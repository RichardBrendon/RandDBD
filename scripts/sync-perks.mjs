import { load } from 'cheerio'
import { mkdir, writeFile } from 'node:fs/promises'

const WIKI = 'https://deadbydaylight.wiki.gg'
const endpoint = new URL('/api.php', WIKI)
endpoint.search = new URLSearchParams({
  action: 'parse',
  page: 'Perks',
  prop: 'text',
  format: 'json',
  formatversion: '2',
})
const response = await fetch(endpoint, {
  headers: { 'User-Agent': 'RandDBD/1.0 (perk catalogue)' },
})
if (!response.ok) throw new Error(`Wiki request failed: ${response.status}`)

const payload = await response.json()
const $ = load(payload.parse.text)
const perks = []

$('table').each((_, table) => {
  const q = $(table)
  if (
    !q.find('.charPortraitRoleBg.survivor').length ||
    q.find('.charPortraitRoleBg.killer').length
  )
    return
  q.find('tr').each((__, row) => {
    const cells = $(row).children()
    const iconPath = cells.eq(0).find('img[alt]').first().attr('src')
    const nameLink = cells.eq(1).find('a[title]').first()
    const descriptionCell = cells.filter('td').first()
    const ownerCell = cells.eq(3)
    const name = nameLink.attr('title') || nameLink.text().trim()
    if (!/Perks_/i.test(iconPath || '') || !name || !descriptionCell.length)
      return
    descriptionCell.find('.tooltiptext, .iconLink, style, script, sup').remove()
    const id =
      nameLink.attr('href')?.replace('/wiki/', '') ||
      name.toLowerCase().replace(/\W+/g, '-')
    const assetId = encodeURIComponent(id)
    const owner =
      ownerCell.find('.charPortraitWrapper').attr('data-search-aliases') ||
      ownerCell.children('a[title]').first().attr('title') ||
      'Geral'
    perks.push({
      id,
      name,
      owner,
      description: descriptionCell.text().replace(/\s+/g, ' ').trim(),
      image: `/perks/${encodeURIComponent(assetId)}.png`,
      assetId,
      sourceImage: new URL(
        iconPath.replace(/\/thumb(\/.*\.png)\/\d+px-[^/?]+/, '$1'),
        WIKI,
      ).href,
      wiki: new URL(nameLink.attr('href'), WIKI).href,
    })
  })
})

const unique = [...new Map(perks.map((perk) => [perk.id, perk])).values()]
if (unique.length !== 179)
  throw new Error(
    `Expected 179 live Survivor perks in patch 10.1.0, extracted ${unique.length}`,
  )
if (unique.some((perk) => !perk.name || !perk.description || !perk.sourceImage))
  throw new Error('One or more perks are incomplete')

await mkdir('src/data', { recursive: true })
await mkdir('public/perks', { recursive: true })
for (const [index, perk] of unique.entries()) {
  let iconResponse
  for (let attempt = 0; attempt < 5; attempt += 1) {
    iconResponse = await fetch(perk.sourceImage, {
      headers: { 'User-Agent': 'RandDBD/1.0 (perk catalogue)' },
    })
    if (iconResponse.ok) break
    if (iconResponse.status !== 429)
      throw new Error(
        `Icon request failed for ${perk.name}: ${iconResponse.status}`,
      )
    await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)))
  }
  if (!iconResponse?.ok)
    throw new Error(`Could not download icon for ${perk.name}`)
  await writeFile(
    `public/perks/${perk.assetId}.png`,
    Buffer.from(await iconResponse.arrayBuffer()),
  )
  if (index % 20 === 19)
    await new Promise((resolve) => setTimeout(resolve, 400))
}
const output = unique.map(({ sourceImage, assetId, ...perk }) => perk)
await writeFile(
  'src/data/survivor-perks.json',
  `${JSON.stringify(output, null, 2)}\n`,
)
console.log(`Saved ${output.length} live Survivor perks with local icons.`)

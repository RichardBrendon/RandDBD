import { PERKS_PER_PLAYER } from './randomizer.js'

const PUBLIC_URL = 'https://randdbd.vercel.app/'
const FORMAT_VERSION = 1
const MAX_HASH_LENGTH = 8192

export function createBuildLink(builds, playerNames) {
  const players = builds.map((build, index) => [
    playerNames[index].trim() || `JOGADOR ${index + 1}`,
    build.map((perk) => perk.id),
  ])
  const url = new URL(PUBLIC_URL)
  url.hash = new URLSearchParams({
    build: JSON.stringify([FORMAT_VERSION, players]),
  }).toString()
  return url.href
}

export function readBuildLink(hash, perksById) {
  if (!hash.startsWith('#build=')) return null
  if (hash.length > MAX_HASH_LENGTH)
    return { error: 'Este link de build é longo demais.' }

  try {
    const payload = JSON.parse(new URLSearchParams(hash.slice(1)).get('build'))
    if (!Array.isArray(payload)) throw new Error()
    const [version, players] = payload
    if (version !== FORMAT_VERSION) {
      return {
        error:
          'Este formato de link de build não é compatível com esta versão do RandDBD.',
      }
    }
    if (!Array.isArray(players) || players.length < 1 || players.length > 4) {
      throw new Error()
    }

    const builds = []
    const playerNames = []
    for (const player of players) {
      if (!Array.isArray(player)) throw new Error()
      const [name, ids] = player
      if (
        typeof name !== 'string' ||
        !name.trim() ||
        name.length > 24 ||
        !Array.isArray(ids) ||
        ids.length !== PERKS_PER_PLAYER ||
        ids.some((id) => typeof id !== 'string') ||
        new Set(ids).size !== ids.length
      )
        throw new Error()

      const build = ids.map((id) => perksById.get(id))
      if (build.some((perk) => !perk)) {
        return {
          error:
            'Este link inclui uma perk que não está disponível no catálogo atual.',
        }
      }
      builds.push(build)
      playerNames.push(name)
    }
    return { builds, playerNames }
  } catch {
    return { error: 'Este link de build é inválido ou está incompleto.' }
  }
}

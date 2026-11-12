export const PERKS_PER_PLAYER = 4

export function shuffle(items) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export function createBuilds(perks, playerCount, allowRepeat) {
  if (perks.length < PERKS_PER_PLAYER) return []

  if (allowRepeat) {
    return Array.from({ length: playerCount }, () =>
      shuffle(perks).slice(0, PERKS_PER_PLAYER),
    )
  }

  const shuffledPerks = shuffle(perks)

  return Array.from({ length: playerCount }, (_, playerIndex) => {
    const start = playerIndex * PERKS_PER_PLAYER
    return shuffledPerks.slice(start, start + PERKS_PER_PLAYER)
  })
}

export function rerollBuilds(perks, builds, locks, allowRepeat, playerIndex) {
  const shouldKeep = (player, slot) =>
    (playerIndex !== undefined && player !== playerIndex) ||
    locks[player]?.[slot]
  const reserved = new Set()

  if (!allowRepeat) {
    builds.forEach((build, player) => {
      build.forEach((perk, slot) => {
        if (shouldKeep(player, slot)) reserved.add(perk.id)
      })
    })
  }

  const next = []
  for (const [player, build] of builds.entries()) {
    const openSlots = build.filter((_, slot) => !shouldKeep(player, slot))
    if (openSlots.length === 0) {
      next.push(build)
      continue
    }

    const previous = new Set(build.map((perk) => perk.id))
    const available = shuffle(
      perks.filter((perk) => !previous.has(perk.id) && !reserved.has(perk.id)),
    )
    if (available.length < openSlots.length) return builds

    next.push(
      build.map((perk, slot) => {
        if (shouldKeep(player, slot)) return perk
        const replacement = available.pop()
        if (!allowRepeat) reserved.add(replacement.id)
        return replacement
      }),
    )
  }

  return next
}

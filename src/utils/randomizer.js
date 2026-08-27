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

export function rerollBuild(perks, builds, playerIndex, allowRepeat) {
  const currentBuild = builds[playerIndex]
  if (!currentBuild) return builds

  const blockedPerkIds = new Set(currentBuild.map((perk) => perk.id))

  if (!allowRepeat) {
    builds.forEach((build, index) => {
      if (index !== playerIndex) {
        build.forEach((perk) => blockedPerkIds.add(perk.id))
      }
    })
  }

  const replacement = shuffle(
    perks.filter((perk) => !blockedPerkIds.has(perk.id)),
  ).slice(0, PERKS_PER_PLAYER)

  return builds.map((build, index) =>
    index === playerIndex ? replacement : build,
  )
}

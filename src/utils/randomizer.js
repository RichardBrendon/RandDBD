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

function fillSlots(perks, builds, pools, allowRepeat, shouldKeep) {
  const next = builds.map((build) => [...build])
  const reserved = new Set()
  const slots = []

  if (!allowRepeat) {
    builds.forEach((build, player) => {
      build.forEach((perk, slot) => {
        if (perk && shouldKeep(player, slot)) reserved.add(perk.id)
      })
    })
  }

  for (const [player, build] of builds.entries()) {
    const previous = new Set(build.filter(Boolean).map((perk) => perk.id))
    const available = shuffle(
      perks.filter(
        (perk) =>
          (!pools[player] || pools[player].has(perk.id)) &&
          !previous.has(perk.id) &&
          !reserved.has(perk.id),
      ),
    )
    build.forEach((_, slot) => {
      if (!shouldKeep(player, slot)) slots.push({ player, slot, available })
    })
  }

  // Reassign earlier slots when players need perks from overlapping pools.
  const assignments = new Map()
  function assign(position, visited) {
    const { player, slot, available } = position
    for (const perk of available) {
      const key = allowRepeat ? `${player}:${perk.id}` : perk.id
      if (visited.has(key)) continue
      visited.add(key)
      const occupied = assignments.get(key)
      if (!occupied || assign(occupied, visited)) {
        assignments.set(key, position)
        next[player][slot] = perk
        return true
      }
    }
    return false
  }

  for (const position of slots) {
    if (!assign(position, new Set())) return null
  }
  return next
}

export function createBuilds(perks, playerCount, allowRepeat, pools = []) {
  const empty = Array.from({ length: playerCount }, () =>
    Array(PERKS_PER_PLAYER).fill(null),
  )
  return fillSlots(perks, empty, pools, allowRepeat, () => false) ?? []
}

export function rerollBuilds(
  perks,
  builds,
  locks,
  allowRepeat,
  playerIndex,
  pools = [],
) {
  const shouldKeep = (player, slot) =>
    (playerIndex !== undefined && player !== playerIndex) ||
    locks[player]?.[slot]
  return fillSlots(perks, builds, pools, allowRepeat, shouldKeep) ?? builds
}

import {
  appliesToPlayer,
  EMPTY_CHALLENGE,
  HEALING_EFFECT,
  isAllowedByChallenge,
} from './challenges.js'

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

function fillSlots(perks, builds, pools, allowRepeat, shouldKeep, challenge) {
  const next = builds.map((build) => [...build])
  const reserved = new Set()
  const slots = []
  const keptHealing = builds.map((build, player) =>
    build.some(
      (perk, slot) =>
        perk &&
        shouldKeep(player, slot) &&
        HEALING_EFFECT.test(perk.description),
    ),
  )

  for (const [player, build] of builds.entries()) {
    for (const [slot, perk] of build.entries()) {
      if (!perk || !shouldKeep(player, slot)) continue
      if (!isAllowedByChallenge(perk, player, challenge)) return null
      if (!allowRepeat) reserved.add(perk.id)
    }
  }

  for (const [player, build] of builds.entries()) {
    const previous = new Set(build.filter(Boolean).map((perk) => perk.id))
    const available = shuffle(
      perks.filter(
        (perk) =>
          (!pools[player] || pools[player].has(perk.id)) &&
          !previous.has(perk.id) &&
          !reserved.has(perk.id) &&
          isAllowedByChallenge(perk, player, challenge),
      ),
    )
    build.forEach((_, slot) => {
      if (!shouldKeep(player, slot)) slots.push({ player, slot, available })
    })
  }

  function matchSlots(positions) {
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

    for (const position of positions) {
      if (!assign(position, new Set())) return null
    }
    return next
  }

  function requireHealing(players) {
    const missing = players.filter((player) => !keptHealing[player])
    const firstSlots = missing.map((player) =>
      slots.find((slot) => slot.player === player),
    )
    if (firstSlots.some((slot) => !slot)) return null
    // Free positions for one player have identical candidates, so any one can require healing.
    return matchSlots(
      slots.map((slot) =>
        firstSlots.includes(slot)
          ? {
              ...slot,
              available: slot.available.filter((perk) =>
                HEALING_EFFECT.test(perk.description),
              ),
            }
          : slot,
      ),
    )
  }

  const players = builds.map((_, player) => player)
  if (challenge.healing === 'squad') {
    if (keptHealing.some(Boolean)) return matchSlots(slots)
    for (const player of shuffle(players)) {
      const result = requireHealing([player])
      if (result) return result
    }
    return null
  }
  return requireHealing(
    players.filter((player) => appliesToPlayer(challenge.healing, player)),
  )
}

export function createBuilds(
  perks,
  playerCount,
  allowRepeat,
  pools = [],
  challenge = EMPTY_CHALLENGE,
) {
  const empty = Array.from({ length: playerCount }, () =>
    Array(PERKS_PER_PLAYER).fill(null),
  )
  return (
    fillSlots(perks, empty, pools, allowRepeat, () => false, challenge) ?? []
  )
}

export function rerollBuilds(
  perks,
  builds,
  locks,
  allowRepeat,
  playerIndex,
  pools = [],
  challenge = EMPTY_CHALLENGE,
) {
  const shouldKeep = (player, slot) =>
    (playerIndex !== undefined && player !== playerIndex) ||
    locks[player]?.[slot]
  return (
    fillSlots(perks, builds, pools, allowRepeat, shouldKeep, challenge) ??
    builds
  )
}

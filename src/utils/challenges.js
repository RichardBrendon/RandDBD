export const EMPTY_CHALLENGE = { healing: '', exhaustion: '' }

export const HEALING_EFFECT = /\bheal(?:s|ed|ing)?\b/i
export const EXHAUSTION_EFFECT = /\bexhaust(?:ed|ion)\b/i

export function appliesToPlayer(scope, player) {
  return scope === 'squad' || scope === 'each' || scope === String(player)
}

export function isAllowedByChallenge(perk, player, challenge) {
  return (
    !appliesToPlayer(challenge.exhaustion, player) ||
    !EXHAUSTION_EFFECT.test(perk.description)
  )
}

export function limitChallenge(challenge, playerCount) {
  const players = Array.from({ length: playerCount }, (_, index) =>
    String(index),
  )
  return {
    healing: ['squad', 'each', ...players].includes(challenge?.healing)
      ? challenge.healing
      : '',
    exhaustion: ['squad', ...players].includes(challenge?.exhaustion)
      ? challenge.exhaustion
      : '',
  }
}

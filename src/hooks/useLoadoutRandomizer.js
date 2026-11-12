import { useEffect, useState } from 'react'
import { EMPTY_CHALLENGE, limitChallenge } from '../utils/challenges'
import {
  createBuilds,
  PERKS_PER_PLAYER,
  rerollBuilds,
} from '../utils/randomizer'

const MAX_PLAYERS = 4
const INITIAL_PLAYER_NAMES = Array(MAX_PLAYERS).fill('')
const STORAGE_KEY = 'randdbd.perk-pools.v1'

function readSelections() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(stored)) {
      return stored
        .slice(0, MAX_PLAYERS)
        .map((ids) =>
          Array.isArray(ids)
            ? ids.filter((id) => typeof id === 'string')
            : null,
        )
    }
  } catch {
    // The randomizer still works when storage is unavailable.
  }
  return []
}

export function useLoadoutRandomizer(perks, onDraw) {
  const [playerCount, setPlayerCount] = useState(1)
  const [playerNames, setPlayerNames] = useState(INITIAL_PLAYER_NAMES)
  const [allowRepeat, setAllowRepeat] = useState(true)
  const [builds, setBuilds] = useState([])
  const [locks, setLocks] = useState({})
  const [selections, setSelections] = useState(readSelections)
  const [drawError, setDrawError] = useState('')
  const [challenge, setChallenge] = useState(EMPTY_CHALLENGE)

  function changeChallenge(next) {
    setChallenge(limitChallenge(next, playerCount))
    setDrawError('')
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
    } catch {
      // Keep the selection in memory for this session.
    }
  }, [selections])

  function resetDraw() {
    setBuilds([])
    setLocks({})
    setDrawError('')
  }

  function updateSelection(playerIndex, ids, include) {
    setSelections((current) => {
      const next = [...current]
      if (ids === null) {
        next[playerIndex] = include ? null : []
      } else {
        const selected = new Set(
          current[playerIndex] ?? perks.map((perk) => perk.id),
        )
        for (const id of ids) {
          if (include) selected.add(id)
          else selected.delete(id)
        }
        next[playerIndex] = [...selected]
      }
      return next
    })
    resetDraw()
  }

  function changePlayerCount(count) {
    setPlayerCount(count)
    setChallenge((current) => limitChallenge(current, count))
    resetDraw()
  }

  function updatePlayerName(playerIndex, name) {
    setPlayerNames((currentNames) =>
      currentNames.map((currentName, index) =>
        index === playerIndex ? name : currentName,
      ),
    )
  }

  function togglePerkRepetition() {
    setAllowRepeat((currentValue) => !currentValue)
    resetDraw()
  }

  function applyPreset(config) {
    setPlayerCount(config.playerCount)
    setPlayerNames(
      Array.from(
        { length: MAX_PLAYERS },
        (_, index) => config.playerNames[index] ?? '',
      ),
    )
    setAllowRepeat(config.allowRepeat)
    setSelections(config.selections)
    setChallenge(limitChallenge(config.challenge, config.playerCount))
    resetDraw()
  }

  function randomizeAll() {
    return draw()
  }

  function randomizePlayer(playerIndex) {
    draw(playerIndex)
  }

  function draw(playerIndex) {
    setDrawError('')
    const hasChallenge = challenge.healing || challenge.exhaustion
    const pools = selections.map((ids) => (ids ? new Set(ids) : null))
    if (builds.length > 0) {
      const hasOpenSlot = builds.some(
        (build, player) =>
          (playerIndex === undefined || player === playerIndex) &&
          build.some((_, slot) => !locks[player]?.[slot]),
      )
      if (!hasOpenSlot) {
        if (hasChallenge)
          setDrawError('Destrave pelo menos uma perk para sortear novamente.')
        return
      }

      const next = rerollBuilds(
        perks,
        builds,
        locks,
        allowRepeat,
        playerIndex,
        pools,
        challenge,
      )
      if (next === builds) {
        setDrawError(
          hasChallenge
            ? 'Não há trocas que respeitem o desafio e as perks mantidas. Ajuste as travas, as seleções ou as regras do desafio.'
            : 'Faltam perks diferentes para trocar todas as posições livres. Trave as que quer manter ou amplie a seleção.',
        )
      } else {
        setBuilds(next)
        onDraw(next, playerNames)
        return true
      }
      return
    }

    const short = Array.from({ length: playerCount }, (_, player) => player)
      .filter(
        (player) =>
          perks.filter((perk) => !pools[player] || pools[player].has(perk.id))
            .length < PERKS_PER_PLAYER,
      )
      .map((player) => playerNames[player].trim() || `Jogador ${player + 1}`)
    if (short.length) {
      setDrawError(
        `Selecione pelo menos 4 perks para cada jogador. Seleção insuficiente: ${short.join(', ')}.`,
      )
      return
    }

    const next = createBuilds(perks, playerCount, allowRepeat, pools, challenge)
    if (next.length === 0) {
      setDrawError(
        hasChallenge
          ? 'Não há uma combinação completa com estas regras e perks disponíveis. Ajuste o desafio, amplie as seleções ou permita repetições entre jogadores.'
          : 'As seleções do grupo se sobrepõem demais. Amplie as seleções ou permita repetir perks entre jogadores.',
      )
      return
    }
    setBuilds(next)
    onDraw(next, playerNames)
    return true
  }

  function togglePerkLock(playerIndex, slotIndex) {
    setLocks((current) => ({
      ...current,
      [playerIndex]: {
        ...current[playerIndex],
        [slotIndex]: !current[playerIndex]?.[slotIndex],
      },
    }))
  }

  return {
    allowRepeat,
    applyPreset,
    builds,
    challenge,
    changeChallenge,
    changePlayerCount,
    drawError,
    locks,
    playerCount,
    playerNames,
    randomizeAll,
    randomizePlayer,
    selections,
    togglePerkRepetition,
    togglePerkLock,
    updatePlayerName,
    updateSelection,
  }
}

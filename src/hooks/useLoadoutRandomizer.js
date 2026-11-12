import { useState } from 'react'
import { createBuilds, rerollBuilds } from '../utils/randomizer'

const MAX_PLAYERS = 4
const INITIAL_PLAYER_NAMES = Array(MAX_PLAYERS).fill('')

export function useLoadoutRandomizer(perks) {
  const [playerCount, setPlayerCount] = useState(1)
  const [playerNames, setPlayerNames] = useState(INITIAL_PLAYER_NAMES)
  const [allowRepeat, setAllowRepeat] = useState(true)
  const [builds, setBuilds] = useState([])
  const [locks, setLocks] = useState({})

  function changePlayerCount(count) {
    setPlayerCount(count)
    setBuilds([])
    setLocks({})
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
    setBuilds([])
    setLocks({})
  }

  function randomizeAll() {
    setBuilds((currentBuilds) =>
      currentBuilds.length
        ? rerollBuilds(perks, currentBuilds, locks, allowRepeat)
        : createBuilds(perks, playerCount, allowRepeat),
    )
  }

  function randomizePlayer(playerIndex) {
    setBuilds((currentBuilds) =>
      rerollBuilds(perks, currentBuilds, locks, allowRepeat, playerIndex),
    )
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
    builds,
    changePlayerCount,
    locks,
    playerCount,
    playerNames,
    randomizeAll,
    randomizePlayer,
    togglePerkRepetition,
    togglePerkLock,
    updatePlayerName,
  }
}

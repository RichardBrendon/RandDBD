import { useState } from 'react'
import { createBuilds, rerollBuild } from '../utils/randomizer'

const MAX_PLAYERS = 4
const INITIAL_PLAYER_NAMES = Array(MAX_PLAYERS).fill('')

export function useLoadoutRandomizer(perks) {
  const [playerCount, setPlayerCount] = useState(1)
  const [playerNames, setPlayerNames] = useState(INITIAL_PLAYER_NAMES)
  const [allowRepeat, setAllowRepeat] = useState(true)
  const [builds, setBuilds] = useState([])

  function changePlayerCount(count) {
    setPlayerCount(count)
    setBuilds([])
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
  }

  function randomizeAll() {
    setBuilds(createBuilds(perks, playerCount, allowRepeat))
  }

  function randomizePlayer(playerIndex) {
    setBuilds((currentBuilds) =>
      rerollBuild(perks, currentBuilds, playerIndex, allowRepeat),
    )
  }

  return {
    allowRepeat,
    builds,
    changePlayerCount,
    playerCount,
    playerNames,
    randomizeAll,
    randomizePlayer,
    togglePerkRepetition,
    updatePlayerName,
  }
}

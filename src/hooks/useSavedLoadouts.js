import { useEffect, useState } from 'react'

const STORAGE_KEY = 'randdbd.saved-loadouts.v1'
const HISTORY_LIMIT = 20
const EMPTY_LIBRARY = { history: [], favorites: [], presets: [] }

function isSavedBuild(entry) {
  return (
    typeof entry?.key === 'string' &&
    Number.isFinite(Date.parse(entry.date)) &&
    Array.isArray(entry.players) &&
    entry.players.every(
      (player) =>
        typeof player?.name === 'string' &&
        Array.isArray(player.perks) &&
        player.perks.every(
          (perk) =>
            typeof perk?.id === 'string' && typeof perk.name === 'string',
        ),
    )
  )
}

function isPreset(entry) {
  const config = entry?.config
  return (
    typeof entry?.key === 'string' &&
    typeof entry.name === 'string' &&
    Number.isInteger(config?.playerCount) &&
    config.playerCount >= 1 &&
    config.playerCount <= 4 &&
    typeof config.allowRepeat === 'boolean' &&
    Array.isArray(config.playerNames) &&
    config.playerNames.every((name) => typeof name === 'string') &&
    Array.isArray(config.selections) &&
    config.selections.every(
      (ids) =>
        ids === null ||
        (Array.isArray(ids) && ids.every((id) => typeof id === 'string')),
    )
  )
}

function readLibrary() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      history: Array.isArray(stored?.history)
        ? stored.history.filter(isSavedBuild).slice(0, HISTORY_LIMIT)
        : [],
      favorites: Array.isArray(stored?.favorites)
        ? stored.favorites.filter(isSavedBuild)
        : [],
      presets: Array.isArray(stored?.presets)
        ? stored.presets.filter(isPreset)
        : [],
    }
  } catch {
    return EMPTY_LIBRARY
  }
}

export function buildSnapshot(builds, playerNames) {
  return builds.map((build, player) => ({
    name: playerNames[player].trim() || `Jogador ${player + 1}`,
    perks: build.map(({ id, name }) => ({ id, name })),
  }))
}

export function snapshotKey(players) {
  return JSON.stringify(
    players.map(({ name, perks }) => [name, perks.map(({ id }) => id)]),
  )
}

export function useSavedLoadouts() {
  const [library, setLibrary] = useState(readLibrary)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [library])

  function recordDraw(builds, playerNames) {
    const players = buildSnapshot(builds, playerNames)
    const key = snapshotKey(players)
    const entry = { key, players, date: new Date().toISOString() }
    setLibrary((current) => ({
      ...current,
      history: [
        entry,
        ...current.history.filter((item) => item.key !== key),
      ].slice(0, HISTORY_LIMIT),
    }))
  }

  function toggleFavorite(players) {
    const key = snapshotKey(players)
    const entry = { key, players, date: new Date().toISOString() }
    setLibrary((current) => ({
      ...current,
      favorites: current.favorites.some((item) => item.key === key)
        ? current.favorites.filter((item) => item.key !== key)
        : [entry, ...current.favorites],
    }))
  }

  function savePreset(name, config) {
    const key = name.trim().toLocaleLowerCase('pt-BR')
    const preset = { key, name: name.trim(), config }
    setLibrary((current) => ({
      ...current,
      presets: [preset, ...current.presets.filter((item) => item.key !== key)],
    }))
  }

  function deletePreset(key) {
    setLibrary((current) => ({
      ...current,
      presets: current.presets.filter((item) => item.key !== key),
    }))
  }

  return {
    ...library,
    storageError,
    recordDraw,
    toggleFavorite,
    savePreset,
    deletePreset,
  }
}

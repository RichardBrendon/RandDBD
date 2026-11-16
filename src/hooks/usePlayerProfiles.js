import { useEffect, useState } from 'react'

const KEY = 'randdbd.player-profiles.v1'

export function usePlayerProfiles() {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      return Array.isArray(saved)
        ? saved.filter(
            (profile) =>
              typeof profile?.id === 'string' &&
              typeof profile.name === 'string' &&
              Array.isArray(profile.perks) &&
              profile.perks.every((id) => typeof id === 'string'),
          )
        : []
    } catch {
      return []
    }
  })
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(profiles))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [profiles])

  function save(name, perks, id) {
    const profile = {
      id: id ?? crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      perks: [...perks],
    }
    setProfiles((current) =>
      id
        ? current.map((item) => (item.id === id ? profile : item))
        : [...current, profile],
    )
    return profile.id
  }

  function remove(id) {
    setProfiles((current) => current.filter((profile) => profile.id !== id))
  }

  return { profiles, save, remove, storageError }
}

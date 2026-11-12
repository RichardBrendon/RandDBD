import { useEffect, useState } from 'react'
import { ANDROID_RELEASE_API, findAndroidUpdate } from '../utils/androidUpdate'

const CHECK_INTERVAL = 60 * 60 * 1000
const RETRY_INTERVAL = 60 * 1000
const TIMEOUT = 8000

export function AndroidUpdateNotice({ version }) {
  const [update, setUpdate] = useState(null)

  useEffect(() => {
    if (!version) return

    let active = true
    let pending
    let nextCheck = 0
    async function check(force = false) {
      if (
        !active ||
        !navigator.onLine ||
        pending ||
        (!force && Date.now() < nextCheck)
      )
        return

      const controller = new AbortController()
      pending = controller
      const timeout = setTimeout(() => controller.abort(), TIMEOUT)
      try {
        const response = await fetch(ANDROID_RELEASE_API, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Release API unavailable')
        const release = await response.json()
        if (active) setUpdate(findAndroidUpdate(release, version))
        nextCheck = Date.now() + CHECK_INTERVAL
      } catch {
        // A failed update check must not interfere with offline use.
        nextCheck = Date.now() + RETRY_INTERVAL
      } finally {
        clearTimeout(timeout)
        pending = null
      }
    }

    function onOnline() {
      void check(true)
    }
    function onVisibility() {
      if (document.visibilityState === 'visible') void check()
    }

    void check()
    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      active = false
      pending?.abort()
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [version])

  if (!update) return null

  return (
    <aside className="android-update" aria-label="Atualização do aplicativo">
      <p role="status">RandDBD {update.version} disponível para Android.</p>
      <a href={update.url}>Baixar atualização</a>
    </aside>
  )
}

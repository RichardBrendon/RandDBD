export const ANDROID_RELEASE_API =
  'https://api.github.com/repos/RichardBrendon/RandDBD/releases/latest'

const VERSION_PATTERN = /^(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,8})$/
const RELEASE_BASE =
  'https://github.com/RichardBrendon/RandDBD/releases/download/'

function isNewer(version, installed) {
  if (!VERSION_PATTERN.test(version) || !VERSION_PATTERN.test(installed))
    return false
  const nextParts = version.split('.').map(Number)
  const currentParts = installed.split('.').map(Number)
  const index = nextParts.findIndex(
    (part, position) => part !== currentParts[position],
  )
  return index >= 0 && nextParts[index] > currentParts[index]
}

export function findAndroidUpdate(release, installed) {
  const tag = release?.tag_name
  if (
    typeof tag !== 'string' ||
    !tag.startsWith('android-v') ||
    release.draft ||
    release.prerelease
  ) {
    return null
  }
  const version = tag.slice('android-v'.length)
  if (!isNewer(version, installed)) return null

  const url = `${RELEASE_BASE}${tag}/randdbd.apk`
  const asset =
    Array.isArray(release.assets) &&
    release.assets.find(
      (item) =>
        item?.name === 'randdbd.apk' &&
        item.state === 'uploaded' &&
        item.browser_download_url === url,
    )
  return asset ? { version, url } : null
}

import type { JsonStatistics } from '~/types/json'

export function calculateJsonStatistics(data: unknown, rawText: string): JsonStatistics {
  let objects = 0
  let arrays = 0
  let keys = 0
  let values = 0

  function traverse(item: unknown) {
    if (item === null || item === undefined) {
      values++
      return
    }

    if (Array.isArray(item)) {
      arrays++
      values++
      for (let i = 0; i < item.length; i++) {
        traverse(item[i])
      }
    } else if (typeof item === 'object') {
      objects++
      values++
      const objKeys = Object.keys(item as Record<string, unknown>)
      keys += objKeys.length
      for (const k of objKeys) {
        traverse((item as Record<string, unknown>)[k])
      }
    } else {
      // primitive
      values++
    }
  }

  if (data !== undefined && data !== null) {
    traverse(data)
  }

  const characters = rawText.length
  let sizeBytes = 0
  if (typeof TextEncoder !== 'undefined') {
    sizeBytes = new TextEncoder().encode(rawText).length
  } else {
    sizeBytes = characters
  }

  return {
    objects,
    arrays,
    keys,
    values,
    characters,
    sizeBytes,
    sizeFormatted: formatBytes(sizeBytes)
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const index = Math.min(i, sizes.length - 1)
  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(dm))} ${sizes[index]}`
}

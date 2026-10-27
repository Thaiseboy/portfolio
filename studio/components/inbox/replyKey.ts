// The send key of a reply concept, kept in the tab's sessionStorage: a repeat after a reload uses the
// same key, so the website and Resend never send the concept twice.

export type ReplyKey = {content: string; key: string}

export function storeReplyKey(storageKey: string, value: ReplyKey) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    // No storage: the key only lives in this page.
  }
}

/** The stored key for this exact concept, or a new one that is stored right away. */
export function loadReplyKey(storageKey: string, content: string): ReplyKey {
  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null')
    if (stored?.content === content && typeof stored.key === 'string') return stored as ReplyKey
  } catch {
    // Unreadable: a new key.
  }

  const fresh = {content, key: crypto.randomUUID()}
  storeReplyKey(storageKey, fresh)
  return fresh
}

import { StorageSerializers, useLocalStorage } from "@vueuse/core"

interface SessionData {
  userID: string,
  username: string,
  realName: string | undefined,
}

/**
 * Uses the user session persisted in local storage.
 * @returns The reactive user session
 */
export function useUserSession(): Ref<SessionData | null> {
  return useLocalStorage<SessionData | null>('userSession', null, { serializer: StorageSerializers.object });
}

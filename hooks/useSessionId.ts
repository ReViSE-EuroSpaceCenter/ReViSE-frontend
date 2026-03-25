import { useMemo } from "react";

type SessionKey = "hostId" | "clientId";

function getSessionItem(key: SessionKey): string | null {
	if (globalThis.window === undefined) return null;
	return sessionStorage.getItem(key);
}

export function useSessionId(key: SessionKey): string | null {
	return useMemo(() => getSessionItem(key), [key]);
}
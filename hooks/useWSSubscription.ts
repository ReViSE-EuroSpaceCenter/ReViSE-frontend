import { useEffect } from "react";
import { WSEventType } from "@/types/WSEventType";
import { useWebSocket } from "@/contexts/WebSocketProvider";

type WSChannel = "lobby" | "mission" | "launcher";
type WSHandler = (event: WSEventType) => void;

export function useWSSubscription(channel: WSChannel, handler: WSHandler) {
	const { subscribe, connected } = useWebSocket();

	useEffect(() => {
		if (!connected) return;

		const sub = subscribe(channel, (message: { body: string }) => {
			const event: WSEventType = JSON.parse(message.body);
			handler(event);
		});

		return () => sub?.unsubscribe();
	}, [connected, channel, handler, subscribe]);
}
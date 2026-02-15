"use client";

import React, {
	createContext, useCallback,
	useContext,
	useEffect, useMemo,
	useRef,
	useState,
} from "react";
import SockJS from "sockjs-client";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

type WebSocketContextType = {
	subscribe: (callback: (message: IMessage) => void) => StompSubscription | null;
	connected: boolean;
	id?: string;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({
																		lobbyCode,
																		id,
																		children,
																	}: Readonly<{
	lobbyCode: string;
	id?: string;
	children: React.ReactNode;
}>) {
	const clientRef = useRef<Client | null>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);

		const client = new Client({
			webSocketFactory: () => socket,
			reconnectDelay: 5000,

			onConnect: () => {
				console.log("WebSocket connected");
				setConnected(true);
			},

			onDisconnect: () => {
				console.log("WebSocket disconnected");
				setConnected(false);
			},

			onStompError: (frame) => {
				console.error("STOMP error:", frame);
			},
		});

		client.activate();
		clientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, []);

	const subscribe = useCallback(
		(callback: (message: IMessage) => void) => {
			if (!clientRef.current || !connected) {
				console.warn("Cannot subscribe: WebSocket not connected");
				return null;
			}

			const destination = `/topic/lobby/${lobbyCode}`;
			return clientRef.current.subscribe(destination, callback);
		},
		[connected, lobbyCode, id]
	);

	const values = useMemo(
		() => ({
			subscribe,
			connected,
			id,
		}),
		[subscribe, connected, id]
	);

	return (
		<WebSocketContext.Provider value={values}>
			{children}
		</WebSocketContext.Provider>
	);
}

export function useWebSocket() {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used inside WebSocketProvider");
	}
	return context;
}

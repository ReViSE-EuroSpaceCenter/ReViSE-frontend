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

export type UrlDestination = "lobby" | "game";

type WebSocketContextType = {
	subscribe: (destinationType: UrlDestination, callback: (message: IMessage) => void) => StompSubscription | null;
	connected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({
																		lobbyCode,
																		children,
																	}: Readonly<{
	lobbyCode: string;
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
				setConnected(true);
			},

			onDisconnect: () => {
				setConnected(false);
			},
		});

		client.activate();
		clientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, []);

	const subscribe = useCallback(
		(destinationType: UrlDestination, callback: (message: IMessage) => void) => {
			if (!clientRef.current || !connected) {
				return null;
			}

			const destination = `/topic/${destinationType}/${lobbyCode}`;
			return clientRef.current.subscribe(destination, callback);
		},
		[connected, lobbyCode]
	);

	const values = useMemo(
		() => ({
			subscribe,
			connected,
		}),
		[subscribe, connected]
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

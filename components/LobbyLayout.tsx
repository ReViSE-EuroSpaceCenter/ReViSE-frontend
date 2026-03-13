import React from "react";
import { WebSocketProvider } from "@/contexts/WebSocketProvider";

type LobbyLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
};

export default async function LobbyLayout({ children, params }: Readonly<LobbyLayoutProps>) {
	const { gameId } = await params;

	return (
		<WebSocketProvider lobbyCode={gameId}>
			{children}
		</WebSocketProvider>
	);
}

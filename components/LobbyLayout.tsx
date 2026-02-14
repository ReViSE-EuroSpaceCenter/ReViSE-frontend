import React from "react";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import { cookies } from "next/headers";

type LobbyLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
	cookieKey: string;
};

export default async function LobbyLayout({ children, params, cookieKey }: Readonly<LobbyLayoutProps>) {
	const { gameId } = await params;
	const id = (await cookies()).get(cookieKey)?.value;

	return (
		<WebSocketProvider lobbyCode={gameId} id={id}>
			{children}
		</WebSocketProvider>
	);
}

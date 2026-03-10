import React from "react";
import { WebSocketProvider } from "@/contexts/WebSocketProvider";
import { cookies } from "next/headers";
import QueryProvider from "@/contexts/QueryProvider";

type LobbyLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
	cookieKey: string;
};

export default async function LobbyLayout({ children, params, cookieKey }: Readonly<LobbyLayoutProps>) {
	const { gameId } = await params;
	const id = (await cookies()).get(cookieKey)?.value;

	return (
		<QueryProvider>
			<WebSocketProvider lobbyCode={gameId} id={id}>
				{children}
			</WebSocketProvider>
		</QueryProvider>
	);
}

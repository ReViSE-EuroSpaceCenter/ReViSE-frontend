import React from "react";
import {WebSocketProvider} from "@/components/WebSocketProvider";

export default async function TeacherLayout({ children, params }: Readonly<{
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
}>) {
	const {gameId} = await params;

	return (
		<WebSocketProvider lobbyCode={gameId}>
			{children}
		</WebSocketProvider>
	)
}
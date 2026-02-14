import LobbyLayout from "@/components/LobbyLayout";
import React from "react";

export default function StudentLayout({
																				children,
																				params,
																			}: {
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
}) {
	return (
		<LobbyLayout params={params} cookieKey="clientId">
			{children}
		</LobbyLayout>
	);
}

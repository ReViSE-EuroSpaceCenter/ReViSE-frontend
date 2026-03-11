import LobbyLayout from "@/components/LobbyLayout";
import React from "react";

export default function TeacherLayout({
																				children,
																				params,
																			}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
}>) {
	return (
		<LobbyLayout params={params}>
			{children}
		</LobbyLayout>
	);
}

import LobbyLayout from "@/components/LobbyLayout";
import React from "react";
import {InterceptorProvider} from "@/contexts/InterceptorProvider";

export default function StudentLayout({
																				children,
																				params,
																			}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
}>) {
	return (
		<LobbyLayout params={params}>
			<InterceptorProvider isStudent={true} />
			{children}
		</LobbyLayout>
	);
}

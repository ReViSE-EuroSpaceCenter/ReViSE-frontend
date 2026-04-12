import LobbyLayout from "@/components/LobbyLayout";
import React from "react";
import {InterceptorProvider} from "@/contexts/InterceptorProvider";

export default function TeacherLayout({
																				children,
																				params,
																			}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ gameId: string }>;
}>) {
	return (
		<LobbyLayout params={params}>
			<InterceptorProvider isStudent={false} />
			{children}
		</LobbyLayout>
	);
}

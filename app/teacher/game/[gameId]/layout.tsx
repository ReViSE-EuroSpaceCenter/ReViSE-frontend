import LobbyLayout from "@/components/LobbyLayout";
import React from "react";
import {InterceptorProvider} from "@/contexts/InterceptorProvider";
import {Banner} from "@/components/teacher/Banner";

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
			<Banner message={"Attention, ne pas fermer la page avant la fin du jeu."} />
			{children}
		</LobbyLayout>
	);
}

"use client";

import Toolbox from "@/components/Toolbox";
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import {LobbyEventType} from "@/types/LobbyEventType";
import {useWebSocket} from "@/contexts/WebSocketProvider";

export default function Dashboard() {
	const router = useRouter();
	const pathname = usePathname();
	const { subscribe, connected } = useWebSocket();
	const searchParams = useSearchParams();
	const params = useParams();

	const lobbyCode = params.gameId as string;
	const chosenTeam = searchParams.get("chosenTeam") as string;


	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe("lobby", (message) => {
			const event: LobbyEventType = JSON.parse(message.body);

			if (event.type === "MISSION_ENDED") {
				router.push(`/student/game/${lobbyCode}/${chosenTeam}/resources`);
			}
		});

		return () => subscription?.unsubscribe();
	}, [chosenTeam, connected, lobbyCode, router, subscribe]);

	return (
		<div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
			<div className="w-full max-w-[min(600px,calc(100vh-160px))]">
				<Toolbox
					actions={[
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "État des missions", onClick: () => router.push(`${pathname}/mission`), },
						{ label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>
		</div>
	);
}
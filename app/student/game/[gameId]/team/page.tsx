"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import {useEffect, useMemo, useState} from "react";
import {assignTeam} from "@/api/lobbyApi";
import {LobbyEventType} from "@/types/LobbyEventType";

export default function TeamPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { subscribe, connected, id } = useWebSocket();

	const params = useParams();
	const lobbyCode = params.gameId as string;

	const initialTeams: string[] = useMemo(() => {
		const teamsParam = searchParams.get("teams");
		if (!teamsParam) return [];
		return JSON.parse(decodeURIComponent(teamsParam));
	}, [searchParams]);

	const [availableTeams, setAvailableTeams] = useState<string[]>(initialTeams);

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe(
			(message) => {
				const event: LobbyEventType = JSON.parse(message.body);

				switch (event.type) {
					case "TEAM_JOINED": {
						const teamLabel = event.payload.teamLabel;
						setAvailableTeams((prev) => prev.filter((t) => t !== teamLabel));
						break;
					}
                    case "GAME_STARTED":
                        router.push(`/student/game/${lobbyCode}/intro`);
                        break;

					default:
						break;
				}
			});
		return () => subscription?.unsubscribe();
	}, [router, subscribe, connected, lobbyCode]);

	const handleJoinTeam = async (teamLabel: string) => {
		await assignTeam(lobbyCode, id as string, teamLabel);
	}

	return (
		<>
			<h1>Page pour choisir son équipe</h1>
			{availableTeams.map((team) => (
				<button key={team} type="button" onClick={() => handleJoinTeam(team)}>
					Rejoindre {team}
				</button>
			))}
		</>
	)
}
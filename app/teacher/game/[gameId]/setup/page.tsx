"use client"

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useWebSocket} from "@/components/WebSocketProvider";
import {LobbyEventType} from "@/types/LobbyEventType";

export default function SetUpPage() {
	const router = useRouter();
	const { subscribe, connected } = useWebSocket();
	const searchParams = useSearchParams();
	const nbTeams = Number(searchParams.get("nbTeams"));
	const [ joinedTeam, setJoinedTeam ] = useState(0);

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe((message) => {
			const event: LobbyEventType = JSON.parse(message.body);

			switch (event.type) {
				case "CLIENT_JOINED":
					setJoinedTeam((prev) => prev + 1);
					break;

				case "TEAM_JOINED":
					console.log("joined team", event.payload.teamLabel);
					break;

				case "GAME_STARTED":
					router.push(`/intro/`);
					break;

				default:
					break;
			}
		});

		return () => subscription?.unsubscribe();
	}, [router, subscribe, connected]);


	return (
		<>
			<h1>Page de configuration d{"'"}une partie</h1>
			<div>
				<p>- Afficher un code de connexion</p>
				<p>- Bouton Démarrer la partie</p>
			</div>
			<div>
				<p className="text-lg font-bold m-2">Équipes connectées : {joinedTeam} / {nbTeams}</p>
			</div>
		</>
	)
}
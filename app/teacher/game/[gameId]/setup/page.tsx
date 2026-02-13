"use client"

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useWebSocket} from "@/components/WebSocketProvider";

export default function SetUpPage() {
	const router = useRouter();
	const { subscribe, connected } = useWebSocket();

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe(
			(message) => {
				const event = JSON.parse(message.body);

				if (event.type === "TEAM_JOINED") {
					const teamLabel = event.payload.teamLabel;
					console.log("joined team ", teamLabel);
				}

				if (event.type === "GAME_STARTED") {
					router.push(`/intro/`);
				}
			}
		);

		return () => {
			subscription?.unsubscribe();
		};
	}, [router, subscribe, connected]);


	return (
		<>
			<h1>Page de configuration d{"'"}une partie</h1>
			<div>
				<p>- Afficher un code de connexion</p>
				<p>- Bouton Démarrer la partie</p>
			</div>
		</>
	)
}
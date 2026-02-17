"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import Image from "next/image";
import { assignTeam } from "@/api/lobbyApi";
import { LobbyEventType } from "@/types/LobbyEventType";

type Props = {
	allTeams: string[];
	initialTakenTeams: string[];
};

export default function TeamSelect({
																		 allTeams,
																		 initialTakenTeams,
																	 }: Readonly<Props>) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useParams();
	const { subscribe, connected, id } = useWebSocket();

	const [takenTeams, setTakenTeams] = useState(
		new Set(initialTakenTeams)
	);

	const [error, setError] = useState<string | null>(null);

	const lobbyCode = params.gameId as string;
	const chosenTeam = searchParams.get("chosenTeam");
	const waitForStart = chosenTeam !== null;

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe((message) => {
			const event: LobbyEventType = JSON.parse(message.body);

			switch (event.type) {
				case "TEAM_JOINED":
					setTakenTeams((prev) => {
						const next = new Set(prev);
						next.add(event.payload.teamLabel);
						return next;
					});
					break;

				case "GAME_STARTED":
					router.push("/intro/");
					break;
			}
		});

		return () => subscription?.unsubscribe();
	}, [connected, subscribe, router]);

	const handleJoinTeam = async (teamLabel: string) => {
		if (takenTeams.has(teamLabel)) return;

		try {
			setError(null);
			await assignTeam(lobbyCode, id as string, teamLabel);
			router.replace(`?chosenTeam=${teamLabel}`);
		} catch {
			setError(
				"Cette équipe a déjà été choisie. Veuillez en sélectionner une autre."
			);
		}
	};

	if (waitForStart) {
		return (
			<div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-6 pt-24">
				<div className="max-w-md w-full bg-slate-800/30 border border-purpleReViSE/50 rounded-lg p-10 text-center space-y-6">
					<div className="w-36 h-36 mx-auto">
						<Image
							src={`/badges/${chosenTeam}.png`}
							alt={`Badge ${chosenTeam}`}
							width={144}
							height={144}
							className="w-full h-full object-contain drop-shadow-[0_0_18px_rgba(139,92,246,0.5)]"
						/>
					</div>
					<div className="space-y-2">
						<h2 className="text-xl xl:text-2xl font-bold text-white">
							Vous êtes l{"'"}équipe
						</h2>
						<p className="text-2xl font-semibold text-purpleReViSE">
							{chosenTeam}
						</p>
					</div>
					<div className="border-t border-slate-700 pt-6">
						<p className="text-sm text-slate-400">
							En attente que tout le monde choisisse une équipe...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-80px)]">
			<div className="px-6 lg:px-12 py-6 lg:py-12 max-w-7xl mx-auto">
				<div className="text-center space-y-4 mb-12">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
						Rejoignez votre équipe
					</h1>
					<p className="text-lg sm:text-xl text-slate-300">
						Chaque équipe joue un rôle clé dans l{"'"}expédition vers Europe. Choisissez la vôtre.
					</p>
				</div>

				{error && (
					<div className="max-w-2xl mx-auto mb-8 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
						<p className="text-red-200 text-center">{error}</p>
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{allTeams.map((team) => {
						const isTaken = takenTeams.has(team);
						return (
							<button
								key={team}
								type="button"
								onClick={() => handleJoinTeam(team)}
								disabled={isTaken}
								className={`group bg-slate-800/30 border rounded-lg p-6 transition-all duration-300 flex flex-col items-center space-y-4 ${
									isTaken
										? "border-slate-700/30 opacity-40 cursor-not-allowed"
										: "border-slate-700/50 hover:border-purpleReViSE hover:bg-slate-800/50 cursor-pointer"
								}`}
							>
								<div className="w-32 h-32 flex items-center justify-center">
									<Image
										src={`/badges/${team}.png`}
										alt={`Badge ${team}`}
										width={128}
										height={128}
										className={`w-full h-full object-contain transition-transform duration-300 ${
											isTaken ? "grayscale" : "group-hover:scale-110"
										}`}
									/>
								</div>
								<h3 className={`text-xl font-semibold transition-colors ${
									isTaken ? "text-slate-600" : "text-white group-hover:text-purpleReViSE"
								}`}>
									{team}
								</h3>
								<span className={`text-sm transition-colors ${
									isTaken ? "text-slate-600" : "text-slate-400 group-hover:text-slate-300"
								}`}>
									{isTaken ? "Équipe prise" : "Rejoindre l'équipe"}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

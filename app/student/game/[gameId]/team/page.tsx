"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import {useEffect, useMemo, useState} from "react";
import {assignTeam} from "@/api/lobbyApi";
import {LobbyEventType} from "@/types/LobbyEventType";
import Image from "next/image";

export default function TeamPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { subscribe, connected, id } = useWebSocket();
	const [ waitForStart, setWaitForStart ] = useState(false);
	const [ error, setError ] = useState<string | null>(null);

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
						router.push(`/intro/`);
						break;

					default:
						break;
				}
			});
		return () => subscription?.unsubscribe();
	}, [router, subscribe, connected]);

	const handleJoinTeam = async (teamLabel: string) => {
		try {
			setError(null);
			await assignTeam(lobbyCode, id as string, teamLabel);
			setWaitForStart(true);
		} catch {
			setWaitForStart(false);
			setError("Cette équipe a déjà été choisie par un autre joueur. Veuillez en choisir une autre.");
		}
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

				{waitForStart ? (
					<div className="max-w-2xl mx-auto">
						<div className="bg-slate-800/30 border border-purpleReViSE/50 rounded-lg p-8 text-center space-y-4">
							<h2 className="text-2xl font-semibold text-white">
								Équipe rejointe !
							</h2>
							<p className="text-lg text-slate-300">
								En attente que tout le monde choisisse une équipe...
							</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
						{availableTeams.map((team) => (
							<button
								key={team}
								type="button"
								onClick={() => handleJoinTeam(team)}
								className="group bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:border-purpleReViSE hover:bg-slate-800/50 transition-all duration-300 flex flex-col items-center space-y-4"
							>
								<div className="w-32 h-32 flex items-center justify-center">
									<Image
										src={`/badges/${team}.png`}
										alt={`Badge ${team}`}
										width={128}
										height={128}
										className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
									/>
								</div>
								<h3 className="text-xl font-semibold text-white group-hover:text-purpleReViSE transition-colors">
									{team}
								</h3>
								<span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
									Rejoindre l{"'"}équipe
								</span>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
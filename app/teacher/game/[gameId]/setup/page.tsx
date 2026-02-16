"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import { LobbyEventType } from "@/types/LobbyEventType";

export default function SetUpPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useParams();

	const lobbyCode = params.gameId?.toString() as string;
	const getInitialTeams = (searchParams: URLSearchParams): string[] => {
		const teamsRaw = searchParams.get("teams");
		if (!teamsRaw) return [];
		try {
			return JSON.parse(decodeURIComponent(teamsRaw));
		} catch (e) {
			console.error("Erreur de parsing des équipes", e);
			return [];
		}
	};

	const teamNames = getInitialTeams(searchParams);
	const [joinedTeam, setJoinedTeam] = useState(0);


	const nbTeams = teamNames.length || Number(searchParams.get("nbTeams")) || 0;

	const { subscribe, connected } = useWebSocket();

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe((message) => {
			const event: LobbyEventType = JSON.parse(message.body);


			switch (event.type) {
				case "CLIENT_JOINED":
					setJoinedTeam((prev) => prev + 1);
					break;

				case "TEAM_JOINED":

					console.log("Joined team:", event.payload?.teamLabel);
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

	const handleStart = () => {
		router.push(`/teacher/game/${lobbyCode}/intro`);
	};
	return (
		<div className="flex flex-col items-center justify-center p-4 sm:p-6 w-full">
			<div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/30 border-slate-700/50 transition-colors backdrop-blur-xl shadow-2xl rounded-3xl sm:rounded-[2.5rem]
			 p-6 sm:p-10 border  flex flex-col items-center gap-6 sm:gap-10 scrollbar-hide">

				<header className="text-center shrink-0">
					<h1 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2 tracking-tight">
						Configuration
					</h1>
					<div className="flex items-center justify-center gap-2">
               <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purpleReViSE opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-purpleReViSE"></span>
               </span>
						<p className="text-slate-400 font-medium text-[9px] sm:text-xs uppercase tracking-[0.2em]">
							En attente des joueurs
						</p>
					</div>
				</header>

				{/* Affichage du Code de Session style "Voyage Spatial" */}
				<div className="flex flex-col items-center gap-3 sm:gap-5 w-full shrink-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                Code d&#39;accès session
            </span>
					<div className="flex flex-wrap justify-center gap-2 sm:gap-3">
						{lobbyCode ? lobbyCode.toUpperCase().split("").map((char, i) => (
							<div
								key={i}
								className="w-9 h-12 sm:w-14 sm:h-20 flex items-center justify-center
								bg-white/5 text-white text-xl sm:text-4xl font-black
								rounded-xl sm:rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
							>
								{char}
							</div>
						)) : (
							<div className="text-white/20 italic text-sm animate-pulse tracking-widest uppercase">Génération...</div>
						)}
					</div>
				</div>

				{/* Section Inscriptions / Barre de progression mauve */}
				<div className="w-full bg-black/20 rounded-3xl sm:rounded-4xl p-4 sm:p-8 border border-white/5 space-y-3 sm:space-y-5">
					<div className="flex justify-between items-end px-1">
						<h3 className="text-sm sm:text-lg text-white font-bold tracking-tight">Inscriptions</h3>
						<div className="text-right">
							<span className="text-xl sm:text-3xl font-black text-purpleReViSE">{joinedTeam}</span>
							<span className="text-white/20 text-base sm:text-xl font-bold"> / {nbTeams}</span>
						</div>
					</div>

					<div className="w-full h-2 sm:h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
						<div
							className="h-full bg-linear-to-r from-purpleReViSE via-purple-400
							to-purpleReViSE/80 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
							style={{ width: `${nbTeams > 0 ? (joinedTeam / nbTeams) * 100 : 0}%` }}
						/>
					</div>

					<div className="flex flex-wrap justify-center gap-1 sm:gap-2">
						{teamNames.map((name, index) => (
							<span key={index} className="px-2 py-0.5 sm:px-4 sm:py-1.5 bg-purpleReViSE/10 text-white/60 text-[8px] sm:text-[10px] font-bold rounded-full border border-purpleReViSE/20 uppercase tracking-tighter">
                     {name}
                 </span>
						))}
					</div>
				</div>

				{/* Bouton Démarrer PurpleReViSE */}
				<div className="w-full mt-auto pt-2 shrink-0">
					<button
						onClick={handleStart}
						disabled={joinedTeam < nbTeams || joinedTeam === 0}
						className={`group w-full py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-xl transition-all duration-500 flex items-center justify-center gap-3 shadow-xl ${
							joinedTeam >= nbTeams && joinedTeam > 0
								? "bg-purpleReViSE hover:bg-purpleReViSE/80 text-white cursor-pointer shadow-purpleReViSE/20"
								: "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
						}`}
					>
						{joinedTeam < nbTeams ? (
							<span className="tracking-[0.2em] opacity-40 italic uppercase text-[10px] sm:text-xs">Attente des joueurs...</span>
						) : (
							<>
								<span>DÉMARRER LA SESSION</span>
								<span className="text-xl sm:text-2xl transition-all duration-300 group-hover:animate-[swing_0.8s_ease-in-out_infinite] origin-center inline-block">
  									🎮
								</span>
								<style dangerouslySetInnerHTML={{ __html: `@keyframes swing {
									0%, 100% { transform: rotate(-12deg) scale(1.1); }
									50% { transform: rotate(12deg) scale(1.1); }
								  }`}} />
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

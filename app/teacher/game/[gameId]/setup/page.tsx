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

	// Pour recuperer le nom des equipes mais je n'ai pas su
	const [teamNames, setTeamNames] = useState<string[]>([]);
	const [joinedTeam, setJoinedTeam] = useState(0);

	useEffect(() => {
		const teamsRaw = searchParams.get("teams");
		if (teamsRaw) {
			try {
				setTeamNames(JSON.parse(decodeURIComponent(teamsRaw)));
			} catch (e) {
				console.error("Erreur de parsing des équipes", e);
			}
		}
	}, [searchParams]);

	const nbTeams = teamNames.length || Number(searchParams.get("nbTeams")) || 0;

	const { subscribe, connected } = useWebSocket();

	useEffect(() => {
		if (!connected) return;
		const subscription = subscribe((message) => {
			const event: LobbyEventType = JSON.parse(message.body);
			if (event.type === "CLIENT_JOINED") setJoinedTeam((prev) => prev + 1);

			// Si un autre écran (ou le serveur) déclenche le démarrage
			if (event.type === "GAME_STARTED") router.push(`/intro/`);
		});
		return () => subscription?.unsubscribe();
	}, [router, subscribe, connected]);

	const handleStart = () => {
		router.push(`/teacher/game/${lobbyCode}/intro`);
	};
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 ">
			{/* Ajout de max-h-[90vh] et overflow-y-auto pour la hauteur */}
			<div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1e1b4b]/60 backdrop-blur-xl shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-orange-300/10 flex flex-col items-center gap-6 sm:gap-10 scrollbar-hide">

				<header className="text-center shrink-0"> {/* shrink-0 évite que le titre ne s'écrase */}
					<h1 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2 tracking-tight">
						Configuration
					</h1>
					<div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
              </span>
						<p className="text-orange-100/50 font-medium text-[9px] sm:text-xs uppercase tracking-[0.2em]">
							En attente des joueurs
						</p>
					</div>
				</header>

				{/* AFFICHAGE DU CODE : Plus compact en hauteur */}
				<div className="flex flex-col items-center gap-3 sm:gap-5 w-full shrink-0">
          <span className="text-[9px] sm:text-[10px] font-bold text-orange-200/20 uppercase tracking-[0.4em]">
              Code d&#39;accès session
          </span>
					<div className="flex flex-wrap justify-center gap-2 sm:gap-3">
						{lobbyCode ? lobbyCode.toUpperCase().split("").map((char, i) => (
							<div
								key={i}
								className="w-9 h-12 sm:w-14 sm:h-20 flex items-center justify-center bg-orange-200/5 text-orange-300/90 text-xl sm:text-4xl font-black rounded-xl sm:rounded-2xl border border-orange-200/20"
							>
								{char}
							</div>
						)) : (
							<div className="text-orange-200/40 italic text-sm animate-pulse">Génération...</div>
						)}
					</div>
				</div>


				<div className="w-full bg-orange-900/5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 border border-white/5 space-y-3 sm:space-y-5">
					<div className="flex justify-between items-end px-1">
						<h3 className="text-sm sm:text-lg text-orange-50/80 font-bold">Inscriptions</h3>
						<div className="text-right">
							<span className="text-xl sm:text-3xl font-black text-orange-200">{joinedTeam}</span>
							<span className="text-orange-200/20 text-base sm:text-xl font-bold"> / {nbTeams}</span>
						</div>
					</div>

					<div className="w-full h-2 sm:h-4 bg-black/20 rounded-full overflow-hidden border border-white/5">
						<div
							className="h-full bg-gradient-to-r from-orange-400/60 to-orange-200/60 rounded-full transition-all duration-1000"
							style={{ width: `${nbTeams > 0 ? (joinedTeam / nbTeams) * 100 : 0}%` }}
						/>
					</div>

					<div className="flex flex-wrap justify-center gap-1 sm:gap-2">
						{teamNames.map((name, index) => (
							<span key={index} className="px-2 py-0.5 sm:px-4 sm:py-1.5 bg-orange-200/5 text-orange-100/40 text-[8px] sm:text-[10px] font-bold rounded-full border border-orange-200/10">
                      {name}
                  </span>
						))}
					</div>
				</div>

				<div className="w-full mt-auto pt-2 shrink-0">
					<button
						onClick={handleStart}
						disabled={joinedTeam < nbTeams || joinedTeam === 0}
						className={`w-full py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-xl transition-all duration-500 flex items-center justify-center gap-3 shadow-xl ${
							joinedTeam >= nbTeams && joinedTeam > 0
								? "bg-orange-300 hover:bg-orange-200 text-[#1e1b4b] cursor-pointer"
								: "bg-white/5 text-white/10 cursor-not-allowed"
						}`}
					>
						{joinedTeam < nbTeams ? (
							<span className="tracking-widest opacity-50 italic uppercase text-xs sm:text-sm">Attente des joueurs...</span>
						) : (
							<>
								<span>DÉMARRER LA SESSION</span>
								<span className="animate-bounce text-xl sm:text-2xl">🎮</span>
							</>
						)}
					</button>
				</div>
			</div>
		</main>

	);
}

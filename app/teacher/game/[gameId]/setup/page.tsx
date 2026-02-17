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
    const [joinedTeam, setJoinedTeam] = useState(0);
    const nbTeams = Number(searchParams.get("nbTeams"));

    const { subscribe, connected, id } = useWebSocket();
    const [, setLoading] = useState(false);

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
                    router.push(`/teacher/game/${lobbyCode}/intro`);
                    break;


                default:
                    break;
            }
        });

        return () => subscription?.unsubscribe();
    }, [router, subscribe, connected, lobbyCode]);


    const startGame = async () => {
        if (!id) {
            console.error("hostId manquant, impossible de démarrer la partie");
            return;
        }
        console.log("LobbyCode:", lobbyCode, "hostId:", id);

        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/lobbies/${lobbyCode}/start`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hostId: id }),
                }
            );

            if (!response.ok) throw new Error("Erreur lors du démarrage");

            console.log("Partie démarrée !");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center pt-16 sm:pt-24 p-4 sm:p-6 w-full">
            <div className="w-full max-w-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center gap-6 sm:gap-10">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Code d{"'"}accès à la partie
                </h1>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {lobbyCode.toUpperCase().split("").map((char, i) => (
                        <div
                            key={i+1}
                            className="w-9 h-12 sm:w-22 sm:h-26 flex items-center justify-center bg-white text-black text-xl sm:text-8xl font-black rounded-xl sm:rounded-2xl"
                        >
                            {char}
                        </div>
                    ))}
                </div>

                <div className="w-full rounded-3xl sm:rounded-4xl p-4 sm:p-6 border border-white/5 bg-white/3 space-y-4 sm:space-y-6">

                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-white/40 font-semibold tracking-widest uppercase">Equipes connectées</span>
                        <div className="flex items-end gap-1">
                            <span className="text-3xl sm:text-5xl font-black text-white leading-none">{joinedTeam}</span>
                            <span className="text-white/20 text-lg sm:text-2xl font-bold mb-0.5">/ {nbTeams}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="w-full h-2 sm:h-3 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-purpleReViSE via-purple-400 to-purpleReViSE/80 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                style={{ width: `${nbTeams > 0 ? (joinedTeam / nbTeams) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                </div>

                <button
                    onClick={startGame}
                    disabled={joinedTeam < nbTeams || joinedTeam === 0}
                    className={`w-full py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-xl transition-all duration-500 flex items-center justify-center shadow-xl ${
                        joinedTeam >= nbTeams && joinedTeam > 0
                            ? "bg-purpleReViSE hover:bg-purpleReViSE/80 text-white cursor-pointer shadow-purpleReViSE/20"
                            : "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
                    }`}
                >
                    {joinedTeam < nbTeams || joinedTeam === 0 ? (
                        <span className="tracking-[0.2em] opacity-40 italic uppercase text-[10px] sm:text-xs">En attente de toutes les équipes...</span>
                    ) : (
                        <span>DÉMARRER LA PARTIE</span>
                    )}
                </button>

            </div>
        </div>
    );
}

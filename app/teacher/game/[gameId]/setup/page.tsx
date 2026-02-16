"use client"

import {useEffect, useState} from "react";
import {useRouter, useSearchParams, useParams } from "next/navigation";
import {useWebSocket} from "@/components/WebSocketProvider";
import {LobbyEventType} from "@/types/LobbyEventType";

export default function SetUpPage() {
    const router = useRouter();
    const { subscribe, connected, id } = useWebSocket();
    const searchParams = useSearchParams();
    const params = useParams();
    const nbTeams = Number(searchParams.get("nbTeams"));
    const [ joinedTeam, setJoinedTeam ] = useState(4);
    const lobbyCode = params.gameId as string;
    const [loading, setLoading] = useState(false);


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

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
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
            <button
                onClick={startGame}
                disabled={joinedTeam !== nbTeams || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Démarrage en cours..." : "Démarrer la partie"}
            </button>
        </>
    )
}
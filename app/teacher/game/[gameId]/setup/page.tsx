"use client"

import {useCallback, useEffect, useState} from "react";
import { useRouter, useParams } from "next/navigation";
import { startLobby } from "@/api/lobbyApi";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import {useLobby} from "@/hooks/useLobby";
import {useSessionId} from "@/hooks/useSessionId";
import {useWSSubscription} from "@/hooks/useWSSubscription";
import {useQueryClient} from "@tanstack/react-query";
import {TeamInfo} from "@/types/TeamInfo";
import Image from "next/image";

export default function SetUpPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();

    const lobbyCode = params.gameId?.toString() as string;
    const { lobbyQuery } = useLobby(lobbyCode);
    const { data, error, isError } = lobbyQuery;
    const nbTeams = data?.allTeams.length ?? 0;

    const [loading, setLoading] = useState(false);

    const hostId = useSessionId("hostId");

    useEffect(() => {
        if (isError) {
            showError(error instanceof ApiError ? error.key : "", "");
        }
    }, [isError, error]);

    const joinedTeam = data
      ? data.allTeams.length - data.availableTeams.length
      : 0;

    useWSSubscription(
      "lobby",
      useCallback((event) => {
          switch (event.type) {
              case "TEAM_JOINED":
                  queryClient.setQueryData(["lobby", lobbyCode], (old: TeamInfo | undefined) => {
                      if (!old) return old;

                      return {
                          ...old,
                          availableTeams: old.availableTeams.slice(1),
                      };
                  });
                  break;

              case "GAME_STARTED":
                  router.push(`/teacher/game/${lobbyCode}?presentation=true`);
                  break;
          }
      }, [lobbyCode, queryClient, router])
    );

    const startGame = async () => {
        if (!hostId) {
            showError("", "Identifiant de connexion manquant, impossible de démarrer la partie");
            return;
        }
        
        try {
            setLoading(true);
            await startLobby(lobbyCode, hostId);
        } catch (err) {
            showError(err instanceof ApiError ? err.key : "");
        } finally {
            setLoading(false);
        }
    };

    const getTeamGridCols = (nbTeams: number): string => {
        if (nbTeams === 4) return "grid-cols-4";
        if (nbTeams === 6) return "grid-cols-3";
        return "grid-cols-2 sm:grid-cols-3";
    };

    const teamGridCols = getTeamGridCols(nbTeams);

    return (
      <div className="flex items-center justify-center pt-10 sm:pt-16 p-4 sm:p-6 w-full">
          <div className="w-full max-w-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center gap-6 sm:gap-10">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Code d{"'"}accès à la partie
              </h1>

              <div data-testid="lobby-code-container" className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {lobbyCode.toUpperCase().split("").map((char, i) => (
                    <div key={"key-"+i} className="w-9 h-12 sm:w-22 sm:h-26 flex items-center justify-center bg-white text-black font-black rounded-xl sm:rounded-2xl overflow-hidden">
                <span className="text-[clamp(2rem,6vw,5rem)] leading-none">
                    {char}
                </span>
                    </div>
                  ))}
              </div>

              <div className={`grid w-full gap-3 ${teamGridCols}`}>
                  {data?.allTeams.map((team) => {
                      const isJoined = data && !data.availableTeams.includes(team);

                      return (
                        <div
                          key={team}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-500 ${
                            isJoined
                              ? "bg-purpleReViSE/10 border-purpleReViSE/40"
                              : "bg-white/5 border-white/5 opacity-35 grayscale"
                          }`}
                        >
                            <Image
                              src={`/badges/teams/${team}.svg`}
                              alt={team}
                              width={80}
                              height={80}
                              className="sm:w-24 sm:h-24"
                            />
                        </div>
                      );
                  })}
              </div>

              <button
                data-testid="start-game-button"
                onClick={startGame}
                disabled={joinedTeam < nbTeams || joinedTeam === 0 || loading}
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

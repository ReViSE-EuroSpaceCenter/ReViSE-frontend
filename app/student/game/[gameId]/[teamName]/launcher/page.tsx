"use client"

import {useWSSubscription} from "@/hooks/useWSSubscription";
import {useCallback} from "react";
import {useParams, useRouter} from "next/navigation";

export default function LauncherPage() {
    const router = useRouter();
    const params = useParams();

    const teamName = params.teamName as string;
    const lobbyCode = params.gameId as string;

    useWSSubscription("launcher", useCallback((event) => {
        if (event.type === "LAUNCHER_ENDED") {
            router.push(`/student/game/${lobbyCode}/${teamName}/resources`);
        }
    }, [lobbyCode, teamName, router]));

    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-6 pt-16 sm:pt-20">

          <div className="w-full max-w-md">

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center space-y-8">

                  <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-purpleReViSE/20 flex items-center justify-center text-3xl">
                          🛰️
                      </div>
                  </div>

                  <div className="space-y-3">
                      <p className="text-xs font-semibold tracking-widest text-purpleReViSE uppercase">
                          Cap sur Europe
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                          La suite se passe sur l&apos;écran principal
                      </h1>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                          Suivez les instructions de votre animateur et regardez l&apos;écran
                          central pour la prochaine étape de la mission.
                      </p>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-red-400 text-lg shrink-0">⚠️</span>
                      <p className="text-red-300 text-sm font-medium text-center leading-snug">
                          Ne fermez pas cette page, sinon vous ne pourrez pas continuer la partie.
                      </p>
                  </div>

              </div>

          </div>

      </div>
    );
}
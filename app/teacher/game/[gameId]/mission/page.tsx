"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import clsx from "clsx";

import { teams } from "@/types/Teams";
import { MissionStructure } from "@/components/student/MissionStructure";
<<<<<<< Updated upstream
=======
import { ProgressionBar } from "@/components/student/PogressionBar";
>>>>>>> Stashed changes
import { MissionProvider } from "@/contexts/MissionContext";
import { getGameInfo } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import LoadingPage from "@/app/loading";
import { teamColorMap } from "@/utils/teamColor";
import { useWebSocket } from "@/contexts/WebSocketProvider";
import { createMissionSyncChannel, MissionSyncMessage } from "@/utils/missionSync";
<<<<<<< Updated upstream
import {ProgressionBar} from "@/components/student/ProgressionBar";
=======
>>>>>>> Stashed changes
type TeamStats = {
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

interface TeamProgressionResponse extends TeamStats {
    teamLabel: string;
}

interface GameInfoResponse {
    allTeamsCompleted: boolean;
    teamsProgression: Record<string, TeamProgressionResponse>;
}

export default function HostMissionsPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { subscribe, connected } = useWebSocket();

    const lobbyCode = params.gameId as string;

    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});

    const hostId =
        globalThis.window === undefined
            ? null
            : sessionStorage.getItem("hostId");

    const {
        data: gameData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<GameInfoResponse>({
        queryKey: ["gameInfo", lobbyCode],
        queryFn: () => getGameInfo(lobbyCode),
        enabled: !!lobbyCode,
    });

    useEffect(() => {
        if (isError) {
            showError(
                error instanceof ApiError ? error.key : "",
                "Impossible de récupérer les données de la partie"
            );
        }
    }, [isError, error]);

    const storageKey = useMemo(() => {
        if (!lobbyCode || !selectedTeam) return null;
        return `host-missions-${lobbyCode}-${selectedTeam}`;
    }, [lobbyCode, selectedTeam]);


    useEffect(() => {
        const channel = createMissionSyncChannel();
        if (!channel) return;

        channel.onmessage = (event: MessageEvent<MissionSyncMessage>) => {
            const { lobbyCode: eventLobbyCode, teamName, missionsToUpdate } = event.data;

            if (eventLobbyCode !== lobbyCode) return;
            if (!selectedTeam || selectedTeam !== teamName) return;

            const next = { ...completedMissions };

            for (const missionKey of missionsToUpdate) {
                next[missionKey] = !next[missionKey];
            }

            setCompletedMissions(next);

            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify(next));
            }
        };

        return () => {
            channel.close();
        };
    }, [lobbyCode, selectedTeam, completedMissions, storageKey]);
    const persistCompletedMissions = (next: Record<string, boolean>) => {
        setCompletedMissions(next);
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(next));
        }
    };

    const handleMissionUpdated = async (missionsToUpdate: string[]) => {
        const next = { ...completedMissions };

        for (const missionKey of missionsToUpdate) {
            next[missionKey] = !next[missionKey];
        }

        persistCompletedMissions(next);
        await refetch();
    };

    useEffect(() => {
        if (!connected || !lobbyCode) return;

        const sub = subscribe("game", (message) => {
            try {
                const event = JSON.parse(message.body);

                if (event.type !== "TEAM_PROGRESSION") return;

                const { teamLabel, teamProgression } = event.payload;

                queryClient.setQueryData<GameInfoResponse>(
                    ["gameInfo", lobbyCode],
                    (old) => {
                        if (!old) return old;

                        return {
                            ...old,
                            teamsProgression: {
                                ...old.teamsProgression,
                                [teamLabel]: {
                                    ...old.teamsProgression[teamLabel],
                                    ...teamProgression,
                                },
                            },
                        };
                    }
                );

                if (selectedTeam === teamLabel) {
                    const localCount = Object.values(completedMissions).filter(Boolean).length;
                    const remoteCount = teamProgression.classicMissionsCompleted ?? 0;

                    if (remoteCount < localCount && storageKey) {
                        localStorage.removeItem(storageKey);
                        setCompletedMissions({});
                    }
                }
            } catch (err) {
                console.error("Erreur websocket host missions:", err);
            }
        });

        return () => sub?.unsubscribe();
    }, [connected, lobbyCode, queryClient, subscribe, selectedTeam, completedMissions, storageKey]);

    if (isLoading || !gameData) return <LoadingPage />;

    const activeTeamKeys = Object.keys(gameData.teamsProgression);

    const currentTeam = selectedTeam ? teams[selectedTeam] : null;
    const missions = currentTeam?.missions ?? [];
    const teamColor = selectedTeam ? teamColorMap[selectedTeam] : "#a855f7";

    const missionMap = Object.fromEntries(
        missions.map((m) => [m.id, m])
    );

    const projectIds = [...new Set(missions.map((m) => m.projectId))].sort((a, b) => a - b);

    const selectedTeamProgression = selectedTeam
        ? gameData.teamsProgression[selectedTeam]
        : null;

    const isBonus1Completed =
        selectedTeamProgression?.firstBonusMissionCompleted ?? false;

    const isBonus2Completed =
        selectedTeamProgression?.secondBonusMissionCompleted ?? false;

    const totalMissionCount = missions.filter((m) => !m.bonus).length;

    const localCompletedMissionCount = Object.values(completedMissions).filter(Boolean).length;
    const serverCompletedMissionCount =
        selectedTeamProgression?.classicMissionsCompleted ?? 0;

    const completedMissionCount = Math.max(
        localCompletedMissionCount,
        serverCompletedMissionCount
    );

    const gridClass =
        activeTeamKeys.length <= 4
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";

    return (
        <MissionProvider
            teamColor={teamColor}
            teamName={selectedTeam ?? ""}
            lobbyCode={lobbyCode}
            clientId={hostId ?? ""}
        >
            <div className="min-h-[calc(100vh-80px)]">
                <div className="px-6 lg:px-12 py-6 lg:py-10 space-y-10">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => router.back()}
                                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-purpleReViSE hover:text-white transition text-sm cursor-pointer"
                            >
                                ← Retour
                            </button>

                            {selectedTeam && (
                                <ProgressionBar
                                    completed={completedMissionCount}
                                    totalMission={totalMissionCount}
                                    color={teamColor}
                                />
                            )}
                        </div>

                        <div className={`grid ${gridClass} gap-4 lg:gap-6 place-items-center`}>
                            {activeTeamKeys.map((teamKey) => (
                                <button
                                    key={teamKey}
                                    onClick={() => setSelectedTeam(teamKey)}
                                    className={clsx(
                                        "rounded-2xl border px-4 py-3 transition-all cursor-pointer w-full max-w-30",
                                        selectedTeam === teamKey
                                            ? "border-purpleReViSE bg-white/10 scale-105"
                                            : "border-white/10 hover:border-white/30"
                                    )}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Image
                                            src={`/badges/${teamKey}.png`}
                                            alt={teamKey}
                                            width={56}
                                            height={56}
                                            className="object-contain"
                                        />
                                        <span className="text-sm font-medium">{teamKey}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {!selectedTeam && (
                        <div className="flex justify-center pt-8">
                            <p className="text-slate-400 text-base">
                                Sélectionne une équipe pour afficher ses missions
                            </p>
                        </div>
                    )}

                    {selectedTeam && !hostId && (
                        <div className="flex justify-center pt-4">
                            <p className="text-red-400 text-sm">
                                HostId introuvable dans la session.
                            </p>
                        </div>
                    )}

                    {selectedTeam && hostId && (
                        <div className="space-y-16">
                            {projectIds.map((projectId) => {
                                const missionFilters = missions.filter((m) => m.projectId === projectId);
                                const unlockedIds = new Set(missionFilters.flatMap((m) => m.unlocks));
                                const roots = missionFilters.filter((m) => !unlockedIds.has(m.id));

                                return (
                                    <div
                                        key={projectId}
                                        className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-center"
                                    >
                                        <div className="min-w-37.5">
                                            <h2 className="text-3xl">Projet {projectId}</h2>
                                        </div>

                                        <div className="flex flex-row items-center gap-0 w-full pr-6 overflow-x-auto">
                                            {roots.map((root) => (
                                                <MissionStructure
                                                    key={root.id}
                                                    mission={root}
                                                    missionMap={missionMap}
                                                    isBonus1Completed={isBonus1Completed}
                                                    isBonus2Completed={isBonus2Completed}
                                                    completedMissions={completedMissions}
                                                    onMissionUpdated={handleMissionUpdated}
                                                    isUnlocked={true}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MissionProvider>
    );
}
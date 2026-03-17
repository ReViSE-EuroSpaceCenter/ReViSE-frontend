"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { teams } from "@/types/Teams";
import { MissionStructure } from "@/components/student/MissionStructure";
import { MissionProvider } from "@/contexts/MissionContext";
import { getGameInfo } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import LoadingPage from "@/app/loading";
import { teamColorMap } from "@/utils/teamColor";
import { useWebSocket } from "@/contexts/WebSocketProvider";
import {createMissionSyncChannel, MissionSyncMessage} from "@/utils/missionSync";
import { ProgressionBar } from "@/components/student/ProgressionBar";
import {TeamSelector} from "@/components/teacher/TeamSelector";

type TeamStats = {
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

interface TeamProgressionResponse extends TeamStats {
    teamLabel: string;
}

interface TeamFullProgressionResponse {
    completedMissions: Record<string, boolean>;
    teamProgression: TeamProgressionResponse;
}

interface GameInfoResponse {
    allTeamsCompleted: boolean;
    teamsFullProgression: Record<string, TeamFullProgressionResponse>;
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
        typeof window === "undefined"
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

    const getCompletedMissionsForTeam = (teamKey: string): Record<string, boolean> => {
        if (!gameData) return {};
        return gameData.teamsFullProgression?.[teamKey]?.completedMissions ?? {};
    };

    const handleSelectTeam = (teamKey: string) => {
        const nextCompletedMissions = getCompletedMissionsForTeam(teamKey);

        console.log("teamKey:", teamKey);
        console.log("nextCompletedMissions:", nextCompletedMissions);

        setSelectedTeam(teamKey);
        setCompletedMissions(nextCompletedMissions);
    };

    useEffect(() => {
        const channel = createMissionSyncChannel();
        if (!channel) return;

        channel.onmessage = (event: MessageEvent<MissionSyncMessage>) => {
            const { lobbyCode: eventLobbyCode, teamName, missionsToUpdate } = event.data;

            if (eventLobbyCode !== lobbyCode) return;
            if (!selectedTeam || selectedTeam !== teamName) return;

            setCompletedMissions((prev) => {
                const next = { ...prev };

                for (const missionKey of missionsToUpdate) {
                    next[missionKey] = !next[missionKey];
                }

                return next;
            });
        };

        return () => {
            channel.close();
        };
    }, [lobbyCode, selectedTeam]);
    const handleMissionUpdated = async (missionsToUpdate: string[]) => {
        const next = { ...completedMissions };

        for (const missionKey of missionsToUpdate) {
            next[missionKey] = !next[missionKey];
        }

        setCompletedMissions(next);

        const result = await refetch();

        if (selectedTeam && result.data) {
            const refreshedCompletedMissions =
                result.data.teamsFullProgression?.[selectedTeam]?.completedMissions ?? {};

            setCompletedMissions(refreshedCompletedMissions);
        }
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
                            teamsFullProgression: {
                                ...(old.teamsFullProgression ?? {}),
                                [teamLabel]: {
                                    ...(old.teamsFullProgression?.[teamLabel] ?? {
                                        completedMissions: {},
                                        teamProgression: {
                                            teamLabel,
                                            classicMissionsCompleted: 0,
                                            firstBonusMissionCompleted: false,
                                            secondBonusMissionCompleted: false,
                                        },
                                    }),
                                    teamProgression: {
                                        ...(old.teamsFullProgression?.[teamLabel]?.teamProgression ?? {
                                            teamLabel,
                                            classicMissionsCompleted: 0,
                                            firstBonusMissionCompleted: false,
                                            secondBonusMissionCompleted: false,
                                        }),
                                        ...teamProgression,
                                    },
                                },
                            },
                        };
                    }
                );

                if (selectedTeam === teamLabel) {
                    const localCount = Object.values(completedMissions ?? {}).filter(Boolean).length;
                    const remoteCount = teamProgression?.classicMissionsCompleted ?? 0;

                    if (remoteCount < localCount) {
                        setCompletedMissions(
                            gameData?.teamsFullProgression?.[teamLabel]?.completedMissions ?? {}
                        );
                    }
                }
            } catch (err) {
                console.error("Erreur websocket host missions:", err);
            }
        });

        return () => sub?.unsubscribe();
    }, [connected, lobbyCode, queryClient, subscribe, selectedTeam, completedMissions, gameData]);

    if (isLoading || !gameData) return <LoadingPage />;

    const activeTeamKeys = Object.keys(gameData.teamsFullProgression ?? {});

    const currentTeam = selectedTeam ? teams[selectedTeam] : null;
    const missions = currentTeam?.missions ?? [];
    const teamColor = selectedTeam ? teamColorMap[selectedTeam] : "#a855f7";

    const missionMap = Object.fromEntries(missions.map((m) => [m.id, m]));

    const projectIds = [...new Set(missions.map((m) => m.projectId))].sort((a, b) => a - b);

    const selectedTeamFullProgression = selectedTeam
        ? gameData.teamsFullProgression?.[selectedTeam]
        : null;

    const selectedTeamProgression = selectedTeamFullProgression?.teamProgression ?? null;

    const isBonus1Completed =
        selectedTeamProgression?.firstBonusMissionCompleted ?? false;

    const isBonus2Completed =
        selectedTeamProgression?.secondBonusMissionCompleted ?? false;

    const totalMissionCount = missions.filter((m) => !m.bonus).length;

    const localCompletedMissionCount = Object.values(completedMissions ?? {}).filter(Boolean).length;
    const serverCompletedMissionCount =
        selectedTeamProgression?.classicMissionsCompleted ?? 0;

    const completedMissionCount = Math.max(
        localCompletedMissionCount,
        serverCompletedMissionCount
    );

    return (
        <MissionProvider
            teamColor={teamColor}
            teamName={selectedTeam ?? ""}
            lobbyCode={lobbyCode}
            clientId={hostId ?? ""}
        >
            <div className="h-[calc(100vh-80px)] overflow-hidden">
                <div className="h-full px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-5 flex flex-col gap-4 overflow-hidden">
                    <div className="flex flex-col gap-3 shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-fit px-3 sm:px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-purpleReViSE hover:text-white transition text-sm cursor-pointer"
                            >
                                ← Retour
                            </button>

                            {selectedTeam && (
                                <div className="w-full sm:w-auto">
                                    <ProgressionBar
                                        completed={completedMissionCount}
                                        totalMission={totalMissionCount}
                                        color={teamColor}
                                    />
                                </div>
                            )}
                        </div>

                        <TeamSelector
                            activeTeamKeys={activeTeamKeys}
                            selectedTeam={selectedTeam}
                            onSelectTeam={handleSelectTeam}
                        />
                    </div>

                    {!selectedTeam && (
                        <div className="flex-1 min-h-0 flex items-center justify-center">
                            <p className="text-slate-400 text-sm sm:text-base text-center">
                                Sélectionne une équipe pour afficher ses missions
                            </p>
                        </div>
                    )}

                    {selectedTeam && !hostId && (
                        <div className="flex-1 min-h-0 flex items-center justify-center">
                            <p className="text-red-400 text-sm text-center">
                                HostId introuvable dans la session.
                            </p>
                        </div>
                    )}

                    {selectedTeam && hostId && (
                        <div className="flex-1 min-h-0 flex flex-col gap-4 sm:gap-5 lg:gap-6 overflow-hidden pt-3 sm:pt-4 lg:pt-5">
                            {projectIds.map((projectId) => {
                                const missionFilters = missions.filter((m) => m.projectId === projectId);
                                const unlockedIds = new Set(missionFilters.flatMap((m) => m.unlocks));
                                const roots = missionFilters.filter((m) => !unlockedIds.has(m.id));

                                return (
                                    <div
                                        key={projectId}
                                        className="grid grid-cols-1 xl:grid-cols-[110px_1fr] 2xl:grid-cols-[140px_1fr] gap-2 sm:gap-3 lg:gap-4 items-center flex-1 min-h-0"
                                    >
                                        <div className="min-w-0 shrink-0">
                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                                                Projet {projectId}
                                            </h2>
                                        </div>

                                        <div className="w-full min-h-0 overflow-visible py-2">
                                            <div className="flex flex-row items-center gap-0 w-full h-full origin-left scale-[0.72] sm:scale-[0.8] lg:scale-[0.9] xl:scale-100 overflow-visible">
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
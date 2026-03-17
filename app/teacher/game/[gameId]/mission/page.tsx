"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ProgressionBar } from "@/components/student/ProgressionBar";
import { WSEventType } from "@/types/WSEventType";
import { GameInfoResponse } from "@/types/Mission";

type TeamProgressionPayload = {
    teamProgression: {
        teamLabel: string;
        firstBonusMissionCompleted: boolean;
        secondBonusMissionCompleted: boolean;
        classicMissionsCompleted?: number;
    };
    allTeamsMissionsCompleted: boolean;
};

function getHostId() {
    return typeof window === "undefined" ? null : sessionStorage.getItem("hostId");
}

function parseMissionEvent(messageBody: string): TeamProgressionPayload | null {
    const event: WSEventType = JSON.parse(messageBody);
    return event.type === "TEAM_PROGRESSION"
        ? (event.payload as TeamProgressionPayload)
        : null;
}

function updateTeamProgression(
    gameData: GameInfoResponse | undefined,
    payload: TeamProgressionPayload
) {
    if (!gameData) return gameData;

    const { teamProgression, allTeamsMissionsCompleted } = payload;
    const { teamLabel } = teamProgression;
    const teamData = gameData.teamsFullProgression?.[teamLabel];

    if (!teamData) return gameData;

    const bonusMissions = teams[teamLabel]?.missions.filter((mission) => mission.bonus) ?? [];
    const [bonus1, bonus2] = bonusMissions;

    return {
        ...gameData,
        teamsFullProgression: {
            ...gameData.teamsFullProgression,
            [teamLabel]: {
                ...teamData,
                completedMissions: {
                    ...teamData.completedMissions,
                    ...(bonus1
                        ? { [bonus1.id]: teamProgression.firstBonusMissionCompleted }
                        : {}),
                    ...(bonus2
                        ? { [bonus2.id]: teamProgression.secondBonusMissionCompleted }
                        : {}),
                },
                teamProgression: {
                    ...teamData.teamProgression,
                    ...teamProgression,
                },
            },
        },
        allTeamsCompleted: allTeamsMissionsCompleted,
    };
}

function getProjectRoots(missions: (typeof teams)[keyof typeof teams]["missions"], projectId: number) {
    const projectMissions = missions.filter((mission) => mission.projectId === projectId);
    const unlockedIds = new Set(projectMissions.flatMap((mission) => mission.unlocks));
    return projectMissions.filter((mission) => !unlockedIds.has(mission.id));
}

type ProjectSectionProps = {
    projectId: number;
    missions: (typeof teams)[keyof typeof teams]["missions"];
    missionMap: Record<number, (typeof teams)[keyof typeof teams]["missions"][number]>;
    isBonus1Completed: boolean;
    isBonus2Completed: boolean;
    completedMissions: Record<number, boolean>;
    onMissionUpdated: () => Promise<void>;
};

function ProjectSection({
                            projectId,
                            missions,
                            missionMap,
                            isBonus1Completed,
                            isBonus2Completed,
                            completedMissions,
                            onMissionUpdated,
                        }: ProjectSectionProps) {
    const roots = getProjectRoots(missions, projectId);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[110px_1fr] 2xl:grid-cols-[140px_1fr] gap-2 sm:gap-3 lg:gap-4 items-center flex-1 min-h-0">
            <div className="min-w-0 shrink-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    Projet {projectId}
                </h2>
            </div>

            <div className="w-full min-h-0 py-2 overflow-x-auto">
                <div className="flex flex-row items-center gap-0 min-w-max">
                    {roots.map((root) => (
                        <MissionStructure
                            key={root.id}
                            mission={root}
                            missionMap={missionMap}
                            isBonus1Completed={isBonus1Completed}
                            isBonus2Completed={isBonus2Completed}
                            completedMissions={completedMissions}
                            onMissionUpdated={onMissionUpdated}
                            isUnlocked
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function HostMissionsPage() {
    const { gameId } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { subscribe, connected } = useWebSocket();

    const lobbyCode = gameId as string;
    const hostId = getHostId();
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

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
        if (!isError) return;

        showError(
            error instanceof ApiError ? error.key : "",
            "Impossible de récupérer les données de la partie"
        );
    }, [isError, error]);

    const activeTeamKeys = Object.keys(gameData?.teamsFullProgression ?? {});
    const effectiveSelectedTeam = selectedTeam ?? activeTeamKeys[0] ?? null;

    useEffect(() => {
        if (!connected || !lobbyCode) return;

        const handleMissionMessage = async (message: { body: string }) => {
            try {
                const payload = parseMissionEvent(message.body);
                if (!payload) return;

                queryClient.setQueryData<GameInfoResponse>(
                    ["gameInfo", lobbyCode],
                    (previousData) => updateTeamProgression(previousData, payload)
                );

                if (payload.teamProgression.teamLabel === effectiveSelectedTeam) {
                    await refetch();
                }
            } catch (err) {
                showError(
                    err instanceof ApiError ? err.key : "",
                    "Erreur lors de la récupération des données"
                );
            }
        };

        const subscription = subscribe("mission", handleMissionMessage);
        return () => subscription?.unsubscribe();
    }, [connected, lobbyCode, queryClient, subscribe, effectiveSelectedTeam, refetch]);

    const handleMissionUpdated = async () => {
        await refetch();
    };

    const currentTeam = effectiveSelectedTeam ? teams[effectiveSelectedTeam] : null;
    const missions = useMemo(() => {
        return currentTeam?.missions ?? [];
    }, [currentTeam]);
    const teamColor = effectiveSelectedTeam ? teamColorMap[effectiveSelectedTeam] : "#a855f7";

    const selectedTeamData = effectiveSelectedTeam
        ? gameData?.teamsFullProgression?.[effectiveSelectedTeam]
        : null;

    const completedMissions = selectedTeamData?.completedMissions ?? {};
    const teamProgression = selectedTeamData?.teamProgression;

    const completedMissionCount = Math.max(
        Object.values(completedMissions).filter(Boolean).length,
        teamProgression?.classicMissionsCompleted ?? 0
    );

    const totalMissionCount = missions.filter((mission) => !mission.bonus).length;
    const isBonus1Completed = teamProgression?.firstBonusMissionCompleted ?? false;
    const isBonus2Completed = teamProgression?.secondBonusMissionCompleted ?? false;

    const missionMap = useMemo(
        () => Object.fromEntries(missions.map((mission) => [mission.id, mission])),
        [missions]
    );

    const projectIds = useMemo(
        () => [...new Set(missions.map((mission) => mission.projectId))].sort((a, b) => a - b),
        [missions]
    );

    if (isLoading || !gameData) {
        return <LoadingPage />;
    }

    return (
        <MissionProvider
            teamColor={teamColor}
            teamName={effectiveSelectedTeam ?? ""}
            lobbyCode={lobbyCode}
            clientId={hostId ?? ""}
        >
            <div className="h-[calc(100vh-80px)] overflow-hidden">
                <div className="h-full px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-5 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-end justify-between gap-4 border-b border-slate-700 shrink-0 overflow-hidden">
                        <div className="flex items-end gap-4 overflow-x-auto min-w-0">
                            <button
                                onClick={() => router.back()}
                                className="mb-2 px-3 sm:px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-purpleReViSE hover:text-white transition text-sm cursor-pointer shrink-0"
                            >
                                ← Retour
                            </button>

                            <div className="flex items-end gap-2 min-w-max">
                                {activeTeamKeys.map((teamKey) => {
                                    const isSelected = effectiveSelectedTeam === teamKey;

                                    return (
                                        <button
                                            key={teamKey}
                                            type="button"
                                            onClick={() => setSelectedTeam(teamKey)}
                                            className={[
                                                "px-4 py-2 text-sm font-medium transition cursor-pointer",
                                                "rounded-t-xl border border-b-0 flex items-center gap-2 whitespace-nowrap",
                                                isSelected
                                                    ? "bg-slate-800 text-white border-slate-500"
                                                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white",
                                            ].join(" ")}
                                        >
                                            <span
                                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                                style={{ backgroundColor: teamColorMap[teamKey] }}
                                            />
                                            {teamKey}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {effectiveSelectedTeam && (
                            <div className="mb-2 w-full max-w-xs shrink-0">
                                <ProgressionBar
                                    completed={completedMissionCount}
                                    totalMission={totalMissionCount}
                                    color={teamColor}
                                />
                            </div>
                        )}
                    </div>

                    {!effectiveSelectedTeam && (
                        <div className="flex-1 min-h-0 flex items-center justify-center">
                            <p className="text-slate-400 text-sm sm:text-base text-center">
                                Sélectionne une équipe pour afficher ses missions
                            </p>
                        </div>
                    )}

                    {effectiveSelectedTeam && !hostId && (
                        <div className="flex-1 min-h-0 flex items-center justify-center">
                            <p className="text-red-400 text-sm text-center">
                                Une erreur est survenue. Réessayez dans quelques instants.
                            </p>
                        </div>
                    )}

                    {effectiveSelectedTeam && hostId && (
                        <div className="flex-1 min-h-0 flex flex-col gap-4 sm:gap-5 lg:gap-6 overflow-hidden pt-3 sm:pt-4 lg:pt-5">
                            {projectIds.map((projectId) => (
                                <ProjectSection
                                    key={projectId}
                                    projectId={projectId}
                                    missions={missions}
                                    missionMap={missionMap}
                                    isBonus1Completed={isBonus1Completed}
                                    isBonus2Completed={isBonus2Completed}
                                    completedMissions={completedMissions}
                                    onMissionUpdated={handleMissionUpdated}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MissionProvider>
    );
}
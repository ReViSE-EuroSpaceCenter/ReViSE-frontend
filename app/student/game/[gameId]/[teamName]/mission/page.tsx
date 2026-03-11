"use client";

import { teams } from "@/types/Teams";
import { useParams, useRouter } from "next/navigation";
import { MissionStructure } from "@/components/student/MissionStructure";
import { useEffect } from "react";
import { ProgressionBar } from "@/components/student/PogressionBar";
import { getTeamMissionsState } from "@/api/missionApi";
import { MissionProvider } from "@/contexts/MissionContext";
import { showError } from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";
import LoadingPage from "@/app/loading";
import {teamColorMap} from "@/utils/teamColor";
import {useWebSocket} from "@/contexts/WebSocketProvider";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {TeamMissionsState} from "@/types/TeamMissionState";

export default function MissionPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { subscribe, connected } = useWebSocket();

    const teamName = params.teamName as string;
    const lobbyCode = params.gameId as string;
    const currentTeam = teams[teamName];
    const clientId = sessionStorage.getItem("clientId") as string;
    const missions = currentTeam.missions;

    const missionMap = Object.fromEntries(
        missions.map((m) => [m.id, m])
    );

    const projectIds = [...new Set(missions.map(m => m.projectId))]
        .sort((a, b) => a - b);

    const teamColor = teamColorMap[teamName];

    const { data, isError, error, isLoading } = useQuery<TeamMissionsState>({
        queryKey: ["missions", lobbyCode, clientId],
        queryFn: () => getTeamMissionsState(lobbyCode, clientId),
        enabled: !!lobbyCode && !!clientId,
    });

    useEffect(() => {
        if (isError) {
            showError(error instanceof ApiError ? error.key : "");
        }
    }, [isError, error]);

    useEffect(() => {
        if (!connected) return;

        const sub = subscribe("game", (message) => {
            const event = JSON.parse(message.body);

            if (event.type !== "TEAM_PROGRESSION" || event.payload.teamLabel !== teamName) return;

            if (event.type === "TEAM_PROGRESSION" && event.payload.teamLabel === teamName) {
                queryClient.setQueryData<TeamMissionsState>(
                  ["missions", lobbyCode, clientId],
                  (old) => {
                      if (!old) return old;
                      return {
                          ...old,
                          teamFullProgression: {
                              ...old.teamFullProgression,
                              teamProgression: event.payload.teamProgression,
                          },
                      };
                  }
                );
            }
        });

        return () => sub?.unsubscribe();
    }, [clientId, connected, lobbyCode, queryClient, subscribe, teamName]);

    if (isLoading || !data) return <LoadingPage />;

    const completedMissions = data.teamFullProgression.completedMissions;
    const isBonus1Completed = data.teamFullProgression.teamProgression.firstBonusMissionCompleted;
    const isBonus2Completed = data.teamFullProgression.teamProgression.secondBonusMissionCompleted;

    const totalMissionCount = missions.filter(m => !m.bonus).length;
    const completedMissionCount = Object.values(completedMissions).filter(Boolean).length;

    return (
        <MissionProvider
            teamColor={teamColor}
            teamName={teamName}
            lobbyCode={lobbyCode}
            clientId={clientId}
        >
        <div className="min-h-[calc(100vh-80px)]">
            <div className="px-6 lg:px-12 py-6 lg:py-12 space-y-16 justify-between item-center">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-purpleReViSE hover:text-white transition text-sm cursor-pointer"
                    >
                        ← Retour
                    </button>

                    <div className="flex flex-col gap-6 ">
                        <ProgressionBar
                            completed={completedMissionCount}
                            totalMission={totalMissionCount}
                            color={teamColor}
                        />
                    </div>
                </div>

                {projectIds.map(projectId => {
                    const missionFilters = missions.filter(
                        m => m.projectId === projectId
                    );

                    const unlockedIds = new Set(missionFilters.flatMap(m => m.unlocks));
                    const roots = missionFilters.filter(m => !unlockedIds.has(m.id));

                    return (
                        <div
                            key={projectId}
                            className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-center"
                        >
                            <div className="min-w-37.5">
                                <h2 className="text-3xl">
                                    Projet {projectId}
                                </h2>
                            </div>

                            <div className="flex flex-row items-center gap-0 w-full pr-6">
                                {roots.map(root => (
                                    <MissionStructure
                                        key={root.id}
                                        mission={root}
                                        missionMap={missionMap}
                                        isBonus1Completed={isBonus1Completed}
                                        isBonus2Completed={isBonus2Completed}
                                        completedMissions={completedMissions}
                                        onMissionUpdated={() => queryClient.invalidateQueries({ queryKey: ["missions", lobbyCode, clientId] })}
                                        isUnlocked={true}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        </MissionProvider>
    );
}
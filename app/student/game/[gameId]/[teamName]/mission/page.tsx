"use client";

import {teams} from "@/types/Teams";
import {useParams, useRouter} from "next/navigation";
import {MissionStructure} from "@/components/student/MissionStructure";
import {useEffect} from "react";
import {useWebSocket} from "@/contexts/WebSocketProvider";
import {ProgressionBar} from "@/components/student/PogressionBar";
import {getTeamMissionsState} from "@/api/missionApi";
import {missionNameTraduction} from "@/utils/MissionName";
import {teamColorMap} from "@/utils/TeamColor";
import {MissionProvider} from "@/contexts/MissionContext";
import {showError} from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {TeamMissionsState} from "@/types/TeamMissionState";
import LoadingPage from "@/app/loading";

export default function MissionPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const teamName = params.teamName as string;
    const lobbyCode = params.gameId as string;
    const currentTeam = teams[teamName];
    const { subscribeGame, connected, id } = useWebSocket();
    const clientId = id as string;
    const missions = currentTeam.missions;

    const missionMap = Object.fromEntries(
      missions.map((m) => [m.id, m])
    );

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

        const sub = subscribeGame((message) => {
            const event = JSON.parse(message.body);
            if (event.type !== "TEAM_PROGRESSION" || event.payload.teamLabel !== teamName) return;
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

        });

        return () => sub?.unsubscribe();
    }, [connected, subscribeGame, teamName, lobbyCode, clientId, queryClient]);

    if (isLoading || !data) return <LoadingPage />;

    const completedMissions = data.teamFullProgression.completedMissions;
    const progression = data.teamFullProgression.teamProgression.classicMissionPercentage;
    const isBonus1Completed = data.teamFullProgression.teamProgression.firstBonusMissionCompleted;
    const isBonus2Completed = data.teamFullProgression.teamProgression.secondBonusMissionCompleted;

    const projectIds = [...new Set(missions.map((m) => m.projectId))].sort((a, b) => a - b);

    const projectCompletionMap = projectIds.reduce<Record<number, boolean>>((acc, projectId) => {
        const projectMissions = missions.filter((m) => m.projectId === projectId && !m.bonus);
        acc[projectId] = projectMissions.every((m) => {
            const missionNumber = missionNameTraduction(m, teamName);
            return completedMissions[missionNumber];
        });
        return acc;
    }, {});

    const projectUnlockedMap = projectIds.reduce<Record<number, boolean>>((acc, projectId, index) => {
        const previousProjectId = projectIds[index - 1];
        acc[projectId] = index === 0 ? true : acc[previousProjectId] && projectCompletionMap[previousProjectId];
        return acc;
    }, {});

    const totalMissionCount = missions.filter((m) => !m.bonus).length;
    const completedMissionCount = Math.round((progression / 100) * totalMissionCount);

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

                      <div className="flex flex-col gap-6">
                          <ProgressionBar
                            progression={progression}
                            completed={completedMissionCount}
                            totalMission={totalMissionCount}
                            color={teamColor}
                          />
                      </div>
                  </div>

                  {projectIds.map((projectId) => {
                      const isProjectUnlocked =
                        projectUnlockedMap[projectId];

                      const missionFilters = currentTeam.missions.filter(
                        (m) => m.projectId === projectId
                      );

                      const unlockedIds = new Set(
                        missionFilters.flatMap((m) => m.unlocks)
                      );

                      const roots = missionFilters.filter(
                        (m) => !unlockedIds.has(m.id)
                      );

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
                                {roots.map((root) => (
                                  <MissionStructure
                                    key={root.id}
                                    mission={root}
                                    missionMap={missionMap}
                                    isBonus1Completed={isBonus1Completed}
                                    isBonus2Completed={isBonus2Completed}
                                    completedMissions={completedMissions}
                                    onMissionUpdated={() =>
                                      queryClient.invalidateQueries({
                                          queryKey: [
                                              "missions",
                                              lobbyCode,
                                              clientId,
                                          ],
                                      })
                                    }
                                    isUnlocked={isProjectUnlocked}
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
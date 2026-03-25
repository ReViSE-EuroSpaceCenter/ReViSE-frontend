"use client";

import { useParams, useRouter } from "next/navigation";
import {useCallback, useEffect} from "react";
import { ProgressionBar } from "@/components/mission/ProgressionBar";
import { getTeamMissionsState } from "@/api/missionApi";
import { MissionProvider } from "@/contexts/MissionContext";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import LoadingPage from "@/app/loading";
import { teamColorMap } from "@/utils/teamColor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TeamMissionsState } from "@/types/TeamMissionState";
import { ProjectSection } from "@/components/mission/ProjectSection";
import { ReturnButton } from "@/components/mission/ReturnButton";
import { useMission } from "@/hooks/useMission";
import {useSessionId} from "@/hooks/useSessionId";
import {useWSSubscription} from "@/hooks/useWSSubscription";
import {useInvalidateMissions} from "@/hooks/useInvalidateMissions";

export default function MissionPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const clientId = useSessionId("clientId");

    const teamName = params.teamName as string;
    const lobbyCode = params.gameId as string;

    const { missions, missionMap, projectIds, totalMissionCount } = useMission(teamName);

    const invalidateMissions = useInvalidateMissions([
        "missions",
        lobbyCode,
        clientId,
    ]);

    const teamColor = teamColorMap[teamName];

    const { data, isError, error, isLoading } = useQuery<TeamMissionsState>({
        queryKey: ["missions", lobbyCode, clientId],
        queryFn: () => getTeamMissionsState(lobbyCode, clientId as string),
        enabled: !!lobbyCode && !!clientId,
    });

    useEffect(() => {
        if (isError) {
            showError(error instanceof ApiError ? error.key : "");
        }
    }, [isError, error]);

    useWSSubscription("mission", useCallback((event) => {
        if (event.type === "MISSION_ENDED") {
            router.push(`/student/game/${lobbyCode}/${teamName}/resources`);
            return;
        }

        if (event.type !== "TEAM_PROGRESSION" || event.payload.teamProgression.teamLabel !== teamName) return;

        queryClient.setQueryData<TeamMissionsState>(["missions", lobbyCode, clientId], (old) => {
            if (!old) return old;
            return {
                ...old,
                teamFullProgression: {
                    ...old.teamFullProgression,
                    teamProgression: event.payload.teamProgression,
                },
            };
        });
    }, [lobbyCode, teamName, clientId, router, queryClient]));

    if (isLoading || !data) return <LoadingPage />;

    const completedMissions = data.teamFullProgression.completedMissions;
    const isBonus1Completed = data.teamFullProgression.teamProgression.firstBonusMissionCompleted;
    const isBonus2Completed = data.teamFullProgression.teamProgression.secondBonusMissionCompleted;

    const completedMissionCount = Object.values(completedMissions).filter(Boolean).length;

    return (
        <MissionProvider
            teamColor={teamColor}
            teamName={teamName}
            lobbyCode={lobbyCode}
            clientId={clientId as string}
        >
        <div className="min-h-[calc(100vh-80px)]">
            <div className="px-6 lg:px-12 py-6 lg:py-12 space-y-16 justify-between item-center">
                <div className="flex items-center justify-between mb-6">
                    <ReturnButton url={`/student/game/${lobbyCode}/${teamName}`} />
                    <div className="flex flex-col gap-6 w-48 sm:w-64 lg:w-80">
                        <ProgressionBar
                            completed={completedMissionCount}
                            totalMission={totalMissionCount}
                            color={teamColor}
                        />
                    </div>
                </div>

                {projectIds.map((projectId) => (
                  <ProjectSection
                    key={projectId}
                    projectId={projectId}
                    missions={missions}
                    missionMap={missionMap}
                    isBonus1Completed={isBonus1Completed}
                    isBonus2Completed={isBonus2Completed}
                    completedMissions={completedMissions}
                    onMissionUpdated={invalidateMissions}
                  />
                ))}
            </div>
        </div>
        </MissionProvider>
    );
}
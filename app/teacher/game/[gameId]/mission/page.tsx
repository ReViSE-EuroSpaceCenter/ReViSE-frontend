"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MissionProvider } from "@/contexts/MissionContext";
import { getTeamsFullProgression } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import LoadingPage from "@/app/loading";
import { teamColorMap } from "@/utils/teamColor";
import { ProgressionBar } from "@/components/mission/ProgressionBar";
import {TeamsFullProgression, TeamProgressionWS} from "@/types/TeamData";
import { ProjectSection } from "@/components/mission/ProjectSection";
import { ReturnButton } from "@/components/mission/ReturnButton";
import { TeamTabs } from "@/components/mission/TeamTabs";
import { useMission } from "@/hooks/useMission";
import { useSessionId } from "@/hooks/useSessionId";
import { useWSSubscription } from "@/hooks/useWSSubscription";
import { updateTeamProgression } from "@/utils/missionUpdate";
import {useInvalidateMissions} from "@/hooks/useInvalidateMissions";

export default function HostMissionsPage() {
    const { gameId } = useParams();
    const queryClient = useQueryClient();
    const lobbyCode = gameId as string;
    const hostId = useSessionId("hostId");

    const { data: gameData, isLoading, isError, error } = useQuery<TeamsFullProgression>({
        queryKey: ["gameInfo", lobbyCode],
        queryFn: () => getTeamsFullProgression(lobbyCode),
        enabled: !!lobbyCode,
    });

    useEffect(() => {
        if (isError) {
            showError(error instanceof ApiError ? error.key : "", "Impossible de récupérer les données de la partie");
        }
    }, [isError, error]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const teamKeys = useMemo(
        () => Object.keys(gameData?.teamsFullProgression ?? {}).sort((a, b) => a.localeCompare(b)),
        [gameData?.teamsFullProgression]
    );
    const selectedTeam = teamKeys[selectedIndex] ?? "";

    useWSSubscription("mission", useCallback((event) => {
        if (event.type !== "TEAM_PROGRESSION") return;

        const wsPayload: TeamProgressionWS = {
            teamProgression: {
                ...event.payload,
                allTeamsMissionsCompleted: event.payload.allTeamsMissionsCompleted,
            },
            allTeamsMissionsCompleted: event.payload.allTeamsMissionsCompleted,
        };

        queryClient.setQueryData<TeamsFullProgression>(["gameInfo", lobbyCode], (prev) =>
            updateTeamProgression(prev, wsPayload)
        );
    }, [lobbyCode, queryClient]));

    const { missions, missionMap, projectIds } = useMission(selectedTeam);

    const invalidateGame = useInvalidateMissions([
        "gameInfo",
        lobbyCode,
    ]);

    const { completedMissions, teamProgression } = useMemo(() => {
        const data = gameData?.teamsFullProgression?.[selectedTeam];
        return {
            completedMissions: data?.completedMissions ?? {},
            teamProgression: data?.teamProgression,
        };
    }, [gameData, selectedTeam]);

    const completedMissionsCount = gameData?.teamsFullProgression?.[selectedTeam]?.teamProgression?.classicMissionsCompleted ?? 0;

    if (isLoading || !gameData || !teamKeys.length) return <LoadingPage />;

    return (
        <MissionProvider
            teamColor={teamColorMap[selectedTeam]}
            teamName={selectedTeam}
            lobbyCode={lobbyCode}
            clientId={hostId as string}
        >
            <div className="min-h-[calc(100vh-80px)]">
                <div className="px-6 lg:px-12 py-6 lg:py-12 space-y-12 justify-between item-center">
                    <div className="border-b border-slate-700 flex flex-col gap-4 mb-6 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">

                        <div className="self-start">
                            <ReturnButton url={`/teacher/game/${lobbyCode}`} />
                        </div>

                        <div className="w-full lg:w-auto flex items-end">
                            <TeamTabs
                                teamKeys={teamKeys}
                                selectedTeam={selectedTeam}
                                setSelectedIndex={setSelectedIndex}
                            />
                        </div>

                        <div className="w-full sm:w-164 lg:w-80 self-end min-[900px]:ml-auto min-[700px]:mb-2">
                            <ProgressionBar
                                completed={completedMissionsCount}
                                totalMission={missions.filter((m) => !m.bonus).length}
                                color={teamColorMap[selectedTeam]}
                            />
                        </div>
                    </div>
                    {projectIds.map((projectId) => (
                        <ProjectSection
                            key={projectId}
                            projectId={projectId}
                            missions={missions}
                            missionMap={missionMap}
                            isBonus1Completed={teamProgression?.firstBonusMissionCompleted ?? false}
                            isBonus2Completed={teamProgression?.secondBonusMissionCompleted ?? false}
                            completedMissions={completedMissions}
                            onMissionUpdated={invalidateGame}
                        />
                    ))}
                </div>
            </div>
        </MissionProvider>
    );
}
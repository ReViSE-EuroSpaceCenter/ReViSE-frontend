"use client";

import { teams } from "@/types/Teams";
import { useParams, useRouter } from "next/navigation";
import { MissionStructure } from "@/components/student/MissionStructure";
import { useEffect, useMemo, useState } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { ProgressionBar } from "@/components/student/PogressionBar";
import { getTeamMissionsState } from "@/api/missionApi";
import { missionNameTraduction } from "@/utils/MissionName";
import { teamColorMap } from "@/utils/TeamColor";
import { MissionProvider } from "@/contexts/MissionContext";

export default function MissionPage() {
    const params = useParams();
    const router = useRouter();
    const teamName = params.teamName as string;
    const lobbyCode = params.gameId as string;
    const currentTeam = teams[teamName];
    const { id } = useWebSocket();
    const clientId = id as string;
    const missionMap = Object.fromEntries(
        currentTeam.missions.map((m) => [m.id, m])
    );

    const missions = currentTeam.missions;
    const [progression, setProgression] = useState<number>(0);
    const { subscribeGame, connected } = useWebSocket();

    const [isBonus1Completed, setIsBonus1Completed] = useState(false);
    const [isBonus2Completed, setIsBonus2Completed] = useState(false);
    const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});

    const projectIds = [...new Set(missions.map(m => m.projectId))]
        .sort((a, b) => a - b);

    const projectCompletionMap = projectIds.reduce<Record<number, boolean>>(
        (acc, projectId) => {
            const projectMissions = missions.filter(
                m => m.projectId === projectId && !m.bonus
            );

            acc[projectId] = projectMissions.every(m => {
                const missionNumber = missionNameTraduction(m, teamName);
                return completedMissions[missionNumber];
            });
            return acc;
        },
        {}
    );

    const projectUnlockedMap = useMemo(() => {
        const map: Record<number, boolean> = {};
        let previousUnlocked = true;

        for (let i = 0; i < projectIds.length; i++) {
            const projectId = projectIds[i];
            if (!previousUnlocked) {
                map[projectId] = false;
            } else {
                map[projectId] = true;
                previousUnlocked = projectCompletionMap[projectId];
            }
        }

        return map;
    }, [projectIds, projectCompletionMap]);

    const teamColor = teamColorMap[teamName];

    const fetchMissions = async () => {
        try {
            const data = await getTeamMissionsState(lobbyCode, clientId);
            setCompletedMissions(data.teamFullProgression.completedMissions);
            setProgression(data.teamFullProgression.teamProgression.classicMissionPercentage);
            setIsBonus1Completed(data.teamFullProgression.teamProgression.firstBonusMissionCompleted);
            setIsBonus2Completed(data.teamFullProgression.teamProgression.secondBonusMissionCompleted);
        } catch (error) {
            console.error(error);
        }};

    useEffect(() => {
        if (!connected) return;
        void (async () => {
            try {
                const data = await getTeamMissionsState(lobbyCode, clientId);
                setCompletedMissions(data.teamFullProgression.completedMissions);
                setProgression(data.teamFullProgression.teamProgression.classicMissionPercentage);
                setIsBonus1Completed(data.teamFullProgression.teamProgression.firstBonusMissionCompleted);
                setIsBonus2Completed(data.teamFullProgression.teamProgression.secondBonusMissionCompleted);
            } catch (err) {
                console.error("Erreur lors de la récupération des missions :", err);
            }
        })();
    }, [connected, lobbyCode, clientId]);

    useEffect(() => {
        if (!connected) return;

        const sub = subscribeGame((message) => {
            const event = JSON.parse(message.body);

            if (event.type !== "TEAM_PROGRESSION" || event.payload.teamLabel !== teamName) return;

            if (event.type === "TEAM_PROGRESSION" && event.payload.teamLabel === teamName) {
                const progressionValue = event.payload.teamProgression.classicMissionPercentage;

                setProgression(progressionValue);
                const isBonus1Completed = event.payload.teamProgression.firstBonusMissionCompleted;
                const isBonus2Completed = event.payload.teamProgression.secondBonusMissionCompleted;
                setIsBonus1Completed(isBonus1Completed);
                setIsBonus2Completed(isBonus2Completed);
            }
        });

        return () => sub?.unsubscribe();
    }, [connected, subscribeGame, teamName]);

    const totalMissionCount = missions.filter(m => !m.bonus).length;
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

                    <div className="flex flex-col gap-6 ">
                        <ProgressionBar
                            progression={progression}
                            completed={completedMissionCount}
                            totalMission={totalMissionCount}
                            color={teamColor}
                        />
                    </div>
                </div>

                {projectIds.map(projectId => {
                    const isProjectUnlocked = projectUnlockedMap[projectId];
                    const missionFilters = currentTeam.missions.filter(
                        m => m.projectId === projectId
                    );

                    const unlockedIds = new Set(missionFilters.flatMap(m => m.unlocks));
                    const roots = missionFilters.filter(m => !unlockedIds.has(m.id));

                    return (
                        <div
                            key={projectId}
                            className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-center"
                        >
                            <div className="min-w-[150px]">
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
                                        onMissionUpdated={fetchMissions}
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
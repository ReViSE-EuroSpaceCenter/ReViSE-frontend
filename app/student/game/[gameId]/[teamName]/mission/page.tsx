"use client";

import { teams } from "@/types/Teams";
import { useParams, useRouter } from "next/navigation";
import { MissionStructure } from "@/components/student/MissionStructure";
import { useEffect, useState} from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import {ProgressionBar} from "@/components/student/PogressionBar";

export default function MissionPage() {
    const params = useParams();
    const router = useRouter();
    const teamName = params.teamName as string;
    const currentTeam = teams[teamName];

    const missionMap = Object.fromEntries(
        currentTeam.missions.map((m) => [m.id, m])
    );

    const projectIds = [...new Set(currentTeam.missions.map(m => m.projectId))].sort((a, b) => a - b);

    const teamColorMap: Record<string, string> = {
        MEDI: "#a2d49f",
        COOP: "#1783c2",
        AERO: "#84298e",
        MECA: "#e4dec8",
        EXPE: "#da5437",
        GECO: "#234e6f",
    };
    const teamColor = teamColorMap[teamName];

    const {subscribe ,connected} = useWebSocket();
    const [progression, setProgression] = useState<number>(0);

    useEffect(() => {
        if (!connected) return;

        const subscription = subscribe((message) => {
            const event = JSON.parse(message.body) as {
                type: string;
                payload: {
                    teamLabel: string;
                    classicMissionPercentage: number;
                };
            };

            if (event.type !== "TEAM_PROGRESSION") return;
            if (event.payload.teamLabel !== teamName) return;

            setProgression(event.payload.classicMissionPercentage);
        });

        return () => subscription?.unsubscribe();
    }, [connected, subscribe, teamName]);

    const normalMissions = currentTeam.missions.filter(m => !m.bonus);
    const totalMissionCount = normalMissions.length;
    const completedMissionCount = Math.round((progression / 100) * totalMissionCount);

    return (
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
                    const missions = currentTeam.missions.filter(
                        m => m.projectId === projectId
                    );

                    const unlockedIds = new Set(missions.flatMap(m => m.unlocks));
                    const roots = missions.filter(m => !unlockedIds.has(m.id));

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
                                        teamColor={teamColor}
                                        teamName={teamName}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
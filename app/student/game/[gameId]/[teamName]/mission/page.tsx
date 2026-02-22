"use client";

import { teams } from "@/types/Teams";
import { useParams, useRouter } from "next/navigation";
import { MissionStructure } from "@/components/student/MissionStructure";
import { useEffect, useState} from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { ProgressionBar } from "@/components/student/PogressionBar";
import { MissionHeader } from "@/components/student/MissionHeader";

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

    const teamBadgeMap: Record<string, string[]> = {
        MEDI: ["/badges/MEDI.png"],
        COOP: ["/badges/COOP.png"],
        AERO: ["/badges/AERO.png"],
        MECA: ["/badges/MECA.png"],
        EXPE: ["/badges/EXPE.png"],
        GECO: ["/badges/GECO.png"],
    };

    const {subscribe ,connected} = useWebSocket();
    const [progression, setProgression] = useState<number>(0);

    useEffect(() => {
        if (!connected) return;

        const subscription = subscribe((message) => {
            const data = JSON.parse(message.body) as {
                teamName: string;
                classicMissionPercentage: number;
                firstBonusMissionCompleted: boolean;
                secondBonusMissionCompleted: boolean;
            };

            if (data.teamName === teamName) {
                setProgression(data.classicMissionPercentage);
            }
        });

        return () => subscription?.unsubscribe();
    }, [connected, subscribe, teamName]);

    const normalMissions = currentTeam.missions.filter(m => !m.bonus);
    const totalMissionCount = normalMissions.length;
    const completedMissionCount = Math.round((progression / 100) * totalMissionCount);

    return (
        <div className="min-h-[calc(100vh-80px)]">
            <div className="px-6 lg:px-12 py-6 lg:py-12 space-y-16">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">

                    <MissionHeader
                        teamName={teamName}
                        color={teamColor}
                        badges={teamBadgeMap[teamName] || []}
                        onBack={() => router.back()}
                    />

                    <ProgressionBar
                        progression={progression}
                        completed={completedMissionCount}
                        totalMission={totalMissionCount}
                        color={teamColor}
                    />
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
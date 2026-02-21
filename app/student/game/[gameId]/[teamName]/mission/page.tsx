"use client";

import { teams } from "@/types/Teams";
import { useParams } from "next/navigation";
import { MissionStructure } from "@/components/student/MissionStructure";

export default function MissionPage() {
    const params = useParams();
    const teamName = params.teamName as string;
    const currentTeam = teams[teamName];

    if (!currentTeam) return <p>Équipe non trouvée</p>;

    const missionMap = Object.fromEntries(
        currentTeam.missions.map((m) => [m.id, m])
    );

    const projectIds = [...new Set(currentTeam.missions.map(m => m.projectId))].sort((a, b) => a - b);

    const teamColorMap: Record<string, string> = {
        MEDI: "--color-teamMEDI",
        COOP: "--color-teamCOOP",
        AERO: "--color-teamAERO",
        MECA: "--color-teamMECA",
        EXPE: "--color-teamEXPE",
        GECO: "--color-teamGECO",
    };

    const teamColor = teamColorMap[teamName];


    const normalMissions = currentTeam.missions.filter(m => !m.bonus);

    const completedCount = 3;

    const totalCount = normalMissions.length;

    const progress = totalCount > 0
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

    return (
        <div className="min-h-[calc(100vh-80px)]">
            <div className="px-6 lg:px-12 py-6 lg:py-12 space-y-16">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <h1
                        className="text-4xl font-bold"
                        style={{ color: `var(${teamColor})` }}
                    >
                        {teamName} Missions
                    </h1>

                    <div className="w-full lg:w-80">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Progression</span>
                            <span>{completedCount} / {totalCount}</span>
                        </div>

                        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: `var(${teamColor})`,
                                }}
                            />
                        </div>
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
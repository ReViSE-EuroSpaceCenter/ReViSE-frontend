import { Mission } from "@/types/Mission";

export function MissionStructure({
                                     mission,
                                     missionMap,
                                     teamColor,
                                     teamName,
                                 }: {
    mission: Mission;
    missionMap: Record<number, Mission>;
    teamColor: string;
    teamName: string;
}) {
    const children = mission.unlocks
        .map((id) => missionMap[id])
        .filter(Boolean);

    const isDarkText = teamName === "MECA" || teamName === "MEDI" || teamName === "EXPE";
    const textColorClass = isDarkText ? "text-black" : "text-white";

    return (
        <>
            <div className="flex md:hidden flex-col items-center gap-3 w-full">
                <button
                    style={{ backgroundColor: teamColor }}
                    className={`px-4 py-3 ${textColorClass} rounded-2xl border-2 border-black shadow-md active:scale-95 transition text-center whitespace-nowrap`}                >
                    {mission.title}
                </button>

                {children.length > 0 && (
                    <div className="flex flex-row flex-wrap justify-center gap-3">
                        {children.map((child) => (
                            <div key={child.id} className="flex flex-col items-center">
                                <MissionStructure
                                    mission={child}
                                    missionMap={missionMap}
                                    teamColor={teamColor}
                                    teamName={teamName}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="hidden md:flex flex-row items-center ">
                <button
                    style={{ backgroundColor: teamColor }}
                    className={`shrink-0 px-4 py-3 ${textColorClass} rounded-2xl border-2 border-black shadow-md hover:scale-115 transition text-center whitespace-nowrap`}                >
                    {mission.title}
                </button>

                {children.length === 1 && (
                    <>
                        <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                        <MissionStructure
                            mission={children[0]}
                            missionMap={missionMap}
                            teamColor={teamColor}
                            teamName={teamName}
                        />
                    </>
                )}

                {children.length > 1 && (
                    <div className="flex flex-row items-center">
                        <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                        <div className="relative flex flex-col ">
                            {children.map((child, i) => (
                                <div key={child.id} className="relative flex flex-row items-center py-3">
                                    <div
                                        className="absolute left-0 w-0.5 bg-white/40"
                                        style={{
                                            top: i === 0 ? '50%' : '0',
                                            bottom: i === children.length - 1 ? '50%' : '0',
                                        }}
                                    />
                                    <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                                    <MissionStructure
                                        mission={child}
                                        missionMap={missionMap}
                                        teamColor={teamColor}
                                        teamName={teamName}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { MissionHeader } from "@/components/mission/MissionHeader";
import { teamColorMap } from "@/utils/teamColor";
import { showHint } from "@/utils/alerts";
import { TeamResources } from "@/types/TeamsResources";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    teamsResources: Record<string, TeamResources> | undefined;
};

export default function ResourcesBoard({ teamsResources }: Readonly<Props>) {
    const [index, setIndex] = useState(0);

    if (!teamsResources) return null;
    const teamKeys = ["ÉQUIPAGE COMPLET", ...Object.keys(teamsResources)];
    const isGlobal = teamKeys[index] === "ÉQUIPAGE COMPLET";

    const getTotalResources = (teams: Record<string, TeamResources>) =>
        Object.values(teams).reduce(
            (acc, team) => ({
                ENERGY: acc.ENERGY + (team.resources.ENERGY ?? 0),
                HUMAN: acc.HUMAN + (team.resources.HUMAN ?? 0),
                TIME: acc.TIME + (team.resources.TIME ?? 0),
            }),
            { ENERGY: 0, HUMAN: 0, TIME: 0 }
        );

    const currentTeamResources = isGlobal
        ? getTotalResources(teamsResources)
        : teamsResources[teamKeys[index]]?.resources;

    const resourceItems = [
        { icon: "/badges/resources/energies.svg", value: Math.floor(currentTeamResources?.ENERGY / 3) },
        { icon: "/badges/resources/human.svg", value: currentTeamResources?.HUMAN ?? 0 },
        { icon: "/badges/resources/clock.svg", value: currentTeamResources?.TIME ?? 0 },
    ];

    const prev = () => setIndex((i) => (i - 1 + teamKeys.length) % teamKeys.length);
    const next = () => setIndex((i) => (i + 1) % teamKeys.length);

    return (
        <div className="relative inline-block">
            <Image
                src={`/cadre.svg`}
                alt={`cadre`}
                width={800}
                height={600}
                className="object-contain"
            />

            <div className="absolute inset-0 flex flex-col justify-start pt-8 px-[8%]">
                <div className="flex items-center w-full">
                    <button
                        onClick={prev}
                        className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                        style={{
                            width: "clamp(2.5rem, 4vw, 3rem)",
                            height: "clamp(2.5rem, 4vw, 3rem)",
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        className="flex-1 flex items-center justify-center"
                        style={{ fontSize: "clamp(0.75rem, 2vw, 1.5rem)", height: "clamp(0.75rem, 2vw, 1.5rem)" }}
                    >
                        {index === 0 ? (
                            <>
                                <span className="font-bold text-white leading-tight truncate pr-3">
                                  {teamKeys[index]}
                                </span>
                                <button
                                    className="shrink-0 w-6 h-6 rounded-full border border-blueReViSE text-blueReViSE text-xs font-bold hover:bg-blueReViSE hover:text-white transition-colors"
                                    aria-label={`Détail de calcul du score`}
                                    onClick={() =>
                                        showHint(
                                            `
                                                    <p style="margin-bottom: 10px;">
                                                      Le score total correspond à la moyenne des scores de toutes les équipes.
                                                    </p>
                                                    <p style="margin-bottom: 10px;">
                                                      Le score d’une équipe est calculé ainsi :
                                                    </p>
                                                    <ul style="text-align: left; list-style: disc; padding-left: 20px;">
                                                      <li style="margin-bottom: 6px;">Chaque humain rapporte 1 point</li>
                                                      <li style="margin-bottom: 6px;">Chaque unité de temps rapporte 1 point</li>
                                                      <li style="margin-bottom: 6px;">Les énergies sont divisées par 3 (arrondi à l’entier inférieur)</li>
                                                    </ul>
                                                 `,
                                            true
                                        )
                                    }
                                >
                                    ?
                                </button>
                            </>
                        ) : (
                            <MissionHeader
                                teamName={teamKeys[index]}
                                color={teamColorMap[teamKeys[index]!]}
                                badge={`/badges/teams/${teamKeys[index]}.svg`}
                            />
                        )}
                    </div>

                    <button
                        onClick={next}
                        className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                        style={{
                            width: "clamp(2.5rem, 4vw, 3rem)",
                            height: "clamp(2.5rem, 4vw, 3rem)",
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-4 pb-[2%]">
                    {resourceItems.map((item, i) => (
                        <div key={i} className="flex flex-col items-center justify-center gap-1">
                            <div className="relative" style={{ width: "clamp(2rem, 4vw, 4rem)", height: "clamp(2rem, 4vw, 4rem)" }}>
                                <Image src={item.icon} alt={`resource ${i}`} fill className="object-contain" />
                            </div>
                            <span className="text-white font-bold mt-5" style={{ fontSize: "clamp(0.75rem, 2vw, 1.75rem)" }}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
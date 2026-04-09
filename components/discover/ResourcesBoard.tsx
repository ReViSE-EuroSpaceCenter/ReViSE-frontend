"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MissionHeader } from "@/components/mission/MissionHeader";
import { ResourceItem } from "@/components/discover/ResourceItem";
import { ScoreTable } from "@/components/discover/ScoreTable";
import { useResourcesBoard } from "@/hooks/useResourcesBoard";
import { teamColorMap } from "@/utils/teamColor";
import { showHint } from "@/utils/alerts";
import { TeamResources } from "@/types/TeamsResources";
import { renderToStaticMarkup } from "react-dom/server";

type Props = { teamsResources: Record<string, TeamResources> | undefined };

export default function ResourcesBoard({ teamsResources }: Readonly<Props>) {
    const { teamKeys, index, isGlobal, resourceItems, prev, next } = useResourcesBoard(teamsResources);

    if (!teamsResources) return null;

    const currentTeam = teamKeys[index];

    const handleShowHint = () => {
        const tableHtml = renderToStaticMarkup(<ScoreTable teams={teamsResources} />);
        showHint(
            `<p style="margin-bottom:10px;">Le score total correspond à la moyenne des scores de toutes les équipes.</p>
             <p style="margin-bottom:10px;">Le score d'une équipe est calculé ainsi :</p>
             <ul style="text-align:left;list-style:disc;padding-left:20px;">
               <li style="margin-bottom:6px;">Chaque humain rapporte 1 point</li>
               <li style="margin-bottom:6px;">Chaque unité de temps rapporte 1 point</li>
               <li style="margin-bottom:6px;">Les énergies sont divisées par 3 (arrondi à l'entier inférieur)</li>
             </ul>${tableHtml}`,
            true
        );
    };

    return (
        <div className="relative inline-block">
            <Image src="/cadre.svg" alt="cadre" width={800} height={600} className="object-contain" />

            <div className="absolute inset-0 flex flex-col justify-start pt-8 px-[8%]">
                <div className="flex items-center w-full">
                    <NavButton onClick={prev} icon={<ChevronLeft size={20} />} />

                    <div
                        className="flex-1 flex items-center justify-center"
                        style={{ fontSize: "clamp(0.75rem, 2vw, 1.5rem)", height: "clamp(0.75rem, 2vw, 1.5rem)" }}
                    >
                        {isGlobal ? (
                            <>
                                <span className="font-bold text-white leading-tight truncate pr-3">
                                    {currentTeam}
                                </span>
                                <button
                                    className="shrink-0 w-6 h-6 rounded-full border border-blueReViSE text-blueReViSE text-xs font-bold hover:bg-blueReViSE hover:text-white transition-colors"
                                    aria-label="Détail de calcul du score"
                                    onClick={handleShowHint}
                                >
                                    ?
                                </button>
                            </>
                        ) : (
                            <MissionHeader
                                teamName={currentTeam}
                                color={teamColorMap[currentTeam]}
                                badge={`/badges/teams/${currentTeam}.svg`}
                            />
                        )}
                    </div>

                    <NavButton onClick={next} icon={<ChevronRight size={20} />} />
                </div>

                <div className="flex-1 grid grid-cols-3 gap-4 pb-[2%]">
                    {resourceItems.map((item, i) => (
                        <ResourceItem key={`${item.icon+i}`} icon={item.icon} value={item.value} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function NavButton({ onClick, icon }: { readonly onClick: () => void; readonly icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            style={{
                width: "clamp(2.5rem, 4vw, 3rem)",
                height: "clamp(2.5rem, 4vw, 3rem)",
            }}
        >
            {icon}
        </button>
    );
}
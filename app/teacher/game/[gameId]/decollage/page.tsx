"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import BonusCard from "@/components/decollage/bonusCard";
import ResourceCard from "@/components/decollage/resourceCard";
import { ValidationMissionModal } from "@/components/mission/ValidationMission";
import { getGameInfo } from "@/api/missionApi";
import LoadingPage from "@/app/loading";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import {
    BonusBadgeItem, bonusImages,
    bonusLabels,
    getBonusSubstitute, isBonusCompleted, mapGameInfoToTeamBonuses,
    normalizeStep, normalizeTeamCount, resourceImages, ResourceItem,
    resourceLabels, stepConfigs,
    stepContents
} from "@/types/decollage";
import {GameInfoResponse} from "@/types/TeamData";

const ICON_SIZE = "w-[100px] h-[100px] md:w-[120px] md:h-[120px]";
const SUBSTITUTE_SIZE = "w-[70px] h-[70px] md:w-[85px] md:h-[85px]";




export default function DecollagePage() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const lobbyCode = params.gameId as string;
    const step = normalizeStep(searchParams.get("utm"));

    const { data, isLoading, isError } = useQuery<GameInfoResponse>({
        queryKey: ["game-info", lobbyCode],
        queryFn: async () => {
            try {
                return await getGameInfo(lobbyCode);
            } catch (error) {
                showError(
                    error instanceof ApiError ? error.key : "",
                    "Erreur lors de la récupération des données"
                );
                throw error;
            }
        },
        enabled: Boolean(lobbyCode),
        staleTime: 5 * 60 * 1000,
    });

    const pageData = useMemo(() => {
        if (!data) return null;
        const teamsBonuses = mapGameInfoToTeamBonuses(data);
        const nbTeams = normalizeTeamCount(teamsBonuses.length);
        const config = stepConfigs[nbTeams][step];
        const content = stepContents[step];

        const bonusBadges: BonusBadgeItem[] = config.bonuses.map((bonusKey) => ({
            key: bonusKey,
            image: bonusImages[bonusKey],
            completed: isBonusCompleted(bonusKey, teamsBonuses),
            alt: `Badge mission bonus ${bonusKey}`,
            substitute: getBonusSubstitute(nbTeams, step, bonusKey),
        }));

        const resources: ResourceItem[] = config.resources.map((key) => ({
            key,
            image: resourceImages[key],
        }));

        return {
            step,
            content,
            bonusBadges,
            resources,
        };
    }, [data, step]);

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isError || !pageData) {
        return <div className="text-white">Aucune donnée trouvée.</div>;
    }

    return (
        <>
            <div className="flex items-center justify-center px-2 py-3">
                <div className="flex min-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-md bg-darkBlueReViSE shadow-lg">
                    <div className="flex flex-1 flex-col px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#f3b29c] text-2xl font-bold text-[#f3b29c] md:h-14 md:w-14 md:text-3xl">
                                {pageData.step}
                            </div>

                            <h1 className="text-2xl font-bold text-[#f3b29c] md:text-4xl">
                                {pageData.content.title}
                            </h1>
                        </div>

                        <div className="mt-8 space-y-4 text-white md:mt-10">
                            <p className="text-base leading-7 md:text-xl">
                                {pageData.content.description}
                            </p>
                        </div>

                        <div className="mt-12 md:mt-16">
                            <h2 className="text-xl font-semibold text-white md:text-2xl">
                                Missions bonus et ressources
                            </h2>

                            <div className="mt-8 flex flex-wrap items-start justify-center gap-10 md:justify-start">
                                {pageData.bonusBadges.map((bonus) => (
                                    <BonusCard
                                        key={bonus.key}
                                        bonus={bonus}
                                        label={bonusLabels[bonus.key]}
                                        text={pageData.content.bonusTexts[bonus.key]}
                                        iconSize={ICON_SIZE}
                                        substituteSize={SUBSTITUTE_SIZE}
                                    />
                                ))}

                                {pageData.resources.map((resource) => (
                                    <ResourceCard
                                        key={resource.key}
                                        image={resource.image}
                                        label={resourceLabels[resource.key]}
                                        alt={resourceLabels[resource.key]}
                                        iconSize={ICON_SIZE}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-16">
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="cursor-pointer rounded-md bg-purpleReViSE px-5 py-3 text-lg text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Valider l’étape
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ValidationMissionModal
                title="Confirmation"
                message="Cette action validera l’étape actuelle. Êtes-vous sûr de vouloir continuer ?"
                isOpen={isConfirmOpen}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    router.push(`/teacher/game/${lobbyCode}`);
                }}
            />
        </>
    );
}
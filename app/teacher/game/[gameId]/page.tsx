"use client";

import dynamic from "next/dynamic";
import {useState, useEffect, useCallback} from "react";
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toolbox from "@/components/Toolbox";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import SideRow from "@/components/teacher/SideRow";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import {endMission, getGameInfo} from "@/api/missionApi";
const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);
import {presentationTexts} from "@/utils/presentation_texts";
import {useSessionId} from "@/hooks/useSessionId";
import {useWSSubscription} from "@/hooks/useWSSubscription";

type TeamData = {
	id: number;
	team: string;
    completed: number;
	bonus1_check: boolean;
	bonus2_check: boolean;
};

type TeamStats = {
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

interface TeamProgressionResponse extends TeamStats {
    teamLabel: string;
}

interface TeamFullProgression {
    completedMissions: Record<string, boolean>;
    teamProgression: TeamProgressionResponse;
}

interface GameInfoResponse {
    allTeamsCompleted: boolean;
    teamsFullProgression: Record<string, TeamFullProgression>;
}

const formatTeamStats = (stats: TeamStats) => ({
    bonus1_check: stats.firstBonusMissionCompleted,
    bonus2_check: stats.secondBonusMissionCompleted,
    completed: stats.classicMissionsCompleted,
});

export default function Dashboard() {
    const params = useParams();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
    const lobbyCode = params.gameId as string;
    const queryClient = useQueryClient();
    const hostId = useSessionId("hostId");

    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [isIAOpen, setIsIAOpen] = useState(false);

    const showPresentation = searchParams.get("presentation") === "true";
	const [isPresentationOpen, setIsPresentationOpen] = useState(showPresentation);
	const text = showPresentation ? presentationTexts.TEACHER : null

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { data: gameData, isError, error } = useQuery<GameInfoResponse>({
        queryKey: ["gameInfo", lobbyCode],
        queryFn: () => getGameInfo(lobbyCode),
        enabled: !!lobbyCode,
    });

    useEffect(() => {
        if (isError) {
            showError(error instanceof ApiError ? error.key : "", "Erreur lors de la récupération des données");
        }
    }, [isError, error]);

    useWSSubscription("mission", useCallback((event) => {
        if (event.type !== "TEAM_PROGRESSION") return;

        const { teamProgression, allTeamsMissionsCompleted } = event.payload;

        queryClient.setQueryData<GameInfoResponse>(["gameInfo", lobbyCode], (old) => {
            if (!old) return old;
            return {
                ...old,
                teamsFullProgression: {
                    ...old.teamsFullProgression,
                    [teamProgression.teamLabel]: {
                        ...old.teamsFullProgression[teamProgression.teamLabel],
                        teamProgression: {
                            ...old.teamsFullProgression[teamProgression.teamLabel]?.teamProgression,
                            ...teamProgression,
                        },
                    },
                },
                allTeamsMissionsCompleted,
            };
        });
    }, [lobbyCode, queryClient]));

    const teamsData: TeamData[] = gameData
        ? Object.entries(gameData.teamsFullProgression).map(([key, data], index) => ({
            id: index,
            team: key,
            ...formatTeamStats(data.teamProgression),
        }))
        : [];

    const allTeamsCompleted = gameData?.allTeamsCompleted ?? false;

	const half = Math.ceil(teamsData.length / 2);
	const leftTeams = teamsData.slice(0, half);
	const rightTeams = teamsData.slice(half);

    const handleEndMission = async () => {
        if (!hostId) {
            showError("", "Identifiant de connexion manquant, impossible d'autoriser l'encodage des ressources");
            return;
        }
        try {
            await endMission(lobbyCode, hostId);
        } catch (err) {
            showError(err instanceof ApiError ? err.key : "", "Impossible de clôturer la mission");
        }
    };

    return (
        <>
            <div className="min-h-[calc(100vh-120px)] w-full max-w-450 mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_2fr_1fr] items-center justify-items-center gap-4 px-8 md:px-16 py-10">
                <div className="flex flex-col gap-12 xl:gap-18 w-full min-w-0 items-center xl:items-start xl:pr-12 order-2 xl:order-1 lg:col-span-1">
                    {leftTeams.map((teamItem) => (
                        <div key={`left-${teamItem.team}`} className="flex flex-col items-center xl:items-start gap-2">
                            <SideRow {...teamItem} />
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-[min(800px,100vh)] flex justify-center order-1 xl:order-2 lg:col-span-2 xl:col-span-1 p-16">
                    <Toolbox
                        centerAction={{ label: "Décollage\n🚀", onClick: () => setIsConfirmOpen(true), disabled: !allTeamsCompleted}}
                        actions={[
                            { label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
                            { label: "Missions terminées", onClick: () => router.push(`/teacher/game/${lobbyCode}/mission`)},
                            { label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
                            { label: "Tutoriel", onClick: () => console.log("3") },
                        ]}
                    />
                    <Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
                    <IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
                    {text && (
                        <PresentationModal
                            isOpen={isPresentationOpen}
                            setIsOpen={setIsPresentationOpen}
                            icon="/logo.png"
                            text={text}
                            name="TEACHER"
                            color="#fff"
                            onClose={() => router.replace(pathname) }
                        />
                    )}
                </div>

                <div className="flex flex-col gap-12 xl:gap-18 w-full min-w-0 items-center xl:items-end xl:pl-12 order-3 xl:order-3 lg:col-span-1">
                    {rightTeams.map((teamItem) => (
                        <div key={`right-${teamItem.team}`} className="flex flex-col items-center xl:items-end gap-2">
                            <SideRow {...teamItem} />
                        </div>
                    ))}
                </div>
            </div>

            {isConfirmOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-darkBlueReViSE rounded-lg p-6 max-w-xl w-full shadow-lg">
                        <h2 className="text-3xl font-semibold mb-5">
                            Confirmation
                        </h2>

                        <p className="text-lg text-white mb-6">
                            Cette action est irréversible. Une fois effectuée, les étudiants ne pourront plus modifier l&#39;état des missions réalisées.
                            <br />
                            Êtes-vous sûr de vouloir continuer ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-500 transition cursor-pointer"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={async () => {
                                    setIsConfirmOpen(false);
                                    await handleEndMission();
                                }}
                                className="px-4 py-2 rounded-md bg-purpleReViSE text-white hover:bg-purple-700 transition cursor-pointer"
                            >
                                Continuer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
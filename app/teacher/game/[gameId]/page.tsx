"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toolbox from "@/components/Toolbox";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import SideRow from "@/components/teacher/SideRow";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import {endMission, getGameInfo} from "@/api/missionApi";
import { useWebSocket } from "@/contexts/WebSocketProvider";
import { ProgressionBar } from "@/components/student/ProgressionBar";
import {teamColorMap} from "@/utils/teamColor";
import {WSEventType} from "@/types/WSEventType";
const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);
import {presentationTexts} from "@/utils/presentation_texts";

type TeamData = {
	id: number;
	team: string;
    completed: number;
	mission1_check: boolean;
	mission2_check: boolean;
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
    mission1_check: stats.firstBonusMissionCompleted,
    mission2_check: stats.secondBonusMissionCompleted,
    completed: stats.classicMissionsCompleted,
});

export default function Dashboard() {
    const params = useParams();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
    const lobbyCode = params.gameId as string;
    const queryClient = useQueryClient();
    const { connected, subscribe } = useWebSocket();
    const hostId =
        globalThis.window === undefined
            ? null
            : sessionStorage.getItem("hostId");

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

    useEffect(() => {
        if (!connected || !lobbyCode) return;

        const sub = subscribe("mission", (message) => {
            try {
                const event: WSEventType = JSON.parse(message.body);

                queryClient.setQueryData<GameInfoResponse>(["gameInfo", lobbyCode], (old) => {
                    if (!old) return old;

                    if (event.type === "TEAM_PROGRESSION") {
                        const { teamProgression, allTeamsMissionsCompleted } = event.payload;
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
                    }

                    return old;
                });
            } catch (err) {
                showError(err instanceof ApiError ? err.key : "", "Erreur lors de la récupération des données");
            }
        });

        return () => sub?.unsubscribe();
    }, [connected, lobbyCode, queryClient, subscribe]);

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
    const isTwoTeams = leftTeams.length === 2;

    const layout = isTwoTeams
        ? {
            outerPadding: "px-4 md:px-10 pt-2",
            innerPadding: "px-4 md:px-10 py-10 xl:py-4",
            wrapperHeight: "xl:h-[calc(100vh-180px)]",
            wrapperGap: "gap-8 xl:gap-0",
            sidePaddingLeft: "xl:pr-12",
            sidePaddingRight: "xl:pl-12",
            sideItemGap: "gap-2",
            toolboxPadding: "px-4 xl:px-12",
            mobileGap: "gap-8",
            sideExtra: "",
        }
        : {
            outerPadding: "px-3 md:px-6 pt-1",
            innerPadding: "px-3 md:px-6 py-2 xl:py-1",
            wrapperHeight: "xl:h-[calc(100vh-140px)]",
            wrapperGap: "gap-2 xl:gap-0",
            sidePaddingLeft: "xl:pr-6",
            sidePaddingRight: "xl:pl-6",
            sideItemGap: "gap-0",
            toolboxPadding: "px-1 xl:px-6",
            mobileGap: "gap-1",
            sideExtra: "h-full overflow-hidden",
        };

    return (
        <>
            <div className="w-full flex justify-end px-8 md:px-26 py-2">
                <button
                    disabled={!allTeamsCompleted}
                    onClick={() => setIsConfirmOpen(true)}
                    className="px-4 py-2 bg-purpleReViSE hover:bg-purpleReViSE/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-md font-medium text-base transition-colors"
                >
                    Terminer les missions
                </button>
            </div>

            <div className={`w-full max-w-screen-2xl mx-auto ${layout.innerPadding}`}>
                <div
                    className={`flex flex-col xl:flex-row items-center xl:items-stretch justify-center ${layout.wrapperGap} ${layout.wrapperHeight}`}
                >
                    <div
                        className={`hidden xl:flex flex-col justify-around xl:flex-1 order-1 items-center xl:items-start ${layout.sidePaddingLeft} min-w-0 ${layout.sideExtra}`}
                    >
                        {leftTeams.map((teamItem) => (
                            <div
                                key={`left-${teamItem.team}`}
                                className={`flex flex-col items-center xl:items-start ${layout.sideItemGap} min-w-0`}
                            >
                                <ProgressionBar
                                    completed={teamItem.completed}
                                    totalMission={teamItem.team === "MECA" ? 8 : 7}
                                    color={teamColorMap[teamItem.team]}
                                />
                                <SideRow {...teamItem} />
                            </div>
                        ))}
                    </div>

			<div className="w-full max-w-[min(600px,calc(100vh-160px))] shrink-0 order-1 xl:order-2 flex justify-center px-4 xl:px-12">
				<Toolbox
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

                    <div
                        className={`hidden xl:flex flex-col justify-around xl:flex-1 order-3 items-center xl:items-end ${layout.sidePaddingRight} min-w-0 ${layout.sideExtra}`}
                    >
                        {rightTeams.map((teamItem) => (
                            <div
                                key={`right-${teamItem.team}`}
                                className={`flex flex-col items-center xl:items-end ${layout.sideItemGap} min-w-0`}
                            >
                                <ProgressionBar
                                    completed={teamItem.completed}
                                    totalMission={teamItem.team === "MECA" ? 8 : 7}
                                    color={teamColorMap[teamItem.team]}
                                />
                                <SideRow {...teamItem} />
                            </div>
                        ))}
                    </div>

                    <div className={`xl:hidden w-full order-2 grid grid-cols-1 md:grid-cols-2 ${layout.mobileGap}`}>
                        {[...leftTeams, ...rightTeams].map((teamItem) => (
                            <div
                                key={`mobile-${teamItem.team}`}
                                className={`flex flex-col items-center ${layout.sideItemGap} min-w-0`}
                            >
                                <ProgressionBar
                                    completed={teamItem.completed}
                                    totalMission={teamItem.team === "MECA" ? 8 : 7}
                                    color={teamColorMap[teamItem.team]}
                                />
                                <SideRow {...teamItem} />
                            </div>
                        ))}
                    </div>
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
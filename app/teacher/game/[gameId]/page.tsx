"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toolbox from "@/components/Toolbox";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import SideRow from "@/components/SideRow";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import {endMission, getGameInfo} from "@/api/missionApi";
import { useWebSocket } from "@/contexts/WebSocketProvider";
import { ProgressionBar } from "@/components/student/PogressionBar";
import {teamColorMap} from "@/utils/teamColor";

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

interface GameInfoResponse {
    allTeamsCompleted: boolean;
    teamsProgression: Record<string, TeamProgressionResponse>;
}
const formatTeamStats = (stats: TeamStats) => ({
    mission1_check: stats.firstBonusMissionCompleted,
    mission2_check: stats.secondBonusMissionCompleted,
    completed: stats.classicMissionsCompleted,
});

export default function Dashboard() {
    const params = useParams();
    const lobbyCode = params.gameId as string;
    const queryClient = useQueryClient();
    const { connected, subscribe } = useWebSocket();
    const hostId =
        globalThis.window === undefined
            ? null
            : sessionStorage.getItem("hostId");

    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [isIAOpen, setIsIAOpen] = useState(false);
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

        const sub = subscribe("game", (message) => {
            try {
                const event = JSON.parse(message.body);

                queryClient.setQueryData<GameInfoResponse>(["gameInfo", lobbyCode], (old) => {
                    if (!old) return old;

                    if (event.type === "TEAM_PROGRESSION") {
                        const { teamLabel, teamProgression } = event.payload;
                        return {
                            ...old,
                            teamsProgression: {
                                ...old.teamsProgression,
                                [teamLabel]: {
                                    ...old.teamsProgression[teamLabel],
                                    ...teamProgression,
                                },
                            },
                        };
                    }

                    if (event.allTeamsMissionsCompleted !== undefined) {
                        return { ...old, allTeamsCompleted: event.allTeamsMissionsCompleted };
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
        ? Object.entries(gameData.teamsProgression).map(([key, stats], index) => ({
            id: index,
            team: key,
            ...formatTeamStats(stats),
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
            console.log("Mission end ok ");
        } catch (err) {
            showError(err instanceof ApiError ? err.key : "", "Impossible de clôturer la mission");
        }
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

            <div className="min-h-[calc(100vh-120px)] w-full max-w-450 mx-auto flex flex-wrap xl:flex-nowrap items-center justify-center px-8 md:px-26 gap-8 xl:gap-0 overflow-x-hidden py-10 xl:py-4">

                <div className="flex flex-col gap-12 xl:gap-28 w-full md:w-[calc(50%-1rem)] xl:flex-1 order-2 xl:order-1 items-center xl:items-start xl:pr-12">
                    {leftTeams.map((teamItem) => (
                        <div key={`left-${teamItem.team}`} className="flex flex-col items-center xl:items-start gap-2">
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
						{ label: "Missions terminées", onClick: () => console.log("4") },
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
						{ label: "Tutoriel", onClick: () => console.log("3") },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>

                <div className="flex flex-col gap-12 xl:gap-28 w-full md:w-[calc(50%-1rem)] xl:flex-1 order-3 items-center xl:items-end xl:pl-12">
                    {rightTeams.map((teamItem) => (
                        <div key={`right-${teamItem.team}`} className="flex flex-col items-center xl:items-end gap-2">
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

            {isConfirmOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-darkBlueReViSE rounded-lg p-6 max-w-xl w-full shadow-lg">
                        <h2 className="text-3xl font-semibold mb-5">
                            Confirmation
                        </h2>

                        <p className="text-lg text-white mb-6">
                            Cette action est irréversible. Une fois effectuée, les étudiants ne pourront plus modifier l&#39;état des missions réalisées. Êtes-vous sûr de vouloir continuer ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 rounded-md bg-orangeReViSE/50 text-white hover:bg-orangeReViSE cursor-pointer"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={async () => {
                                    setIsConfirmOpen(false);
                                    await handleEndMission();
                                }}
                                className="px-4 py-2 rounded-md bg-purpleReViSE/50 text-white hover:bg-purpleReViSE cursor-pointer"
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
"use client";

import {useState, useEffect, useCallback, useMemo} from "react";
import dynamic from "next/dynamic";
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import Toolbox from "@/components/Toolbox";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import TeamsColumn from "@/components/teacher/TeamsColumn";
import {showError} from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";
import {endMission, getTeamsFullProgression} from "@/api/missionApi";
import {useSessionId} from "@/hooks/useSessionId";
import {useWSSubscription} from "@/hooks/useWSSubscription";
import {TeamsFullProgression} from "@/types/TeamData";
import {presentationTexts} from "@/utils/presentationTexts";
import {confirmEndMissionMessage} from "@/utils/ConfirmationEndMissionMessage";
import {getTeamsColumns} from "@/utils/calculTeamColumn";
import MissionModal from "@/components/teacher/MissionModal";
const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);

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
    const [toolboxDisabled, setToolboxDisabled] = useState(false);
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const [submittedTeams, setSubmittedTeams] = useState<Set<string>>(new Set());

    const showPresentation = searchParams.get("presentation") === "true";
	const [isPresentationOpen, setIsPresentationOpen] = useState(showPresentation);
	const text = showPresentation ? presentationTexts.TEACHER : null

    const { data: gameData, isError, error } = useQuery<TeamsFullProgression>({
        queryKey: ["gameInfo", lobbyCode],
        queryFn: () => getTeamsFullProgression(lobbyCode),
        enabled: !!lobbyCode,
    });

    useEffect(() => {
        if (isError) {
            showError(error instanceof ApiError ? error.key : "", "Erreur lors de la récupération des données");
        }
    }, [isError, error]);

    useWSSubscription("mission", useCallback((event) => {
        if (event.type !== "TEAM_PROGRESSION") return;

        const { teamLabel, allTeamsMissionsCompleted } = event.payload;

        queryClient.setQueryData<TeamsFullProgression>(["gameInfo", lobbyCode], (old) => {
            if (!old) return old;

            const oldTeamData = old.teamsFullProgression[teamLabel];

            return {
                ...old,
                teamsFullProgression: {
                    ...old.teamsFullProgression,
                    [teamLabel]: {
                        ...oldTeamData,
                        teamProgression: {
                            ...oldTeamData?.teamProgression,
                            ...event.payload,
                        },
                    },
                },
                allTeamsCompleted: allTeamsMissionsCompleted,
            };
        });
    }, [lobbyCode, queryClient]));

    useWSSubscription("launcher", useCallback((event) => {
      if (event.type !== "RESOURCE_UPDATED") return;
      const { teamLabel } = event.payload;
      setSubmittedTeams((prev) => new Set(prev).add(teamLabel));
    }, []))

    const { leftTeams, rightTeams } = useMemo(
        () => getTeamsColumns(gameData),
        [gameData]
    );
    const allTeamsCompleted = gameData?.allTeamsCompleted ?? false;
    const allTeamLabels = useMemo(
      () => Object.keys(gameData?.teamsFullProgression ?? {}),
      [gameData]
    );
    const allResourcesSubmitted = allTeamLabels.length > 0 && allTeamLabels.every((label) => submittedTeams.has(label));


    const handleEndMission = async () => {
        if (!hostId) {
            showError("", "Identifiant de connexion manquant, impossible d'autoriser l'encodage des ressources");
            return;
        }
        try {
            await endMission(lobbyCode, hostId);
            setIsMissionModalOpen(true);
        } catch (err) {
            showError(err instanceof ApiError ? err.key : "", "Impossible de clôturer la mission");
        }
    };

    const confirmAndEndMission = async () => {
        const confirmed = await confirmEndMissionMessage();
        if (confirmed) {
            setToolboxDisabled(true);
            await handleEndMission();
        }
    };

    return (
        <div className="min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] w-full max-w-450 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_2fr_1fr] items-center justify-items-center gap-4 px-8 md:px-16 py-10 ">
            <div className="flex flex-col gap-12 xl:gap-18 w-full min-w-0 items-center xl:items-start xl:pr-12 order-2 xl:order-1 md:col-span-1">
                <TeamsColumn teams={leftTeams} align="start" side="left" />
            </div>

            <div className="w-full max-w-[min(800px,100vh)] flex justify-center order-1 xl:order-2 md:col-span-2 xl:col-span-1 p-4 md:p-8 xl:p-16">
                <Toolbox
                    centerAction={{ label: "Décollage\n🚀", onClick: confirmAndEndMission, disabled: !allTeamsCompleted}}
                    actions={[
                        { label: "Fin du tour", onClick: () => setIsChecklistOpen(true), disabled: toolboxDisabled },
                        { label: "Missions terminées", onClick: () => router.push(`/teacher/game/${lobbyCode}/mission`), disabled: toolboxDisabled },
                        { label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true), disabled: toolboxDisabled },
                        { label: "Tutoriel", onClick: () => console.log("3"), disabled: toolboxDisabled },
                    ]}
                />
                <Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
                <IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
                <MissionModal
                    isOpen={isMissionModalOpen}
                    gameData={gameData}
                    submittedTeams={submittedTeams}
                    allResourcesSubmitted={allResourcesSubmitted}
                    onConfirm={() => router.push(`/teacher/game/${lobbyCode}/launcher?presentation=true`)}
                />
                {text && (
                    <PresentationModal
                        isOpen={isPresentationOpen}
                        setIsOpen={setIsPresentationOpen}
                        icon="/logo.svg"
                        text={text}
                        name="TEACHER"
                        color="#fff"
                        onClose={() => router.replace(pathname) }
                    />
                )}
            </div>

            <div className="flex flex-col gap-12 xl:gap-18 w-full min-w-0 items-center xl:items-end xl:pl-12 order-3 xl:order-3 lg:col-span-1">
                <TeamsColumn teams={rightTeams} align="end" side="right" />
            </div>
        </div>
    );
}
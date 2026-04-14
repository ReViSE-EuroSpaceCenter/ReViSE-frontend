"use client";

import dynamic from "next/dynamic";

const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);
import LauncherBackground from "@/components/launcher/LauncherBackground";
import LauncherPath from "@/components/launcher/LauncherPath";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {launcherTexts} from "@/utils/launcherTexts";
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {useWSSubscription} from "@/hooks/useWSSubscription";
import ResourceModal from "@/components/teacher/ResourceModal";
import {useQuery} from "@tanstack/react-query";
import {TeamsFullProgression} from "@/types/TeamData";
import {endLauncher, getTeamsInfo} from "@/api/launcherApi";
import {useSessionId} from "@/hooks/useSessionId";
import {endResourceEncoding} from "@/api/resourcesApi";

export default function Launcher() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const lobbyCode = params.gameId as string;
    const hostId = useSessionId("hostId");

    const stepParam = Number.parseInt(searchParams.get("step") || "0", 10);
    const step = Number.isNaN(stepParam) ? 0 : stepParam;
    const showPresentation = searchParams.get("presentation") === "true";
    const [isPresentationOpen, setIsPresentationOpen] = useState(showPresentation);
    const text = showPresentation ? launcherTexts.PRESENTATION : null
    const [submittedTeams, setSubmittedTeams] = useState<Set<string>>(new Set());

    const isModalOpen = step === 9;

    const { data: gameData } = useQuery<TeamsFullProgression>({
        queryKey: ["gameInfo", lobbyCode],
        queryFn: () => getTeamsInfo(lobbyCode),
        enabled: !!lobbyCode,
        staleTime: Infinity,
    });

    const hasEndedLauncherRef = useRef(false);

    const handleEndLauncher = useCallback(async () => {
        if (hasEndedLauncherRef.current) return;
        hasEndedLauncherRef.current = true;

        setTimeout(async () => {
            await endLauncher(lobbyCode, hostId as string);
        }, 800);
    }, [lobbyCode, hostId]);

    const handleEndResources = async () => {
        if (allResourcesSubmitted) {
            await endResourceEncoding(lobbyCode, hostId as string);
            router.push(`/teacher/game/${lobbyCode}/discover`);
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            handleEndLauncher();
        }
    }, [isModalOpen, handleEndLauncher]);

    const handleStepAnimationComplete = () => {
        setTimeout(() => {
            router.replace(`${pathname}/${step}`);
        }, 800);
    }

    const allTeamLabels = useMemo(
      () => Object.keys(gameData?.teamsFullProgression ?? {}),
      [gameData]
    );
    const allResourcesSubmitted = allTeamLabels.length > 0 && allTeamLabels.every((label) => submittedTeams.has(label));

    useWSSubscription("resource", useCallback((event) => {
        if (event.type !== "RESOURCE_UPDATED") return;
        const { teamLabel } = event.payload;
        setSubmittedTeams((prev) => new Set(prev).add(teamLabel));
    }, []))

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
            <div className="absolute inset-0">
                <LauncherBackground />
            </div>

            <div className="absolute inset-0">
                <LauncherPath step={step} onStepAnimationComplete={handleStepAnimationComplete} />
            </div>

            <ResourceModal
              isOpen={isModalOpen}
              gameData={gameData}
              submittedTeams={submittedTeams}
              allResourcesSubmitted={allResourcesSubmitted}
              onConfirm={handleEndResources}
            />

            {text && (
                <PresentationModal
                    isOpen={isPresentationOpen}
                    setIsOpen={setIsPresentationOpen}
                    icon="/logo.svg"
                    text={text}
                    name="PRESENTATION"
                    color="#fff"
                    onClose={() => router.replace(`${pathname}?step=1`) }
                />
            )}
        </div>
    );
}
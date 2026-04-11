"use client"

import { useQuery } from "@tanstack/react-query";
import {endGame, getScore} from "@/api/discoverApi";
import {TeamsResources} from "@/types/TeamsResources";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useState} from "react";
import { useSessionId } from "@/hooks/useSessionId";
import Gauge from "@/components/discover/Gauge";
import dynamic from "next/dynamic";
import {getStepsUpTo, SPECIES} from "@/utils/gaugeData";
import ResourcesBoard from "@/components/discover/ResourcesBoard";
import {confirmEndGameMessage} from "@/utils/endGameMessage";
import {showError} from "@/errors/getErrorMessage";
const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);

export default function DiscoverPage() {
    const params = useParams();
    const hostId = useSessionId("hostId");
    const lobbyCode = params.gameId as string;

    const [stepIndex, setStepIndex] = useState(0);
    const [isPresentationOpen, setIsPresentationOpen] = useState(false);

    const { data } = useQuery<TeamsResources>({
        queryKey: ["discover", lobbyCode, hostId],
        queryFn: () => getScore(lobbyCode, hostId as string),
        enabled: !!lobbyCode && !!hostId,
    });

    const steps = getStepsUpTo(data?.totalScore ?? 0);
    const discoveredSteps = steps.slice(0, stepIndex);
    const currentStepTarget = steps[stepIndex] ?? null;
    const isLastStep = stepIndex === steps.length - 1;
    const [isGameFinished, setIsGameFinished] = useState(false);
    const router = useRouter();

    const handleEndGame = async () => {
        const confirmed = await confirmEndGameMessage();

        if (!confirmed) return;
        if (!hostId) {
            showError("", "Identifiant de connexion manquant, impossible de terminer la partie");
            return;
        }
        await endGame(lobbyCode, hostId);
        router.push(`/endGame?win=true`);
    };
    const handleComplete = useCallback(() => {
        console.log("GAME END");
        setIsGameFinished(true);
    }, []);

    const handleStepReached = useCallback(() => {
        setTimeout(() => {
            setIsPresentationOpen(true);
        }, 800);

        if (isLastStep) {
            handleComplete();
        }
    }, [isLastStep, handleComplete]);

    const handleModalClose = useCallback(() => {
        setIsPresentationOpen(false);
        setStepIndex((i) => i + 1);
    }, []);

    return (
        <div className="w-full h-[calc(100dvh-80px)] flex flex-col md:flex-row">
            <div className="w-full md:w-3/5 h-full py-8 flex items-center justify-center order-1 md:order-2">
                <Gauge
                    stepTarget={currentStepTarget}
                    onStepReached={handleStepReached}
                    onComplete={handleComplete}
                    discoveredSteps={discoveredSteps}
                />
            </div>

            <div className="w-full md:w-2/5 flex items-end justify-start pb-8 pl-4 order-2 md:order-1">
                <ResourcesBoard teamsResources={data?.teamsResources} />
            </div>
            <PresentationModal
                isOpen={isPresentationOpen}
                setIsOpen={setIsPresentationOpen}
                icon={SPECIES.find((s) => s.step === currentStepTarget)?.svg}
                text={SPECIES.find((s) => s.step === currentStepTarget)?.text}
                name={SPECIES.find((s) => s.step === currentStepTarget)?.label}
                color="#fff"
                onClose={handleModalClose}
            />
            {isGameFinished && (
                <div className="absolute bottom-6 right-6">
                    <button
                        onClick={handleEndGame}
                        className="cursor-pointer rounded-lg bg-purpleReViSE px-6 py-3 text-lg text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                        Terminer la partie
                    </button>
                </div>
            )}
        </div>
    );
}
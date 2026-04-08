"use client"

import { useQuery } from "@tanstack/react-query";
import { getScore } from "@/api/discoverApi";
import { GameData } from "@/types/GameData";
import { useParams } from "next/navigation";
import {useCallback, useState} from "react";
import { useSessionId } from "@/hooks/useSessionId";
import Gauge from "@/components/discover/Gauge";
import dynamic from "next/dynamic";
import {getStepsUpTo, SPECIES} from "@/utils/gaugeData";
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

    const { data } = useQuery<GameData>({
        queryKey: ["discover", lobbyCode, hostId],
        queryFn: () => getScore(lobbyCode, hostId as string),
        enabled: !!lobbyCode && !!hostId,
    });

    const steps = getStepsUpTo(data?.score ?? 0);
    const discoveredSteps = steps.slice(0, stepIndex);
    const currentStepTarget = steps[stepIndex] ?? null;
    const isLastStep = stepIndex === steps.length - 1;

    const handleComplete = useCallback(() => {
        console.log("GAME END");
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
        <div className="relative w-full h-[calc(100dvh-80px)] overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full max-w-105 h-full px-4 flex items-center justify-center">
                <Gauge
                    stepTarget={currentStepTarget}
                    onStepReached={handleStepReached}
                    onComplete={handleComplete}
                    discoveredSteps={discoveredSteps}
                />
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
        </div>
    );
}
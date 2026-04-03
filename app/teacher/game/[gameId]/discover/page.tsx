"use client";

import { useQuery } from "@tanstack/react-query";
import { getScore } from "@/api/discoverApi";
import { GameData } from "@/types/GameData";
import { useParams } from "next/navigation";
import { useSessionId } from "@/hooks/useSessionId";
import Gauge from "@/components/discover/Gauge";
import {useCallback, useState,} from "react";
import dynamic from "next/dynamic";
const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);

export default function DiscoverPage() {
    const params = useParams();
    const hostId = useSessionId("hostId");
    const lobbyCode = params.gameId as string;

    const [isPresentationOpen, setIsPresentationOpen] = useState(false);

    const { data } = useQuery<GameData>({
        queryKey: ["discover", lobbyCode, hostId],
        queryFn: () => getScore(lobbyCode, hostId as string),
        enabled: !!lobbyCode && !!hostId,
    });

    const handleStep = useCallback(() => {
        setIsPresentationOpen(true);
    }, []);

    const handleGaugeComplete = useCallback(() => {
       console.log("Gauge Complete");
    }, []);

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center">
            <div className="w-1/4 h-[80vh] flex items-center justify-center">
                <Gauge
                    score={data?.score ?? 15}
                    onStep={handleStep}
                    onComplete={handleGaugeComplete}
                />
            </div>
            <PresentationModal
                isOpen={isPresentationOpen}
                setIsOpen={setIsPresentationOpen}
                icon="/logo.svg"
                text="TEXT"
                name="TEACHER"
                color="#fff"
                onClose={undefined}
            />
        </div>
    );
}
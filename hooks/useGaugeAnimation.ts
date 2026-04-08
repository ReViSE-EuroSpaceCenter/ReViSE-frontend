import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { STEPS } from "@/utils/gaugeData";

export function useGaugeAnimation({ stepTarget, onStepReached, onComplete }: {readonly stepTarget: number | null; readonly onStepReached: () => void; readonly onComplete: () => void;}) {
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, { stiffness: 60, damping: 20, restDelta: 0.001 });

    useEffect(() => {
        if (stepTarget === null) return;
        const isMarkerStep = STEPS.includes(stepTarget);

        const unsub = smoothProgress.on("change", (v) => {
            if (Math.abs(v - stepTarget) < 0.002) {
                unsub();
                if (isMarkerStep) onStepReached();
                else onComplete();
            }
        });

        progress.set(stepTarget);
        return () => unsub();
    }, [stepTarget, progress, smoothProgress, onStepReached, onComplete]);

    return { smoothProgress };
}
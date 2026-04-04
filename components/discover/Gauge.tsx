import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { GAUGE_STEPS } from "@/utils/gaugeData";

export default function Gauge({stepTarget, onStepReached, onComplete,}: { readonly stepTarget: number; readonly onStepReached: () => void; readonly onComplete: () => void; }) {
    const gaugeWidth = 180;
    const gaugeHeight = 460;
    const bw = 2;

    const fillWidth = gaugeWidth - bw * 2;
    const fillAreaHeight = gaugeHeight - bw * 2;

    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.001,
    });
    const scaleY = useTransform(smoothProgress, (v) => v);

    useEffect(() => {
        if (stepTarget === null) return;

        const isMarkerStep = GAUGE_STEPS.includes(stepTarget as typeof GAUGE_STEPS[number]);

        const unsub = smoothProgress.on("change", (v) => {
            if (Math.abs(v - stepTarget) < 0.002) {
                unsub();
                if (isMarkerStep) {
                    onStepReached();
                } else {
                    onComplete();
                }
            }
        });
        progress.set(stepTarget);
        return () => unsub();
    }, [stepTarget, progress, smoothProgress, onStepReached, onComplete]);

    return (
        <svg viewBox={`0 0 ${gaugeWidth} ${gaugeHeight}`} className="w-4/5 h-4/5">
            <defs>
                <linearGradient id="degrade" x1="0" x2="0" y1={gaugeHeight} y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#824292" />
                    <stop offset="50%" stopColor="#DA7EB4" />
                    <stop offset="100%" stopColor="#FABAA3" />
                </linearGradient>

                <clipPath id="gaugeClip">
                    <rect x={bw} y={bw} width={fillWidth} height={fillAreaHeight} rx={7} />
                </clipPath>
            </defs>

            <rect x={1} y={1} width={gaugeWidth - bw} height={gaugeHeight - bw}
                  rx={8} fill="#262624" strokeOpacity="0.4" strokeWidth={bw} stroke="#dedcd1" />

            <g clipPath="url(#gaugeClip)">
                {GAUGE_STEPS.map((marker) => {
                    const y = bw + fillAreaHeight * (1 - marker);
                    return <line key={marker} x1={bw} y1={y} x2={bw + fillWidth} y2={y} stroke="#dedcd1" strokeOpacity="0.22" />
                })}

                <motion.rect x={bw} y={bw} width={fillWidth} height={fillAreaHeight} fill="url(#degrade)" style={{scaleY, originY: 1}}/>
            </g>
        </svg>
    );
}
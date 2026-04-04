import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GAUGE_STEPS, SPECIES_MAP } from "@/utils/gaugeData";
import Image from "next/image";

export default function Gauge({stepTarget, onStepReached, onComplete, discoveredSteps,}: { readonly stepTarget: number; readonly onStepReached: () => void; readonly onComplete: () => void; readonly discoveredSteps: number[]; }) {
    const gaugeWidth = 180;
    const gaugeHeight = 460;
    const bw = 2;

    const fillWidth = gaugeWidth - bw * 2;
    const fillAreaHeight = gaugeHeight - bw * 2;
    const totalWidth = gaugeWidth + 80;

    const svgRef = useRef<SVGSVGElement>(null);
    const [svgBounds, setSvgBounds] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSvgBounds({ width, height });
        });
        observer.observe(svgRef.current);
        return () => observer.disconnect();
    }, []);

    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.001,
    });
    const scaleY = useTransform(smoothProgress, (v) => v);

    useEffect(() => {
        if (stepTarget === null) return;

        const isMarkerStep = GAUGE_STEPS.includes(
            stepTarget as (typeof GAUGE_STEPS)[number]
        );

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

    const toRendered = (viewBoxX: number, viewBoxY: number) => {
        if (!svgBounds) return { x: 0, y: 0 };
        const scaleX = svgBounds.width / totalWidth;
        const scaleY = svgBounds.height / gaugeHeight;
        return { x: viewBoxX * scaleX, y: viewBoxY * scaleY };
    };

    const iconSize = svgBounds ? (40 * svgBounds.width) / totalWidth : 40;

    return (
        <>
            <div className="relative w-4/5 h-4/5">
                <svg ref={svgRef} viewBox={`0 0 ${totalWidth} ${gaugeHeight}`} className="w-full h-full">
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
                            return (
                                <line key={marker} x1={bw} y1={y} x2={bw + fillWidth} y2={y} stroke="#dedcd1" strokeOpacity="0.22" />
                            );
                        })}
                        <motion.rect x={bw} y={bw} width={fillWidth} height={fillAreaHeight} fill="url(#degrade)" style={{ scaleY, originY: 1 }} />
                    </g>
                </svg>

                {GAUGE_STEPS.map((marker) => {
                    const isDiscovered = discoveredSteps.includes(marker);
                    const isCurrentStep = marker === stepTarget;
                    const shouldShow = isDiscovered || isCurrentStep;

                    if (!shouldShow || !SPECIES_MAP[marker]) return null;

                    const yViewBox = bw + fillAreaHeight * (1 - marker);
                    const pos = toRendered(gaugeWidth + 8, yViewBox - 20);

                    return (
                        <motion.div
                            key={marker}
                            className="absolute"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                width: iconSize,
                                height: iconSize,
                            }}
                            initial={isCurrentStep ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={isCurrentStep
                                ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                                : { duration: 0 }
                            }
                        >
                            <Image src={SPECIES_MAP[marker]} alt={`species-${marker}`} fill className="object-contain"/>
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
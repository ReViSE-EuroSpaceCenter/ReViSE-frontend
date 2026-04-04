import { motion, useTransform, MotionValue } from "framer-motion";
import { GAUGE_STEPS } from "@/utils/gaugeData";

export function GaugeBar({ gaugeWidth, gaugeHeight, bw, smoothProgress }: { readonly gaugeWidth: number; readonly gaugeHeight: number, readonly bw: number, readonly smoothProgress: MotionValue<number> }) {
    const fillWidth = gaugeWidth - bw * 2;
    const fillAreaHeight = gaugeHeight - bw * 2;
    const scaleY = useTransform(smoothProgress, (v) => v);

    return (
        <>
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

            <rect
                x={1} y={1}
                width={gaugeWidth - bw} height={gaugeHeight - bw}
                rx={8} fill="#262624" strokeOpacity="0.4" strokeWidth={bw} stroke="#dedcd1"
            />

            <g clipPath="url(#gaugeClip)">
                {GAUGE_STEPS.map((marker) => {
                    const y = bw + fillAreaHeight * (1 - marker);
                    return (
                        <line
                            key={marker}
                            x1={bw} y1={y} x2={bw + fillWidth} y2={y}
                            stroke="#dedcd1" strokeOpacity="0.22"
                        />
                    );
                })}
                <motion.rect
                    x={bw} y={bw}
                    width={fillWidth} height={fillAreaHeight}
                    fill="url(#degrade)"
                    style={{ scaleY, originY: 1 }}
                />
            </g>
        </>
    );
}
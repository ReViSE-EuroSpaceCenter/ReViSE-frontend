import { motion, useTransform, MotionValue } from "framer-motion";
import { STEPS } from "@/utils/gaugeData";

type Props = {
    gaugeWidth: number;
    gaugeHeight: number;
    bw: number;
    smoothProgress: MotionValue<number>;
}

export function GaugeBar({ gaugeWidth, gaugeHeight, bw, smoothProgress }: Readonly<Props>) {
    const fillWidth = gaugeWidth - bw * 2;
    const fillAreaHeight = gaugeHeight - bw * 2;

    const clipY = useTransform(smoothProgress, (v) => bw + fillAreaHeight * (1 - v));
    const clipHeight = useTransform(smoothProgress, (v) => fillAreaHeight * v + 8);

    return (
        <>
            <defs>
                <linearGradient id={"degrade"} x1="0" x2="0" y1={gaugeHeight} y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#824292" />
                    <stop offset="50%" stopColor="#DA7EB4" />
                    <stop offset="100%" stopColor="#FABAA3" />
                </linearGradient>

                <clipPath id={"gaugeFillClip"}>
                    <motion.rect
                        x={bw}
                        width={fillWidth}
                        y={clipY}
                        height={clipHeight}
                    />
                </clipPath>
            </defs>

            <rect
                x={1} y={1}
                width={gaugeWidth - bw} height={gaugeHeight - bw}
                rx={8} fill="#262624" strokeOpacity="0.4" strokeWidth={bw} stroke="#dedcd1"
            />

            {STEPS.slice(0, -1).map((marker) => {
                const y = bw + fillAreaHeight * (1 - marker);
                return (
                    <line
                        key={marker}
                        x1={bw} y1={y} x2={bw + fillWidth} y2={y}
                        stroke="#dedcd1" strokeOpacity="0.22"
                    />
                );
            })}

            <rect
                x={bw} y={bw}
                width={fillWidth} height={fillAreaHeight}
                fill={`url(#degrade)`}
                clipPath={`url(#gaugeFillClip)`}
                rx={7}
            />
        </>
    );
}
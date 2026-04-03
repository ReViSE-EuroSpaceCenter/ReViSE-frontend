import { motion } from "framer-motion";

const STEPS = [0.2, 0.4, 0.6, 0.8, 1.0];

export default function Gauge({score, onStep, onComplete,}: { readonly score: number; readonly onStep?: (step: number) => void; readonly onComplete?: () => void; }) {
    const gaugeWidth = 180;
    const gaugeHeight = 460;
    const borderWidth = 2;
    const fillWidth = gaugeWidth - borderWidth * 2;
    const fillAreaHeight = gaugeHeight - borderWidth * 2;

    return (
        <svg viewBox={`0 0 ${gaugeWidth} ${gaugeHeight}`} className="w-4/5 h-4/5">
            <defs>
                <linearGradient id="degrade" x1="0" x2="0" y1={gaugeHeight} y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#824292" />
                    <stop offset="50%" stopColor="#DA7EB4" />
                    <stop offset="100%" stopColor="#FABAA3" />
                </linearGradient>

                <clipPath id="gaugeClip">
                    <rect x={borderWidth} y={borderWidth} width={fillWidth} height={fillAreaHeight} rx={7} />
                </clipPath>
            </defs>

            <rect x={1} y={1} width={gaugeWidth - borderWidth} height={gaugeHeight - borderWidth} rx={8} fill="#262624" strokeOpacity="0.4" strokeWidth={borderWidth} stroke="#dedcd1"/>

            <g clipPath="url(#gaugeClip)">
                {STEPS.map((marker) => {
                    const y = borderWidth + fillAreaHeight * (1 - marker);
                    return (
                        <line
                            key={marker}
                            x1={borderWidth}
                            y1={y}
                            x2={borderWidth + fillWidth}
                            y2={y}
                            stroke="#dedcd1"
                            strokeOpacity="0.22"
                        />
                    );
                })}

                <motion.rect
                    x={borderWidth}
                    width={fillWidth}
                    fill="url(#degrade)"
                />
            </g>
        </svg>
    );
}
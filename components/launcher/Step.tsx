import { motion } from "framer-motion"
import { useDrawPath } from "@/hooks/useDrawPath"
import { StepConfig } from "@/types/StepConfig"

export default function Step({step, config, onAnimationComplete}: { readonly step: number; readonly config: StepConfig; readonly onAnimationComplete: () => void; }) {
    const { segments, segmentConfigs, isOrbit } = useDrawPath(config.id, config.path)
    const isPast = step > config.id;
    if (step < config.id) return null

    const tokenDelay = isPast
        ? 0
        : segmentConfigs.at(-1)?.delay

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="300 0 2800 1400"
            style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinecap: "round",
                strokeLinejoin: "round",
            }}
        >
            <g transform={config.transform}>
                <clipPath id={config.clipId}>
                    <path d={config.clipPath} />
                </clipPath>

                <g clipPath={`url(#${config.clipId})`}>
                    {segments.map((seg, i) => (
                        <motion.path key={`${seg.d}-${i}`} d={seg.d}
                            stroke="#da7eb2"
                            fill="none"
                            strokeWidth={isOrbit ? 16.67 : 30.76}
                            strokeDasharray={seg.length}
                            strokeDashoffset={isPast ? 0 : seg.length}
                            initial={
                                isPast
                                    ? { strokeDashoffset: 0, opacity: 1 }
                                    : { strokeDashoffset: seg.length, opacity: isOrbit ? 1 : 0 }
                            }
                            animate={{ strokeDashoffset: 0, opacity: 1 }}
                            transition={
                                isPast
                                    ? { duration: 0 }
                                    : {
                                        duration: segmentConfigs[i].duration,
                                        delay: segmentConfigs[i].delay,
                                        ease: "linear",
                                    }
                            }
                        />
                    ))}
                </g>
            </g>

            <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: isPast ? 0 : 0.3,
                    delay: tokenDelay,
                    ease: "backOut",
                }}
                style={{ transformOrigin: `${config.token.x}px ${config.token.y}px` }}
                onAnimationComplete={() => {
                    if (!isPast) {
                        onAnimationComplete();
                    }
                }}
            >
                <circle
                    cx={config.token.x}
                    cy={config.token.y}
                    r={30}
                    fill="none"
                    stroke="rgb(250,186,163)"
                    strokeWidth={3}
                />
                <text
                    x={config.token.x}
                    y={config.token.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="Impact, sans-serif"
                    fontSize={34}
                    fill="rgb(250,186,163)"
                >
                    {config.id}
                </text>
            </motion.g>
        </svg>
    )
}
import { motion } from "framer-motion"
import { useDrawPath } from "@/hooks/useDrawPath"
import {StepConfig} from "@/types/StepConfig";

export default function Step({ step, config }: { step: number; config: StepConfig }) {
    const { segments, segmentConfigs, isOrbit } = useDrawPath(config.id, config.path)
    const isPast = step > config.id;
    if (step < config.id) return null

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
                        <motion.path key={i} d={seg.d}
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
        </svg>
    )
}
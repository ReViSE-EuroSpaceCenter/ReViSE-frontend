import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STEPS, SPECIES } from "@/utils/gaugeData";
import { useGaugeAnimation } from "@/hooks/useGaugeAnimation";
import { GaugeBar } from "@/components/discover/GaugeBar";
import { IconSpecies } from "@/components/discover/IconSpecies";

const GAUGE_WIDTH = 180;
const GAUGE_HEIGHT = 460;
const BW = 2;
const TOTAL_WIDTH = GAUGE_WIDTH + 80;
const FILL_AREA_HEIGHT = GAUGE_HEIGHT - BW * 2;

type Props = {
    stepTarget: number;
    onStepReached: () => void;
    onComplete: () => void;
    discoveredSteps: number[];
}

export default function Gauge({ stepTarget, onStepReached, onComplete, discoveredSteps }: Readonly<Props>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgBounds, setSvgBounds] = useState<{ width: number; height: number } | null>(null);
    const [pendingStep, setPendingStep] = useState<number | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSvgBounds({ width, height });

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSvgBounds({ width, height });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleStepReached = useCallback(() => {
        setPendingStep(stepTarget);
    }, [stepTarget]);

    const { smoothProgress } = useGaugeAnimation({
        stepTarget,
        onStepReached: handleStepReached,
        onComplete,
    });

    const layout = useMemo(() => {
        if (!svgBounds) {
            return {
                scale: 1,
                renderedWidth: TOTAL_WIDTH,
                renderedHeight: GAUGE_HEIGHT,
                offsetX: 0,
                offsetY: 0,
            };
        }

        const scale = Math.min(svgBounds.width / TOTAL_WIDTH, svgBounds.height / GAUGE_HEIGHT);
        const renderedWidth = TOTAL_WIDTH * scale;
        const renderedHeight = GAUGE_HEIGHT * scale;

        return {
            scale,
            renderedWidth,
            renderedHeight,
            offsetX: (svgBounds.width - renderedWidth) / 2,
            offsetY: (svgBounds.height - renderedHeight) / 2,
        };
    }, [svgBounds]);

    const iconSize = Math.max(28, 60 * layout.scale);

    const toRendered = (viewBoxX: number, viewBoxY: number) => {
        return {
            x: layout.offsetX + viewBoxX * layout.scale,
            y: layout.offsetY + viewBoxY * layout.scale,
        };
    };

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-visible">
            <svg
                viewBox={`0 0 ${TOTAL_WIDTH} ${GAUGE_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute"
                style={{
                    left: layout.offsetX,
                    top: layout.offsetY,
                    width: layout.renderedWidth,
                    height: layout.renderedHeight,
                }}
            >
                <GaugeBar
                    gaugeWidth={GAUGE_WIDTH}
                    gaugeHeight={GAUGE_HEIGHT}
                    bw={BW}
                    smoothProgress={smoothProgress}
                />
            </svg>

            {STEPS.map((marker) => {
                const isDiscovered = discoveredSteps.includes(marker);
                const isCurrentStep = marker === pendingStep;
                const src = SPECIES.find((s) => s.step === marker)?.svg;

                if ((!isDiscovered && !isCurrentStep) || !src) return null;

                const yViewBox = BW + FILL_AREA_HEIGHT * (1 - marker);
                const position = toRendered(GAUGE_WIDTH + 8, yViewBox - 20);

                return (
                    <IconSpecies
                        key={marker}
                        src={src}
                        marker={marker}
                        iconSize={iconSize}
                        position={position}
                        isCurrentStep={isCurrentStep}
                        onPopInComplete={onStepReached}
                    />
                );
            })}
        </div>
    );
}
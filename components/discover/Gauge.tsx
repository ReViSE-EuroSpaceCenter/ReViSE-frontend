import {useCallback, useEffect, useRef, useState} from "react";
import { STEPS, SPECIES } from "@/utils/gaugeData";
import { useGaugeAnimation } from "@/hooks/useGaugeAnimation";
import { GaugeBar } from "@/components/discover/GaugeBar";
import { IconSpecies } from "@/components/discover/IconSpecies";

const GAUGE_WIDTH = 180;
const GAUGE_HEIGHT = 460;
const BW = 2;
const TOTAL_WIDTH = GAUGE_WIDTH + 80;
const FILL_AREA_HEIGHT = GAUGE_HEIGHT - BW * 2;

export default function Gauge({ stepTarget, onStepReached, onComplete, discoveredSteps }: {readonly stepTarget:number; readonly onStepReached: () => void; readonly onComplete: () => void; readonly discoveredSteps: number[]}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [svgBounds, setSvgBounds] = useState<{ width: number; height: number } | null>(null);
    const [pendingStep, setPendingStep] = useState<number | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSvgBounds({ width, height });
        });
        observer.observe(svgRef.current);
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

    const iconSize = svgBounds ? (60 * svgBounds.width) / TOTAL_WIDTH : 60;

    const toRendered = (viewBoxX: number, viewBoxY: number) => {
        if (!svgBounds) return { x: 0, y: 0 };
        return {
            x: viewBoxX * (svgBounds.width / TOTAL_WIDTH),
            y: viewBoxY * (svgBounds.height / GAUGE_HEIGHT),
        };
    };

    return (
        <div className="relative w-full h-full">
            <svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${GAUGE_HEIGHT}`} className="w-full h-full">
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
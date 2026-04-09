import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STEPS, SPECIES } from "@/utils/gaugeData";
import { useGaugeAnimation } from "@/hooks/useGaugeAnimation";
import { GaugeBar } from "@/components/discover/GaugeBar";
import { IconSpecies } from "@/components/discover/IconSpecies";

const GAUGE_WIDTH = 180;
const GAUGE_HEIGHT = 460;
const BORDER_WIDTH = 2;
const TOTAL_WIDTH = GAUGE_WIDTH + 80;
const FILL_AREA_HEIGHT = GAUGE_HEIGHT - BORDER_WIDTH * 2;

type Props = {
    stepTarget: number;
    onStepReached: () => void;
    onComplete: () => void;
    discoveredSteps: number[];
};

export default function Gauge({stepTarget, onStepReached, onComplete, discoveredSteps,}: Readonly<Props>) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [bounds, setBounds] = useState<{ width: number; height: number } | null>(null);
    const [pendingStep, setPendingStep] = useState<number | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const update = (width: number, height: number) =>
            setBounds({ width, height });

        const rect = containerRef.current.getBoundingClientRect();
        update(rect.width, rect.height);

        const observer = new ResizeObserver(([entry]) => {
            update(entry.contentRect.width, entry.contentRect.height);
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
        if (!bounds) {
            return {
                scale: 1,
                width: TOTAL_WIDTH,
                height: GAUGE_HEIGHT,
                offsetX: 0,
                offsetY: 0,
            };
        }

        const scale = Math.min(
            bounds.width / TOTAL_WIDTH,
            bounds.height / GAUGE_HEIGHT
        );

        const width = TOTAL_WIDTH * scale;
        const height = GAUGE_HEIGHT * scale;

        return {
            scale,
            width,
            height,
            offsetX: (bounds.width - width) / 2,
            offsetY: (bounds.height - height) / 2,
        };
    }, [bounds]);

    const iconSize = Math.max(28, 60 * layout.scale);

    const speciesMap = useMemo(() => {
        return new Map(SPECIES.map((s) => [s.step, s.svg]));
    }, []);

    const discoveredSet = useMemo(() => new Set(discoveredSteps), [discoveredSteps]);

    const toRendered = useCallback(
        (x: number, y: number) => ({
            x: layout.offsetX + x * layout.scale,
            y: layout.offsetY + y * layout.scale,
        }),
        [layout]
    );

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-visible" style={{ visibility: bounds ? "visible" : "hidden" }}>
            <svg
                viewBox={`0 0 ${TOTAL_WIDTH} ${GAUGE_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute"
                style={{
                    left: layout.offsetX,
                    top: layout.offsetY,
                    width: layout.width,
                    height: layout.height,
                }}
            >
                <GaugeBar
                    gaugeWidth={GAUGE_WIDTH}
                    gaugeHeight={GAUGE_HEIGHT}
                    bw={BORDER_WIDTH}
                    smoothProgress={smoothProgress}
                />
            </svg>

            {STEPS.map((marker) => {
                const isDiscovered = discoveredSet.has(marker);
                const isCurrentStep = marker === pendingStep;

                if (!isDiscovered && !isCurrentStep) return null;

                const src = speciesMap.get(marker);
                if (!src) return null;

                const y = BORDER_WIDTH + FILL_AREA_HEIGHT * (1 - marker);
                const position = toRendered(GAUGE_WIDTH + 8, y - 20);

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
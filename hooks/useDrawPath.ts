import { svgPathProperties } from "svg-path-properties"
import {useMemo} from "react";

export function useDrawPath(triggerStep: number, pathD?: string) {

    const isOrbit = triggerStep === 1 || triggerStep === 8

    const segments = useMemo(() => {
        if (!pathD) return [];
        const rawSegments = pathD.match(/[Mm][^Mm]*/g) || [];
        const measured = rawSegments.map(d => ({
            d,
            length: new svgPathProperties(d).getTotalLength(),
        }));
        return isOrbit ? measured : measured.reverse();
    }, [pathD, isOrbit]);

    const segmentConfigs = useMemo(() => {
        const OVERLAP = 0.15
        const BASE_DELAY = 0.5
        const TOTAL = isOrbit ? 1+BASE_DELAY : 2+BASE_DELAY
        if (segments.length <= 1) {
            return [{ delay: BASE_DELAY, duration: TOTAL }]
        }

        return segments.map((_, i) => ({
            delay: BASE_DELAY + i * (TOTAL / segments.length),
            duration: TOTAL / segments.length + OVERLAP,
        }))
    }, [isOrbit, segments])

    return { segments, segmentConfigs, isOrbit }
}
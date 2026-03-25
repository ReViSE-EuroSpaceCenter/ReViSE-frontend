import { useEffect, useMemo, useState } from "react"
import { svgPathProperties } from "svg-path-properties"

type Segment = { d: string; length: number }

function splitPath(d: string): string[] {
    return d.match(/[Mm][^Mm]*/g) || []
}

export function useDrawPath(triggerStep: number, pathD?: string) {
    const [segments, setSegments] = useState<Segment[]>([])

    const isOrbit = triggerStep === 1 || triggerStep === 8

    useEffect(() => {
        if (!pathD) return
        const rawSegments = splitPath(pathD)
        const measured = rawSegments.map((d) => ({
            d,
            length: new svgPathProperties(d).getTotalLength(),
        }))
        setSegments(isOrbit ? measured : measured.reverse())
    }, [pathD, isOrbit])

    const segmentConfigs = useMemo(() => {
        const TOTAL = isOrbit ? 1 : 2
        const OVERLAP = 0.15
        if (segments.length <= 1) return [{ delay: 0, duration: TOTAL }]
        return segments.map((_, i) => ({
            delay: i * (TOTAL / segments.length),
            duration: TOTAL / segments.length + OVERLAP,
        }))
    }, [isOrbit, segments])

    return { segments, segmentConfigs, isOrbit }
}
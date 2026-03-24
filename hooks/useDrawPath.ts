import { useEffect, useRef, useState } from "react"

export function useDrawPath(step: number, triggerStep: number) {
    const pathRef = useRef<SVGPathElement | null>(null)
    const [length, setLength] = useState(0)
    const [draw, setDraw] = useState(false)
    const onDrawStart = useRef<(() => void) | null>(null)

    useEffect(() => {
        if (pathRef.current) setLength(pathRef.current.getTotalLength())
    }, [])

    useEffect(() => {
        if (step >= triggerStep) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setDraw(true)
                    onDrawStart.current?.()
                })
            })
        }
    }, [step, triggerStep])

    const style = {
        fill: "none",
        stroke: "#da7eb2",
        strokeWidth: "16.67px",
        strokeDasharray: length,
        strokeDashoffset: draw ? 0 : length,
        transition: draw ? "stroke-dashoffset 2s ease" : "none",
    }

    return { pathRef, style, onDrawStart }
}
import {useDrawPath} from "@/hooks/useDrawPath";

export default function Step({ step, config }: { step: number; config: any }) {
    const { pathRef, style } = useDrawPath(step, config.id)
    
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 1.5,
            }}
            viewBox="300 0 2800 1400"
        >
            <g transform={config.transform}>
                <clipPath id={config.clipId}>
                    <path d={config.clipPath} />
                </clipPath>
                <g clipPath={`url(#${config.clipId})`}>
                    <path ref={pathRef} d={config.path} style={style} />
                </g>
            </g>
        </svg>
    )
}
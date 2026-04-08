import Image from "next/image";
import { PopInSpecies } from "@/components/discover/PopInSpecies";

type Props = {
    src: string;
    marker: number;
    iconSize: number;
    position: { x: number; y: number };
    isCurrentStep: boolean;
    onPopInComplete: () => void;
}

export function IconSpecies({ src, marker, iconSize, position, isCurrentStep, onPopInComplete }: Readonly<Props>) {
    return (
        <div
            className="absolute overflow-visible"
            style={{ left: position.x, top: position.y, width: iconSize, height: iconSize }}
        >
            {isCurrentStep ? (
                <PopInSpecies
                    src={src}
                    iconSize={iconSize}
                    onAnimationComplete={onPopInComplete}
                />
            ) : (
                <Image
                    src={src}
                    alt={`species-${marker}`}
                    fill
                    className="object-contain"
                />
            )}
        </div>
    );
}
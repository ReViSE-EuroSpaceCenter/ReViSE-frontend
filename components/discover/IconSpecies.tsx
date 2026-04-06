import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { PopInSpecies } from "@/components/discover/PopInSpecies";

export function IconSpecies({ src, marker, iconSize, position, isCurrentStep, onPopInComplete }:  {readonly src: string; readonly marker: number; readonly iconSize: number; readonly position: { x: number; y: number }; readonly isCurrentStep: boolean; readonly onPopInComplete: () => void;}) {
    return (
        <div
            className="absolute overflow-visible"
            style={{ left: position.x, top: position.y, width: iconSize, height: iconSize }}
        >
            <AnimatePresence>
                {isCurrentStep ? (
                    <PopInSpecies
                        key="pop"
                        src={src}
                        iconSize={iconSize}
                        onAnimationComplete={onPopInComplete}
                    />
                ) : (
                    <motion.div
                        key="static"
                        className="absolute inset-0"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Image src={src} alt={`species-${marker}`} fill className="object-contain" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
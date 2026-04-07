import { motion } from "framer-motion";
import Image from "next/image";
import { PARTICLES } from "@/utils/gaugeData";

type Props = {
    src: string;
    iconSize: number;
    onAnimationComplete?: () => void;
}

export function PopInSpecies({ src, iconSize, onAnimationComplete }: Readonly<Props>) {
    return (
        <>
            {PARTICLES.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: iconSize / 2,
                        top: iconSize / 2,
                        width: p.size,
                        height: p.size,
                        backgroundColor: "#ffffff",
                    }}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.6],
                        x: p.x * (iconSize / 120),
                        y: p.y * (iconSize / 120),
                    }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
            ))}

            <motion.div
                className="absolute inset-0"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0.9, 1.1, 1] }}
                transition={{ duration: 0.6, times: [0, 0.4, 0.6, 0.8, 1], ease: "easeOut" }}
                onAnimationComplete={onAnimationComplete}
            >
                <Image src={src} alt="espèce découverte" fill className="object-contain" />
            </motion.div>
        </>
    );
}
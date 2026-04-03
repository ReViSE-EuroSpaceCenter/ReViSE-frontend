import { motion, AnimatePresence } from 'framer-motion';

export default function PopInSpecies({ speciesSVG }: { readonly speciesSVG: string }) {
    {
        return (
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.2}}
                >
                    {[...Array(100)].map((_, i) => {
                        const angle = (i / 100) * Math.PI * 2;
                        const distance = 100 + Math.random() * 60;

                        return (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    width: `${3 + Math.random() * 3}px`,
                                    height: `${3 + Math.random() * 3}px`,
                                    backgroundColor: '#ffffff',
                                }}
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    x: 0,
                                    y: 0,
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0.6],
                                    x: Math.cos(angle) * distance,
                                    y: Math.sin(angle) * distance,
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            />
                        );
                    })}

                    <motion.div
                        initial={{scale: 0}}
                        animate={{
                            scale: [0, 1.5, 0.9, 1.1, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            times: [0, 0.4, 0.6, 0.8, 1],
                            ease: "easeOut"
                        }}
                    >
                        {speciesSVG}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }
}
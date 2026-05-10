"use client";

import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {useEffect, useRef} from "react";
import styles from "./endGame.module.css";
import Image from "next/image";

export default function EndGamePage() {
    const searchParams = useSearchParams();
    const isWin = searchParams.get("win") === "true";

    const scrollRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        container.scrollTop = 0;

        const duration = 5200;
        const startTime = performance.now();

        let animationFrameId: number;

        const easeInOutCubic = (t: number) =>
            t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            const targetY = container.scrollHeight - container.clientHeight;

            container.scrollTop = targetY * easedProgress;

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animateScroll);
            }
        };

        animationFrameId = requestAnimationFrame(animateScroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={scrollRef} className="h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden px-6 lg:px-12 bg-darkBlueReViSE">
        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between py-4">
            <div className="max-w-6xl w-full mx-auto space-y-4 text-center pt-2">
                <div className="space-y-2">
                    <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-purpleReViSE">
                        <span>Merci d’avoir joué à ReVisE !</span>
                        {!isWin && (
                            <span className="block">
                                Vous avez perdu !
                            </span>
                        )}
                    </h1>
                </div>

                <div className="text-white space-y-4">
                    <h2 className={`${styles.fadeInUp} [animation-delay:200ms] text-2xl sm:text-3xl font-bold text-white`}>
                        CRÉDITS
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                        <div className={`${styles.fadeInUp} [animation-delay:500ms]`}>
                            <h3 className="text-lg font-semibold text-purpleReViSE">
                                Développement
                            </h3>
                            <p>Hugo Chot</p>
                            <p className="text-sm opacity-80">(Euro Space Center)</p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:900ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Scénario
                            </h3>
                            <p>Hugo Chot <span className="text-sm opacity-80">(Euro Space Center)</span></p>
                            <p>Victor Hamer <span className="text-sm opacity-80">(B12 Consulting)</span></p>
                            <p>Bastien Wauthoz <span className="text-sm opacity-80">(Designed by Acritarche)</span></p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:1300ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Game Design
                            </h3>
                            <p>Bastien Wauthoz</p>
                            <p className="text-sm opacity-80">(Designed by Acritarche)</p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:1700ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Design Graphique
                            </h3>
                            <p>Bastien Wauthoz</p>
                            <p className="text-sm opacity-80">(Designed by Acritarche)</p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:2100ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Design Pédagogique
                            </h3>
                            <p>Julie Henry</p>
                            <p>Cécile Lombart</p>
                            <p className="text-sm opacity-80">(Université de Namur)</p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:2500ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Référente Inclusivité
                            </h3>
                            <p>Julie Henry</p>
                            <p className="text-sm opacity-80">(Université de Namur)</p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:2900ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Validation des Contenus Techniques
                            </h3>
                            <p>Victor Hamer <span className="text-sm opacity-80">(B12 Consulting by YUMA)</span></p>
                            <p>Julie Henry</p>
                            <p>Cécile Lombart</p>
                            <p className="text-sm opacity-80">(Université de Namur)</p>
                        </div>

                        <div className={`${styles.fadeInUp} [animation-delay:3300ms]`}>
                            <h3 className="text-xl font-semibold text-purpleReViSE">
                                Développement Application Web
                            </h3>
                            <p>Erin Fouarge</p>
                            <p>Hugo Raskin</p>
                            <p>Mallory Bouchard</p>
                            <p>Simon Karler</p>
                            <p>Taj Eddine Temssamani Bouazza</p>
                        </div>
                    </div>
                </div>

                    <Link
                        href="/"
                        className={`${styles.fadeInUp} [animation-delay:3800ms] inline-block px-5 py-2 rounded-lg bg-purpleReViSE text-white font-semibold hover:opacity-90 transition`}
                    >
                        Retour à l’accueil
                    </Link>
                </div>

            <div
                className={`${styles.fadeInUp} [animation-delay:4200ms] w-full max-w-5xl mx-auto pt-2 h-14 lg:h-16 overflow-hidden`}
            >
                <div className="h-full flex items-center justify-center gap-4 lg:gap-8 flex-nowrap">
                    <Image
                        src="/logos/acritarche.png"
                        width={130}
                        height={48}
                        alt="Logo Acritarche"
                        className="h-8 lg:h-10 w-auto object-contain shrink-0"
                    />
                    <Image
                        src="/logos/B12.png"
                        width={130}
                        height={48}
                        alt="Logo B12"
                        className="h-8 lg:h-10 w-auto object-contain shrink-0"
                    />
                    <Image
                        src="/logos/eurospace.png"
                        width={130}
                        height={48}
                        alt="Logo Euro Space Center"
                        className="h-8 lg:h-10 w-auto object-contain shrink-0"
                    />
                    <Image
                        src="/logos/unamur_blanc.png"
                        width={130}
                        height={48}
                        alt="Logo UNamur"
                        className="h-8 lg:h-10 w-auto object-contain shrink-0"
                    />
                    <Image
                        src="/logos/WR.png"
                        width={130}
                        height={48}
                        alt="Logo Wallonie Recherche"
                        className="h-8 lg:h-10 w-auto object-contain shrink-0"
                    />
                </div>
            </div>
            </div>
        </div>
    );
}
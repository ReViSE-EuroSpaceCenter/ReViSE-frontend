"use client";

import Image from "next/image";

type BonusSubstituteType =
    | "check_no_bonus"
    | "recycle_no_bonus"
    | "ring_no_bonus"
    | "time_no_bonus"
    | "tools_no_bonus"
    | "energy";

type BonusBadgeItem = {
    key: string;
    image: string;
    completed: boolean;
    alt: string;
    substitute?: {
        type: BonusSubstituteType;
        image: string;
        quantity?: number;
    };
};

type BonusCardProps = {
    bonus: BonusBadgeItem;
    label: string;
    text?: string;
    iconSize?: string;
    substituteSize?: string;
};

export default function BonusCard({
                                      bonus,
                                      label,
                                      text,
                                      iconSize = "w-[100px] h-[100px] md:w-[120px] md:h-[120px]",
                                      substituteSize = "w-[70px] h-[70px] md:w-[85px] md:h-[85px]",
                                  }: BonusCardProps) {
    const substitute = bonus.substitute;

    const showNoBonusSubstitute =
        !bonus.completed && substitute && substitute.type !== "energy";

    const showEnergyReward =
        bonus.completed && substitute && substitute.type === "energy";

    return (
        <div className="flex max-w-72 flex-col items-center text-center">
            <div className="flex items-center justify-center gap-3">
                <div className={`${iconSize} relative shrink-0`}>
                    <Image
                        src={bonus.image}
                        alt={bonus.alt}
                        fill
                        className={`object-contain transition-all duration-500 ${
                            bonus.completed
                                ? "opacity-100 scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                                : "opacity-25 brightness-125 contrast-75"
                        }`}
                    />

                    {bonus.completed && (
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white shadow">
                            ✓
                        </div>
                    )}
                </div>

                {(showNoBonusSubstitute || showEnergyReward) && substitute && (
                    <>
                        <span className="text-3xl font-bold text-white/80">→</span>

                        {substitute.type === "energy" && substitute.quantity ? (
                            <div className="flex flex-wrap items-center justify-center gap-2 max-w-35">
                                {Array.from({ length: substitute.quantity }).map((_, index) => (
                                    <div
                                        key={`${bonus.key}-energy-${index}`}
                                        className="relative h-10 w-10 md:h-12 md:w-12 shrink-0"
                                    >
                                        <Image
                                            src={substitute.image}
                                            alt={`Énergie ${index + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`${substituteSize} relative shrink-0`}>
                                <Image
                                    src={substitute.image}
                                    alt={`Substitut de ${bonus.key}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <span className="mt-2 text-sm font-semibold uppercase text-white">
                {label}
            </span>

            {text && (
                <p className="mt-2 text-xs leading-5 text-white/75 md:text-sm">
                    {text}
                </p>
            )}
        </div>
    );
}
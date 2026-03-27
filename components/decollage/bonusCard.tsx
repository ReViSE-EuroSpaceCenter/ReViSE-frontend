"use client";

import Image from "next/image";

type BonusSubstituteType =
    | "preparer_no_bonus"
    | "adapter_no_bonus"
    | "forcer_no_bonus"
    | "anticiper_no_bonus"
    | "reparer_no_bonus"
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
                                  }: Readonly<BonusCardProps>) {
    const substitute = bonus.substitute;

    const showNoBonusSubstitute =
        !bonus.completed && substitute && substitute.type !== "energy";

    const showEnergyReward =
        bonus.completed && substitute?.type === "energy";
    console.log(bonus)

    return (
        <div className="flex max-w-72 flex-col items-center text-center">
            <div className="flex items-center justify-center gap-3">
                <div className={`${iconSize} relative shrink-0`}>
                    <Image
                        src={
                            bonus.completed
                                ? bonus.image
                                : bonus.image.replace(/(\.[a-zA-Z]+)$/, "_gris$1")
                        }
                        alt={bonus.alt}
                        fill
                        className={`object-contain transition-all duration-500 ${
                            bonus.completed
                                ? "scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                                : ""
                        }`}
                    />
                </div>

                {(showNoBonusSubstitute || showEnergyReward) && substitute && (
                    <>
                        <span className="relative text-3xl font-bold text-white/80">
                             →
                            {substitute.type === "energy" && (
                                <span className="absolute left-full ml-1 top-1/2 -translate-y-1/2 text-3xl font-bold text-purpleReViSE/80">
                                    +
                                </span>
                            )}
                        </span>

                        {substitute.type === "energy" && substitute.quantity ? (
                            <div className="relative flex flex-wrap items-center justify-center gap-2 max-w-35">


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
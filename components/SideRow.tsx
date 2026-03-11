import Image from "next/image";

type StatRowProps = {
    team: string;
    mission1_check: boolean;
    mission2_check: boolean;
};

export default function SideRow({team , mission2_check , mission1_check}: Readonly<StatRowProps>) {


    return (
        <div className="flex flex-row items-center gap-10 w-full max-w-187.5 py-6 group transition-all">
            <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
                <Image
                    src={`/badges/${team}.png`}
                    alt={`Badge ${team}`}
                    width={120}
                    height={120}
                    className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-transform duration-500"
                />
            </div>

            <div className="flex flex-col gap-6 flex-1 min-w-0">


                <div className="flex flex-row gap-6 px-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative">
                        <Image
                            src={`/badges_missions/${team}_mission1.png`}
                            alt="Mission 1"
                            width={64}
                            height={64}
                            className={`object-contain transition-all duration-500 ${
                                mission1_check
                                    ? "grayscale-0 opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                    : "grayscale opacity-25 brightness-125 contrast-75"
                            }`}
                        />
                    </div>

                    <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative">
                        <Image
                            src={`/badges_missions/${team}_mission2.png`}
                            alt="Mission 2"
                            width={64}
                            height={64}
                            className={`object-contain transition-all duration-500 ${
                                mission2_check
                                    ? "grayscale-0 opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                    : "grayscale opacity-25 brightness-125 contrast-75"
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
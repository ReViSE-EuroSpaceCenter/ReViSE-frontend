import Image from "next/image";

type StatRowProps = {
    label: string;
    percent: number;
    team: string;
};

export default function SideRow({ label, percent, team }: StatRowProps) {
    return (
        <div className="flex items-center gap-6 group w-full max-w-[320px]">
            <div className="relative w-40 h-40 shrink-0">
                <Image
                    src={`/badges/${team}.png`}
                    alt={`Badge ${team}`}
                    width={128}
                    height={128}
                    className="object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform"
                />
            </div>

            <div className="flex flex-col gap-4 w-full grow">

                <div className="flex items-center gap-4 w-full text-sm uppercase tracking-[0.2em] text-slate-300 font-bold px-1">
                    <span>{label}</span>
                    <span className="text-purpleReViSE">{percent}%</span>
                </div>

                <div className="w-full h-4 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
                    <div
                        className="h-full bg-linear-to-r from-purpleReViSE via-blue-400 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center mt-1 px-1">
                    <div className="flex gap-3">
                        <div className="w-4 h-4 rounded-full border border-slate-600 bg-slate-800 animate-pulse" />
                        <div className="w-4 h-4 rounded-full border border-slate-600 bg-slate-800 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
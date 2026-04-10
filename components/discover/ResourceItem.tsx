import Image from "next/image";

type Props = { icon: string; value: number | undefined };

export function ResourceItem({ icon, value }: Readonly<Props>) {
    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <div
                className="relative"
                style={{ width: "clamp(2rem, 4vw, 4rem)", height: "clamp(2rem, 4vw, 4rem)" }}
            >
                <Image src={icon} alt="resource" fill className="object-contain" />
            </div>
            <span
                className="text-white font-bold mt-5"
                style={{ fontSize: "clamp(0.75rem, 2vw, 1.75rem)" }}
            >
                {value}
            </span>
        </div>
    );
}
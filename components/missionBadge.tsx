import Image from "next/image";
import { Mission } from "@/data/mission";

type Props = {
    mission: Mission;
    isLocked: boolean;
    isCompleted: boolean;
    onClick?: () => void;
};

export default function MissionBadge({
                                         mission,
                                         isLocked,
                                         isCompleted,
                                         onClick,
                                     }: Props) {
    return (
        <div
            className={`relative flex flex-col items-center justify-center w-28 h-28 transition 
            ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={onClick}
        >
            <Image
                src={mission.badge}
                alt={mission.title}
                width={100}
                height={100}
                className={isCompleted ? "opacity-70" : ""}
            />

            <p className="absolute bottom-0 text-xs font-bold text-red-600">
                {mission.title}
            </p>
        </div>
    );
}

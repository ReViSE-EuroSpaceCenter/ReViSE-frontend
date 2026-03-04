import React from "react";
import { Mission } from "@/types/Mission";

type Props = {
    mission: Mission;
    isUnlocked: boolean;
    teamColor: string;
    textColorClass: string;
    onClick: () => void;
};

export function MissionButton({
                                  mission,
                                  isUnlocked,
                                  teamColor,
                                  textColorClass,
                                  onClick
                              }: Props) {

    let displayText: React.ReactNode = mission.title;

    if (mission.bonus) {
        const parts = mission.title.split(" ");
        if (parts.length >= 2) {
            displayText = (
                <>
                    {parts[0]}<br />
                    {parts.slice(1).join("")}
                </>
            );
        }
    }

    return (
        <button
            onClick={onClick}
            disabled={!isUnlocked}
            style={{
                backgroundColor: isUnlocked ? teamColor : "#555"
            }}
            className={`px-4 py-3 rounded-2xl border-2 border-black shadow-md ${textColorClass} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
        >
            {displayText}
        </button>
    );
}
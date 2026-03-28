import React from "react";
import SideRow from "./SideRow";
import { TeamData } from "@/types/TeamData";

interface TeamColumnProps {
    teams: TeamData[];
    align: "start" | "end";
    side: "left" | "right";
}

const TeamColumn = ({ teams, align = "start", side }: TeamColumnProps) => (
    <div
        className={`flex flex-col gap-12 xl:gap-18 w-full min-w-0 items-center xl:items-${align} ${
            side === "left" ? "xl:pr-12" : "xl:pl-12"
        } order-${side === "left" ? "2 xl:order-1" : "3 xl:order-3"} lg:col-span-1`}
    >
        {teams.map((teamItem) => (
            <div
                key={`${side}-${teamItem.team}`}
                className={`flex flex-col items-center xl:items-${align} gap-2`}
            >
                <SideRow {...teamItem} />
            </div>
        ))}
    </div>
);

export default TeamColumn;
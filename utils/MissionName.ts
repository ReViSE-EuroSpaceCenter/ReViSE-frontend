import { Mission } from "@/types/Mission";

export function missionNameTraduction(mission: Mission, teamName: string): string {
    if (mission.bonus) {
        if (teamName !== "MECA") {
            if (mission.id === 8) return "BONUS_1";
            if (mission.id === 9) return "BONUS_2";
        } else {
            if (mission.id === 9) return "BONUS_1";
            if (mission.id === 10) return "BONUS_2";
        }
    }
    return `CLASSIC_${mission.id}`;
}
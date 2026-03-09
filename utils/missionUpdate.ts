import {missionNameTraduction} from "@/utils/missionName";
import {Mission} from "@/types/Mission";

export function getProjectMissionsToUpdate(
    mission: Mission,
    missionMap: Record<number, Mission>,
    completedMissions: Record<string, boolean>,
    teamName: string,
    isBonus1completed: boolean,
    isBonus2completed: boolean
) {

    const allProjectMissions = Object.values(missionMap)
        .filter(m => m.projectId === mission.projectId);

    const normalMissions = allProjectMissions
        .filter(m => !m.bonus)
        .sort((a, b) => a.id - b.id);

    const bonusMissions = allProjectMissions.filter(m => m.bonus);
    const missionNumber = missionNameTraduction(mission, teamName);
    const isCompleted = completedMissions[missionNumber];

    if (!isCompleted) {
        return [missionNumber];
    }

    const missionIndex = normalMissions.findIndex(m => m.id === mission.id);

    const missionsToInvalidate: string[] = [];

    for (let i = missionIndex; i < normalMissions.length; i++) {
        const m = normalMissions[i];
        const number = missionNameTraduction(m, teamName);

        if (completedMissions[number]) {
            missionsToInvalidate.push(number);
        }
    }

    for (const bonus of bonusMissions) {
        const number = missionNameTraduction(bonus, teamName);

        if (number === "BONUS_1" && isBonus1completed || number === "BONUS_2" && isBonus2completed) {
            missionsToInvalidate.push(number);
        }
    }

    return missionsToInvalidate;
}
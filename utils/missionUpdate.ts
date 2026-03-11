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

    const bonusMissions = allProjectMissions.filter(m => m.bonus);
    const missionNumber = missionNameTraduction(mission, teamName);
    const isCompleted = completedMissions[missionNumber];

    if (!isCompleted) {
        return [missionNumber];
    }

    const missionsToInvalidate: Set<string> = new Set();
    const queue: Mission[] = [mission];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentNumber = missionNameTraduction(current, teamName);

        if (!completedMissions[currentNumber]) continue;
        if (missionsToInvalidate.has(currentNumber)) continue;

        missionsToInvalidate.add(currentNumber);

        for (const unlockedId of current.unlocks) {
            const unlockedMission = missionMap[unlockedId];
            if (unlockedMission) queue.push(unlockedMission);
        }
    }

    for (const bonus of bonusMissions) {
        const number = missionNameTraduction(bonus, teamName);
        if ((number === "BONUS_1" && isBonus1completed) || (number === "BONUS_2" && isBonus2completed)) {
            missionsToInvalidate.add(number);
        }
    }

    return Array.from(missionsToInvalidate);
}
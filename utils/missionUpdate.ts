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
    const missionNumber = missionNameTraduction(mission, teamName);
    const isCompleted = completedMissions[missionNumber];

    // Si la mission n'est pas complétée, on ne s'occupe que d'elle-même
    if (!isCompleted) {
        return [missionNumber];
    }

    const missionsToInvalidate: Set<string> = new Set();
    const queue: Mission[] = [mission];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentNumber = missionNameTraduction(current, teamName);

        // Si déjà traité, on passe
        if (missionsToInvalidate.has(currentNumber)) continue;

        // On vérifie si cette mission précise est complétée dans l'état actuel
        const isCurrentCompleted = current.bonus
            ? (currentNumber === "BONUS_1" ? isBonus1completed : isBonus2completed)
            : completedMissions[currentNumber];

        if (!isCurrentCompleted) continue;

        // Ajouter à la liste des invalidations
        missionsToInvalidate.add(currentNumber);

        // Ajouter les missions débloquées par celle-ci à la file
        for (const unlockedId of current.unlocks) {
            const unlockedMission = missionMap[unlockedId];
            if (unlockedMission) {
                queue.push(unlockedMission);
            }
        }
    }

    return Array.from(missionsToInvalidate);
}
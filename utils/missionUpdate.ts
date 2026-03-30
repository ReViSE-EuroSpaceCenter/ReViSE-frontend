import {missionNameTraduction} from "@/utils/missionName";
import {Mission} from "@/types/Mission";
import {teams} from "@/types/Teams";
import {TeamsFullProgression, TeamProgressionWS} from "@/types/TeamData";

function checkCompletion(
    missionNum: string,
    mission: Mission,
    completedMissions: Record<string, boolean>,
    isBonus1: boolean,
    isBonus2: boolean
): boolean {
    if (!mission.bonus) {
        return completedMissions[missionNum];
    }
    return missionNum === "BONUS_1" ? isBonus1 : isBonus2;
}

export function getProjectMissionsToUpdate(
    mission: Mission,
    missionMap: Record<number, Mission>,
    completedMissions: Record<string, boolean>,
    teamName: string,
    isBonus1completed: boolean,
    isBonus2completed: boolean
): string[] {
    const missionNumber = missionNameTraduction(mission, teamName);

    if (!completedMissions[missionNumber]) {
        return [missionNumber];
    }

    const missionsToInvalidate = new Set<string>();
    const queue: Mission[] = [mission];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentNum = missionNameTraduction(current, teamName);

        const isCurrentCompleted = checkCompletion(
            currentNum,
            current,
            completedMissions,
            isBonus1completed,
            isBonus2completed
        );

        if (isCurrentCompleted && !missionsToInvalidate.has(currentNum)) {
            missionsToInvalidate.add(currentNum);

            current.unlocks.forEach(id => {
                if (missionMap[id]) queue.push(missionMap[id]);
            });
        }
    }

    return Array.from(missionsToInvalidate);
}

export function updateTeamProgression(
  gameData: TeamsFullProgression | undefined,
  payload: TeamProgressionWS
) {
    if (!gameData) return gameData;

    const { teamProgression, allTeamsMissionsCompleted } = payload;
    const teamLabel = teamProgression.teamLabel;

    const teamData = gameData.teamsFullProgression?.[teamLabel];
    if (!teamData) return gameData;

    const bonusMissions =
      teams[teamLabel]?.missions.filter((m) => m.bonus) ?? [];

    const updatedCompletedMissions = { ...teamData.completedMissions };

    if (bonusMissions[0]) {
        updatedCompletedMissions[bonusMissions[0].id] =
          teamProgression.firstBonusMissionCompleted;
    }

    if (bonusMissions[1]) {
        updatedCompletedMissions[bonusMissions[1].id] =
          teamProgression.secondBonusMissionCompleted;
    }

    return {
        ...gameData,
        teamsFullProgression: {
            ...gameData.teamsFullProgression,
            [teamLabel]: {
                ...teamData,
                completedMissions: updatedCompletedMissions,
                teamProgression: {
                    ...teamData.teamProgressionDTO,
                    ...teamProgression,
                },
            },
        },
        allTeamsCompleted: allTeamsMissionsCompleted,
    };
}
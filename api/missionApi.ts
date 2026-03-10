import { put, get } from './apiClient'
import { TeamMissionsState } from "@/types/TeamMissionState";

export const changeTeamMissionState = async (lobbyCode: string, clientId: string, updateMissions: string[]) => {
    return await put(`/api/missions/${lobbyCode}`, { body: { clientId, updateMissions }});
};

export const getTeamMissionsState = async (
  lobbyCode: string,
  clientId: string
): Promise<TeamMissionsState> => {
    const response = await get(`/api/missions/${lobbyCode}/${clientId}`);

    if (!response) {
        return {
            teamFullProgression: {
                completedMissions: {},
                teamProgression: {
                    classicMissionPercentage: 0,
                    firstBonusMissionCompleted: false,
                    secondBonusMissionCompleted: false,
                },
            },
        };
    }

    return response as TeamMissionsState;
};

export const getTeamProgression = async (lobbyCode: string) => {
    return await get(`/api/missions/${lobbyCode}`);
};
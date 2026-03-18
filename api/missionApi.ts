import { put, get, post } from './apiClient'
import { TeamMissionsState } from "@/types/TeamMissionState";

export const changeTeamMissionState = async (
    lobbyCode: string,
    id: string,
    updateMissions: string[],
    teamLabel?: string
) => {
    return await put(`/api/missions/${lobbyCode}`, {
        body: {
            id,
            teamLabel,
            updateMissions,
        },
    });
};

export const getTeamMissionsState = async (
  lobbyCode: string,
  clientId: string
): Promise<TeamMissionsState> => {
    const response = await get(`/api/missions/${lobbyCode}?clientId=${clientId}`);

    if (!response) {
        return {
            teamFullProgression: {
                completedMissions: {},
                teamProgression: {
                    classicMissionsCompleted: 0,
                    firstBonusMissionCompleted: false,
                    secondBonusMissionCompleted: false,
                },
            },
        };
    }

    return response as TeamMissionsState;
};

export const getGameInfo = async (lobbyCode: string) => {
    return await get(`/api/missions/${lobbyCode}`);
};

export const endMission = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/missions/${lobbyCode}/end`, {
        body: { hostId }
    });
};
import { put, get, post } from './apiClient'
import {TeamProgression} from "@/types/TeamData";

export const changeTeamMissionState = async (
    lobbyCode: string,
    id: string,
    updateMissions: string[],
    teamLabel?: string
) => {
    return await put(`/api/missions/${lobbyCode}`, {
        body: {
            id,
            updateMissions,
            teamLabel,
        },
    });
};

export const getTeamFullProgression = async (
  lobbyCode: string,
  clientId: string
): Promise<TeamProgression> => {
    const response = await get(`/api/missions/${lobbyCode}/team?clientId=${clientId}`);

    if (!response) {
        return {
            completedMissions: {},
            teamProgressionDTO: {
                teamLabel: "",
                classicMissionsCompleted: 0,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
                allTeamsMissionsCompleted: false
            }
        }

    }

    return response as TeamProgression;
};

export const getTeamsFullProgression = async (lobbyCode: string) => {
    return await get(`/api/missions/${lobbyCode}`);
};

export const endMission = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/missions/${lobbyCode}/end`, {
        body: { hostId }
    });
};
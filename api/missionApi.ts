import { put, get } from './apiClient'

export const changeTeamMissionState = async (lobbyCode: string, clientId: string, updateMissions: string[]) => {
    return await put(`/api/missions/${lobbyCode}`, { body: { clientId, updateMissions }});
};

export const getTeamMissionsState = async (lobbyCode: string, clientId: string)=> {
    return get(`/api/missions/${lobbyCode}/${clientId}`);
};

export const getTeamProgression = async (lobbyCode: string) => {
    return await get(`/api/missions/${lobbyCode}`);
};
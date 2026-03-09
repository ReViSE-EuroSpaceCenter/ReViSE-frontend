import { put, get } from './apiClient'

export const changeTeamMissionState = async (lobbyCode: string, clientId: string, updateMissions: string[]) => {
    return await put(`/api/games/${lobbyCode}/missions`, { body: { clientId, updateMissions }});
};

export const getTeamMissionsState = async (lobbyCode: string, clientId: string)=> {
    return get(`/api/games/${lobbyCode}/${clientId}/missions`);
};

export const getTeamProgression = async (lobbyCode: string) => {
    return await get(`/api/games/${lobbyCode}`);
};
import { post } from './apiClient'


export const createLobby = async (numberOfTeams: number) => {
	return (await post(`/api/lobbies`, { body: { numberOfTeams } }));
}

export const joinLobby = async (lobbyCode: string) => {
	return await post(`/api/lobbies/${lobbyCode}/join`, { body: {} });
}

export const assignTeam = async (
	lobbyCode: string,
	clientId: string,
	teamLabel: string
) => {
	return await post(`/api/lobbies/${lobbyCode}/team`, { body: { clientId, teamLabel} });
};

export const completeMission = async (lobbyCode: string, clientId: string, missionNumber: string) => {
    return await post(`/api/games/${lobbyCode}/complete`, {
        body: {
            clientId,
            missionNumber,
            resources: {
                ENERGY: 0,
                HUMAN: 0,
            },
        },
    });
};


export const startLobby = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/lobbies/${lobbyCode}/start`, {body: { hostId }});
};

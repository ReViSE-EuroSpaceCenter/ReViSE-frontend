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
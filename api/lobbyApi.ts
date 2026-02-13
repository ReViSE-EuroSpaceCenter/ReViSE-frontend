import { post } from './apiClient'


export const createLobby = async () => {
	return (await post("/api/lobbies", { body: {} })).lobbyCode;
}

export const joinLobby = async (lobbyCode: string) => {
	return await post(`/api/lobbies/${lobbyCode}/join?teamLabel=MEDI`, { body: {} });
}

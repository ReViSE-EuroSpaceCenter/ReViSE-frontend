import { post } from './apiClient'


export const createLobby = async () => {
	return (await post("/api/lobbies", { body: {} })).lobbyCode;
}
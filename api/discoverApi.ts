import {get, post} from "@/api/apiClient";

export const getScore = async (lobbyCode: string, hostId: string) => {
	return await get(`/api/discover/${lobbyCode}/score`, { params: { hostId } });
}

export const endGame = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/discover/${lobbyCode}/endGame`, {body: { hostId }});
};
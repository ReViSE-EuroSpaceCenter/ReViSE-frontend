import {get} from "@/api/apiClient";

export const getScore = async (lobbyCode: string, hostId: string) => {
	return await get(`/api/discover/${lobbyCode}/score`, { params: { hostId } });
}

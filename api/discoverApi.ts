import {get, put} from "@/api/apiClient";
import {TeamResources} from "@/types/TeamsResources";

export const getScore = async (lobbyCode: string, hostId: string) => {
	return await get(`/api/discover/${lobbyCode}/score`, { params: { hostId } });
}

export const updateResources = async (lobbyCode: string, clientId: string, r: TeamResources) => {
	await put(`/api/launchers/${lobbyCode}`, { body: { clientId, resources: r.resources } });
}
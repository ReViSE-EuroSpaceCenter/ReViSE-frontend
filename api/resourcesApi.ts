import { post, put } from "@/api/apiClient";
import {TeamResources} from "@/types/TeamsResources";

export const updateResources = async (lobbyCode: string, clientId: string, r: TeamResources) => {
	await post(`/api/resources/${lobbyCode}`, { body: { clientId, resources: r.resources } });
}

export const endResourceEncoding = async (lobbyCode: string, hostId: string) => {
	await put(`/api/resources/${lobbyCode}/end`, { body: { hostId } });
}
import {get, put} from "@/api/apiClient";

type ResourceType = "ENERGY" | "HUMAN" | "CLOCK";

type ResourcesPayload = {
	resources: Record<ResourceType, number>;
};

export const getScore = async (lobbyCode: string, hostId: string) => {
	return await get(`/api/launchers/${lobbyCode}/score`, { params: { hostId } });
}

export const updateResources = async (lobbyCode: string, clientId: string, r: ResourcesPayload) => {
	await put(`/api/launchers/${lobbyCode}`, { body: { clientId, resources: r.resources } });
}
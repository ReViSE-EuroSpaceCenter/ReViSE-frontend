import { post, put } from "@/api/apiClient";

type ResourceType = "ENERGY" | "HUMAN" | "CLOCK";

type ResourcesPayload = {
	resources: Record<ResourceType, number>;
};

export const updateResources = async (lobbyCode: string, clientId: string, r: ResourcesPayload) => {
	await post(`/api/resources/${lobbyCode}`, { body: { clientId, resources: r.resources } });
}

export const endResourceEncoding = async (lobbyCode: string, hostId: string) => {
	await put(`/api/resources/${lobbyCode}/end`, { body: { hostId } });
}
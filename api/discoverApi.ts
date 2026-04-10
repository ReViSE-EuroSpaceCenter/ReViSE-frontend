import {post, put} from "@/api/apiClient";

type ResourceType = "ENERGY" | "HUMAN" | "CLOCK";

type ResourcesPayload = {
	resources: Record<ResourceType, number>;
};

export const updateResources = async (lobbyCode: string, clientId: string, r: ResourcesPayload) => {
	await put(`/api/discover/${lobbyCode}`, { body: { clientId, resources: r.resources } });
}

export const endGame = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/discover/${lobbyCode}/endGame`, {body: { hostId }});
};
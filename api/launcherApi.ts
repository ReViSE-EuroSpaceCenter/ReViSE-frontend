import {put} from "@/api/apiClient";

type ResourceType = "ENERGY" | "HUMAN" | "CLOCK";

type ResourcesPayload = {
	resources: Record<ResourceType, number>;
};

export const updateResources = async (lobbyCode: string, clientId: string, r: ResourcesPayload) => {
	 await put(`/api/launchers/${lobbyCode}`, { body: { request: { clientId, resources: r.resources }} });
}
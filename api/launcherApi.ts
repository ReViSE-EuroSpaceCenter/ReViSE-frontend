import {get, post} from "@/api/apiClient";

export const getTeamsInfo = async (lobbyCode: string) => {
	return await get(`/api/launcher/${lobbyCode}`);
};

export const endLauncher = async (lobbyCode: string, hostId: string) => {
	await post(`/api/launcher/${lobbyCode}/end`, {
		body: { hostId }
	});
};
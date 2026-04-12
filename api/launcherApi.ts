import {get, post} from "@/api/apiClient";

export const endLauncher = async (lobbyCode: string, hostId: string) => {
	await post(`/api/launcher/${lobbyCode}/end`, {
		body: { hostId }
	});
};

export const getTeamsInfo = async (lobbyCode: string) => {
	return await get(`/api/launcher/${lobbyCode}`);
};

export const gameOver = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/launcher/${lobbyCode}/gameOver`, {body: { hostId }});
};
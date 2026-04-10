import {post} from "@/api/apiClient";

export const gameOver = async (lobbyCode: string, hostId: string) => {
    return await post(`/api/launcher/${lobbyCode}/gameOver`, {body: { hostId }});
};
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { joinLobby } from "@/api/lobbyApi";
import { ApiError } from "@/api/apiError";
import { showError } from "@/errors/getErrorMessage";

export const useJoinLobby = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (lobbyCode: string) => {
			const result = await joinLobby(lobbyCode);
			return { ...result, lobbyCode };
		},

		onSuccess: ({ clientId, lobbyCode }) => {
			sessionStorage.setItem("clientId", clientId);
			router.replace(`/student/game/${lobbyCode}/team`);
		},

		onError: (error) => {
			showError(error instanceof ApiError ? error.key : "");
		},
	});
};
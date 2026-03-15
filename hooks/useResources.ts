import {useMutation} from "@tanstack/react-query";
import {updateResources} from "@/api/launcherApi";
import {showError} from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";
import {useParams, useRouter} from "next/navigation";

export const useResources = () => {
	const router = useRouter();
	const params = useParams();
	const clientId =
		globalThis.window === undefined
			? null
			: sessionStorage.getItem("clientId");

	const lobbyCode = params.gameId as string;
	const teamName = params.teamName as string;

	return useMutation({
		mutationFn: async ({ resources, humans, time }: {
			resources: number;
			humans: number;
			time: number;
		}) => {
			const resourcesPayload = {
				resources: {
					ENERGY: resources || 0,
					HUMAN: humans || 0,
					CLOCK: time || 0,
				},
			};
			await updateResources(lobbyCode, clientId as string, resourcesPayload);
		},
		onSuccess: () => {
			router.push(`/student/game/${lobbyCode}/${teamName}/launcher`);
		},
		onError: (error) => {
			showError(error instanceof ApiError ? error.key : "");
		},
	});
}
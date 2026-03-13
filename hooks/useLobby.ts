import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {assignTeam, getLobbyInfo} from "@/api/lobbyApi";
import {showError} from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";
import {TeamInfo} from "@/types/TeamInfo";
import {useRouter} from "next/navigation";

export const useLobby = (lobbyCode: string) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const lobbyQuery = useQuery<TeamInfo>({
		queryKey: ["lobbyInfo", lobbyCode],
		queryFn: () => getLobbyInfo(lobbyCode),
		enabled: !!lobbyCode,
	});

	const joinTeamMutation = useMutation({
		mutationFn: ({ teamLabel, id }: { teamLabel: string, id: string }) =>
			assignTeam(lobbyCode, id, teamLabel),
		onSuccess: (_, { teamLabel }) => {
			queryClient.setQueryData(["lobbyInfo", lobbyCode], (oldData: TeamInfo) => {
				if (!oldData) return oldData;
				return { ...oldData, availableTeams: oldData.availableTeams.filter(t => t !== teamLabel) };
			});
			router.replace(`?chosenTeam=${teamLabel}`);
		},
		onError: (err) => showError(err instanceof ApiError ? err.key : ""),
	});

	const handleJoinTeam = (teamLabel: string, availableTeams: string[], id: string) => {
		if (!availableTeams.includes(teamLabel)) return;
		joinTeamMutation.mutate({ teamLabel, id });
	};

	return { lobbyQuery, joinTeamMutation, handleJoinTeam };
};
import {useQueryClient} from "@tanstack/react-query";

export function useInvalidateMissions(queryKey: unknown[]) {
	const queryClient = useQueryClient();

	return () =>
		queryClient.invalidateQueries({
			queryKey,
		});
}
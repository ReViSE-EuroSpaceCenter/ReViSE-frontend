import { useMemo } from "react";
import { teams } from "@/types/Teams";

export function useMission(teamName: string) {
	const missions = useMemo(
		() => teams[teamName]?.missions ?? [],
		[teamName]
	);

	const missionMap = useMemo(
		() => Object.fromEntries(missions.map((m) => [m.id, m])),
		[missions]
	);

	const projectIds = useMemo(
		() =>
			[...new Set(missions.map((m) => m.projectId))].sort(
				(a, b) => a - b
			),
		[missions]
	);

	const totalMissionCount = useMemo(
		() => missions.filter((m) => !m.bonus).length,
		[missions]
	);

	return {
		missions,
		missionMap,
		projectIds,
		totalMissionCount,
	};
}
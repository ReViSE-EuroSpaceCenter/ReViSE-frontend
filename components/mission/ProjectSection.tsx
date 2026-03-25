import { useMemo } from "react";
import { teams } from "@/types/Teams";
import { MissionStructure } from "@/components/mission/MissionStructure";

type Mission = (typeof teams)[keyof typeof teams]["missions"][number];
type Missions = Mission[];

type ProjectSectionProps = Readonly<{
	projectId: number;
	missions: Missions;
	missionMap: Record<number, Mission>;
	isBonus1Completed: boolean;
	isBonus2Completed: boolean;
	completedMissions: Record<number, boolean>;
	onMissionUpdated: () => Promise<void>;
}>;

const getProjectRoots = (missions: Missions, projectId: number): Mission[] => {
	const projectMissions = missions.filter(
		(mission) => mission.projectId === projectId
	);

	const unlockedIds = new Set<number>();
	for (const mission of projectMissions) {
		mission.unlocks.forEach((id) => unlockedIds.add(id));
	}

	return projectMissions.filter((mission) => !unlockedIds.has(mission.id));
}

export function ProjectSection({
																 projectId,
																 missions,
																 missionMap,
																 isBonus1Completed,
																 isBonus2Completed,
																 completedMissions,
																 onMissionUpdated,
															 }: ProjectSectionProps) {
	const roots = useMemo(
		() => getProjectRoots(missions, projectId),
		[missions, projectId]
	);

	return (
		<div className="grid grid-cols-1 xl:grid-cols-[110px_1fr] 2xl:grid-cols-[140px_1fr] gap-2 sm:gap-3 lg:gap-4 items-center flex-1 min-h-0">
			<div className="min-w-0 shrink-0">
				<h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
					Projet {projectId}
				</h2>
			</div>

			<div className="w-full min-h-0 py-2 overflow-x-auto">
				<div className="flex flex-row items-center gap-0 min-w-max">
					{roots.map((root) => (
						<MissionStructure
							key={root.id}
							mission={root}
							missionMap={missionMap}
							isBonus1Completed={isBonus1Completed}
							isBonus2Completed={isBonus2Completed}
							completedMissions={completedMissions}
							onMissionUpdated={onMissionUpdated}
							isUnlocked
						/>
					))}
				</div>
			</div>
		</div>
	);
}
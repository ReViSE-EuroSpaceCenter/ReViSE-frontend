export type TeamMissionsState = {
	teamFullProgression: {
		completedMissions: Record<string, boolean>;
		teamProgression: {
			classicMissionPercentage: number;
			firstBonusMissionCompleted: boolean;
			secondBonusMissionCompleted: boolean;
		};
	};
};
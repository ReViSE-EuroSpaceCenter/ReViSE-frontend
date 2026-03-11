export type TeamMissionsState = {
	teamFullProgression: {
		completedMissions: Record<string, boolean>;
		teamProgression: {
			classicMissionsCompleted: number;
			firstBonusMissionCompleted: boolean;
			secondBonusMissionCompleted: boolean;
		};
	};
};
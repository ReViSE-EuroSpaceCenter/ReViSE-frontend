export type WSEventType =
	| { type: "GAME_STARTED" }
	| { type: "CLIENT_JOINED" }
	| { type: "TEAM_JOINED"; payload: { teamLabel: string } }
	| {
			type: "TEAM_PROGRESSION";
			payload: {
				allTeamsMissionsCompleted: boolean;
				teamProgression: {
					teamLabel: string;
					classicMissionsCompleted: number;
					firstBonusMissionCompleted: boolean;
					secondBonusMissionCompleted: boolean;
				};
			};
		}
	| { type: "MISSION_ENDED"}
	| { type: "RESSOURCES_ENCODED"};
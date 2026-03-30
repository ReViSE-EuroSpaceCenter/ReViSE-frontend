export type TeamData = {
    id: number;
    team: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

type TeamProgressionDTO = {
    teamLabel: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
    allTeamsMissionsCompleted: boolean;
};

export type TeamProgression = {
    completedMissions: Record<string, boolean>;
    teamProgressionDTO: TeamProgressionDTO;
};

export type TeamsFullProgression = {
    teamsFullProgression: Record<string, TeamProgression>;
    allTeamsCompleted: boolean;
};

export type TeamProgressionWS = {
    teamProgression: TeamProgressionDTO;
    allTeamsMissionsCompleted: boolean;
};
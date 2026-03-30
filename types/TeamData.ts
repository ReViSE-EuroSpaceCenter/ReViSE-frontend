export type TeamData = {
    id: number;
    team: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

type TeamProgression = {
    teamLabel: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
    allTeamsMissionsCompleted: boolean;
};

export type TeamFullProgression = {
    completedMissions: Record<string, boolean>;
    teamProgression: TeamProgression;
};

export type TeamsFullProgression = {
    teamsFullProgression: Record<string, TeamFullProgression>;
    allTeamsCompleted: boolean;
};

export type TeamProgressionWS = {
    teamProgression: TeamProgression;
    allTeamsMissionsCompleted: boolean;
};
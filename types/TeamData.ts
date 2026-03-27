export type TeamData = {
    id: number;
    team: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

type TeamProgressionResponse = {
    teamLabel: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

type TeamFullProgressionResponse = {
    completedMissions: Record<string, boolean>;
    teamProgression: TeamProgressionResponse;
};

export type GameInfoResponse = {
    allTeamsCompleted: boolean;
    teamsFullProgression: Record<string, TeamFullProgressionResponse>;
};

export type TeamProgressionWS = {
    teamProgression: TeamProgressionResponse;
    allTeamsMissionsCompleted: boolean;
};
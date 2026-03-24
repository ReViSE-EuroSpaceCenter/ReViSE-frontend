export type Mission = {
    id: number;
    title: string;
    bonus?: boolean;
    projectId: number;
    unlocks: number[];
};

export type Team = {
    name: string;
    missions: Mission[];
};


export type TeamStats = {
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

export interface TeamProgressionResponse extends TeamStats {
    teamLabel: string;
}

export interface TeamFullProgressionResponse {
    completedMissions: Record<string, boolean>;
    teamProgression: TeamProgressionResponse;
}

export interface GameInfoResponse {
    allTeamsCompleted: boolean;
    teamsFullProgression: Record<string, TeamFullProgressionResponse>;
}

export type TeamProgressionWS = {
    teamProgression: TeamProgressionResponse;
    allTeamsMissionsCompleted: boolean;
};
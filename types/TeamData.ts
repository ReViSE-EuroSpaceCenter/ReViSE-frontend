export interface TeamData {
    id: number;
    team: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
}

type TeamStats = {
    teamLabel: string;
    classicMissionsCompleted: number;
    firstBonusMissionCompleted: boolean;
    secondBonusMissionCompleted: boolean;
};

type TeamFullProgression = {
    completedMissions: Record<string, boolean>;
    teamProgression: TeamStats;
};

export type GameInfoResponse = {
    allTeamsCompleted: boolean;
    teamsFullProgression: Record<string, TeamFullProgression>;
};
enum ResourceType {
    HUMAN = "HUMAN",
    TIME = "TIME",
    ENERGY = "ENERGY",
}

export interface TeamResources {
    resources: Record<ResourceType, number>;
}

export type TeamsResources = {
    teamsResources: Record<string, TeamResources>;
    totalScore: number;
}
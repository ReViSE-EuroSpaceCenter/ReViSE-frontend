enum ResourceType {
    HUMAN = "HUMAN",
    CLOCK = "CLOCK",
    ENERGY = "ENERGY",
}

export interface TeamResources {
    resources: Record<ResourceType, number>;
}

export type TeamsResources = {
    teamsResources: Record<string, TeamResources>;
    totalScore: number;
}
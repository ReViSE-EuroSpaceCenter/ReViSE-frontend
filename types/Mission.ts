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

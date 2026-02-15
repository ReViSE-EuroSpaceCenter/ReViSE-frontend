export type Mission = {
    id: number;
    title: string;
    badge: string;
    bonus?: boolean;
};

export type Team = {
    name: string;
    missions: Mission[];
};

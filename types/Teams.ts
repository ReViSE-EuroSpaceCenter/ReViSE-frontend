import { Team } from "@/types/Mission";
export const teams: Record<string, Team> = {
    COOP: {
        name: "COOP",
        missions: [
            { id: 1, title: "Mission 1", projectId: 1, unlocks: [2] },
            { id: 2, title: "Mission 2", projectId: 1, unlocks: [8, 3] },
            { id: 3, title: "Mission 3", projectId: 1, unlocks: [4] },
            { id: 4, title: "Mission 4", projectId: 1, unlocks: [5] },
            { id: 5, title: "Mission 5", projectId: 1, unlocks: [] },
            { id: 6, title: "Mission 6", projectId: 3, unlocks: [7] },
            { id: 7, title: "Mission 7", projectId: 3, unlocks: [] },
            { id: 8, title: "Mission Bonus 1", projectId: 1, bonus: true, unlocks: [] },
            { id: 9, title: "Mission Bonus 2", projectId: 2, bonus: true, unlocks: [] },
        ],
    },

    MECA: {
        name: "MECA",
        missions: [
            { id: 1, title: "Mission 1", projectId: 1, unlocks: [2] },
            { id: 2, title: "Mission 2", projectId: 1, unlocks: [3] },
            { id: 3, title: "Mission 3", projectId: 1, unlocks: [9, 4] },
            { id: 4, title: "Mission 4", projectId: 1, unlocks: [] },
            { id: 5, title: "Mission 5", projectId: 2, unlocks: [6, 7] },
            { id: 6, title: "Mission 6", projectId: 2, unlocks: [] },
            { id: 7, title: "Mission 7", projectId: 2, unlocks: [] },
            { id: 8, title: "Mission 8", projectId: 3, unlocks: [] },
            { id: 9, title: "Mission Bonus 1", projectId: 1, bonus: true, unlocks: [] },
            { id: 10, title: "Mission Bonus 2", projectId: 4, bonus: true, unlocks: [] },
        ],
    },

    GECO: {
        name: "GECO",
        missions: [
            { id: 1, title: "Mission 1", projectId: 1, unlocks: [2] },
            { id: 2, title: "Mission 2", projectId: 1, unlocks: [3] },
            { id: 3, title: "Mission 3", projectId: 1, unlocks: [4, 5] },
            { id: 4, title: "Mission 4", projectId: 1, unlocks: [] },
            { id: 5, title: "Mission 5", projectId: 1, unlocks: [8] },
            { id: 6, title: "Mission 6", projectId: 2, unlocks: [] },
            { id: 7, title: "Mission 7", projectId: 3, unlocks: [] },
            { id: 8, title: "Mission Bonus 1", projectId: 1, bonus: true, unlocks: [] },
            { id: 9, title: "Mission Bonus 2", projectId: 4, bonus: true, unlocks: [] },
        ],
    },

    AERO: {
        name: "AERO",
        missions: [
            { id: 1, title: "Mission 1", projectId: 1, unlocks: [2] },
            { id: 2, title: "Mission 2", projectId: 1, unlocks: [3] },
            { id: 3, title: "Mission 3", projectId: 1, unlocks: [4, 8] },
            { id: 4, title: "Mission 4", projectId: 1, unlocks: [] },
            { id: 5, title: "Mission 5", projectId: 2, unlocks: [] },
            { id: 6, title: "Mission 6", projectId: 3, unlocks: [] },
            { id: 7, title: "Mission 7", projectId: 4, unlocks: [9] },
            { id: 8, title: "Mission Bonus 1", projectId: 1, bonus: true, unlocks: [] },
            { id: 9, title: "Mission Bonus 2", projectId: 2, bonus: true, unlocks: [] },
        ],
    },

    EXPE: {
        name: "EXPE",
        missions: [
            { id: 1, title: "Mission 1", projectId: 1, unlocks: [2] },
            { id: 2, title: "Mission 2", projectId: 1, unlocks: [3] },
            { id: 3, title: "Mission 3", projectId: 1, unlocks: [4, 5] },
            { id: 4, title: "Mission 4", projectId: 1, unlocks: [8] },
            { id: 5, title: "Mission 5", projectId: 1, unlocks: [] },
            { id: 6, title: "Mission 6", projectId: 2, unlocks: [] },
            { id: 7, title: "Mission 7", projectId: 4, unlocks: [] },
            { id: 8, title: "Mission Bonus 1", projectId: 1, bonus: true, unlocks: [] },
            { id: 9, title: "Mission Bonus 2", projectId: 3, bonus: true, unlocks: [] },
        ],
    },

    MEDI: {
        name: "MEDI",
        missions: [
            { id: 1, title: "Mission 1", projectId: 1, unlocks: [2] },
            { id: 2, title: "Mission 2", projectId: 1, unlocks: [3] },
            { id: 3, title: "Mission 3", projectId: 1, unlocks: [4, 6] },
            { id: 4, title: "Mission 4", projectId: 1, unlocks: [5] },
            { id: 5, title: "Mission 5", projectId: 1, unlocks: [] },
            { id: 6, title: "Mission 6", projectId: 1, unlocks: [] },
            { id: 7, title: "Mission 7", projectId: 2, unlocks: [] },
            { id: 8, title: "Mission Bonus 1", projectId: 3, bonus: true, unlocks: [] },
            { id: 9, title: "Mission Bonus 2", projectId: 4, bonus: true, unlocks: [] },
        ],
    },


};

import { Team } from "@/types/mission";

export const teams: Record<string, Team> = {
    MECA: {
        name: "MECA",
        missions: [
            { id: 1, title: "Mission 1", badge: "/badges/m1.png" },
            { id: 2, title: "Mission 2", badge: "/badges/m2.png" },
            { id: 3, title: "Mission 3", badge: "/badges/m3.png" },
            { id: 4, title: "Bonus 1", badge: "/badges/meca/mecaBN1.png", bonus: true },
            { id: 5, title: "Mission 4", badge: "/badges/m4.png" },
            { id: 6, title: "Mission 5", badge: "/badges/m5.png" },
            { id: 7, title: "Mission 6", badge: "/badges/m6.png" },
            { id: 8, title: "Mission 7", badge: "/badges/m7.png" },
            { id: 9, title: "Bonus 2", badge: "/badges/meca/mecaBN2.png", bonus: true },
        ],
    },


};

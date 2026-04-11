import { describe, it, expect, vi, beforeEach } from "vitest";

import { missionNameTraduction } from "@/utils/missionName";
import {getProjectMissionsToUpdate, updateTeamProgression} from "@/utils/missionUpdate";

vi.mock("@/utils/missionName", () => ({
    missionNameTraduction: vi.fn(),
}));

describe("getProjectMissionsToUpdate", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMission = (id: number, bonus = false, unlocks: number[] = []) => ({
        id,
        bonus,
        unlocks,
    });

    it("retourne la mission si elle n'est pas complétée", () => {
        const mission = createMission(1);
        vi.mocked(missionNameTraduction).mockReturnValue("M1");

        const result = getProjectMissionsToUpdate(
            mission as any,
            {},
            { M1: false },
            "MECA",
            false,
            false
        );

        expect(result).toEqual(["M1"]);
    });

    it("retourne la mission et ses dépendances si complétée", () => {
        const m1 = createMission(1, false, [2]);
        const m2 = createMission(2);

        vi.mocked(missionNameTraduction)
            .mockReturnValueOnce("M1")
            .mockReturnValueOnce("M1")
            .mockReturnValueOnce("M2");

        const result = getProjectMissionsToUpdate(
            m1 as any,
            { 2: m2 as any },
            { M1: true, M2: true },
            "MECA",
            false,
            false
        );

        expect(result).toContain("M1");
        expect(result).toContain("M2");
    });

    it("ignore les missions non complétées dans la chaîne", () => {
        const m1 = createMission(1, false, [2]);
        const m2 = createMission(2);

        vi.mocked(missionNameTraduction)
            .mockReturnValueOnce("M1")
            .mockReturnValueOnce("M1")
            .mockReturnValueOnce("M2");

        const result = getProjectMissionsToUpdate(
            m1 as any,
            { 2: m2 as any },
            { M1: true, M2: false },
            "MECA",
            false,
            false
        );

        expect(result).toEqual(["M1"]);
    });

    it("gère BONUS_1 correctement", () => {
        const mission = createMission(1, true);
        vi.mocked(missionNameTraduction).mockReturnValue("BONUS_1");

        const result = getProjectMissionsToUpdate(
            mission as any,
            {},
            {},
            "MECA",
            true,
            false
        );

        expect(result).toContain("BONUS_1");
    });

    it("gère BONUS_2 correctement", () => {
        const mission = createMission(1, true);
        vi.mocked(missionNameTraduction).mockReturnValue("BONUS_2");

        const result = getProjectMissionsToUpdate(
            mission as any,
            {},
            {},
            "MECA",
            false,
            true
        );

        expect(result).toContain("BONUS_2");
    });
});

describe("updateTeamProgression", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    vi.mock("@/types/Teams", () => ({
        teams: {
            MECA: {
                missions: [
                    { id: "BONUS_1", bonus: true },
                    { id: "BONUS_2", bonus: true },
                ],
            },
        },
    }));

    it("retourne gameData inchangé si undefined", () => {
        const result = updateTeamProgression(undefined, {} as any);

        expect(result).toBeUndefined();
    });

    it("met à jour les bonus missions", () => {
        const gameData = {
            teamsFullProgression: {
                MECA: {
                    completedMissions: {
                        BONUS_1: false,
                        BONUS_2: false,
                    },
                    teamProgression: {},
                },
            },
        };

        const payload = {
            teamProgression: {
                teamLabel: "MECA",
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: false,
            },
            allTeamsMissionsCompleted: true,
        };

        const result = updateTeamProgression(gameData as any, payload as any);

        expect(
            result?.teamsFullProgression.MECA.completedMissions.BONUS_1
        ).toBe(true);

        expect(
            result?.teamsFullProgression.MECA.completedMissions.BONUS_2
        ).toBe(false);
    });

    it("met à jour allTeamsCompleted", () => {
        const gameData = {
            teamsFullProgression: {
                MECA: {
                    completedMissions: {},
                    teamProgression: {},
                },
            },
        };

        const payload = {
            teamProgression: {
                teamLabel: "MECA",
            },
            allTeamsMissionsCompleted: true,
        };

        const result = updateTeamProgression(gameData as any, payload as any);

        expect(result?.allTeamsCompleted).toBe(true);
    });

    it("ne crash pas si team inconnue", () => {
        const gameData = {
            teamsFullProgression: {},
        };

        const payload = {
            teamProgression: {
                teamLabel: "UNKNOWN",
            },
            allTeamsMissionsCompleted: false,
        };

        const result = updateTeamProgression(gameData as any, payload as any);

        expect(result).toEqual(gameData);
    });
});
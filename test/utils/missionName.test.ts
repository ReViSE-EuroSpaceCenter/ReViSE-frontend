import { describe, it, expect } from "vitest";
import { missionNameTraduction } from "@/utils/missionName";
import {Mission} from "@/types/Mission";

describe("missionNameTraduction", () => {
	const makeMission = (id: number, bonus = false): Mission => ({
		id,
		bonus,
		title: `Mission ${id}`,
		projectId: 1,
		unlocks: [],
	});

	it("retourne CLASSIC_x si mission n'a pas de bonus", () => {
		expect(missionNameTraduction(makeMission(5, false), "MECA")).toBe("CLASSIC_5");
		expect(missionNameTraduction(makeMission(12, false), "EXPE")).toBe("CLASSIC_12");
	});

	it("MECA : id=9 → BONUS_1", () => {
		expect(missionNameTraduction(makeMission(9, true), "MECA")).toBe("BONUS_1");
	});

	it("MECA : id=10 → BONUS_2", () => {
		expect(missionNameTraduction(makeMission(10, true), "MECA")).toBe("BONUS_2");
	});

	it("autres équipes : id=8 → BONUS_1", () => {
		expect(missionNameTraduction(makeMission(8, true), "EXPE")).toBe("BONUS_1");
		expect(missionNameTraduction(makeMission(8, true), "AERO")).toBe("BONUS_1");
	});

	it("autres équipes : id=9 → BONUS_2", () => {
		expect(missionNameTraduction(makeMission(9, true), "EXPE")).toBe("BONUS_2");
		expect(missionNameTraduction(makeMission(9, true), "GECO")).toBe("BONUS_2");
	});

	it("retourne CLASSIC_x si aucune règle bonus ne correspond", () => {
		expect(missionNameTraduction(makeMission(11, true), "MECA")).toBe("CLASSIC_11");
		expect(missionNameTraduction(makeMission(7, true), "EXPE")).toBe("CLASSIC_7");
	});
});

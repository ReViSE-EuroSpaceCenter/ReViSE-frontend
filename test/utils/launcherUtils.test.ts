import { describe, it, expect } from "vitest";
import { getBonusKey, parseBonusId } from "@/utils/launcherUtils";

describe("launcherUtils", () => {
	describe("getBonusKey", () => {
		it("retourne firstBonusMissionCompleted quand nb = '1'", () => {
			expect(getBonusKey("1")).toBe("firstBonusMissionCompleted");
		});

		it("retourne secondBonusMissionCompleted quand nb != '1'", () => {
			expect(getBonusKey("2")).toBe("secondBonusMissionCompleted");
			expect(getBonusKey("9")).toBe("secondBonusMissionCompleted");
			expect(getBonusKey("0")).toBe("secondBonusMissionCompleted");
		});
	});

	describe("parseBonusId", () => {
		it("extrait correctement team et nb", () => {
			expect(parseBonusId("MECA1")).toEqual({ team: "MECA", nb: "1" });
			expect(parseBonusId("EXPE2")).toEqual({ team: "EXPE", nb: "2" });
			expect(parseBonusId("AERO9")).toEqual({ team: "AERO", nb: "9" });
		});

		it("fonctionne même avec des ids inattendus", () => {
			expect(parseBonusId("TEST7")).toEqual({ team: "TEST", nb: "7" });
			expect(parseBonusId("ABCD3")).toEqual({ team: "ABCD", nb: "3" });
		});
	});
});

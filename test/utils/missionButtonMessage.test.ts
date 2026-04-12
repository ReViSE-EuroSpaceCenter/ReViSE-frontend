import { describe, it, expect } from "vitest";
import {getBonusMissionModalMessage, getClassicMissionModalMessage} from "@/utils/missionButtonMessage";

describe("MissionButtonMessage", () => {
	describe("getBonusMissionModalMessage", () => {
		it("retourne le message de validation quand isCompleted = false", () => {
			expect(getBonusMissionModalMessage(false))
				.toBe("Voulez-vous valider cette mission bonus ?");
		});

		it("retourne le message d'invalidation quand isCompleted = true", () => {
			expect(getBonusMissionModalMessage(true))
				.toBe("Voulez-vous invalider cette mission bonus ?");
		});
	});

	describe("getClassicMissionModalMessage", () => {
		it("retourne le message de validation quand isCompleted = false", () => {
			expect(getClassicMissionModalMessage(false))
				.toBe("Voulez-vous valider cette mission ?");
		});

		it("retourne le message d'invalidation quand isCompleted = true", () => {
			expect(getClassicMissionModalMessage(true))
				.toBe("Voulez-vous invalider cette mission ?");
		});
	});
});

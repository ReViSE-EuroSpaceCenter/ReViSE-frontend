import { describe, it, expect } from "vitest";
import { calculate } from "@/utils/ProgressionCalcul";

// Tests pour la fonction calculate
describe("calculateCompleted", () => {
    it("returns 0 when progression is 0", () => {
        expect(calculate(0, 4)).toBe(0);
    });

    it("returns 2 when progression is 50% of 4 missions", () => {
        expect(calculate(50, 4)).toBe(2);
    });

    it("rounds correctly", () => {
        expect(calculate(33, 3)).toBe(1);
    });
});
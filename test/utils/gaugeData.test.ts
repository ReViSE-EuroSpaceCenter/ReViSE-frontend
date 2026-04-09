import { beforeEach, describe, expect, it, vi } from "vitest";
import { GAUGE_MAX_SCORE, SPECIES, STEPS, getStepsUpTo } from "@/utils/gaugeData";

async function loadGaugeDataWithRandom(randomValue: number) {
	vi.resetModules();
	const randomSpy = vi.spyOn(Math, "random").mockReturnValue(randomValue);
	const module = await import("@/utils/gaugeData");
	return { module, randomSpy };
}

describe("gaugeData", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("expose STEPS comme projection des étapes de SPECIES", () => {
		expect(STEPS).toEqual(SPECIES.map((species) => species.step));
	});

	it("retourne un tableau vide pour un score nul ou négatif", () => {
		expect(getStepsUpTo(0)).toEqual([]);
		expect(getStepsUpTo(-5)).toEqual([]);
	});

	it("ajoute les paliers atteints et la progression intermédiaire quand on est entre deux steps", () => {
		const steps = getStepsUpTo(4);

		expect(steps[0]).toBeCloseTo(1 / 6, 6);
		expect(steps[steps.length - 1]).toBeCloseTo(4 / GAUGE_MAX_SCORE, 6);
		expect(steps).toHaveLength(2);
	});

	it("ne rajoute pas la progression quand le score est exactement sur un step", () => {
		expect(getStepsUpTo(3)).toEqual([1 / 6]);
		expect(getStepsUpTo(6)).toEqual([1 / 6, 1 / 3]);
		expect(getStepsUpTo(18)).toEqual(STEPS);
	});

	it("respecte la tolérance autour d'un palier", () => {
		const almostOnStep = getStepsUpTo(3.01);
		expect(almostOnStep).toEqual([1 / 6]);

		const clearlyBetweenSteps = getStepsUpTo(3.2);
		expect(clearlyBetweenSteps).toHaveLength(2);
		expect(clearlyBetweenSteps[1]).toBeCloseTo(3.2 / GAUGE_MAX_SCORE, 6);
	});

	it("borne le ratio à 1 au-delà du score max", () => {
		expect(getStepsUpTo(99)).toEqual(STEPS);
	});

	it("génère 60 particules déterministes quand Math.random est figé", async () => {
		const { module, randomSpy } = await loadGaugeDataWithRandom(0);

		expect(module.PARTICLES).toHaveLength(60);
		expect(module.PARTICLES[0]).toMatchObject({
			id: "particle-0",
			angle: 0,
			distance: 100,
			size: 3,
			x: 100,
			y: 0,
		});
		expect(module.PARTICLES[15].x).toBeCloseTo(0, 10);
		expect(module.PARTICLES[15].y).toBeCloseTo(100, 10);

		randomSpy.mockRestore();
	});

	it("produit des valeurs plus grandes quand Math.random renvoie 1", async () => {
		const { module, randomSpy } = await loadGaugeDataWithRandom(1);

		expect(module.PARTICLES[0]).toMatchObject({
			distance: 160,
			size: 6,
		});

		randomSpy.mockRestore();
	});
});


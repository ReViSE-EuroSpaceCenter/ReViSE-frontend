export const GAUGE_MAX_SCORE = 18;

export const SPECIES = [
    { step: 1/6, label: "Checkpoint 1", svg: "/species/sucre.svg", text: "" },
    { step: 2/6, label: "Checkpoint 2", svg: "/species/adn.svg", text: "" },
    { step: 3/6, label: "Checkpoint 3", svg: "/species/bacterie.svg", text: "" },
    { step: 4/6, label: "Checkpoint 4", svg: "/species/species_3.svg", text: "" },
    { step: 5/6, label: "Checkpoint 5", svg: "/species/species_4.svg", text: "" },
    { step: 6/6, label: "Checkpoint 6", svg: "/species/species_5.svg", text: "" },
] as const;

export const STEPS = SPECIES.map(c => c.step);

export const PARTICLES = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * Math.PI * 2;
    const distance = 100 + Math.random() * 60;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 3 + Math.random() * 3;

    return { angle, distance, size, x, y };
});

export function getStepsUpTo(score: number): number[] {
    const ratio = Math.min(score / GAUGE_MAX_SCORE, 1);

    const reachedSteps = STEPS.filter(step => step <= ratio);
    const lastStep = reachedSteps.at(-1) ?? 0;
    const isExactlyOnStep = Math.abs(lastStep - ratio) < 0.001;

    return !isExactlyOnStep && ratio > 0
        ? [...reachedSteps, ratio]
        : reachedSteps;
}
export const GAUGE_MAX_SCORE = 15;

export const SPECIES = [
    { step: 0.2, label: "Checkpoint 1", svg: "/badges/checkpoints/checkpoint_1.svg", text: "" },
    { step: 0.4, label: "Checkpoint 2", svg: "/badges/checkpoints/checkpoint_2.svg", text: "" },
    { step: 0.6, label: "Checkpoint 3", svg: "/badges/checkpoints/checkpoint_3.svg", text: "" },
    { step: 0.8, label: "Checkpoint 4", svg: "/badges/checkpoints/checkpoint_4.svg", text: "" },
    { step: 1.0, label: "Checkpoint 5", svg: "/badges/checkpoints/checkpoint_5.svg", text: "" },
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
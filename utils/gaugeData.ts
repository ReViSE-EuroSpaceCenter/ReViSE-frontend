export const GAUGE_MAX_SCORE = 15;
export const GAUGE_STEPS = [0.2, 0.4, 0.6, 0.8, 1.0] as const;

export const SPECIES_MAP: Record<number, string> = {
    0.2: "/badges/checkpoints/checkpoint_1.svg",
    0.4: "/badges/checkpoints/checkpoint_2.svg",
    0.6: "/badges/checkpoints/checkpoint_3.svg",
    0.8: "/badges/checkpoints/checkpoint_4.svg",
    1.0: "/badges/checkpoints/checkpoint_5.svg"
};

export function getStepsUpTo(score: number): number[] {
    const ratio = Math.min(score / GAUGE_MAX_SCORE, 1);
    const fullSteps = GAUGE_STEPS.filter((s) => s <= ratio);

    const lastStep = fullSteps[fullSteps.length - 1] ?? 0;
    const isExactlyOnStep = Math.abs(lastStep - ratio) < 0.001;

    if (!isExactlyOnStep && ratio > 0) {
        return [...fullSteps, ratio];
    }

    return fullSteps;
}
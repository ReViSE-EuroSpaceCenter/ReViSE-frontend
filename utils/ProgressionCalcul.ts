export function calculate(
    progression: number,
    total: number
): number {
    return Math.round((progression / 100) * total);
}
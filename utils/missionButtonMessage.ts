export default function getMissionModalMessage(
    isBonus: boolean,
    isCompleted: boolean
): string {
    if (isBonus) {
        return isCompleted
            ? `Voulez-vous invalider cette mission bonus ?`
            : `Voulez-vous valider cette mission bonus ?`;
    } else {
        return isCompleted
            ? `Voulez-vous invalider cette mission ?`
            : `Voulez-vous valider cette mission ?`;
    }
}
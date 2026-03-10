export function getBonusMissionModalMessage(isCompleted: boolean): string {
    return isCompleted
      ? "Voulez-vous invalider cette mission bonus ?"
      : "Voulez-vous valider cette mission bonus ?";
}

export function getClassicMissionModalMessage(isCompleted: boolean): string {
    return isCompleted
      ? "Voulez-vous invalider cette mission ?"
      : "Voulez-vous valider cette mission ?";
}
export function getBonusKey(nb: string): "firstBonusMissionCompleted" | "secondBonusMissionCompleted" {
	return nb === "1" ? "firstBonusMissionCompleted" : "secondBonusMissionCompleted";
}

export function parseBonusId(id: string): { team: string; nb: string } {
	return { team: id.slice(0, 4), nb: id.slice(-1) };
}
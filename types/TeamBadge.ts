export type TeamBadgeStatus = "waiting" | "validated";

export type TeamBadgeItem = {
	label: string;
	status: TeamBadgeStatus;
};
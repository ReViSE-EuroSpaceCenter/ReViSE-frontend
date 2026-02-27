import type { ErrorKey } from "./errorKeys";

export const errorMessages: Record<ErrorKey, string> = {
	actionReservedToHost: "Cette action est réservée à l'hôte.",
	clientNotInLobby: "Vous n'êtes pas dans ce lobby.",
	clientAlreadyChooseTeam: "Vous avez déjà choisi une équipe.",
	gameNotFound: "Partie introuvable.",
	invalidLobbyCode: "Code de lobby invalide.",
	invalidMissionType: "Type de mission invalide.",
	invalidNumberOfTeams: "Nombre d'équipes invalide.",
	invalidTeamLabel: "Nom d'équipe invalide.",
	invalidTeamLabels: "Les noms d'équipes sont invalides.",
	invalidUuid: "Identifiant invalide.",
	lobbyNotFound: "Lobby introuvable.",
	onlyMecaCanCompleteClassic8: "Seul le rôle Meca peut compléter la mission Classic 8.",
	teamLabelAlreadyTaken: "Ce nom d'équipe est déjà utilisé.",
	teamNotFound: "Équipe introuvable."
};
export const ERROR_KEYS = {
	ACTION_RESERVED_TO_HOST: "actionReservedToHost",
	CLIENT_NOT_IN_LOBBY: "clientNotInLobby",
	CLIENT_ALREADY_CHOSE_TEAM: "clientAlreadyChooseTeam",
	GAME_NOT_FOUND: "gameNotFound",
	INVALID_LOBBY_CODE: "invalidLobbyCode",
	INVALID_MISSION_TYPE: "invalidMissionType",
	INVALID_NUMBER_OF_TEAMS: "invalidNumberOfTeams",
	INVALID_TEAM_LABEL: "invalidTeamLabel",
	INVALID_TEAM_LABELS: "invalidTeamLabels",
	INVALID_UUID: "invalidUuid",
	LOBBY_NOT_FOUND: "lobbyNotFound",
	ONLY_MECA_COMPLETE_CLASSIC_8: "onlyMecaCanCompleteClassic8",
	TEAM_LABEL_ALREADY_TAKEN: "teamLabelAlreadyTaken",
	TEAM_NOT_FOUND: "teamNotFound"
} as const;

export type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];
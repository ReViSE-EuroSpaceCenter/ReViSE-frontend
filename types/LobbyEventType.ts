export type LobbyEventType =
	| { type: "GAME_STARTED" }
	| { type: "CLIENT_JOINED" }
	| { type: "TEAM_JOINED"; payload: { teamLabel: string } }
	| { type: "TEAM_PROGRESSION"; payload: { teamLabel: string; percent: number } };
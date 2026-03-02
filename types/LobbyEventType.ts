export type LobbyEventType =
	| { type: "GAME_STARTED" }
	| { type: "CLIENT_JOINED" }
	| { type: "TEAM_JOINED"; payload: { teamLabel: string } };

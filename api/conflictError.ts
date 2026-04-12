export type Props = {
	code: string;
	lobby: string;
	isStudent: boolean;
	team?: string;
}

const routes = {
	LOBBY: (p: Props) =>
		p.isStudent
			? `/student/join`
			: `/teacher/game/${p.lobby}/setup`,
	MISSION: (p: Props) =>
		p.isStudent
			? `/student/game/${p.lobby}/${p.team}`
			: `/teacher/game/${p.lobby}`,
	LAUNCHER: (p: Props) =>
		p.isStudent
			? `/student/game/${p.lobby}/${p.team}/launcher`
			: `/teacher/game/${p.lobby}/launcher`,
	RESOURCE: (p: Props) =>
		p.isStudent
			? `/student/game/${p.lobby}/${p.team}/resources`
			: `/teacher/game/${p.lobby}/launcher?step=8`,
	DISCOVER: (p: Props) =>
		p.isStudent
			? `/student/game/${p.lobby}/${p.team}/discover`
			: `/teacher/game/${p.lobby}/discover`,
	END: () => `/`,
};

export const getRedirectUrlFromConflict = (props: Props) => {
	return routes[props.code as keyof typeof routes]?.(props) ?? null;
};

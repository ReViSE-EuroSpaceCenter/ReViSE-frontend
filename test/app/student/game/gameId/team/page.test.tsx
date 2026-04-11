import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import TeamPage from "@/app/student/game/[gameId]/team/page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
	useParams: () => ({ gameId: "ABC123" }),
	useRouter: () => ({ push: pushMock }),
	useSearchParams: () => ({
		get: vi.fn(() => null),
	}),
}));

vi.mock("@/hooks/useSessionId", () => ({
	useSessionId: () => "CLIENT123",
}));

const handleJoinTeamMock = vi.fn();

vi.mock("@/hooks/useLobby", () => ({
	useLobby: () => ({
		lobbyQuery: {
			data: {
				availableTeams: ["EXPE", "MECA"],
				allTeams: ["EXPE", "AERO", "MECA", "GECO"],
			},
			isLoading: false,
			isError: false,
		},
		handleJoinTeam: handleJoinTeamMock,
	}),
}));

vi.mock("@/hooks/useWSSubscription", () => ({
	useWSSubscription: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
	useQueryClient: () => ({ setQueryData: vi.fn() }),
}));


vi.mock("@/components/student/TeamButton", () => ({
	TeamButton: ({ team, isTaken, onJoin }: any) => (
		<button data-testid={`team-${team}`} disabled={isTaken} onClick={() => onJoin(team)}>
			{team}
		</button>
	),
}));

vi.mock("@/components/student/WaitForStartMissions", () => ({
	WaitForStartMissions: () => <div data-testid="wait-start" />,
}));

vi.mock("@/app/loading", () => ({
	default: () => <div data-testid="loading" />,
}));

describe("TeamPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("affiche les équipes disponibles", () => {
		render(<TeamPage />);

		expect(screen.getByTestId("team-EXPE")).toBeInTheDocument();
		expect(screen.getByTestId("team-AERO")).toBeInTheDocument();
		expect(screen.getByTestId("team-MECA")).toBeInTheDocument();
		expect(screen.getByTestId("team-GECO")).toBeInTheDocument();
	});

	it("désactive les équipes déjà prises", () => {
		render(<TeamPage />);

		expect(screen.getByTestId("team-AERO")).toBeDisabled();
		expect(screen.getByTestId("team-GECO")).toBeDisabled();
	});

	it("appelle handleJoinTeam lorsqu'on clique sur une équipe libre", () => {
		render(<TeamPage />);

		fireEvent.click(screen.getByTestId("team-EXPE"));

		expect(handleJoinTeamMock).toHaveBeenCalledWith(
			"EXPE",
			["EXPE", "MECA"],
			"CLIENT123"
		);
	});

});
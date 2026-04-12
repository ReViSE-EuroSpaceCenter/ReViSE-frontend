import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPage } from "@/test/utils/renderPage";
import { showError } from "@/errors/getErrorMessage";
import TeamPage from "@/app/student/game/[gameId]/team/page";

const pushMock = vi.fn();
const setQueryDataMock = vi.fn();
const handleJoinTeamMock = vi.fn();

let wsCallback: any;
let searchParamsMock: any;
let useLobbyMock: any;

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
    useParams: () => ({ gameId: "AZERTY" }),
    useSearchParams: () => searchParamsMock,
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@tanstack/react-query")>();
    return {
        ...actual,
        useQueryClient: () => ({
            setQueryData: setQueryDataMock,
        }),
    };
});

vi.mock("@/hooks/useSessionId", () => ({
    useSessionId: () => "1",
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/components/student/TeamButton", () => ({
    TeamButton: ({ team, onJoin }: any) => (
        <button onClick={() => onJoin(team)}>{team}</button>
    ),
}));

vi.mock("@/components/student/WaitForStartMissions", () => ({
    WaitForStartMissions: ({ chosenTeam }: any) => (
        <div>WAIT {chosenTeam}</div>
    ),
}));

vi.mock("@/app/loading", () => ({
    default: () => <div>Loading...</div>,
}));

vi.mock("@/hooks/useWSSubscription", () => ({
    useWSSubscription: (_: any, cb: any) => {
        wsCallback = cb;
    },
}));

vi.mock("@/hooks/useLobby", () => ({
    useLobby: (...args: any[]) => useLobbyMock(...args),
}));

describe("TeamPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        searchParamsMock = {
            get: vi.fn().mockReturnValue(null),
        };

        useLobbyMock = () => ({
            lobbyQuery: {
                data: {
                    availableTeams: ["MECA", "AERO"],
                    allTeams: ["MECA", "AERO", "MEDI", "GECO"],
                },
                isLoading: false,
                isError: false,
                error: null,
            },
            handleJoinTeam: handleJoinTeamMock,
        });
    });

    it("affiche loading", () => {
        useLobbyMock = () => ({
            lobbyQuery: { isLoading: true },
        });

        renderPage(<TeamPage />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("affiche une erreur", () => {
        useLobbyMock = () => ({
            lobbyQuery: {
                isLoading: false,
                isError: true,
                error: new Error("fail"),
            },
        });

        renderPage(<TeamPage />);

        expect(showError).toHaveBeenCalled();
    });

    it("affiche l'écran d'attente si équipe choisie", () => {
        searchParamsMock.get = vi.fn().mockReturnValue("MECA");

        renderPage(<TeamPage />);

        expect(screen.getByText(/wait meca/i)).toBeInTheDocument();
    });

    it("affiche les équipes", () => {
        renderPage(<TeamPage />);

        expect(screen.getByText("MEDI")).toBeInTheDocument();
        expect(screen.getByText("GECO")).toBeInTheDocument();
    });

    it("appelle handleJoinTeam au clic", async () => {
        renderPage(<TeamPage />);

        const button = screen.getByText("MEDI");

        await userEvent.click(button);

        expect(handleJoinTeamMock).toHaveBeenCalledWith(
            "MEDI",
            ["MECA", "AERO"],
            "1"
        );
    });

    it("met à jour les équipes via websocket", () => {
        renderPage(<TeamPage />);

        wsCallback({
            type: "TEAM_JOINED",
            payload: { teamLabel: "MECA" },
        });

        expect(setQueryDataMock).toHaveBeenCalled();
    });

    it("redirige quand le jeu démarre", () => {
        searchParamsMock.get = vi.fn().mockReturnValue("MECA");

        renderPage(<TeamPage />);

        wsCallback({
            type: "GAME_STARTED",
        });

        expect(pushMock).toHaveBeenCalledWith(
            "/student/game/AZERTY/MECA?presentation=true"
        );
    });
});
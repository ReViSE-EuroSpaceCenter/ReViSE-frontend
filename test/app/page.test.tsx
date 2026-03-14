import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi, beforeEach} from "vitest";
import Home from "@/app/page";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Dashboard from "@/app/teacher/game/[gameId]/page";

// ---------- Mocks ----------
const createLobbyMock = vi.fn();

vi.mock("@/api/lobbyApi", () => ({
    createLobby: (...args: any[]) => createLobbyMock(...args),
}));

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    useParams: () => ({ teamName: "MECA", gameId: "LOBBY123" }),
}));

const endMissionMock = vi.fn();
const getGameInfoMock = vi.fn();

vi.mock("@/api/missionApi", () => ({
    endMission: (...args: any[]) => endMissionMock(...args),
    getGameInfo: (...args: any[]) => getGameInfoMock(...args),
}));

vi.mock("@/contexts/WebSocketProvider", () => ({
    useWebSocket: () => ({
        connected: false,
        subscribe: vi.fn(),
    }),
}));

// ---------- Helpers ----------
function renderPage(ui: React.ReactNode) {
    const client = new QueryClient({
        defaultOptions: {
            queries: {retry: false},
            mutations: {retry: false},
        },
    });

    return render(
        <QueryClientProvider client={client}>
            {ui}
        </QueryClientProvider>
    );
}

// ---------- Tests ----------
describe("Home page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
        sessionStorage.setItem("hostId", "host123");

        getGameInfoMock.mockResolvedValue({
            allTeamsCompleted: true,
            teamsProgression: {
                TEAM1: {
                    teamLabel: "MECA",
                    classicMissionsCompleted: 8,
                    firstBonusMissionCompleted: false,
                    secondBonusMissionCompleted: false,
                },
            },
        });
    });

    it("affiche le contenu de la page d'accueil", () => {
        renderPage(<Home/>);

        expect(screen.getByText("Cap sur Europe")).toBeInTheDocument();
        expect(screen.getByText("Créer une partie")).toBeInTheDocument();
        expect(screen.getByText("Rejoindre une partie")).toBeInTheDocument();
    });

    it("clique sur Rejoindre une partie → router.push('/student/join')", async () => {
        const user = userEvent.setup();

        renderPage(<Home/>);

        await user.click(
            screen.getByRole("button", {name: "Rejoindre une partie"})
        );

        expect(pushMock).toHaveBeenCalledWith("/student/join");
    });

    it("clique sur Créer une partie → ouvre la modale", async () => {
        const user = userEvent.setup();

        renderPage(<Home/>);

        await user.click(
            screen.getByRole("button", {name: "Créer une partie"})
        );

        expect(
            screen.getByText("Choisissez le nombre d'équipes")
        ).toBeInTheDocument();
    });

    it("Créer une partie → 4 équipes → createLobby(4) + redirection", async () => {
        const user = userEvent.setup();

        createLobbyMock.mockResolvedValueOnce({
            lobbyCode: "ABC123",
            hostId: "host-xxx",
        });

        renderPage(<Home/>);

        await user.click(
            screen.getByRole("button", {name: "Créer une partie"})
        );

        await user.click(
            screen.getByRole("button", {name: "4 équipes"})
        );

        await waitFor(() => {
            expect(createLobbyMock).toHaveBeenCalledWith(4);
        });

        expect(sessionStorage.getItem("hostId")).toBe("host-xxx");

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith(
                "/teacher/game/ABC123/setup?nbTeams=4"
            );
        });
    });

    it("ferme la modale avec Annuler", async () => {
        const user = userEvent.setup();

        renderPage(<Home/>);

        await user.click(
            screen.getByRole("button", {name: "Créer une partie"})
        );

        expect(
            screen.getByText("Choisissez le nombre d'équipes")
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {name: "Annuler"})
        );

        await waitFor(() => {
            expect(
                screen.queryByText("Choisissez le nombre d'équipes")
            ).not.toBeInTheDocument();
        });
    });

    it("clique sur Continuer", async () => {
        const user = userEvent.setup();

        endMissionMock.mockResolvedValueOnce({});

        renderPage(<Dashboard />);

        const button = await screen.findByRole("button", {
            name: "Terminer les missions",
        });

        await user.click(button);

        const continueButton = screen.getByRole("button", { name: "Continuer" });

        await user.click(continueButton);

        await waitFor(() => {
            expect(endMissionMock).toHaveBeenCalled();
        });
    });
    it("clique sur Annuler", async () => {
        const user = userEvent.setup();

        renderPage(<Dashboard />);

        const button = await screen.findByRole("button", {
            name: "Terminer les missions",
        });

        await user.click(button);

        const cancelButton = screen.getByRole("button", { name: "Annuler" });

        await user.click(cancelButton);

        await waitFor(() => {
            expect(
                screen.queryByText(/Cette action est irréversible/i)
            ).not.toBeInTheDocument();
        });
        expect(endMissionMock).not.toHaveBeenCalled();
    });

    it("clique sur Terminer les missions → ouvre la modal de confirmation", async () => {
        const user = userEvent.setup();

        renderPage(<Dashboard />);

        const button = await screen.findByRole("button", {
            name: "Terminer les missions",
        });

        await user.click(button);

        expect(
            screen.queryByText(/Cette action est irréversible/i)
        ).toBeInTheDocument();
    });

    it("le bouton est désactivé si toutes les missions ne sont pas terminées", async () => {
        getGameInfoMock.mockResolvedValueOnce({
            allTeamsCompleted: false,
            teamsProgression: {},
        });

        renderPage(<Dashboard />);

        const button = await screen.findByRole("button", {
            name: "Terminer les missions",
        });

        expect(button).toBeDisabled();
    });
});
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi, beforeEach} from "vitest";
import NumberTeamSelector from "@/components/teacher/NumberTeamSelector";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// ---------- Mocks ----------
const createLobbyMock = vi.fn();

vi.mock("@/api/lobbyApi", () => ({
    createLobby: (...args: any[]) => createLobbyMock(...args),
}));

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({push: pushMock}),
}));

// ---------- Helpers ----------
function renderWithQuery(ui: React.ReactNode) {
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
describe("NumberTeamSelector", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    it("affiche la modale quand isOpen=true", () => {
        renderWithQuery(
            <NumberTeamSelector isOpen={true} onClose={() => {
            }}/>
        );

        expect(
            screen.getByText("Choisissez le nombre d'équipes")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {name: "4 équipes"})
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {name: "6 équipes"})
        ).toBeInTheDocument();
    });

    it("clique '4 équipes' -> appelle createLobby(4), stocke hostId et redirige", async () => {
        const user = userEvent.setup();

        createLobbyMock.mockResolvedValueOnce({
            lobbyCode: "ABC123",
            hostId: "host-xxx",
        });

        renderWithQuery(
            <NumberTeamSelector isOpen={true} onClose={() => {
            }}/>
        );

        await user.click(
            screen.getByRole("button", {name: "4 équipes"})
        );

        await waitFor(() => {
            expect(createLobbyMock).toHaveBeenCalledTimes(1);
            expect(createLobbyMock).toHaveBeenCalledWith(4);
        });

        expect(sessionStorage.getItem("hostId")).toBe("host-xxx");

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith(
                "/teacher/game/ABC123/setup?nbTeams=4"
            );
        });
    });

    it("clique 'Annuler' -> appelle onClose()", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        renderWithQuery(
            <NumberTeamSelector isOpen={true} onClose={onClose}/>
        );

        await user.click(
            screen.getByRole("button", {name: "Annuler"})
        );

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("clique '6 équipes' -> appelle createLobby(6) et redirige avec nbTeams=6", async () => {
        const user = userEvent.setup();

        createLobbyMock.mockResolvedValueOnce({
            lobbyCode: "XYZ999",
            hostId: "host-yyy",
        });

        renderWithQuery(
            <NumberTeamSelector isOpen={true} onClose={() => {
            }}/>
        );

        await user.click(
            screen.getByRole("button", {name: "6 équipes"})
        );

        await waitFor(() => {
            expect(createLobbyMock).toHaveBeenCalledWith(6);
        });

        expect(sessionStorage.getItem("hostId")).toBe("host-yyy");

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith(
                "/teacher/game/XYZ999/setup?nbTeams=6"
            );
        });
    });
});
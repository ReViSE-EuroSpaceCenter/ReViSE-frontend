import { screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi, beforeEach} from "vitest";
import Home from "@/app/page";
import {renderPage} from "@/test/utils/renderPage";

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
}));

// ---------- Helpers ----------
async function openCreateModal(user: ReturnType<typeof userEvent.setup>) {
    await user.click(
        screen.getByRole("button", { name: "Créer une partie" })
    );
}
// ---------- Tests ----------
describe("Home page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
        sessionStorage.setItem("hostId","host123");
    });

    it("affiche le contenu de la page d'accueil", () => {
        renderPage(<Home />);

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

        await openCreateModal(user);

        expect(
            screen.getByText("Choisissez le nombre d'équipes")
        ).toBeInTheDocument();
    });

    it.each([
        { teams: 4, lobbyCode: "ABC123", hostId: "host-xxx" },
        { teams: 6, lobbyCode: "DEF456", hostId: "host-yyy" }
    ])(
        "Créer une partie → $teams équipes",
        async ({ teams, lobbyCode, hostId }) => {

            const user = userEvent.setup();

            createLobbyMock.mockResolvedValueOnce({
                lobbyCode,
                hostId
            });

            renderPage(<Home />);

            await openCreateModal(user);

            await user.click(
                screen.getByRole("button", { name: `${teams} équipes` })
            );

            await waitFor(() => {
                expect(createLobbyMock).toHaveBeenCalledWith(teams);
            });

            expect(sessionStorage.getItem("hostId")).toBe(hostId);

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith(
                    `/teacher/game/${lobbyCode}/setup`
                );
            });

        }
    );

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
});
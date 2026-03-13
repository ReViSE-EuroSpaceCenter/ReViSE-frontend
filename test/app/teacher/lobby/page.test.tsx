import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LobbyPage from "@/app/teacher/game/[gameId]/setup/page";

// --- Mocks partagés entre tests
const pushMock = vi.fn();

// Callback WebSocket capturée ici pour pouvoir émettre des messages depuis le test
let onMessage: ((msg: { body: string }) => void) | null = null;

// API initiale: 0 équipe connectée (all == available)
vi.mock("@/lib/api/lobby", () => ({
    getLobbyInfo: vi.fn().mockResolvedValue({
        allTeams: ["AERO", "EXPE", "GECO", "MECA"],
        availableTeams: ["AERO", "EXPE", "GECO", "MECA"],
    }),
}));

// WebSocket: on capture la callback du subscribe
vi.mock("@/contexts/WebSocketProvider", () => ({
    __esModule: true,
    WebSocketProvider: ({ children }: any) => <>{children}</>,
    useWebSocket: () => ({
        connected: true,
        subscribe: vi.fn((_destinationType: "lobby" | "game", cb: (msg: any) => void) => {
            onMessage = cb; // on retient la callback pour l'utiliser dans le test
            return { unsubscribe: vi.fn() };
        }),
    }),
}));

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF" }),
    useSearchParams: () => new URLSearchParams("nbTeams=4"),
    useRouter: () => ({ push: pushMock, replace: vi.fn(), refresh: vi.fn() }),
}));

describe("LobbyPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        onMessage = null;
    });

    it("affiche le code du lobby et les équipes (état initial)", async () => {
        render(<LobbyPage />);

        const chars = [
            screen.getByTestId("lobby-code-char-0"),
            screen.getByTestId("lobby-code-char-1"),
            screen.getByTestId("lobby-code-char-2"),
            screen.getByTestId("lobby-code-char-3"),
            screen.getByTestId("lobby-code-char-4"),
            screen.getByTestId("lobby-code-char-5"),
        ];

        const displayed = chars.map((el) => el.textContent?.trim()).join("");
        expect(displayed).toBe("ABCDEF");

        const joinedTeams = screen.getByTestId("joinedTeams").textContent?.trim();
        const nbTeams = screen.getByTestId("nbTeams").textContent?.trim();

        expect(joinedTeams).toBe("0");
        expect(nbTeams).toBe("/ 4");

        // Bouton désactivé tant que 4 équipes ne sont pas connectées
        const button = screen.getByTestId("start-game-button");
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent(/En attente de toutes les équipes/i);
    });

    it("active le bouton 'DÉMARRER LA PARTIE' après 4 TEAM_JOINED via WebSocket", async () => {
        render(<LobbyPage />);

        // Attendre que le composant soit monté et que subscribe ait été appelé
        await waitFor(() => {
            expect(onMessage).toBeInstanceOf(Function);
        });

        // Émettre 4 événements TEAM_JOINED depuis le WebSocket mocké
        const emit = (type: string) => onMessage?.({ body: JSON.stringify({ type }) } as any);
        emit("TEAM_JOINED");
        emit("TEAM_JOINED");
        emit("TEAM_JOINED");
        emit("TEAM_JOINED");

        // Vérifier que le compteur affiche bien 4/4
        await waitFor(() => {
            expect(screen.getByTestId("joinedTeams").textContent?.trim()).toBe("4");
        });

        const button = screen.getByTestId("start-game-button");
        await waitFor(() => expect(button).not.toBeDisabled());
        expect(button).toHaveTextContent("DÉMARRER LA PARTIE");
    });

    it("redirige vers la page de jeu sur événement GAME_STARTED", async () => {
        render(<LobbyPage />);

        // S'assurer que la callback est prête
        await waitFor(() => {
            expect(onMessage).toBeInstanceOf(Function);
        });

        // Emettre l'événement GAME_STARTED
        onMessage?.({ body: JSON.stringify({ type: "GAME_STARTED" }) } as any);

        // Vérifier la redirection
        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/teacher/game/ABCDEF");
        });
    });
});
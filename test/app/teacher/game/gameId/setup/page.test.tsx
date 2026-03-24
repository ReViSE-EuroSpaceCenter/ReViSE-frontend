import {screen, waitFor} from "@testing-library/react";
import {describe, it, expect, vi, beforeEach} from "vitest";
import {act} from "react";
import LobbyPage from "@/app/teacher/game/[gameId]/setup/page";
import {renderPage} from "@/test/utils/renderPage";

// ---------- Mocks ----------
const pushMock = vi.fn();

let onMessage: ((msg: { body: string }) => void) | null = null;

vi.mock("@/lib/api/lobby", () => ({
    getLobbyInfo: vi.fn().mockResolvedValue({
        allTeams: ["AERO", "EXPE", "GECO", "MECA"],
        availableTeams: ["AERO", "EXPE", "GECO", "MECA"],
    }),
}));

vi.mock("sweetalert2", () => {
    return {
        default: {
            fire: vi.fn().mockResolvedValue({}),
        },
    };
});

vi.mock("@/contexts/WebSocketProvider", () => ({
    __esModule: true,
    WebSocketProvider: ({children}: any) => <>{children}</>,
    useWebSocket: () => ({
        connected: true,
        subscribe: vi.fn(
            (_destinationType: "lobby" | "game", cb: (msg: any) => void) => {
                onMessage = cb;
                return {unsubscribe: vi.fn()};
            }
        ),
    }),
}));

vi.mock("next/navigation", () => ({
    useParams: () => ({gameId: "ABCDEF"}),
    useSearchParams: () => new URLSearchParams("nbTeams=4"),
    useRouter: () => ({
        push: pushMock,
        replace: vi.fn(),
        refresh: vi.fn(),
    }),
}));

// ---------- Tests ----------
describe("LobbyPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        onMessage = null;
    });

    it("affiche le code du lobby et les équipes (état initial)", async () => {
        renderPage(<LobbyPage />);

        expect(
            screen.queryByText("Choisissez le nombre d'équipes")
        ).not.toBeInTheDocument();

        const chars = Array.from({length: 6}, (_, i) =>
            screen.getByTestId(`lobby-code-char-${i}`)
        );

        const displayed = chars.map((el) => el.textContent?.trim()).join("");
        expect(displayed).toBe("ABCDEF");

        expect(screen.getByTestId("joinedTeams").textContent?.trim()).toBe("0");

        const button = screen.getByTestId("start-game-button");
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent(/En attente de toutes les équipes/i);
    });

    it("active le bouton après 4 TEAM_JOINED via WebSocket", async () => {
        renderPage(<LobbyPage />);

        await waitFor(() => {
            expect(onMessage).toBeInstanceOf(Function);
        });

        await act(async () => {
            const emit = (type: string) =>
                onMessage?.({body: JSON.stringify({type})} as any);

            emit("TEAM_JOINED");
            emit("TEAM_JOINED");
            emit("TEAM_JOINED");
            emit("TEAM_JOINED");
        });

        await waitFor(() => {
            expect(
                screen.getByTestId("joinedTeams").textContent?.trim()
            ).toBe("4");
        });

        const button = screen.getByTestId("start-game-button");
        expect(button).not.toBeDisabled();
        expect(button).toHaveTextContent("DÉMARRER LA PARTIE");
    });

    it("redirige vers la page de jeu sur GAME_STARTED", async () => {
        renderPage(<LobbyPage />);

        await waitFor(() => {
            expect(onMessage).toBeInstanceOf(Function);
        });

        await act(async () => {
            onMessage?.({
                body: JSON.stringify({type: "GAME_STARTED"}),
            } as any);
        });

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/teacher/game/ABCDEF?presentation=true");
        });
    });
});
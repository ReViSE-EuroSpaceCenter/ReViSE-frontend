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
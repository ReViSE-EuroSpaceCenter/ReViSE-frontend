import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LobbyPage from "@/app/teacher/game/[gameId]/setup/page";

vi.mock("@/lib/api/lobby", () => ({
    getLobbyInfo: vi.fn().mockResolvedValue({
        allTeams: ["AERO", "EXPE", "GECO", "MECA"],
        availableTeams: ["AERO", "EXPE", "GECO", "MECA"],
    }),
}));

vi.mock("@/contexts/WebSocketProvider", () => {
    return {
        __esModule: true,
        WebSocketProvider: ({ children }: any) => <>{children}</>,
        useWebSocket: () => ({
            connected: true,
            subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
        }),
    };
});

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF" }),
    useSearchParams: () => new URLSearchParams("nbTeams=4"),
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

describe("LobbyPage", () => {
    it("affiche le code du lobby et les équipes", async () => {
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
    });


});
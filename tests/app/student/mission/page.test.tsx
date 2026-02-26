import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MissionPage from "@/app/student/game/[gameId]/[teamName]/mission/page";

// Mock des données teams
vi.mock("@/types/Teams", () => ({
    teams: {
        MECA: {
            missions: [
                { id: 1, projectId: 1, bonus: false, unlocks: [] },
                { id: 2, projectId: 1, bonus: false, unlocks: [] }
            ]
        }
    }
}));

// Mock Next navigation
const backMock = vi.fn();
vi.mock("next/navigation", () => ({
    useParams: () => ({ teamName: "MECA" }),
    useRouter: () => ({ back: backMock }),
}));

// Mock MissionStructure
vi.mock("@/components/student/MissionStructure", () => ({
    MissionStructure: () => <div data-testid="mission" />,
}));

// Variables globales pour le WebSocket
type WebSocketMessage = { body: string };
let storedCallback: (message: WebSocketMessage) => void;

// Mock WebSocket
vi.mock("@/components/WebSocketProvider", () => ({
    useWebSocket: () => ({
        connected: true,
        subscribe: (callback: (message: WebSocketMessage) => void) => {
            storedCallback = callback; // sauvegarde du callback pour simuler messages
            return { unsubscribe: vi.fn() };
        },
    }),
}));

describe("MissionPage", () => {
    beforeEach(() => {
        backMock.mockClear();
    });

    // Tests pour MissionPage (si elle s'affiche bien)
    it("renders without crashing", () => {
        const { container } = render(<MissionPage />);
        expect(container).toBeTruthy();
    });

    // Test pour vérifier que le titre du projet s'affiche correctement
    it("displays project title", () => {
        render(<MissionPage />);
        expect(screen.getByText(/Projet 1/i)).toBeInTheDocument();
    });

    // Test pour vérifier que le bouton de retour fonctionne
    it("calls router.back when clicking Retour button", () => {
        render(<MissionPage />);
        fireEvent.click(screen.getByText("← Retour"));
        expect(backMock).toHaveBeenCalled();
    });

    // Test pour vérifier que la progression ne s'affiche pas si le teamLabel ne correspond pas
    it("does not update progression if teamLabel does not match", () => {
        render(<MissionPage />);

        storedCallback({
            body: JSON.stringify({
                type: "TEAM_PROGRESSION",
                payload: {
                    teamLabel: "WRONG_TEAM",
                    classicMissionPercentage: 80,
                },
            }),
        });

        expect(screen.queryByText(/80/)).not.toBeInTheDocument();
    });

    // Test pour vérifier que la progression s'affiche correctement lorsque le message WebSocket arrive
    it("updates progression when websocket message arrives", async () => {
        render(<MissionPage />);

        storedCallback({
            body: JSON.stringify({
                type: "TEAM_PROGRESSION",
                payload: {
                    teamLabel: "MECA",
                    classicMissionPercentage: 50,
                },
            }),
        });

        await waitFor(() => {
            expect(screen.getByText("1 / 2")).toBeInTheDocument();
        });
    });

    // Test qui vérifie que le composant affiche le bon nombre de missions racines
    it("renders correct number of root missions", () => {
        render(<MissionPage />);
        expect(screen.getAllByTestId("mission")).toHaveLength(2);
    });

    describe("MissionPage - useEffect early returns", () => {
        it("does not subscribe if not connected", async () => {
            const subscribeMock = vi.fn();

            // Spy sur le hook pour retourner connected=false
            const wsModule = await import("@/components/WebSocketProvider");
            vi.spyOn(wsModule, "useWebSocket").mockReturnValue({
                connected: false,
                subscribe: subscribeMock,
            });

            render(<MissionPage />);
            expect(subscribeMock).not.toHaveBeenCalled();
        });
    });

    describe("MissionPage WebSocket early return", () => {
        it("ignores websocket messages that are not TEAM_PROGRESSION", () => {
            render(<MissionPage />);

            storedCallback({
                body: JSON.stringify({ type: "OTHER_EVENT", payload: {} })
            });

            expect(screen.getByText("0 / 2")).toBeInTheDocument();
        });
    });
});
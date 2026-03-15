import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MissionPage from "@/app/student/game/[gameId]/[teamName]/mission/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {TeamMissionsState} from "@/types/TeamMissionState";

// ---------- Mocks ----------
const mockMissionsState: TeamMissionsState = {
    teamFullProgression: {
        completedMissions: {
            "Mission 1": true,
            "Mission 2": false
        },
        teamProgression: {
            classicMissionsCompleted: 1,
            firstBonusMissionCompleted: false,
            secondBonusMissionCompleted: false
        }
    }
};

vi.mock("@/api/missionApi", () => ({
    getTeamMissionsState: vi.fn(() => Promise.resolve(mockMissionsState)),
}));

vi.mock("@/types/Teams", () => ({
    teams: {
        MECA: {
            missions: [
                { id: 1, projectId: 1, bonus: false, unlocks: [2], title: "Mission 1" },
                { id: 2, projectId: 1, bonus: false, unlocks: [], title: "Mission 2" }
            ]
        }
    }
}));

const backMock = vi.fn();
vi.mock("next/navigation", () => ({
    useParams: () => ({ teamName: "MECA", gameId: "LOBBY123" }),
    useRouter: () => ({ back: backMock, push: vi.fn(), refresh: vi.fn() }),
}));

let storedCallback: (message: { body: string }) => void;
vi.mock("@/contexts/WebSocketProvider", () => ({
    useWebSocket: () => ({
        connected: true,
        subscribe: vi.fn((topic, callback) => {
            storedCallback = callback;
            return { unsubscribe: vi.fn() };
        }),
    }),
}));

vi.mock("@/components/student/MissionStructure", () => ({
    MissionStructure: () => <div data-testid="mission-node" />,
}));

vi.mock("@/components/student/ProgressionBar", () => ({
    ProgressionBar: ({ completed, totalMission}: {
        completed: number;
        totalMission: number;
    }) => (
        <div data-testid="progression-bar">{completed} / {totalMission}</div>
    ),
}));

// ---------- Tests ----------
describe("MissionPage", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false, gcTime: 0 } }
        });
        global.sessionStorage.setItem("clientId", "clientTest123");
    });

    const renderPage = () => render(
        <QueryClientProvider client={queryClient}>
            <MissionPage />
        </QueryClientProvider>
    );

    it("affiche l'état de chargement puis le contenu", async () => {
        renderPage();
        expect(screen.getByText(/chargement/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Projet 1/i)).toBeInTheDocument();
        });
    });

    it("affiche la progression correcte après chargement", async () => {
        renderPage();

        await waitFor(() => {
            const progBar = screen.getByTestId("progression-bar");
            expect(progBar.textContent).toBe("1 / 2");
        });
    });

    it("appelle router.back lors du clic sur le bouton retour", async () => {
        renderPage();
        const backBtn = await screen.findByRole("button", { name: /retour/i });
        fireEvent.click(backBtn);
        expect(backMock).toHaveBeenCalled();
    });

    it("ne rend que la mission racine", async () => {
        renderPage();
        await waitFor(() => {
            const nodes = screen.getAllByTestId("mission-node");
            expect(nodes).toHaveLength(1);
        });
    });

});
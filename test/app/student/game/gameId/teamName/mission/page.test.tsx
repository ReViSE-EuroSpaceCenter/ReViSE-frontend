import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MissionPage from "@/app/student/game/[gameId]/[teamName]/mission/page";
import { QueryClient } from "@tanstack/react-query";
import {TeamMissionsState} from "@/types/TeamMissionState";
import {renderPage} from "@/test/utils/renderPage";

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

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useParams: () => ({ teamName: "MECA", gameId: "LOBBY123" }),
    useRouter: () => ({
        back: vi.fn(),
        push: pushMock,
        refresh: vi.fn(),
    }),
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

vi.mock("@/components/mission/MissionStructure", () => ({
    MissionStructure: () => <div data-testid="mission-node" />,
}));

vi.mock("@/components/mission/ProgressionBar", () => ({
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

    it("affiche l'état de chargement puis le contenu", async () => {
        renderPage(<MissionPage />);
        expect(screen.getByText(/chargement/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Projet 1/i)).toBeInTheDocument();
        });
    });

    it("affiche la progression correcte après chargement", async () => {
        renderPage(<MissionPage />);

        await waitFor(() => {
            const progBar = screen.getByTestId("progression-bar");
            expect(progBar.textContent).toBe("1 / 2");
        });
    });

    it("redirige vers la page student game lors du clic sur retour", async () => {
        renderPage(<MissionPage />);

        const backBtn = await screen.findByRole("button", { name: /retour/i });
        fireEvent.click(backBtn);

        expect(pushMock).toHaveBeenCalledWith("/student/game/LOBBY123/MECA");
    });

    it("ne rend que la mission racine", async () => {
        renderPage(<MissionPage />);
        await waitFor(() => {
            const nodes = screen.getAllByTestId("mission-node");
            expect(nodes).toHaveLength(1);
        });
    });

});
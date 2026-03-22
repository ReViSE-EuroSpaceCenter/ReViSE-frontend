import React from "react";
import { screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "@/app/teacher/game/[gameId]/page";
import { getGameInfo } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";
import {renderPage} from "@/test/utils/renderPage";

// ---------- Websocket mocks ----------
const subscribeMock = vi.fn();
const unsubscribeMock = vi.fn();

let wsCallback: ((message: { body: string }) => void) | undefined;

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF" }),
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => "/teacher/game/ABCDEF",
    useSearchParams: () => ({ get: vi.fn(() => null) }),
}));

vi.mock("@/api/missionApi", () => ({
    getGameInfo: vi.fn(),
    endMission: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/contexts/WebSocketProvider", () => ({
    useWebSocket: () => ({
        connected: true,
        subscribe: subscribeMock,
    }),
}));

vi.mock("@/components/teacher/SideRow", () => ({
    default: ({ team, completed }: { team: string; completed: number }) => (
        <div>
            SideRow-{team}-{completed}
        </div>
    ),
}))

vi.mock("@/components/student/ProgressionBar", () => ({
    ProgressionBar: () => <div>ProgressionBar</div>,
}));

vi.mock("@/components/Toolbox", () => ({
    default: ({ centerAction }: any) => (
        <button
            data-testid="center-action-button"
            disabled={centerAction?.disabled}
            onClick={centerAction?.onClick}
        >
            {centerAction?.label}
        </button>
    ),
}));

// ---------- Helpers ----------
const gameInfo = {
    allTeamsCompleted: false,
    teamsFullProgression: {
        MECA: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "MECA",
                classicMissionsCompleted: 4,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
            },
        },
    },
};

// ---------- Tests ----------
describe("Dashboard websocket", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        subscribeMock.mockImplementation((_channel, callback) => {
            wsCallback = callback;
            return { unsubscribe: unsubscribeMock };
        });

        vi.mocked(getGameInfo).mockResolvedValue(gameInfo as any);
    });

    it("met à jour la progression d'équipe via websocket", async () => {
        renderPage(<Dashboard />);

        expect(await screen.findByText("SideRow-MECA-4")).toBeInTheDocument();

        act(() => {
            wsCallback?.({
                body: JSON.stringify({
                    type: "TEAM_PROGRESSION",
                    payload: {
                        teamProgression: {
                            teamLabel: "MECA",
                            classicMissionsCompleted: 6,
                            firstBonusMissionCompleted: true,
                            secondBonusMissionCompleted: false,
                        },
                        allTeamsMissionsCompleted: false,
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(screen.getByText("SideRow-MECA-6")).toBeInTheDocument();
        });
    });

    it("ignore les messages websocket invalides", async () => {
        renderPage(<Dashboard />);

        await screen.findByTestId("center-action-button");

        act(() => {
            wsCallback?.({
                body: "{invalid-json",
            });
        });

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                "",
                "Erreur lors de la récupération des données"
            );
        });
    });

    it("désabonne le websocket au unmount", async () => {
        const view = renderPage(<Dashboard />);

        await screen.findByTestId("center-action-button");

        view.unmount();

        expect(unsubscribeMock).toHaveBeenCalled();
    });
});
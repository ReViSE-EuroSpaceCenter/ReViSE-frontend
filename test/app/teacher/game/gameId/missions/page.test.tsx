import React from "react";
import { act, fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { showError } from "@/errors/getErrorMessage";
import HostMissionsPage from "@/app/teacher/game/[gameId]/mission/page";

// ---------- Mocks ----------
const mockPush = vi.fn();
const mockSetQueryData = vi.fn();
const mockRefetch = vi.fn();

let mockUseQueryState: any = {};
let wsCallback: ((event: any) => void) | null = null;

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "GAME123" }),
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
      "@tanstack/react-query"
    );

    return {
        ...actual,
        useQuery: vi.fn(() => mockUseQueryState),
        useQueryClient: () => ({
            setQueryData: mockSetQueryData,
        }),
    };
});

vi.mock("@/hooks/useWSSubscription", () => ({
    useWSSubscription: (_topic: string, cb: (event: any) => void) => {
        wsCallback = cb;
    },
}));

vi.mock("@/api/missionApi", () => ({
    getGameInfo: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/api/apiError", () => ({
    ApiError: class ApiError extends Error {
        key: string;
        constructor(key: string) {
            super(key);
            this.key = key;
        }
    },
}));

vi.mock("@/app/loading", () => ({
    default: () => <div>Loading page...</div>,
}));

vi.mock("@/components/mission/ProgressionBar", () => ({
    ProgressionBar: ({
                         completed,
                         totalMission,
                         color,
                     }: {
        completed: number;
        totalMission: number;
        color: string;
    }) => (
        <div data-testid="progression-bar">
            {completed}/{totalMission} - {color}
        </div>
    ),
}));

vi.mock("@/components/mission/ProjectSection", () => ({
    ProjectSection: ({ missions }: any) => (
      <div>
          Projet {missions[0]?.projectId}
          {missions.map((m: any) => (
            <button key={m.id}>mission-{m.id}</button>
          ))}
      </div>
    ),
}));

vi.mock("@/components/mission/ReturnButton", () => ({
    ReturnButton: ({ url }: { url: string }) => (
      <button onClick={() => mockPush(url)}>← Retour</button>
    ),
}));

vi.mock("@/components/mission/TeamTabs", () => ({
    TeamTabs: ({ teamKeys, setSelectedIndex }: any) => (
      <div>
          {teamKeys.map((team: string, i: number) => (
            <button key={team} onClick={() => setSelectedIndex(i)}>
                {team}
            </button>
          ))}
      </div>
    ),
}));

vi.mock("@/contexts/MissionContext", () => ({
    MissionProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/hooks/useSessionId", () => ({
    useSessionId: () => "HOST123",
}));

vi.mock("@/hooks/useMission", () => ({
    useMission: (team: string) => ({
        missions:
          team === "EXPE"
            ? [{ id: "CLASSIC_3", projectId: 1, bonus: false }]
            : [
                { id: "CLASSIC_1", projectId: 1, bonus: false },
                { id: "CLASSIC_2", projectId: 1, bonus: false },
            ],
        missionMap: {},
        projectIds: [1],
    }),
}));

vi.mock("@/hooks/useInvalidateMissions", () => ({
    useInvalidateMissions: () => mockRefetch,
}));

vi.mock("@/utils/teamColor", () => ({
    teamColorMap: {
        MECA: "#ff0000",
        EXPE: "#00ff00",
    },
}));

// ---------- Helpers ----------
function renderPage() {
    const client = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return render(
      <QueryClientProvider client={client}>
          <HostMissionsPage />
      </QueryClientProvider>
    );
}

const baseGameData = {
    allTeamsCompleted: false,
    teamsFullProgression: {
        MECA: {
            completedMissions: {
                CLASSIC_1: true,
                CLASSIC_2: false,
            },
            teamProgression: {
                teamLabel: "MECA",
                classicMissionsCompleted: 1,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
                allTeamsMissionsCompleted: false,
            },
        },
        EXPE: {
            completedMissions: {
                CLASSIC_3: false,
            },
            teamProgression: {
                teamLabel: "EXPE",
                classicMissionsCompleted: 0,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
                allTeamsMissionsCompleted: false,
            },
        },
    },
};

describe("HostMissionsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        wsCallback = null;

        mockUseQueryState = {
            data: baseGameData,
            isLoading: false,
            isError: false,
            error: null,
        };
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it("affiche LoadingPage pendant le chargement", () => {
        mockUseQueryState = { ...mockUseQueryState, isLoading: true, data: undefined };

        renderPage();

        expect(screen.getByText("Loading page...")).toBeInTheDocument();
    });

    it("redirige vers /teacher/game/GAME123 au clic sur retour", () => {
        renderPage();

        fireEvent.click(screen.getByText("← Retour"));

        expect(mockPush).toHaveBeenCalledWith("/teacher/game/GAME123");
    });

    it("change d'équipe", () => {
        renderPage();

        fireEvent.click(screen.getByText("EXPE"));

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("0/1 - #00ff00");
    });

    it("affiche la progression correcte", () => {
        renderPage();

        fireEvent.click(screen.getByText("MECA"));

        expect(screen.getByTestId("progression-bar"))
          .toHaveTextContent("1/2 - #ff0000");
    });

    it("appelle showError en cas d'erreur API", async () => {
        const { ApiError } = await import("@/api/apiError");

        mockUseQueryState = {
            ...mockUseQueryState,
            isError: true,
            error: new ApiError("ERR"),
        };

        renderPage();

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
              "ERR",
              "Impossible de récupérer les données de la partie"
            );
        });
    });

    it("met à jour le cache via websocket", async () => {
        renderPage();

        await act(async () => {
            wsCallback?.({
                type: "TEAM_PROGRESSION",
                payload: {
                    teamProgression: {
                        teamLabel: "MECA",
                        classicMissionsCompleted: 2,
                    },
                    allTeamsMissionsCompleted: false,
                },
            });
        });

        expect(mockSetQueryData).toHaveBeenCalledWith(
          ["gameInfo", "GAME123"],
          expect.any(Function)
        );
    });

    it("ignore les events non pertinents", async () => {
        renderPage();

        await act(async () => {
            wsCallback?.({
                type: "OTHER_EVENT",
            });
        });

        expect(mockSetQueryData).not.toHaveBeenCalled();
    });

    it("n'affiche pas la progression si aucune équipe", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            data: { allTeamsCompleted: false, teamsFullProgression: {} },
        };

        renderPage();

        expect(screen.queryByTestId("progression-bar")).not.toBeInTheDocument();
    });
});
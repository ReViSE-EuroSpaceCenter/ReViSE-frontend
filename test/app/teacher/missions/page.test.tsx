import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { showError } from "@/errors/getErrorMessage";
import HostMissionsPage from "@/app/teacher/game/[gameId]/mission/page";

// ---------- Mocks ----------
const mockBack = vi.fn();
const mockSetQueryData = vi.fn();
const mockRefetch = vi.fn();
const mockSubscribe = vi.fn();
const unsubscribeMock = vi.fn();

let mockUseQueryState: any = {};
let wsHandler: ((message: { body: string }) => void) | null = null;

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "GAME123" }),
    useRouter: () => ({
        back: mockBack,
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

vi.mock("@/contexts/WebSocketProvider", () => ({
    useWebSocket: () => ({
        connected: true,
        subscribe: mockSubscribe,
    }),
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
    default: function LoadingPage() {
        return <div>Loading page...</div>;
    },
}));

vi.mock("@/components/student/ProgressionBar", () => ({
    ProgressionBar: ({
                         completed,
                         totalMission,
                     }: {
        completed: number;
        totalMission: number;
    }) => <div data-testid="progression-bar">{completed}/{totalMission}</div>,
}));

vi.mock("@/components/student/MissionStructure", () => ({
    MissionStructure: ({
                           mission,
                           onMissionUpdated,
                       }: {
        mission: { id: string };
        onMissionUpdated: (missionsToUpdate: string[]) => Promise<void>;
    }) => (
        <button onClick={() => void onMissionUpdated([mission.id])}>
            mission-{mission.id}
        </button>
    ),
}));

vi.mock("@/contexts/MissionContext", () => ({
    MissionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/types/Teams", () => ({
    teams: {
        MECA: {
            missions: [
                { id: "CLASSIC_1", projectId: 1, bonus: false, unlocks: [] },
                { id: "CLASSIC_2", projectId: 1, bonus: false, unlocks: [] },
                { id: "BONUS_1", projectId: 2, bonus: true, unlocks: [] },
            ],
        },
        EXPE: {
            missions: [{ id: "CLASSIC_3", projectId: 1, bonus: false, unlocks: [] }],
        },
    },
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
            mutations: { retry: false },
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
            },
        },
    },
};

// ---------- Tests ----------
describe("HostMissionsPage coverage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        wsHandler = null;

        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: vi.fn(() => "HOST123"),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });

        mockSubscribe.mockImplementation(
            (_topic: string, cb: (message: { body: string }) => void) => {
                wsHandler = cb;
                return {
                    unsubscribe: unsubscribeMock,
                };
            }
        );

        mockRefetch.mockResolvedValue({
            data: {
                ...baseGameData,
                teamsFullProgression: {
                    ...baseGameData.teamsFullProgression,
                    MECA: {
                        ...baseGameData.teamsFullProgression.MECA,
                        completedMissions: {
                            CLASSIC_1: true,
                            CLASSIC_2: true,
                        },
                        teamProgression: {
                            ...baseGameData.teamsFullProgression.MECA.teamProgression,
                            classicMissionsCompleted: 2,
                        },
                    },
                },
            },
        });

        mockUseQueryState = {
            data: baseGameData,
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
        };
    });

    it("change d'équipe au clic sur un onglet", () => {
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: /EXPE/i }));

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("0/1");
        expect(screen.getByText("Projet 1")).toBeInTheDocument();
        expect(screen.getByText("mission-CLASSIC_3")).toBeInTheDocument();
    });



    it("retourne en arrière au clic sur le bouton retour", () => {
        renderPage();

        fireEvent.click(screen.getByText("← Retour"));

        expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("appelle showError quand useQuery est en erreur", async () => {
        const { ApiError } = await import("@/api/apiError");

        mockUseQueryState = {
            ...mockUseQueryState,
            isError: true,
            error: new ApiError("GAME_FETCH_ERROR"),
        };

        renderPage();

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                "GAME_FETCH_ERROR",
                "Impossible de récupérer les données de la partie"
            );
        });
    });

    it("appelle refetch après mise à jour d'une mission", async () => {
        renderPage();

        fireEvent.click(screen.getByText("mission-CLASSIC_2"));

        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });


    it("met à jour le cache via websocket TEAM_PROGRESSION", async () => {
        renderPage();

        await act(async () => {
            wsHandler?.({
                body: JSON.stringify({
                    type: "TEAM_PROGRESSION",
                    payload: {
                        teamProgression: {
                            teamLabel: "MECA",
                            classicMissionsCompleted: 2,
                            firstBonusMissionCompleted: true,
                            secondBonusMissionCompleted: false,
                        },
                        allTeamsMissionsCompleted: false,
                    },
                }),
            });
        });

        expect(mockSetQueryData).toHaveBeenCalledTimes(1);
        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it("appelle showError si le message websocket est invalide", async () => {
        renderPage();

        await act(async () => {
            wsHandler?.({
                body: "{invalid json",
            });
        });

        expect(showError).toHaveBeenCalledWith(
            "",
            "Erreur lors de la récupération des données"
        );
    });
});
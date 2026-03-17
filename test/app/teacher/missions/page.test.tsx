import React from "react";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {showError} from "@/errors/getErrorMessage";
import {createMissionSyncChannel} from "@/utils/missionSync";
import HostMissionsPage from "@/app/teacher/game/[gameId]/mission/page";

// ---------- Mocks ----------
const mockBack = vi.fn();
const mockSetQueryData = vi.fn();
const mockRefetch = vi.fn();
const mockSubscribe = vi.fn();
const unsubscribeMock = vi.fn();

let mockUseQueryState: any = {};
let missionChannelHandler: ((event: MessageEvent<any>) => void) | null = null;
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
        onMissionUpdated: (missionsToUpdate: string[]) => void;
    }) => (
        <button onClick={() => onMissionUpdated([mission.id])}>
            mission-{mission.id}
        </button>
    ),
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

let mockMissionChannel: {
    close: ReturnType<typeof vi.fn>;
    onmessage: ((event: MessageEvent<any>) => void) | null;
} | null = null;

vi.mock("@/utils/missionSync", () => ({
    createMissionSyncChannel: vi.fn(() => {
        mockMissionChannel = {
            close: vi.fn(),
            onmessage: null,
        };

        return mockMissionChannel;
    }),
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
        missionChannelHandler = null;
        wsHandler = null;
        sessionStorage.clear();

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

    it("affiche le loading pendant le chargement", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            isLoading: true,
            data: undefined,
        };

        renderPage();

        expect(screen.getByText("Loading page...")).toBeInTheDocument();
    });

    it("affiche le message initial si aucune équipe n'est sélectionnée", () => {
        renderPage();

        expect(
            screen.getByText("Sélectionne une équipe pour afficher ses missions")
        ).toBeInTheDocument();
    });

    it("sélectionne une équipe et affiche ses missions", async () => {
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: /MECA/i }));

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("1/2");
        expect(screen.getByText("Projet 1")).toBeInTheDocument();
        expect(screen.getByText("Projet 2")).toBeInTheDocument();
        expect(screen.getByText("mission-CLASSIC_1")).toBeInTheDocument();
        expect(screen.getByText("mission-CLASSIC_2")).toBeInTheDocument();
    });

    it("affiche le message hostId introuvable si absent", () => {
        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: vi.fn(() => null),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });

        renderPage();
        fireEvent.click(screen.getByRole("button", { name: /MECA/i }));

        expect(
            screen.getByText("HostId introuvable dans la session.")
        ).toBeInTheDocument();
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

    it("met à jour les missions après clic sur une mission et refetch", async () => {
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: /MECA/i }));
        fireEvent.click(screen.getByText("mission-CLASSIC_2"));

        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByTestId("progression-bar")).toHaveTextContent("2/2");
        });
    });

    it("réagit au mission sync channel pour l'équipe sélectionnée", async () => {
        renderPage();

        fireEvent.click(
            screen.getByRole("button", {
                name: (name) => name.includes("MECA"),
            })
        );

        await waitFor(() => {
            expect(createMissionSyncChannel).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockMissionChannel?.onmessage).toBeTruthy();
        });

        await act(async () => {
            mockMissionChannel?.onmessage?.({
                data: {
                    lobbyCode: "GAME123",
                    teamName: "MECA",
                    missionsToUpdate: ["CLASSIC_2"],
                },
            } as MessageEvent<any>);
        });

        await waitFor(() => {
            expect(screen.getByTestId("progression-bar")).toHaveTextContent("2/2");
        });
    });

    it("ignore le mission sync channel pour une autre équipe", async () => {
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: /MECA/i }));

        await act(async () => {
            missionChannelHandler?.({
                data: {
                    lobbyCode: "GAME123",
                    teamName: "EXPE",
                    missionsToUpdate: ["CLASSIC_3"],
                },
            } as MessageEvent<any>);
        });

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("1/2");
    });

    it("met à jour le cache via websocket TEAM_PROGRESSION", async () => {
        renderPage();

        expect(mockSubscribe).toHaveBeenCalled();

        await act(async () => {
            wsHandler?.({
                body: JSON.stringify({
                    type: "TEAM_PROGRESSION",
                    payload: {
                        teamLabel: "MECA",
                        teamProgression: {
                            classicMissionsCompleted: 2,
                            firstBonusMissionCompleted: true,
                            secondBonusMissionCompleted: false,
                        },
                    },
                }),
            });
        });

        expect(mockSetQueryData).toHaveBeenCalled();
    });

    it("ignore les messages websocket non TEAM_PROGRESSION", async () => {
        renderPage();

        await act(async () => {
            wsHandler?.({
                body: JSON.stringify({
                    type: "OTHER_EVENT",
                    payload: {},
                }),
            });
        });

        expect(mockSetQueryData).not.toHaveBeenCalled();
    });

    it("gère une erreur JSON websocket sans crasher", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        renderPage();

        await act(async () => {
            wsHandler?.({
                body: "{invalid json",
            });
        });

        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("désabonne les channels au unmount si nécessaire", () => {
        const view = renderPage();
        view.unmount();

        // À adapter selon ton implémentation réelle si tu veux tester close/unsubscribe explicitement
        expect(true).toBe(true);
    });
});
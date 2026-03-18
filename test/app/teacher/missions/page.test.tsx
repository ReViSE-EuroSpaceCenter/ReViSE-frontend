import React from "react";
import { act, fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

vi.mock("@/components/student/MissionStructure", () => ({
    MissionStructure: ({
                           mission,
                           onMissionUpdated,
                       }: {
        mission: { id: string };
        onMissionUpdated: () => Promise<void>;
    }) => (
        <button type="button" onClick={() => void onMissionUpdated()}>
            mission-{mission.id}
        </button>
    ),
}));

vi.mock("@/contexts/MissionContext", async () => {
    const MockMissionProvider = ({ children }: React.PropsWithChildren) => <>{children}</>;

    return {
        MissionProvider: MockMissionProvider,
    };
});

vi.mock("@/types/Teams", () => ({
    teams: {
        MECA: {
            missions: [
                { id: "CLASSIC_1", projectId: 1, bonus: false, unlocks: ["CLASSIC_2"] },
                { id: "CLASSIC_2", projectId: 1, bonus: false, unlocks: [] },
                { id: "BONUS_1", projectId: 2, bonus: true, unlocks: [] },
            ],
        },
        EXPE: {
            missions: [
                { id: "CLASSIC_3", projectId: 1, bonus: false, unlocks: [] },
            ],
        },
        AERO: {
            missions: [
                { id: "AERO_CLASSIC_1", projectId: 2, bonus: false, unlocks: [] },
                { id: "AERO_BONUS_1", projectId: 2, bonus: true, unlocks: [] },
            ],
        },
    },
}));

vi.mock("@/utils/teamColor", () => ({
    teamColorMap: {
        MECA: "#ff0000",
        EXPE: "#00ff00",
        AERO: "#0000ff",
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
                BONUS_1: false,
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

describe("HostMissionsPage coverage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        wsHandler = null;

        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
            if (key === "hostId") return "HOST123";
            return null;
        });
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {});

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
                            BONUS_1: true,
                        },
                        teamProgression: {
                            ...baseGameData.teamsFullProgression.MECA.teamProgression,
                            classicMissionsCompleted: 2,
                            firstBonusMissionCompleted: true,
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

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it("affiche LoadingPage pendant le chargement", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            data: undefined,
            isLoading: true,
        };

        renderPage();

        expect(screen.getByText("Loading page...")).toBeInTheDocument();
    });

    it("affiche LoadingPage si gameData est absent", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            data: undefined,
            isLoading: false,
        };

        renderPage();

        expect(screen.getByText("Loading page...")).toBeInTheDocument();
    });

    it("change d'équipe au clic sur un onglet", () => {
        renderPage();

        fireEvent.click(screen.getByRole("button", { name: /EXPE/i }));

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("0/1 - #00ff00");
        expect(screen.getByText("Projet 1")).toBeInTheDocument();
        expect(screen.getByText("mission-CLASSIC_3")).toBeInTheDocument();
    });

    it("retourne en arrière au clic sur le bouton retour", () => {
        renderPage();

        fireEvent.click(screen.getByText("← Retour"));

        expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("affiche la progression de l'équipe sélectionnée avec la bonne couleur", () => {
        renderPage();

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("1/2 - #ff0000");
    });

    it("utilise classicMissionsCompleted si supérieur au nombre calculé", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            data: {
                ...baseGameData,
                teamsFullProgression: {
                    ...baseGameData.teamsFullProgression,
                    MECA: {
                        completedMissions: {
                            CLASSIC_1: false,
                            CLASSIC_2: false,
                            BONUS_1: false,
                        },
                        teamProgression: {
                            teamLabel: "MECA",
                            classicMissionsCompleted: 2,
                            firstBonusMissionCompleted: false,
                            secondBonusMissionCompleted: false,
                        },
                    },
                },
            },
        };

        renderPage();

        expect(screen.getByTestId("progression-bar")).toHaveTextContent("2/2");
    });

    it("n'affiche que les missions racines d'un projet", () => {
        renderPage();

        expect(screen.getByText("mission-CLASSIC_1")).toBeInTheDocument();
        expect(screen.queryByText("mission-CLASSIC_2")).not.toBeInTheDocument();
    });

    it("appelle showError quand useQuery est en erreur avec ApiError", async () => {
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

    it("appelle showError quand useQuery est en erreur générique", async () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            isError: true,
            error: new Error("boom"),
        };

        renderPage();

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                "",
                "Impossible de récupérer les données de la partie"
            );
        });
    });

    it("appelle refetch après mise à jour d'une mission", async () => {
        renderPage();

        fireEvent.click(screen.getByText("mission-CLASSIC_1"));

        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });

    it("met à jour le cache via websocket TEAM_PROGRESSION et refetch si équipe sélectionnée", async () => {
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
        expect(mockSetQueryData).toHaveBeenCalledWith(
            ["gameInfo", "GAME123"],
            expect.any(Function)
        );
        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it("applique correctement la mise à jour du cache pour une équipe connue", async () => {
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
                        allTeamsMissionsCompleted: true,
                    },
                }),
            });
        });

        const updater = mockSetQueryData.mock.calls[0][1];
        const updated = updater(baseGameData);

        expect(updated).toEqual({
            ...baseGameData,
            allTeamsCompleted: true,
            teamsFullProgression: {
                ...baseGameData.teamsFullProgression,
                MECA: {
                    ...baseGameData.teamsFullProgression.MECA,
                    completedMissions: {
                        ...baseGameData.teamsFullProgression.MECA.completedMissions,
                        BONUS_1: true,
                    },
                    teamProgression: {
                        ...baseGameData.teamsFullProgression.MECA.teamProgression,
                        teamLabel: "MECA",
                        classicMissionsCompleted: 2,
                        firstBonusMissionCompleted: true,
                        secondBonusMissionCompleted: false,
                    },
                },
            },
        });
    });

    it("ne modifie pas le cache si l'équipe du websocket n'existe pas dans gameData", async () => {
        renderPage();

        await act(async () => {
            wsHandler?.({
                body: JSON.stringify({
                    type: "TEAM_PROGRESSION",
                    payload: {
                        teamProgression: {
                            teamLabel: "AERO",
                            classicMissionsCompleted: 1,
                            firstBonusMissionCompleted: true,
                            secondBonusMissionCompleted: false,
                        },
                        allTeamsMissionsCompleted: false,
                    },
                }),
            });
        });

        const updater = mockSetQueryData.mock.calls[0][1];
        const updated = updater(baseGameData);

        expect(updated).toBe(baseGameData);
        expect(mockRefetch).not.toHaveBeenCalled();
    });

    it("retourne undefined dans le cache si previousData est undefined", async () => {
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

        const updater = mockSetQueryData.mock.calls[0][1];
        const updated = updater(undefined);

        expect(updated).toBeUndefined();
    });

    it("met à jour le cache sans refetch si l'event concerne une autre équipe", async () => {
        renderPage();

        await act(async () => {
            wsHandler?.({
                body: JSON.stringify({
                    type: "TEAM_PROGRESSION",
                    payload: {
                        teamProgression: {
                            teamLabel: "EXPE",
                            classicMissionsCompleted: 1,
                            firstBonusMissionCompleted: false,
                            secondBonusMissionCompleted: false,
                        },
                        allTeamsMissionsCompleted: false,
                    },
                }),
            });
        });

        expect(mockSetQueryData).toHaveBeenCalledTimes(1);
        expect(mockRefetch).not.toHaveBeenCalled();
    });

    it("ignore les messages websocket d'un autre type", async () => {
        renderPage();

        await act(async () => {
            wsHandler?.({
                body: JSON.stringify({
                    type: "OTHER_EVENT",
                    payload: {
                        foo: "bar",
                    },
                }),
            });
        });

        expect(mockSetQueryData).not.toHaveBeenCalled();
        expect(mockRefetch).not.toHaveBeenCalled();
        expect(showError).not.toHaveBeenCalled();
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

    it("s'abonne au websocket mission", () => {
        renderPage();

        expect(mockSubscribe).toHaveBeenCalledWith("mission", expect.any(Function));
    });

    it("se désabonne du websocket au démontage", () => {
        const view = renderPage();

        view.unmount();

        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });

    it("affiche une erreur si une équipe est sélectionnée mais hostId est absent", () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
            if (key === "hostId") return null;
            return null;
        });

        renderPage();

        expect(
            screen.getByText("Une erreur est survenue. Réessayez dans quelques instants.")
        ).toBeInTheDocument();
    });

    it("affiche le message de sélection si aucune équipe n'est disponible", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            data: {
                allTeamsCompleted: false,
                teamsFullProgression: {},
            },
        };

        renderPage();

        expect(
            screen.getByText("Sélectionne une équipe pour afficher ses missions")
        ).toBeInTheDocument();
    });

    it("n'affiche pas la progression si aucune équipe n'est sélectionnée", () => {
        mockUseQueryState = {
            ...mockUseQueryState,
            data: {
                allTeamsCompleted: false,
                teamsFullProgression: {},
            },
        };

        renderPage();

        expect(screen.queryByTestId("progression-bar")).not.toBeInTheDocument();
    });
});
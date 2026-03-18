import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/app/teacher/game/[gameId]/page";
import { getGameInfo, endMission } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";

// ---------- Mocks ----------
const subscribeMock = vi.fn();
const unsubscribeMock = vi.fn();
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useParams: () => ({
        gameId: "ABC123",
    }),
    useRouter: () => ({
        replace: replaceMock,
    }),
    usePathname: () => "/teacher/game/ABC123",
    useSearchParams: () => ({
        get: vi.fn(() => null),
    }),
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

vi.mock("@/components/Toolbox", () => ({
    default: ({ centerAction, actions }: { centerAction?: { label: string; onClick: () => void, disabled :boolean }; actions: { label: string; onClick: () => void }[] }) => {
        return (
            <div>
                {actions.map((action) => (
                    <button key={action.label} onClick={action.onClick}>
                        {action.label}
                    </button>
                ))}

                {centerAction && (
                    <button
                        data-testid="center-action-button"
                        disabled={centerAction.disabled}
                        onClick={centerAction.disabled ? undefined : centerAction.onClick}
                        style={{
                            cursor: centerAction.disabled ? "not-allowed" : "pointer",
                        }}
                    >
                        {centerAction.label}
                    </button>
                )}
            </div>
        );
    },
}));

vi.mock("@/components/Checklist", () => ({
    default: ({ isOpen }: { isOpen: boolean }) => (
        <div>{isOpen ? "Checklist ouverte" : "Checklist fermée"}</div>
    ),
}));

vi.mock("@/components/IATech", () => ({
    default: ({ isOpen }: { isOpen: boolean }) => (
        <div>{isOpen ? "IA ouverte" : "IA fermée"}</div>
    ),
}));

vi.mock("@/components/teacher/SideRow", () => ({
    default: ({ team, completed }: { team: string; completed: number }) => (
        <div>
            SideRow-{team}-{completed}
        </div>
    ),
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
        <div>
            ProgressionBar-{completed}-{totalMission}-{color}
        </div>
    ),
}));

vi.mock("@/components/PresentationModal", () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div>Presentation ouverte</div> : null,
}));

vi.mock("@/utils/teamColor", () => ({
    teamColorMap: {
        MECA: "white",
        AERO: "purple",
        GECO: "green",
        EXPE: "red",
        MEDI: "blue",
        COOP: "orange",
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
            <Dashboard />
        </QueryClientProvider>
    );
}

const gameInfo4Teams = {
    allTeamsCompleted: true,
    teamsFullProgression: {
        MECA: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "MECA",
                classicMissionsCompleted: 4,
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: false,
            },
        },
        AERO: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "AERO",
                classicMissionsCompleted: 3,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: true,
            },
        },
        GECO: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "GECO",
                classicMissionsCompleted: 2,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
            },
        },
        EXPE: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "EXPE",
                classicMissionsCompleted: 1,
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: true,
            },
        },
    },
};

const gameInfo6Teams = {
    allTeamsCompleted: false,
    teamsFullProgression: {
        MECA: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "MECA",
                classicMissionsCompleted: 4,
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: false,
            },
        },
        AERO: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "AERO",
                classicMissionsCompleted: 3,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: true,
            },
        },
        GECO: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "GECO",
                classicMissionsCompleted: 2,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
            },
        },
        EXPE: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "EXPE",
                classicMissionsCompleted: 1,
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: true,
            },
        },
        MEDI: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "MEDI",
                classicMissionsCompleted: 5,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
            },
        },
        COOP: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "COOP",
                classicMissionsCompleted: 6,
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: false,
            },
        },
    },
};

// ---------- Tests ----------
describe("Dashboard coverage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();

        subscribeMock.mockReturnValue({
            unsubscribe: unsubscribeMock,
        });
    });

    it("affiche les équipes et désactive le bouton si toutes les équipes ne sont pas terminées", async () => {
        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo6Teams as any);

        renderPage();

        expect(await screen.findAllByText("SideRow-MECA-4")).toHaveLength(1);
        expect(screen.getAllByText("SideRow-AERO-3").length).toBeGreaterThan(0);
        expect(screen.getAllByText("SideRow-GECO-2").length).toBeGreaterThan(0);

        const button = await screen.findByTestId('center-action-button')

        expect(button).toBeDisabled();
    });

    it("active le bouton si toutes les équipes sont terminées", async () => {
        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        const centerButton = await screen.findByTestId('center-action-button');

        await waitFor(() => {
            expect(centerButton).toHaveStyle({ cursor: "pointer" });
            expect(centerButton).not.toHaveAttribute("onClick");
        });
    });

    it("ouvre Checklist et IATech via les actions Toolbox", async () => {
        const user = userEvent.setup();

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        await screen.findByTestId('center-action-button');

        expect(screen.getByText("Checklist fermée")).toBeInTheDocument();
        expect(screen.getByText("IA fermée")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Fin du tour" }));
        await user.click(
            screen.getByRole("button", { name: /Aide\s*Technologies IA/i })
        );

        expect(screen.getByText("Checklist ouverte")).toBeInTheDocument();
        expect(screen.getByText("IA ouverte")).toBeInTheDocument();
    });

    it("ouvre la modale de confirmation au clic sur Terminer les missions", async () => {
        const user = userEvent.setup();

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        const button = await screen.findByTestId('center-action-button');

        await user.click(button);

        expect(screen.getByText("Confirmation")).toBeInTheDocument();
        expect(
            screen.getByText(/Cette action est irréversible/i)
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Continuer" })).toBeInTheDocument();
    });

    it("ferme la modale quand on clique sur Annuler", async () => {
        const user = userEvent.setup();

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        await user.click(
            await screen.findByTestId('center-action-button')
        );

        expect(screen.getByText("Confirmation")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Annuler" }));

        await waitFor(() => {
            expect(screen.queryByText("Confirmation")).not.toBeInTheDocument();
        });
    });

    it("appelle endMission avec lobbyCode et hostId quand on confirme", async () => {
        const user = userEvent.setup();

        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);
        vi.mocked(endMission).mockResolvedValueOnce(undefined as any);

        renderPage();

        await user.click(
            await screen.findByTestId('center-action-button')
        );

        await user.click(screen.getByRole("button", { name: "Continuer" }));

        await waitFor(() => {
            expect(endMission).toHaveBeenCalledWith("ABC123", "host-123");
        });

        expect(showError).not.toHaveBeenCalled();
    });

    it("affiche une erreur si hostId est manquant quand on confirme", async () => {
        const user = userEvent.setup();

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        await user.click(
            await screen.findByTestId('center-action-button')
        );

        await user.click(screen.getByRole("button", { name: "Continuer" }));

        expect(endMission).not.toHaveBeenCalled();
        expect(showError).toHaveBeenCalledWith(
            "",
            "Identifiant de connexion manquant, impossible d'autoriser l'encodage des ressources"
        );
    });

    it("affiche une erreur si endMission échoue", async () => {
        const user = userEvent.setup();

        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);
        vi.mocked(endMission).mockRejectedValueOnce(new Error("boom"));

        renderPage();

        await user.click(
            await screen.findByTestId('center-action-button')
        );

        await user.click(screen.getByRole("button", { name: "Continuer" }));

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                "",
                "Impossible de clôturer la mission"
            );
        });
    });

    it("affiche une erreur si getGameInfo échoue", async () => {
        vi.mocked(getGameInfo).mockRejectedValueOnce(new Error("fetch failed"));

        renderPage();

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                "",
                "Erreur lors de la récupération des données"
            );
        });
    });

    it("s'abonne au websocket et met à jour TEAM_PROGRESSION", async () => {
        let wsCallback: ((message: { body: string }) => void) | undefined;

        subscribeMock.mockImplementation((_channel, callback) => {
            wsCallback = callback;
            return { unsubscribe: unsubscribeMock };
        });

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        expect(await screen.findAllByText("SideRow-AERO-3")).toHaveLength(1);

        act(() => {
            wsCallback?.({
                body: JSON.stringify({
                    type: "TEAM_PROGRESSION",
                    payload: {
                        teamProgression: {
                            teamLabel: "AERO",
                            classicMissionsCompleted: 6,
                            firstBonusMissionCompleted: true,
                            secondBonusMissionCompleted: true,
                        },
                        allTeamsMissionsCompleted: true,
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(screen.getAllByText("SideRow-AERO-6")).toHaveLength(1);
        });
    });

    it("met à jour la progression d'équipe via websocket sans activer le bouton", async () => {
        let wsCallback: ((message: { body: string }) => void) | undefined;

        subscribeMock.mockImplementation((_channel, callback) => {
            wsCallback = callback;
            return { unsubscribe: unsubscribeMock };
        });

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo6Teams as any);

        renderPage();

        const button = await screen.findByTestId('center-action-button')

        expect(button).toBeDisabled();
        expect(await screen.findAllByText("SideRow-MECA-4")).toHaveLength(1);

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
                        allTeamsMissionsCompleted: true,
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(screen.getAllByText("SideRow-MECA-6")).toHaveLength(1);
        });

        expect(button).toBeDisabled();
    });

    it("ignore les messages websocket invalides", async () => {
        let wsCallback: ((message: { body: string }) => void) | undefined;

        subscribeMock.mockImplementation((_channel, callback) => {
            wsCallback = callback;
            return { unsubscribe: unsubscribeMock };
        });

        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        renderPage();

        await screen.findByTestId('center-action-button')

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
        vi.mocked(getGameInfo).mockResolvedValueOnce(gameInfo4Teams as any);

        const view = renderPage();

        expect(await screen.findAllByText("SideRow-MECA-4")).toHaveLength(1);

        view.unmount();

        expect(unsubscribeMock).toHaveBeenCalled();
    });
});
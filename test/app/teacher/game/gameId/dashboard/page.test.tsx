import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, beforeEach, vi } from "vitest";
import Dashboard from "@/app/teacher/game/[gameId]/page";
import { getTeamsFullProgression, endMission } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";
import { renderPage } from "@/test/utils/renderPage";

// ---------- Mocks ----------
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABC123" }),
    useRouter: () => ({ replace: replaceMock }),
    usePathname: () => "/teacher/game/ABC123",
    useSearchParams: () => ({ get: vi.fn(() => null) }),
}));

vi.mock("@/api/missionApi", () => ({
    getTeamsFullProgression: vi.fn(),
    endMission: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/contexts/WebSocketProvider", () => ({
    useWebSocket: () => ({
        connected: true,
        subscribe: vi.fn(() => ({
            unsubscribe: vi.fn(),
        })),
    }),
}));

// ---------- UI mocks ----------
vi.mock("@/components/Toolbox", () => ({
    default: ({ centerAction, actions }: any) => (
        <div>
            {actions?.map((action: any) => (
                <button key={action.label} onClick={action.onClick}>
                    {action.label}
                </button>
            ))}
            {centerAction && (
                <button
                    data-testid="center-action-button"
                    onClick={centerAction.onClick}
                    disabled={centerAction.disabled}
                >
                    {centerAction.label}
                </button>
            )}
        </div>
    ),
}));

vi.mock("@/components/Checklist", () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div>Checklist ouverte</div> : <div>Checklist fermée</div>,
}));

vi.mock("@/components/IATech", () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div>IA ouverte</div> : <div>IA fermée</div>,
}));

vi.mock("@/components/teacher/SideRow", () => ({
    default: ({ team, classicMissionsCompleted }: { team: string; classicMissionsCompleted: number }) => (
        <div>
            SideRow-{team}-{classicMissionsCompleted}
        </div>
    ),
}));

vi.mock("@/components/PresentationModal", () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div>Presentation ouverte</div> : null,
}));

// ---------- Test data ----------
const gameInfo = {
    allTeamsCompleted: true,
    teamsFullProgression: {
        MECA: {
            completedMissions: {
                CLASSIC_1: true,
                CLASSIC_2: false,
            },
            teamProgression: {
                teamLabel: "MECA",
                classicMissionsCompleted: 4,
                firstBonusMissionCompleted: true,
                secondBonusMissionCompleted: false,
                allTeamsMissionsCompleted: false,
            },
        },
        AERO: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "AERO",
                classicMissionsCompleted: 3,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: true,
                allTeamsMissionsCompleted: false,
            },
        },
    },
};

// ---------- Tests ----------
describe("Dashboard page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getTeamsFullProgression).mockResolvedValue(gameInfo as any);
        sessionStorage.clear();
    });

    describe("Rendu et Navigation", () => {
        it("désactive le bouton Décollage si toutes les équipes n'ont pas fini", async () => {
            vi.mocked(getTeamsFullProgression).mockResolvedValue({
                ...gameInfo,
                allTeamsCompleted: false
            } as any);

            renderPage(<Dashboard />);

            const btn = await screen.findByTestId("center-action-button");
            expect(btn).toBeDisabled();
        });

        it("affiche correctement les équipes et le Toolbox", async () => {
            renderPage(<Dashboard />);

            expect(await screen.findByText("SideRow-MECA-4")).toBeInTheDocument();
            expect(screen.getByText("SideRow-AERO-3")).toBeInTheDocument();

            expect(screen.getByTestId("center-action-button")).toBeInTheDocument();
            expect(screen.getByText("Fin du tour")).toBeInTheDocument();
            expect(screen.getByText(/Aide\s*Technologies IA/i)).toBeInTheDocument();
        });

        it("affiche Checklist et IATech fermées par défaut", async () => {
            renderPage(<Dashboard />);
            expect(await screen.findByText("Checklist fermée")).toBeInTheDocument();
            expect(screen.getByText("IA fermée")).toBeInTheDocument();
        });

        it("ouvre Checklist quand on clique sur 'Fin du tour'", async () => {
            renderPage(<Dashboard />);
            fireEvent.click(await screen.findByText("Fin du tour"));
            expect(screen.getByText("Checklist ouverte")).toBeInTheDocument();
        });

        it("ouvre IATech quand on clique sur 'Aide Technologies IA'", async () => {
            renderPage(<Dashboard />);
            fireEvent.click(await screen.findByText(/Aide\s*Technologies IA/i));
            expect(screen.getByText("IA ouverte")).toBeInTheDocument();
        });
    });

    describe("Actions de mission (Décollage)", () => {
        it("ouvre la modale de confirmation au clic sur Décollage", async () => {
            const user = userEvent.setup();
            renderPage(<Dashboard />);

            const button = await screen.findByTestId("center-action-button");
            await user.click(button);

            expect(screen.getByText("Confirmation")).toBeInTheDocument();
            expect(screen.getByText(/Cette action est irréversible/i)).toBeInTheDocument();
        });

        it("ferme la modale quand on clique sur Annuler", async () => {
            const user = userEvent.setup();
            renderPage(<Dashboard />);

            await user.click(await screen.findByTestId("center-action-button"));
            await user.click(screen.getByRole("button", { name: "Annuler" }));

            await waitFor(() => {
                expect(screen.queryByText("Confirmation")).not.toBeInTheDocument();
            });
        });

        it("appelle endMission quand on confirme", async () => {
            const user = userEvent.setup();
            sessionStorage.setItem("hostId", "host-123");
            vi.mocked(endMission).mockResolvedValueOnce(undefined as any);

            renderPage(<Dashboard />);

            await user.click(await screen.findByTestId("center-action-button"));
            await user.click(screen.getByRole("button", { name: "Continuer" }));

            await waitFor(() => {
                expect(endMission).toHaveBeenCalledWith("ABC123", "host-123");
            });
            expect(showError).not.toHaveBeenCalled();
        });

        it("affiche une erreur si hostId est manquant lors de la confirmation", async () => {
            const user = userEvent.setup();
            renderPage(<Dashboard />);

            await user.click(await screen.findByTestId("center-action-button"));
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
            vi.mocked(endMission).mockRejectedValueOnce(new Error("boom"));

            renderPage(<Dashboard />);

            await user.click(await screen.findByTestId("center-action-button"));
            await user.click(screen.getByRole("button", { name: "Continuer" }));

            await waitFor(() => {
                expect(showError).toHaveBeenCalledWith(
                    "",
                    "Impossible de clôturer la mission"
                );
            });
        });
    });
});
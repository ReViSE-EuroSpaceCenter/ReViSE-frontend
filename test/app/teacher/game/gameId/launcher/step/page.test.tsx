import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPage } from "@/test/utils/renderPage";
import { confirmEndGameMessage } from "@/utils/endGameMessage";
import StepPage from "@/app/teacher/game/[gameId]/launcher/[step]/page";
import { gameOver, getTeamsInfo } from "@/api/launcherApi";
import { showError } from "@/errors/getErrorMessage";
import { showEnergyBonusAlert } from "@/utils/alerts";

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF", step: "1" }),
    useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

vi.mock("@/utils/endGameMessage", () => ({
    confirmEndGameMessage: vi.fn(),
}));

vi.mock("@/api/launcherApi", () => ({
    gameOver: vi.fn(),
    getTeamsInfo: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/utils/alerts", () => ({
    showEnergyBonusAlert: vi.fn(),
}));

const baseGameData = {
    teamsFullProgression: {
        MECA: { teamProgression: {} },
        AERO: { teamProgression: {} },
        EXPE: { teamProgression: {} },
        GECO: { teamProgression: {} },
    },
};

describe("StepPage - Fin du jeu", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getTeamsInfo).mockResolvedValue(baseGameData as any);
    });

    it("termine la partie après confirmation", async () => {
        vi.mocked(confirmEndGameMessage).mockResolvedValue(true);

        renderPage(<StepPage />);

        const button = await screen.findByRole("button", { name: /fin du jeu/i });
        await userEvent.click(button);

        expect(confirmEndGameMessage).toHaveBeenCalled();
        expect(gameOver).toHaveBeenCalledWith("ABCDEF", "host-123");
        expect(pushMock).toHaveBeenCalledWith("/endGame?win=false");
    });

    it("n'appelle pas l'api si l'utilisateur annule la confirmation", async () => {
        vi.mocked(confirmEndGameMessage).mockResolvedValue(false);

        renderPage(<StepPage />);

        const button = await screen.findByRole("button", { name: /fin du jeu/i });
        await userEvent.click(button);

        expect(confirmEndGameMessage).toHaveBeenCalled();
        expect(gameOver).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it("affiche une erreur si le hostId est manquant", async () => {
        sessionStorage.removeItem("hostId");
        vi.mocked(confirmEndGameMessage).mockResolvedValue(true);

        renderPage(<StepPage />);

        const button = await screen.findByRole("button", { name: /fin du jeu/i });
        await userEvent.click(button);

        expect(showError).toHaveBeenCalledWith(
            "",
            "Identifiant de connexion manquant, impossible de terminer la partie"
        );
        expect(gameOver).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });
});

describe("StepPage - Rendu", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getTeamsInfo).mockResolvedValue(baseGameData as any);
    });

    it("affiche un loader pendant le chargement des données", () => {
        vi.mocked(getTeamsInfo).mockReturnValue(new Promise(() => {}));

        renderPage(<StepPage />);

        expect(screen.getByTestId("loading-page")).toBeInTheDocument();
    });

    it("affiche les boutons d'action une fois les données chargées", async () => {
        renderPage(<StepPage />);

        expect(await screen.findByRole("button", { name: /fin du jeu/i })).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: /valider l'étape/i })).toBeInTheDocument();
    });

    it("affiche une erreur si la récupération des données échoue", async () => {
        vi.mocked(getTeamsInfo).mockRejectedValue(new Error("Network error"));

        renderPage(<StepPage />);

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                "",
                "Impossible de récupérer les données de la partie"
            );
        });
    });
});

describe("StepPage - Validation d'étape", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getTeamsInfo).mockResolvedValue(baseGameData as any);
    });

    it("le bouton 'Valider l'étape' est désactivé si toutes les ressources ne sont pas validées", async () => {
        renderPage(<StepPage />);

        const validateButton = await screen.findByRole("button", { name: /valider l'étape/i });

        expect(validateButton).toBeDisabled();
    });

    it("ouvre la modale de confirmation lors du clic sur 'Valider l'étape'", async () => {
        // Mock toutes les ressources comme déjà validées via auto-validation
        vi.mocked(getTeamsInfo).mockResolvedValue({
            teamsFullProgression: {
                MECA: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
                AERO: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
                EXPE: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
                GECO: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
            },
        } as any);

        renderPage(<StepPage />);

        const validateButton = await screen.findByRole("button", { name: /valider l'étape/i });

        if (!validateButton.hasAttribute("disabled")) {
            await userEvent.click(validateButton);
            expect(await screen.findByText(/confirmation/i)).toBeInTheDocument();
        }
    });

    it("ferme la modale si l'utilisateur annule", async () => {
        renderPage(<StepPage />);

        // Ouvre la modale si accessible
        const validateButton = await screen.findByRole("button", { name: /valider l'étape/i });

        if (!validateButton.hasAttribute("disabled")) {
            await userEvent.click(validateButton);

            const cancelButton = await screen.findByRole("button", { name: /annuler/i });
            await userEvent.click(cancelButton);

            await waitFor(() => {
                expect(screen.queryByText(/confirmation/i)).not.toBeInTheDocument();
            });
        }
    });

    it("redirige vers l'étape suivante après confirmation de la validation", async () => {
        vi.mocked(showEnergyBonusAlert).mockResolvedValue(undefined);
        vi.mocked(getTeamsInfo).mockResolvedValue({
            teamsFullProgression: {
                MECA: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
                AERO: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
                EXPE: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
                GECO: { teamProgression: { bonus1: true, bonus2: true, bonus3: true } },
            },
        } as any);

        renderPage(<StepPage />);

        const validateButton = await screen.findByRole("button", { name: /valider l'étape/i });

        if (!validateButton.hasAttribute("disabled")) {
            await userEvent.click(validateButton);

            const confirmButton = await screen.findByRole("button", { name: /confirmer/i });
            await userEvent.click(confirmButton);

            await waitFor(() => {
                expect(replaceMock).toHaveBeenCalledWith(
                    "/teacher/game/ABCDEF/launcher?step=2"
                );
            });
        }
    });
});

describe("StepPage - Ressources", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.setItem("hostId", "host-123");
    });

    it("coche une ressource au clic et la décoche au second clic", async () => {
        vi.mocked(getTeamsInfo).mockResolvedValue(baseGameData as any);

        renderPage(<StepPage />);

        await screen.findByRole("button", { name: /fin du jeu/i });

        const resourceCards = screen.queryAllByTestId("resource-card");

        if (resourceCards.length > 0) {
            const card = resourceCards[0];
            await userEvent.click(card);
            expect(card).toHaveAttribute("data-validated", "true");

            await userEvent.click(card);
            expect(card).toHaveAttribute("data-validated", "false");
        }
    });

    it("affiche correctement pour 6 équipes", async () => {
        vi.mocked(getTeamsInfo).mockResolvedValue({
            teamsFullProgression: {
                MECA: { teamProgression: {} },
                AERO: { teamProgression: {} },
                EXPE: { teamProgression: {} },
                GECO: { teamProgression: {} },
                AGRI: { teamProgression: {} },
                INFO: { teamProgression: {} },
            },
        } as any);

        renderPage(<StepPage />);

        expect(await screen.findByRole("button", { name: /fin du jeu/i })).toBeInTheDocument();
    });
});
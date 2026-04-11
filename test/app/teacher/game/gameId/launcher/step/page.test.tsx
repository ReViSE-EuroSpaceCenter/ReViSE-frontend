import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPage } from "@/test/utils/renderPage";
import { confirmEndGameMessage } from "@/utils/endGameMessage";
import StepPage from "@/app/teacher/game/[gameId]/launcher/[step]/page";
import {gameOver, getTeamsInfo} from "@/api/launcherApi";
import {showError} from "@/errors/getErrorMessage";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF", step: "1" }),
    useRouter: () => ({ push: pushMock, replace: vi.fn() }),
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

describe("StepPage - Fin du jeu", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getTeamsInfo).mockResolvedValue({
            teamsFullProgression: {
                MECA: { teamProgression: {} },
                AERO: { teamProgression: {} },
                EXPE: { teamProgression: {} },
                GECO: { teamProgression: {} },
            },
        } as any);
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
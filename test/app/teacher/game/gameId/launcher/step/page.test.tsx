import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPage } from "@/test/utils/renderPage";
import { confirmEndGameMessage } from "@/utils/endGameMessage";
import StepPage from "@/app/teacher/game/[gameId]/launcher/[step]/page";
import {getTeamsFullProgression} from "@/api/missionApi";
import {endGame} from "@/api/discoverApi";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF", step: "1" }),
    useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/utils/endGameMessage", () => ({
    confirmEndGameMessage: vi.fn(),
}));

vi.mock("@/api/discoverApi", () => ({
    endGame: vi.fn(),
}));

vi.mock("@/api/missionApi", () => ({
    getTeamsFullProgression: vi.fn(),
}));

describe("StepPage - Fin du jeu", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.setItem("hostId", "host-123");
        vi.mocked(getTeamsFullProgression).mockResolvedValue({
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
        expect(endGame).toHaveBeenCalledWith("ABCDEF", "host-123");
        expect(pushMock).toHaveBeenCalledWith("/endGame");
    });

    it("n'appelle pas l'api si l'utilisateur annule la confirmation", async () => {
        vi.mocked(confirmEndGameMessage).mockResolvedValue(false);

        renderPage(<StepPage />);

        const button = await screen.findByRole("button", { name: /fin du jeu/i });

        await userEvent.click(button);

        expect(confirmEndGameMessage).toHaveBeenCalled();
        expect(endGame).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });
});
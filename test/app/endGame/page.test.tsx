import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderPage } from "@/test/utils/renderPage";
import EndGamePage from "@/app/endGame/page";

const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
    useSearchParams: () => mockUseSearchParams(),
}));

describe("EndGamePage", () => {

    it("affiche le contenu de victoire", () => {
        mockUseSearchParams.mockReturnValue({
            get: () => "true",
        });

        renderPage(<EndGamePage />);

        expect(
            screen.getByRole("heading", { name: /Merci d’avoir joué à ReVisE !/i })
        ).toBeInTheDocument();

    });

    it("affiche le contenu d'échec", () => {
        mockUseSearchParams.mockReturnValue({
            get: () => "false",
        });

        renderPage(<EndGamePage />);

        expect(
            screen.getByRole("heading", { name: /Merci d’avoir joué à ReVisE ! Vous avez perdu !/i })
        ).toBeInTheDocument();

    });

    it("contient un lien vers l'accueil", () => {
        mockUseSearchParams.mockReturnValue({
            get: () => "true",
        });

        renderPage(<EndGamePage />);

        const link = screen.getByRole("link", { name: /retour à l’accueil/i });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
    });
    it("exécute le scroll automatique", () => {
        mockUseSearchParams.mockReturnValue({
            get: () => "true",
        });

        const callbacks: FrameRequestCallback[] = [];

        vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            callbacks.push(callback);
            return callbacks.length;
        });

        renderPage(<EndGamePage />);

        callbacks[0](1000);
        callbacks[1](4000);
        callbacks[2](5200);

        expect(window.scrollTo).toHaveBeenCalledTimes(3);

        vi.restoreAllMocks();
    });
});

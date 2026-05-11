import { screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderPage } from "@/test/utils/renderPage";
import EndGamePage from "@/app/endGame/page";

const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
    useSearchParams: () => mockUseSearchParams(),
}));

describe("EndGamePage", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        mockUseSearchParams.mockReset();
    });

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
            screen.getByRole("heading", { name: /Merci d’avoir joué à ReVisE !\s*Vous avez perdu !/i, })
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
        mockUseSearchParams.mockReturnValue({ get: () => "true" });

        const callbacks: FrameRequestCallback[] = [];

        vi.spyOn(performance, "now").mockReturnValue(0);
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
            callbacks.push(cb);
            return callbacks.length;
        });

        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

        const { container, unmount } = renderPage(<EndGamePage />);
        const scrollContainer = container.firstElementChild as HTMLDivElement;

        Object.defineProperty(scrollContainer, "scrollHeight", {
            value: 1000,
            configurable: true,
        });

        Object.defineProperty(scrollContainer, "clientHeight", {
            value: 500,
            configurable: true,
        });

        callbacks[0](1000);
        callbacks[1](5200);

        expect(scrollContainer.scrollTop).toBeGreaterThan(0);
        unmount();
        expect(window.cancelAnimationFrame).toHaveBeenCalled();
        vi.restoreAllMocks();
    });
});
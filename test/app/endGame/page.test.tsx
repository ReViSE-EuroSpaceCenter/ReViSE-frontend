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
            screen.getByRole("heading", { name: /voyage terminé/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/félicitations à tous les membres/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/recherche de vie sur europe/i)
        ).toBeInTheDocument();
    });

    it("affiche le contenu d'échec", () => {
        mockUseSearchParams.mockReturnValue({
            get: () => "false",
        });

        renderPage(<EndGamePage />);

        expect(
            screen.getByRole("heading", { name: /vous avez échoué/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/vous manquez de ressources/i)
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

});
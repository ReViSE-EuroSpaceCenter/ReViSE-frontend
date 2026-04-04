import { screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import {renderPage} from "@/test/utils/renderPage";
import EndGamePage from "@/app/endGame/page";

describe("EndGamePage", () => {
    beforeEach(() => {
        renderPage(<EndGamePage />);
    });

    it("affiche le titre de fin de partie", () => {
        expect(
            screen.getByRole("heading", { name: /voyage terminé/i })
        ).toBeInTheDocument();
    });

    it("affiche le message de félicitations", () => {
        expect(
            screen.getByText(/félicitations à tous les membres/i)
        ).toBeInTheDocument();
    });

    it("affiche le texte explicatif", () => {
        expect(
            screen.getByText(/recherche de vie sur europe/i)
        ).toBeInTheDocument();
    });

    it("contient un lien vers l'accueil", () => {
        const link = screen.getByRole("link", { name: /retour à l’accueil/i });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
    });

});
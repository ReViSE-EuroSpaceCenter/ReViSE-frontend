import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresentationModal from "@/components/PresentationModal";

vi.mock("next/image", () => ({
    default: (props: any) => <img {...props} />,
}));

describe("PresentationModal", () => {
    const baseProps = {
        isOpen: true,
        setIsOpen: vi.fn(),
        icon: "/test.svg",
        text: "Texte simple",
        name: "PRESENTATION",
        color: "#fff",
        onClose: vi.fn(),
    };

    const renderModal = (props = {}) => {
        const merged = { ...baseProps, ...props };
        render(<PresentationModal {...merged} />);
        return merged;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("ne rend rien si name est manquant", () => {
        renderModal({ name: undefined });

        expect(screen.queryByText(/continuer/i)).not.toBeInTheDocument();
    });

    it("ne rend rien si icon est manquant", () => {
        renderModal({ icon: undefined });

        expect(screen.queryByText(/continuer/i)).not.toBeInTheDocument();
    });

    it("ne rend rien si text est manquant", () => {
        renderModal({ text: undefined });

        expect(screen.queryByText(/continuer/i)).not.toBeInTheDocument();
    });

    it("affiche le titre correct pour PRESENTATION", () => {
        renderModal();

        expect(
            screen.getByText(/présentation du voyage vers europe/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour une équipe", () => {
        renderModal({ name: "MECA" });

        expect(
            screen.getByText(/présentation de l'équipe - meca/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre par défaut", () => {
        renderModal({ name: "ALIEN" });

        expect(
            screen.getByText(/nouvelle espèce découverte : alien/i)
        ).toBeInTheDocument();
    });

    it("affiche l'image avec le bon src", () => {
        renderModal();

        const img = screen.getByRole("img");

        expect(img).toHaveAttribute("src", "/test.svg");
    });

    it("affiche le texte", () => {
        renderModal({ text: "Bonjour le monde" });

        expect(screen.getByText(/bonjour le monde/i)).toBeInTheDocument();
    });

    it("rend le texte en gras avec ** **", () => {
        renderModal({ text: "Ceci est **important** !" });

        const bold = screen.getByText("important");

        expect(bold.tagName).toBe("STRONG");
    });

    it("gère les retours à la ligne", () => {
        renderModal({
            text: "ligne 1\nligne 2",
        });

        expect(screen.getByText(/ligne 1/i)).toBeInTheDocument();
        expect(screen.getByText(/ligne 2/i)).toBeInTheDocument();
    });

    it("détecte les lignes de liste", () => {
        renderModal({
            text: "• élément 1\n• élément 2",
        });

        expect(screen.getByText(/élément 1/i)).toBeInTheDocument();
        expect(screen.getByText(/élément 2/i)).toBeInTheDocument();
    });

    it("ferme la modal au clic sur continuer", async () => {
        const props = renderModal();

        const button = screen.getByRole("button", {
            name: /continuer/i,
        });

        await userEvent.click(button);

        expect(props.setIsOpen).toHaveBeenCalledWith(false);
    });

    it("appelle onClose si fourni", async () => {
        const props = renderModal();

        const button = screen.getByRole("button", {
            name: /continuer/i,
        });

        await userEvent.click(button);

        expect(props.onClose).toHaveBeenCalled();
    });

    it("n'appelle pas onClose s'il n'existe pas", async () => {
        const props = renderModal({ onClose: undefined });

        const button = screen.getByRole("button", {
            name: /continuer/i,
        });

        await userEvent.click(button);

        expect(props.setIsOpen).toHaveBeenCalledWith(false);
    });
});
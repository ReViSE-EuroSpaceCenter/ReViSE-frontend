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

    it("affiche le titre correct pour TEACHER", () => {
        renderModal({name: "TEACHER"});

        expect(
          screen.getByText(/Présentation du jeu - ReViSE/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour AERO", () => {
        renderModal({ name: "AERO" });

        expect(
          screen.getByText(/Équipe Ingénierie Aérospatiale – AERO/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour EXPE", () => {
        renderModal({ name: "EXPE" });

        expect(
          screen.getByText(/Équipe Exploration d’Europe – EXPE/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour COOP", () => {
        renderModal({ name: "COOP" });

        expect(
          screen.getByText(/Équipe Coordination opérationnelle – COOP/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour GECO", () => {
        renderModal({ name: "GECO" });

        expect(
          screen.getByText(/Équipe Gestion Écosystémique – GECO/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour MEDI", () => {
        renderModal({ name: "MEDI" });

        expect(
          screen.getByText(/Équipe Accompagnement Psycho Médical – MEDI/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre pour MECA", () => {
        renderModal({ name: "MECA" });

        expect(
            screen.getByText(/Équipe Ingénierie Mécatronique – MECA/i)
        ).toBeInTheDocument();
    });

    it("affiche le titre par défaut", () => {
        renderModal({ name: "ALIEN" });

        expect(
            screen.getByText(/alien/i)
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
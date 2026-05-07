import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import PresentationModal from "@/components/PresentationModal";

const defaultProps = {
    isOpen: true,
    setIsOpen: vi.fn(),
    icon: "/icons/meca.svg",
    text: "Texte de présentation.",
    name: "MECA",
    color: "#FF0000",
};

describe("PresentationModal - Rendu conditionnel", () => {
    it("ne rend rien si 'name' est absent", () => {
        const { container } = render(
            <PresentationModal {...defaultProps} name={undefined} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("ne rend rien si 'icon' est absent", () => {
        const { container } = render(
            <PresentationModal {...defaultProps} icon={undefined} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("ne rend rien si 'text' est absent", () => {
        const { container } = render(
            <PresentationModal {...defaultProps} text={undefined} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("ne rend rien si la modale est fermée", () => {
        render(<PresentationModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("rend la modale si toutes les props requises sont présentes", () => {
        render(<PresentationModal {...defaultProps} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
});

describe("PresentationModal - Titres selon 'name'", () => {
    const cases: [string, string][] = [
        ["TEACHER", "Présentation du jeu - ReViSE"],
        ["MECA", "Équipe Ingénierie Mécatronique – MECA"],
        ["GECO", "Équipe Gestion Écosystémique – GECO"],
        ["EXPE", "Équipe Exploration d’Europe – EXPE"],
        ["MEDI", "Équipe Accompagnement Psycho Médical – MEDI"],
        ["AERO", "Équipe Ingénierie Aérospatiale – AERO"],
        ["COOP", "Équipe Coordination opérationnelle – COOP"],
        ["IA", "Fiabilité des systèmes d’IA"],
        ["LAUNCHER", "Voyage interplanétaire"],
    ];

    it.each(cases)("affiche le bon titre pour name='%s'", (name, expectedTitle) => {
        render(<PresentationModal {...defaultProps} name={name} />);
        expect(screen.getByText(expectedTitle)).toBeInTheDocument();
    });

    it("affiche le name brut si non reconnu", () => {
        render(<PresentationModal {...defaultProps} name="INCONNU" />);
        expect(screen.getByText("INCONNU")).toBeInTheDocument();
    });
});

describe("PresentationModal - Fermeture", () => {
    let setIsOpen: ReturnType<typeof vi.fn>;
    let onClose: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        setIsOpen = vi.fn();
        onClose = vi.fn();
    });

    it("appelle setIsOpen(false) au clic sur 'Continuer'", async () => {
        render(
            <PresentationModal {...defaultProps} setIsOpen={setIsOpen} />
        );

        await userEvent.click(screen.getByRole("button", { name: /continuer/i }));

        expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("appelle onClose au clic sur 'Continuer' si fourni", async () => {
        render(
            <PresentationModal {...defaultProps} setIsOpen={setIsOpen} onClose={onClose} />
        );

        await userEvent.click(screen.getByRole("button", { name: /continuer/i }));

        expect(onClose).toHaveBeenCalledOnce();
    });

    it("n'appelle pas onClose si non fourni", async () => {
        render(
            <PresentationModal {...defaultProps} setIsOpen={setIsOpen} />
        );

        await userEvent.click(screen.getByRole("button", { name: /continuer/i }));

        // Aucune erreur levée = onClose absent géré correctement
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("appelle setIsOpen(false) lors de la fermeture via Headless UI (Escape / backdrop)", () => {
        render(
            <PresentationModal {...defaultProps} setIsOpen={setIsOpen} />
        );

        fireEvent.keyDown(document.activeElement ?? document.body, {
            key: "Escape",
            code: "Escape",
        });

        expect(setIsOpen).toHaveBeenCalledWith(false);
    });
});

describe("PresentationModal - Rendu du texte", () => {
    it("affiche le texte fourni", () => {
        render(<PresentationModal {...defaultProps} text="Bonjour le monde." />);
        expect(screen.getByText("Bonjour le monde.")).toBeInTheDocument();
    });

    it("rend le texte en gras avec la syntaxe **bold**", () => {
        render(
            <PresentationModal {...defaultProps} text="Voici du **texte en gras** ici." />
        );
        expect(screen.getByText("texte en gras").tagName).toBe("STRONG");
    });

    it("rend les listes avec bullet point (•)", () => {
        render(
            <PresentationModal {...defaultProps} text="• Premier élément" />
        );
        const paragraph = screen.getByText(/Premier élément/).closest("p");
        expect(paragraph).toHaveClass("flex");
    });

    it("rend les lignes normales centrées par défaut", () => {
        render(
            <PresentationModal {...defaultProps} text="Ligne normale" isJustify={false} />
        );
        const paragraph = screen.getByText(/Ligne normale/).closest("p");
        expect(paragraph).toHaveClass("text-center");
    });

    it("rend le texte justifié si isJustify=true", () => {
        render(
            <PresentationModal {...defaultProps} text="Ligne justifiée" isJustify={true} />
        );
        const paragraph = screen.getByText(/Ligne justifiée/).closest("p");
        expect(paragraph).toHaveClass("text-justify");
    });

    it("gère plusieurs lignes séparées par \\n", () => {
        render(
            <PresentationModal {...defaultProps} text={"Ligne 1\nLigne 2\nLigne 3"} />
        );
        expect(screen.getByText("Ligne 1")).toBeInTheDocument();
        expect(screen.getByText("Ligne 2")).toBeInTheDocument();
        expect(screen.getByText("Ligne 3")).toBeInTheDocument();
    });
});

describe("PresentationModal - Image", () => {
    it("affiche l'image avec le bon src", () => {
        render(<PresentationModal {...defaultProps} icon="/icons/meca.svg" />);
        const img = screen.getByRole("img", { name: /\/icons\/meca\.svg/i });
        expect(img).toHaveAttribute("src", expect.stringContaining("meca.svg"));
    });

    it("applique la classe spécifique pour /logo.svg", () => {
        render(<PresentationModal {...defaultProps} icon="/logo.svg" />);
        const img = screen.getByRole("img", { name: /\/logo\.svg/i });
        expect(img).toHaveClass("w-35");
    });

    it("applique la classe standard pour une icône non-logo", () => {
        render(<PresentationModal {...defaultProps} icon="/icons/meca.svg" />);
        const img = screen.getByRole("img");
        expect(img).toHaveClass("w-20");
    });
});

describe("PresentationModal - Couleur du titre", () => {
    it("applique la couleur fournie au titre", () => {
        render(<PresentationModal {...defaultProps} color="#ABC123" />);
        const title = screen.getByText("Équipe Ingénierie Mécatronique – MECA");
        expect(title).toHaveStyle({ color: "#ABC123" });
    });
});
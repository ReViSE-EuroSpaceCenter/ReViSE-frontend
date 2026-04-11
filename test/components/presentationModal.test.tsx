import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PresentationModal from "@/components/PresentationModal";

vi.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => <img {...props} data-testid="mock-image" />,
}));

vi.mock("@headlessui/react", () => ({
	Dialog: ({ open, onClose, children }: any) =>
		open ? (
			<div data-testid="dialog" onClick={() => onClose()}>
				{children}
			</div>
		) : null,
	DialogPanel: ({ children }: any) => (
		<div data-testid="dialog-panel">{children}</div>
	),
	DialogTitle: ({ children }: any) => (
		<h2 data-testid="dialog-title">{children}</h2>
	),
}));

describe("PresentationModal", () => {
	it("ne rend rien si name, icon ou text manquent", () => {
		const { container } = render(
			<PresentationModal isOpen={true} setIsOpen={() => {}} />
		);

		expect(container.firstChild).toBeNull();
	});

	it("rend le modal quand tous les props sont présents", () => {
		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={() => {}}
				name="EXPE"
				icon="/img.png"
				text="Hello"
			/>
		);

		expect(screen.getByTestId("dialog")).toBeInTheDocument();
		expect(screen.getByTestId("dialog-panel")).toBeInTheDocument();
		expect(screen.getByTestId("mock-image")).toBeInTheDocument();
	});

	it("ferme la modal quand on clique sur le bouton Continuer", () => {
		const setIsOpen = vi.fn();

		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={setIsOpen}
				name="EXPE"
				icon="/img.png"
				text="Hello"
			/>
		);

		fireEvent.click(screen.getByText("Continuer"));

		expect(setIsOpen).toHaveBeenCalledWith(false);
	});

	it("appelle onClose en plus de setIsOpen(false)", () => {
		const setIsOpen = vi.fn();
		const onClose = vi.fn();

		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={setIsOpen}
				onClose={onClose}
				name="EXPE"
				icon="/img.png"
				text="Hello"
			/>
		);

		fireEvent.click(screen.getByText("Continuer"));

		expect(setIsOpen).toHaveBeenCalledWith(false);
		expect(onClose).toHaveBeenCalled();
	});

	it("ferme la modal quand on clique en dehors (onClose du Dialog)", () => {
		const setIsOpen = vi.fn();

		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={setIsOpen}
				name="EXPE"
				icon="/img.png"
				text="Hello"
			/>
		);

		fireEvent.click(screen.getByTestId("dialog"));

		expect(setIsOpen).toHaveBeenCalledWith(false);
	});

	it("affiche le bon titre pour une équipe", () => {
		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={() => {}}
				name="MECA"
				icon="/img.png"
				text="Hello"
			/>
		);

		expect(screen.getByTestId("dialog-title").textContent).toBe(
			"Présentation de l'équipe - MECA"
		);
	});

	it("affiche le bon titre pour PRESENTATION", () => {
		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={() => {}}
				name="PRESENTATION"
				icon="/img.png"
				text="Hello"
			/>
		);

		expect(screen.getByTestId("dialog-title").textContent).toBe(
			"Présentation du voyage vers Europe"
		);
	});

	it("affiche du texte avec gras (**bold**)", () => {
		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={() => {}}
				name="EXPE"
				icon="/img.png"
				text="Voici un **texte important**"
			/>
		);

		expect(screen.getByText("texte important")).toBeInTheDocument();
		expect(screen.getByText("texte important").tagName).toBe("STRONG");
	});

	it("affiche une liste avec puces •", () => {
		render(
			<PresentationModal
				isOpen={true}
				setIsOpen={() => {}}
				name="EXPE"
				icon="/img.png"
				text={"• Élément 1\n• Élément 2"}
			/>
		);

		expect(screen.getByText("• Élément 1")).toBeInTheDocument();
		expect(screen.getByText("• Élément 2")).toBeInTheDocument();
	});
});

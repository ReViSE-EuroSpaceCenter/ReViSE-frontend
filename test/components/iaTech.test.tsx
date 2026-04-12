import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import IATech from "@/components/IATech";

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
}));

describe("IATech", () => {
	it("n'affiche rien quand isOpen = false", () => {
		render(<IATech isOpen={false} setIsOpen={() => {}} />);

		expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
	});

	it("affiche le Dialog quand isOpen = true", () => {
		render(<IATech isOpen={true} setIsOpen={() => {}} />);

		expect(screen.getByTestId("dialog")).toBeInTheDocument();
		expect(screen.getByTestId("dialog-panel")).toBeInTheDocument();
	});

	it("affiche l'image IA", () => {
		render(<IATech isOpen={true} setIsOpen={() => {}} />);

		const img = screen.getByTestId("mock-image");
		expect(img).toHaveAttribute("src", "/IA.svg");
		expect(img).toHaveAttribute("alt", "Technologies d'IA");
	});

	it("ferme la modal quand on clique sur le bouton ✕", () => {
		const setIsOpen = vi.fn();

		render(<IATech isOpen={true} setIsOpen={setIsOpen} />);

		fireEvent.click(screen.getByLabelText("Fermer"));

		expect(setIsOpen).toHaveBeenCalledWith(false);
	});

	it("ferme la modal quand on clique en dehors (onClose)", () => {
		const setIsOpen = vi.fn();

		render(<IATech isOpen={true} setIsOpen={setIsOpen} />);

		fireEvent.click(screen.getByTestId("dialog"));

		expect(setIsOpen).toHaveBeenCalledWith(false);
	});
});

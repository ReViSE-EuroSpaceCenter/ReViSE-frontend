import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import Checklist from "@/components/Checklist";

const setIsOpenMock = vi.fn();

vi.mock("@/utils/alerts", () => ({
	showHint: vi.fn(),
}));

vi.mock("@headlessui/react", () => ({
	Dialog: ({ children }: any) => <div>{children}</div>,
	DialogPanel: ({ children }: any) => <div>{children}</div>,
	DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

describe("Checklist", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("affiche le titre et la première étape", () => {
		render(<Checklist isOpen={true} setIsOpen={setIsOpenMock} />);

		expect(screen.getByText(/Check-List/i)).toBeInTheDocument();
		expect(
			screen.getByText(/hallucinations/i)
		).toBeInTheDocument();
	});

	it("affiche les étapes progressivement", () => {
		render(<Checklist isOpen={true} setIsOpen={setIsOpenMock} />);

		expect(screen.getAllByRole("button", { name: /Cocher/i })).toHaveLength(1);

		fireEvent.click(screen.getByRole("button", { name: /Cocher/i }));

		expect(screen.getAllByRole("button", { name: /Cocher/i }).length).toBeGreaterThan(1);
	});

	it("permet de cocher et décocher avec logique de reset", () => {
		render(<Checklist isOpen={true} setIsOpen={setIsOpenMock} />);

		const step1 = screen.getByRole("button", { name: /Cocher/i });

		fireEvent.click(step1);
		fireEvent.click(step1);

		expect(screen.getAllByRole("button", { name: /Cocher/i })).toHaveLength(1);
	});

	it("appelle showHint quand on clique sur ?", async () => {
		const { showHint } = await import("@/utils/alerts");

		render(<Checklist isOpen={true} setIsOpen={setIsOpenMock} />);

		const hintBtn = screen.getByRole("button", { name: /Indice/i });

		fireEvent.click(hintBtn);

		expect(showHint).toHaveBeenCalled();
	});

	it("ferme la modal et reset les étapes", () => {
		render(<Checklist isOpen={true} setIsOpen={setIsOpenMock} />);

		fireEvent.click(screen.getByRole("button", { name: /Cocher/i }));
		fireEvent.click(screen.getByLabelText("Fermer"));

		expect(setIsOpenMock).toHaveBeenCalledWith(false);
	});
});
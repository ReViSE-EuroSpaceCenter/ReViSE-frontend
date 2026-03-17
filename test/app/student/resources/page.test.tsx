import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Resources from "@/app/student/game/[gameId]/[teamName]/resources/page";

const mutateMock = vi.fn();
const useResourcesMock = vi.fn();

vi.mock("@/hooks/useResources", () => ({
	useResources: () => useResourcesMock(),
}));

describe("Resources", () => {

	beforeEach(() => {
		vi.clearAllMocks();

		useResourcesMock.mockReturnValue({
			mutate: mutateMock,
			isPending: false,
		});
	});

	it("affiche le bouton de validation", () => {
		render(<Resources />);

		expect(
			screen.getByRole("button", { name: /valider les ressources/i })
		).toBeInTheDocument();
	});

	it("permet de saisir une valeur", () => {
		render(<Resources />);

		const inputs = screen.getAllByRole("spinbutton");

		fireEvent.change(inputs[0], { target: { value: "10" } });

		expect(inputs[0]).toHaveValue(10);
	});

	it("désactive le bouton pendant l'envoi", () => {

		useResourcesMock.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		});

		render(<Resources />);

		const button = screen.getByRole("button");

		expect(button).toBeDisabled();
		expect(screen.getByText(/envoi en cours/i)).toBeInTheDocument();
	});

	it("envoie les valeurs correctes au submit", () => {
		render(<Resources />);

		const inputs = screen.getAllByRole("spinbutton");

		fireEvent.change(inputs[0], { target: { value: "20" } });
		fireEvent.change(inputs[1], { target: { value: "4" } });
		fireEvent.change(inputs[2], { target: { value: "3" } });

		fireEvent.click(
			screen.getByRole("button", { name: /valider les ressources/i })
		);

		expect(mutateMock).toHaveBeenCalledWith({
			resources: 20,
			humans: 4,
			time: 3,
		});
	});

	it("empêche la saisie de e, E, + et -", () => {
		render(<Resources />);

		const input = screen.getAllByRole("spinbutton")[0];

		fireEvent.change(input, { target: { value: "1" } });
		expect(input).toHaveValue(1);

		const blockedKeys = ["e", "E", "+", "-"];

		blockedKeys.forEach((key) => {
			fireEvent.keyDown(input, { key });
			expect(input).toHaveValue(1);
		});
	});

});
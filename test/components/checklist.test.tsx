import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Checklist from "@/components/Checklist";
import { showHint } from "@/utils/alerts";

vi.mock("@/utils/alerts", () => ({
    showHint: vi.fn(),
}));

describe("Checklist", () => {
    const setup = (isOpen = true) => {
        const setIsOpen = vi.fn();

        render(<Checklist isOpen={isOpen} setIsOpen={setIsOpen} />);

        return { setIsOpen };
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("affiche la checklist quand isOpen est true", () => {
        setup(true);

        expect(
            screen.getByText(/Quand vous n’avez plus de points d’action PA disponibles, vous devez effectuer les actions suivantes :/i)
        ).toBeInTheDocument();
    });

    it("n'affiche rien quand isOpen est false", () => {
        setup(false);

        expect(
            screen.queryByText(/Quand vous n’avez plus de points d’action PA disponibles, vous devez effectuer les actions suivantes :/i)
        ).not.toBeInTheDocument();
    });

    it("applique un style barré quand une étape est cochée", async () => {
        setup();

        const firstCheckbox = screen.getByRole("button", {
            name: /cocher/i,
        });

        const text = screen.getByText(/hallucinations/i);

        await userEvent.click(firstCheckbox);

        expect(text).toHaveClass("line-through");
    });

    it("appelle showHint quand on clique sur le bouton indice", async () => {
        setup();

        const hintButton = screen.getByRole("button", {
            name: /indice/i,
        });

        await userEvent.click(hintButton);

        expect(showHint).toHaveBeenCalled();
    });

    it("ferme la modal quand on clique sur le bouton fermer", async () => {
        const { setIsOpen } = setup();

        const closeButton = screen.getByLabelText(/fermer/i);

        await userEvent.click(closeButton);

        expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("ferme automatiquement la modal quand toutes les étapes sont cochées", async () => {
        const { setIsOpen } = setup();

        for (let i = 0; i < 4; i++) {
            const checkboxes = screen.getAllByRole("button", {
                name: /cocher/i,
            });

            const lastCheckbox = checkboxes[checkboxes.length - 1];

            await userEvent.click(lastCheckbox);
        }

        await waitFor(() => {
            expect(setIsOpen).toHaveBeenCalledWith(false);
        });
    });
});
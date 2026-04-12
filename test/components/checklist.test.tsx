import { render, screen } from "@testing-library/react";
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
            screen.getByText(/check-list — fin du tour/i)
        ).toBeInTheDocument();
    });

    it("n'affiche rien quand isOpen est false", () => {
        setup(false);

        expect(
            screen.queryByText(/check-list — fin du tour/i)
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
});
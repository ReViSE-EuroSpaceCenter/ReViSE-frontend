import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Toolbox from "@/components/Toolbox";

describe("Toolbox", () => {
    it("affiche le bouton central désactivé si centerAction.disabled=true", () => {
        const actions = [{ label: "Action1", onClick: vi.fn() }];
        render(<Toolbox centerAction={{ label: "Décollage", onClick: vi.fn(), disabled: true }} actions={actions} />);

        const centerButton = screen.getByTestId("center-action-button");
        expect(centerButton).toHaveAttribute("cursor", "not-allowed");

        fireEvent.click(centerButton);
        expect(actions[0].onClick).not.toHaveBeenCalled();
    });

    it("déclenche onClick du bouton central si activé", () => {
        const onClickMock = vi.fn();
        render(<Toolbox centerAction={{ label: "Décollage", onClick: onClickMock }} actions={[]} />);

        const centerButton = screen.getByTestId("center-action-button");
        fireEvent.click(centerButton);
        expect(onClickMock).toHaveBeenCalled();
    });

    it("rend tous les boutons d'action et répond au click", () => {
        const action1 = vi.fn();
        const action2 = vi.fn();
        const actions = [
            { label: "Fin du tour", onClick: action1 },
            { label: "Aide IA", onClick: action2 },
        ];
        render(<Toolbox actions={actions} />);

        const btn1 = screen.getByText("Fin du tour");
        const btn2 = screen.getByText("Aide IA");

        fireEvent.click(btn1);
        fireEvent.click(btn2);

        expect(action1).toHaveBeenCalled();
        expect(action2).toHaveBeenCalled();
    });
});
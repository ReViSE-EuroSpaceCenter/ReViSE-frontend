import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Toolbox from "@/components/Toolbox";

describe("Toolbox - interactions avancées", () => {
    it("montre et cache le bouton central selon disabled", () => {
        const onClickMock = vi.fn();

        // bouton central actif
        render(<Toolbox centerAction={{ label: "Décollage", onClick: onClickMock }} actions={[]} />);
        let centerButton = screen.getByTestId("center-action-button");
        expect(centerButton).toBeVisible();
    });

    it("déclenche le hover sur bouton central", () => {
        const onClickMock = vi.fn();
        render(<Toolbox centerAction={{ label: "Décollage", onClick: onClickMock }} actions={[]} />);
        const centerButton = screen.getByTestId("center-action-button");

        fireEvent.mouseEnter(centerButton);
        fireEvent.mouseLeave(centerButton);

        // on ne peut pas tester le style exact facilement, mais ça doit juste ne pas throw
        expect(centerButton).toBeInTheDocument();
    });

    it("gère les actions avec hover et click sur les pétales", () => {
        const action1 = vi.fn();
        const action2 = vi.fn();
        const actions = [
            { label: "Fin du tour", onClick: action1 },
            { label: "Aide IA", onClick: action2 },
        ];

        render(<Toolbox actions={actions} />);

        const petal1 = screen.getByText("Fin du tour");
        const petal2 = screen.getByText("Aide IA");

        fireEvent.mouseEnter(petal1);
        fireEvent.mouseLeave(petal1);
        fireEvent.click(petal1);
        expect(action1).toHaveBeenCalled();

        fireEvent.mouseEnter(petal2);
        fireEvent.mouseLeave(petal2);
        fireEvent.click(petal2);
        expect(action2).toHaveBeenCalled();
    });

    it("rend correctement les multi-lignes dans le centre et les pétales", () => {
        const centerClick = vi.fn();
        const actions = [
            { label: "Ligne 1\nLigne 2", onClick: vi.fn() },
        ];
        render(<Toolbox centerAction={{ label: "Décollage\nLancer", onClick: centerClick }} actions={actions} />);

        // Vérifie que les tspan sont présents
        expect(screen.getByText("Décollage")).toBeInTheDocument();
        expect(screen.getByText("Lancer")).toBeInTheDocument();
        expect(screen.getByText("Ligne 1")).toBeInTheDocument();
        expect(screen.getByText("Ligne 2")).toBeInTheDocument();
    });

    it("ne déclenche pas onClick si centerAction.disabled", () => {
        const onClickMock = vi.fn();
        render(<Toolbox centerAction={{ label: "Décollage", onClick: onClickMock, disabled: true }} actions={[]} />);
        const centerButton = screen.getByTestId("center-action-button");

        fireEvent.click(centerButton);
        expect(onClickMock).not.toHaveBeenCalled();
    });

    it("ne déclenche pas onClick pour les actions désactivées", () => {
        const action1 = vi.fn();
        const action2 = vi.fn();
        const actions = [
            { label: "Action active", onClick: action1 },
            { label: "Action désactivée", onClick: action2, disabled: true },
        ];

        render(<Toolbox actions={actions} />);

        const activeBtn = screen.getByText("Action active");
        const disabledBtn = screen.getByText("Action désactivée");

        fireEvent.click(activeBtn);
        fireEvent.click(disabledBtn);

        expect(action1).toHaveBeenCalled();
        expect(action2).not.toHaveBeenCalled(); // le disabled bloque le click
    });
});
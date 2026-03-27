import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import {TeamButton} from "@/components/student/TeamButton";


vi.mock("next/image", () => ({
	default: (props: any) => <img {...props} />,
}));

describe("TeamButton", () => {
	it("affiche le nom de l'équipe", () => {
		render(
			<TeamButton team="MECA" isTaken={false} onJoin={vi.fn()} />
		);

		expect(screen.getByText("MECA")).toBeInTheDocument();
	});

	it("affiche le bon texte quand l'équipe est disponible", () => {
		render(
			<TeamButton team="AERO" isTaken={false} onJoin={vi.fn()} />
		);

		expect(screen.getByText("Rejoindre l'équipe")).toBeInTheDocument();
	});

	it("affiche le bon texte quand l'équipe est prise", () => {
		render(
			<TeamButton team="COOP" isTaken={true} onJoin={vi.fn()} />
		);

		expect(screen.getByText("Équipe prise")).toBeInTheDocument();
	});

	it("désactive le bouton quand isTaken = true", () => {
		render(
			<TeamButton team="MECA" isTaken={true} onJoin={vi.fn()} />
		);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});

	it("appelle onJoin avec le bon team quand on clique", () => {
		const onJoin = vi.fn();

		render(
			<TeamButton team="AERO" isTaken={false} onJoin={onJoin} />
		);

		fireEvent.click(screen.getByRole("button"));

		expect(onJoin).toHaveBeenCalledWith("AERO");
	});

	it("n'appelle pas onJoin si le bouton est désactivé", () => {
		const onJoin = vi.fn();

		render(
			<TeamButton team="AERO" isTaken={true} onJoin={onJoin} />
		);

		fireEvent.click(screen.getByRole("button"));

		expect(onJoin).not.toHaveBeenCalled();
	});

	it("affiche l'image avec le bon src", () => {
		render(
			<TeamButton team="MECA" isTaken={false} onJoin={vi.fn()} />
		);

		const image = screen.getByAltText("Badge MECA");

		expect(image).toHaveAttribute("src", "/badges/teams/MECA.svg");
	});

	it("applique la classe grayscale quand isTaken = true", () => {
		render(
			<TeamButton team="MECA" isTaken={true} onJoin={vi.fn()} />
		);

		const image = screen.getByAltText("Badge MECA");

		expect(image.className).toMatch(/grayscale/);
	});
});
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import {WaitForStartMissions} from "@/components/student/WaitForStartMissions";


vi.mock("next/image", () => ({
	default: (props: any) => <img {...props} />,
}));

describe("WaitForStartMissions", () => {
	it("affiche le nom de l'équipe choisie", () => {
		render(<WaitForStartMissions chosenTeam="MECA" />);

		expect(screen.getByText("MECA")).toBeInTheDocument();
	});

	it("affiche le texte principal", () => {
		render(<WaitForStartMissions chosenTeam="COOP" />);

		expect(screen.getByText("Vous êtes l'équipe")).toBeInTheDocument();
	});

	it("affiche le message d'attente", () => {
		render(<WaitForStartMissions chosenTeam="AERO" />);

		expect(
			screen.getByText("En attente que tout le monde choisisse une équipe...")
		).toBeInTheDocument();
	});

	it("affiche l'image avec le bon src et alt", () => {
		render(<WaitForStartMissions chosenTeam="MECA" />);

		const image = screen.getByAltText("Badge MECA");

		expect(image).toHaveAttribute("src", "/badges/teams/MECA.svg");
		expect(image).toBeInTheDocument();
	});

	it("affiche correctement les différentes équipes", () => {
		const { rerender } = render(
			<WaitForStartMissions chosenTeam="MECA" />
		);

		expect(screen.getByText("MECA")).toBeInTheDocument();

		rerender(<WaitForStartMissions chosenTeam="AERO" />);

		expect(screen.getByText("AERO")).toBeInTheDocument();
	});

	it("contient un titre (heading)", () => {
		render(<WaitForStartMissions chosenTeam="MECA" />);

		const heading = screen.getByRole("heading");

		expect(heading).toBeInTheDocument();
	});
});
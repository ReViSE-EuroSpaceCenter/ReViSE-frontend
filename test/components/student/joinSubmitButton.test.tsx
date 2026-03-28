import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { JoinSubmitButton } from "@/components/student/JoinSubmitButton";

describe("JoinSubmitButton", () => {
	it("affiche le texte REJOINDRE quand isPending = false", () => {
		render(<JoinSubmitButton isPending={false} />);

		expect(screen.getByText("REJOINDRE")).toBeInTheDocument();
	});

	it("désactive le bouton quand isPending = true", () => {
		render(<JoinSubmitButton isPending={true} />);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});

	it("affiche le loader et le texte Connexion quand isPending = true", () => {
		render(<JoinSubmitButton isPending={true} />);

		expect(screen.getByText("Connexion")).toBeInTheDocument();

		const dots = screen.getAllByText(".");
		expect(dots.length).toBe(3);
	});

	it("n'affiche pas REJOINDRE quand isPending = true", () => {
		render(<JoinSubmitButton isPending={true} />);

		expect(screen.queryByText("REJOINDRE")).not.toBeInTheDocument();
	});

	it("affiche un svg loader quand isPending = true", () => {
		render(<JoinSubmitButton isPending={true} />);

		const svg = document.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("a le type submit", () => {
		render(<JoinSubmitButton isPending={false} />);

		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});

	it("applique les bonnes classes selon isPending", () => {
		const { rerender } = render(<JoinSubmitButton isPending={false} />);

		let button = screen.getByRole("button");
		expect(button.className).toMatch(/bg-purpleReViSE/);

		rerender(<JoinSubmitButton isPending={true} />);

		button = screen.getByRole("button");
		expect(button.className).toMatch(/cursor-not-allowed/);
	});
});
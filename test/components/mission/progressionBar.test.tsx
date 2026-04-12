import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressionBar } from "@/components/mission/ProgressionBar";

describe("ProgressionBar", () => {
	it("affiche les valeurs completed / totalMission", () => {
		render(
			<ProgressionBar completed={3} totalMission={10} color="red" />
		);

		expect(screen.getByText("3 / 10")).toBeInTheDocument();
	});

	it("calcule correctement la largeur de la barre", () => {
		const { container } = render(
			<ProgressionBar completed={5} totalMission={10} color="blue" />
		);

		const bar = screen.getByTestId("progress-bar");
		expect(bar.style.width).toBe("50%");
	});

	it("applique la couleur passée en prop", () => {
		const { container } = render(
			<ProgressionBar completed={2} totalMission={4} color="green" />
		);

		const bar = screen.getByTestId("progress-bar");
		expect(bar.style.backgroundColor).toBe("green");
	});
});
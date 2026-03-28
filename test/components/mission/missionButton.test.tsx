import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MissionButton } from "@/components/mission/MissionButton";
import { Mission } from "@/types/Mission";

describe("MissionButton", () => {
	const mockMission: Mission = {
		id: 1,
		title: "Test Mission",
		bonus: false,
		projectId: 1,
		unlocks: [],
	};

	it("rend le texte de la mission classique", () => {
		render(
			<MissionButton
				mission={mockMission}
				isUnlocked={true}
				teamColor="#ff0000"
				textColorClass="text-white"
				onClick={vi.fn()}
				isCompleted={false}
			/>
		);

		expect(screen.getByText("Test Mission")).toBeInTheDocument();
	});

	it("rend le texte de la mission bonus avec retour à la ligne", () => {
		const bonusMission: Mission = { ...mockMission, title: "Bonus 1", bonus: true };
		render(
			<MissionButton
				mission={bonusMission}
				isUnlocked={true}
				teamColor="#ff0000"
				textColorClass="text-white"
				onClick={vi.fn()}
				isCompleted={false}
			/>
		);

		expect(screen.getByText((content) => content.includes("Bonus"))).toBeInTheDocument();
		expect(screen.getByText((content) => content.includes("1"))).toBeInTheDocument();
	});

	it("affiche le badge ✓ si isCompleted est true", () => {
		render(
			<MissionButton
				mission={mockMission}
				isUnlocked={true}
				teamColor="#ff0000"
				textColorClass="text-white"
				onClick={vi.fn()}
				isCompleted={true}
			/>
		);

		expect(screen.getByText("✓")).toBeInTheDocument();
	});

	it("applique le style disabled si isUnlocked est false", () => {
		render(
			<MissionButton
				mission={mockMission}
				isUnlocked={false}
				teamColor="#ff0000"
				textColorClass="text-white"
				onClick={vi.fn()}
				isCompleted={false}
			/>
		);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(button).toHaveStyle({ backgroundColor: "#555" });
	});

	it("déclenche onClick quand cliqué et isUnlocked true", () => {
		const onClickMock = vi.fn();

		render(
			<MissionButton
				mission={mockMission}
				isUnlocked={true}
				teamColor="#ff0000"
				textColorClass="text-white"
				onClick={onClickMock}
				isCompleted={false}
			/>
		);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(onClickMock).toHaveBeenCalledTimes(1);
	});

	it("ne déclenche pas onClick si disabled", () => {
		const onClickMock = vi.fn();

		render(
			<MissionButton
				mission={mockMission}
				isUnlocked={false}
				teamColor="#ff0000"
				textColorClass="text-white"
				onClick={onClickMock}
				isCompleted={false}
			/>
		);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(onClickMock).not.toHaveBeenCalled();
	});
});
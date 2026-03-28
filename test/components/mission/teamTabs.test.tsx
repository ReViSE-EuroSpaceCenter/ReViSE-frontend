import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { teamColorMap } from "@/utils/teamColor";
import {TeamTabs} from "@/components/mission/TeamTabs";


describe("TeamTabs component", () => {
	const teams = ["MECA", "AERO", "COOP"];
	const selectedTeam = "AERO";
	const setSelectedIndexMock = vi.fn();

	beforeEach(() => {
		setSelectedIndexMock.mockReset();
	});

	it("rend un bouton pour chaque équipe", () => {
		render(
			<TeamTabs
				teamKeys={teams}
				selectedTeam={selectedTeam}
				setSelectedIndex={setSelectedIndexMock}
			/>
		);

		teams.forEach((team) => {
			expect(screen.getByText(team)).toBeInTheDocument();
		});
	});

	it("applique la classe pour le bouton sélectionné", () => {
		render(
			<TeamTabs
				teamKeys={teams}
				selectedTeam={selectedTeam}
				setSelectedIndex={setSelectedIndexMock}
			/>
		);

		const selectedButton = screen.getByText(selectedTeam).closest("button");
		expect(selectedButton).toHaveClass("bg-slate-800 text-white border-slate-500");
	});

	it("applique la classe pour les boutons non sélectionnés", () => {
		render(
			<TeamTabs
				teamKeys={teams}
				selectedTeam={selectedTeam}
				setSelectedIndex={setSelectedIndexMock}
			/>
		);

		const unselectedButton = screen.getByText("MECA").closest("button");
		expect(unselectedButton).toHaveClass(
			"bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
		);
	});

	it("affiche la couleur correcte sur le cercle de chaque bouton", () => {
		render(
			<TeamTabs
				teamKeys={teams}
				selectedTeam={selectedTeam}
				setSelectedIndex={setSelectedIndexMock}
			/>
		);

		teams.forEach((team) => {
			const button = screen.getByText(team).closest("button")!;
			const circle = button.querySelector("span")!;
			expect(circle).toHaveStyle({ backgroundColor: teamColorMap[team] });
		});
	});

	it("appelle setSelectedIndex avec l'index correct quand un bouton est cliqué", () => {
		render(
			<TeamTabs
				teamKeys={teams}
				selectedTeam={selectedTeam}
				setSelectedIndex={setSelectedIndexMock}
			/>
		);

		const aeroButton = screen.getByText("AERO").closest("button")!;
		fireEvent.click(aeroButton);

		expect(setSelectedIndexMock).toHaveBeenCalledTimes(1);
		expect(setSelectedIndexMock).toHaveBeenCalledWith(1);
	});
});
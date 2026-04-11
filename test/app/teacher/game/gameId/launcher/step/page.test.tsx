import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import StepPage from "@/app/teacher/game/[gameId]/launcher/[step]/page";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
	useParams: () => ({ gameId: "ABC123", step: "1" }),
	useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@tanstack/react-query", () => ({
	useQuery: () => ({
		data: {
			teamsFullProgression: {
				AERO: { teamProgression: {} },
				EXPE: { teamProgression: {} },
				GECO: { teamProgression: {} },
				MECA: { teamProgression: {} },
			},
		},
		isLoading: false,
		isError: false,
		error: null,
	}),
}));

vi.mock("@/utils/stepsData", () => ({
	stepsData: [
		{
			title: "Step 1",
			text: "Description step",
			"4": {
				resources: ["r1", "r2"],
				bonuses: [{ id: "b1", replacement: "b1" }],
			},
		},
	],
}));

vi.mock("next/image", () => ({
	default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/launcher/ResourceCard", () => ({
	ResourceCard: ({ id, onClick }: any) => (
		<button data-testid={id} onClick={onClick}>
			{id}
		</button>
	),
}));

vi.mock("@/components/mission/ValidationMission", () => ({
	ValidationMissionModal: ({ isOpen, onConfirm }: any) =>
		isOpen ? <button onClick={onConfirm}>confirm</button> : null,
}));

vi.mock("@/utils/launcherUtils", () => ({
	parseBonusId: () => ({ team: "AERO", nb: "1" }),
	getBonusKey: () => "bonus1",
}));

vi.mock("@/utils/alerts", () => ({
	showEnergyBonusAlert: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
	showError: vi.fn(),
}));

vi.mock("@/app/loading", () => ({
	default: () => <div>loading</div>,
}));

describe("StepPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("affiche le titre et les ressources", () => {
		render(<StepPage />);

		expect(screen.getByText("Step 1")).toBeInTheDocument();
		expect(screen.getByTestId("r1")).toBeInTheDocument();
		expect(screen.getByTestId("r2")).toBeInTheDocument();
		expect(screen.getByTestId("b1")).toBeInTheDocument();
	});

	it("active le bouton valider quand tout est sélectionné", async () => {
		render(<StepPage />);

		fireEvent.click(screen.getByTestId("r1"));
		fireEvent.click(screen.getByTestId("r2"));
		fireEvent.click(screen.getByTestId("b1"));

		await waitFor(() => {
			expect(screen.getByText(/valider/i)).not.toBeDisabled();
		});
	});

	it("ouvre la modal et redirige après confirmation", async () => {
		render(<StepPage />);

		fireEvent.click(screen.getByTestId("r1"));
		fireEvent.click(screen.getByTestId("r2"));
		fireEvent.click(screen.getByTestId("b1"));

		await waitFor(() => {
			expect(screen.getByText(/valider/i)).not.toBeDisabled();
		});

		fireEvent.click(screen.getByText(/valider/i));
		fireEvent.click(screen.getByText("confirm"));

		expect(replaceMock).toHaveBeenCalledWith(
			"/teacher/game/ABC123/launcher?step=2"
		);
	});
});
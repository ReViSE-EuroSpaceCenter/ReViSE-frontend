import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import Header from "@/components/Header";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: pushMock }),
	usePathname: () => mockPathname,
}));

vi.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => (
		<img {...props} data-testid="mock-image" />
	),
}));

vi.mock("@/components/mission/MissionHeader", () => ({
	MissionHeader: ({ teamName, color }: any) => (
		<div data-testid="mission-header" data-team={teamName} data-color={color} />
	),
}));

vi.mock("@/components/teacher/NumberTeamSelector", () => ({
	default: ({ isOpen }: any) =>
		isOpen ? <div data-testid="team-selector" /> : null,
}));

vi.mock("@/utils/teamColor", () => ({
	teamColorMap: {
		EXPE: "red",
		AERO: "blue",
		MECA: "green",
	},
}));

let mockPathname = "/";

describe("Header", () => {

	beforeEach(() => {
		vi.clearAllMocks();
		mockPathname = "/";
	});

	it("affiche le logo et les boutons sur la page d'accueil", () => {
		render(<Header />);

		expect(screen.getByTestId("mock-image")).toBeInTheDocument();
		expect(screen.getByText("Créer une partie")).toBeInTheDocument();
		expect(screen.getByText("Rejoindre une partie")).toBeInTheDocument();
	});


	it("ouvre la modal de création de partie", () => {
		render(<Header />);

		fireEvent.click(screen.getByText("Créer une partie"));

		expect(screen.getByTestId("team-selector")).toBeInTheDocument();
	});

	it("affiche MissionHeader quand on est sur une page d'équipe", () => {
		mockPathname = "/student/game/XYZ/EXPE";

		render(<Header />);

		const missionHeader = screen.getByTestId("mission-header");

		expect(missionHeader).toBeInTheDocument();
		expect(missionHeader.getAttribute("data-team")).toBe("EXPE");
		expect(missionHeader.getAttribute("data-color")).toBe("red");
	});

	it("redirige vers / quand on clique sur le logo", () => {
		render(<Header />);

		fireEvent.click(screen.getByTestId("mock-image"));

		expect(pushMock).toHaveBeenCalledWith("/");
	});

	it("ouvre le menu mobile", () => {
		render(<Header />);

		expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

		fireEvent.click(screen.getByLabelText("Menu"));

		expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
	});

	it("ferme le menu quand on clique en dehors", () => {
		render(<Header />);

		fireEvent.click(screen.getByLabelText("Menu"));
		expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

		fireEvent.mouseDown(document.body);

		expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
	});

	it("teamColor est undefined quand teamName est null (page non-équipe)", () => {
		mockPathname = "/student/join";
		render(<Header />);
		expect(screen.queryByTestId("mission-header")).not.toBeInTheDocument();
	});

	it("affiche le bouton hamburger sur mobile", () => {
		render(<Header />);
		expect(screen.getByLabelText("Menu")).toBeInTheDocument();
	});

	it("le menu mobile contient les deux boutons d'action", () => {
		render(<Header />);
		fireEvent.click(screen.getByLabelText("Menu"));

		const mobileMenu = screen.getByTestId("mobile-menu");
		expect(mobileMenu).toBeInTheDocument();
		expect(within(mobileMenu).getByText("Créer une partie")).toBeInTheDocument();
		expect(within(mobileMenu).getByText("Rejoindre une partie")).toBeInTheDocument();
	});

	it("ouvre la modal depuis le menu mobile et ferme le menu", () => {
		render(<Header />);
		fireEvent.click(screen.getByLabelText("Menu"));

		const mobileMenu = screen.getByTestId("mobile-menu");
		fireEvent.click(within(mobileMenu).getByText("Créer une partie"));

		expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
		expect(screen.getByTestId("team-selector")).toBeInTheDocument();
	});

	it("redirige vers /student/join depuis le menu mobile et ferme le menu", () => {
		render(<Header />);
		fireEvent.click(screen.getByLabelText("Menu"));

		const mobileMenu = screen.getByTestId("mobile-menu");
		fireEvent.click(within(mobileMenu).getByText("Rejoindre une partie"));

		expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
		expect(pushMock).toHaveBeenCalledWith("/student/join");
	});

});

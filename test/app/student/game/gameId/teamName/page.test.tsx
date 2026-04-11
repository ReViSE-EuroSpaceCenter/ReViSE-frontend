import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import Dashboard from "@/app/student/game/[gameId]/[teamName]/page";

const pushMock = vi.fn();
const replaceMock = vi.fn();

let pathnameValue = "/student/game/ABC123/AERO";

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
		replace: replaceMock,
	}),
	useParams: () => ({
		gameId: "ABC123",
		teamName: "AERO",
	}),
	usePathname: () => pathnameValue,
	useSearchParams: () => ({
		get: (key: string) => (key === "presentation" ? null : null),
	}),
}));

vi.mock("@/hooks/useWSSubscription", () => ({
	useWSSubscription: (_channel: string, cb: any) => {
		(globalThis as any).__wsCallback = cb;
	},
}));

vi.mock("@/components/Toolbox", () => ({
	default: ({ actions }: any) => (
		<div>
			{actions.map((a: any) => (
				<button key={a.label} onClick={a.onClick}>
					{a.label}
				</button>
			))}
		</div>
	),
}));

vi.mock("@/components/Checklist", () => ({
	default: ({ isOpen }: any) =>
		isOpen ? <div>Checklist ouverte</div> : <div>Checklist fermée</div>,
}));

vi.mock("@/components/IATech", () => ({
	default: ({ isOpen }: any) =>
		isOpen ? <div>IA ouverte</div> : <div>IA fermée</div>,
}));

vi.mock("@/components/PresentationModal", () => ({
	default: ({ isOpen }: any) =>
		isOpen ? <div>Presentation</div> : null,
}));

vi.mock("@/utils/teamColor", () => ({
	teamColorMap: {
		AERO: "#ff0000",
	},
}));

vi.mock("@/utils/presentationTexts", () => ({
	presentationTexts: {
		AERO: "texte presentation",
	},
}));

vi.mock("next/dynamic", () => ({
	default: (fn: any) => {
		const Component = fn();
		return Component.default || Component;
	},
}));

describe("Student Dashboard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		pathnameValue = "/student/game/ABC123/AERO";
	});

	it("affiche le toolbox", () => {
		render(<Dashboard />);

		expect(screen.getByText("Fin du tour")).toBeInTheDocument();
		expect(screen.getByText("États des missions")).toBeInTheDocument();
		expect(screen.getByText(/Aide\s*Technologies\s*IA/)).toBeInTheDocument();
	});

	it("ouvre la checklist", () => {
		render(<Dashboard />);

		fireEvent.click(screen.getByText("Fin du tour"));

		expect(screen.getByText("Checklist ouverte")).toBeInTheDocument();
	});

	it("ouvre IA Tech", () => {
		render(<Dashboard />);

		fireEvent.click(screen.getByText(/Aide\s*Technologies\s*IA/));

		expect(screen.getByText("IA ouverte")).toBeInTheDocument();
	});

	it("redirige vers mission", () => {
		render(<Dashboard />);

		fireEvent.click(screen.getByText("États des missions"));

		expect(pushMock).toHaveBeenCalledWith(
			"/student/game/ABC123/AERO/mission"
		);
	});

	it("déclenche navigation websocket mission ended", () => {
		render(<Dashboard />);

		const cb = (globalThis as any).__wsCallback;

		cb({
			type: "MISSION_ENDED",
		});

		expect(pushMock).toHaveBeenCalledWith(
			"/student/game/ABC123/AERO/launcher"
		);
	});
});
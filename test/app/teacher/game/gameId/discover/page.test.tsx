import React from "react";
import { renderPage } from "@/test/utils/renderPage";
import { act, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DiscoverPage from "@/app/teacher/game/[gameId]/discover/page";
import { SPECIES } from "@/utils/gaugeData";
import {confirmEndGameMessage} from "@/utils/endGameMessage";
import {endGame} from "@/api/discoverApi";
import userEvent from "@testing-library/user-event";

const pageState = vi.hoisted(() => {
	const useQueryMock = vi.fn();
	const gaugeMock = vi.fn((props: any) => (
		<div data-testid="gauge">
			<span data-testid="gauge-step-target">
				{props.stepTarget === null ? "null" : String(props.stepTarget)}
			</span>
			<span data-testid="gauge-discovered">{JSON.stringify(props.discoveredSteps)}</span>
			<button type="button" onClick={props.onStepReached}>
				reach-step
			</button>
			<button type="button" onClick={props.onComplete}>
				complete
			</button>
		</div>
	));
	const modalMock = vi.fn((props: any) => (
		<div data-testid="presentation-modal">
			<span data-testid="modal-open">{String(props.isOpen)}</span>
			<span data-testid="modal-icon">{props.icon ?? ""}</span>
			<span data-testid="modal-name">{props.name ?? ""}</span>
			<span data-testid="modal-text">{props.text ?? ""}</span>
			<button type="button" onClick={props.onClose}>
				close-modal
			</button>
		</div>
	));

	return {
		useQueryMock,
		gaugeMock,
		modalMock,
		hostId: "host-123" as string | null,
		gameId: "GAME-456",
		queryData: { totalScore: 3 } as any,
	};
});

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
	useParams: () => ({ gameId: pageState.gameId }),
    useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/hooks/useSessionId", () => ({
	useSessionId: () => pageState.hostId,
}));

vi.mock("@tanstack/react-query", async (importOriginal) => ({
	...(await importOriginal<typeof import("@tanstack/react-query")>()),
	useQuery: (options: any) => pageState.useQueryMock(options),
}));

vi.mock("@/components/discover/Gauge", () => ({
	default: (props: any) => pageState.gaugeMock(props),
}));

vi.mock("next/dynamic", () => ({
	default: () => pageState.modalMock,
}));

vi.mock("@/utils/endGameMessage", () => ({
    confirmEndGameMessage: vi.fn(),
}));

vi.mock("@/api/discoverApi", () => ({
    getScore: vi.fn(),
    endGame: vi.fn(),
}));

describe("DiscoverPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
		vi.useRealTimers();
		pageState.hostId = "host-123";
		pageState.gameId = "GAME-456";
		pageState.queryData = { totalScore: 3 };
		pageState.useQueryMock.mockImplementation((options: any) => ({
			data: pageState.queryData,
			options,
		}));
	});

	it("transmet les bonnes props à useQuery, Gauge et PresentationModal", () => {
		renderPage(<DiscoverPage />);

		expect(pageState.useQueryMock).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: ["discover", "GAME-456", "host-123"],
				enabled: true,
				queryFn: expect.any(Function),
			})
		);

		expect(screen.getByTestId("gauge-step-target")).toHaveTextContent(String(SPECIES[0].step));
		expect(screen.getByTestId("gauge-discovered")).toHaveTextContent("[]");

		expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
		expect(screen.getByTestId("modal-icon")).toHaveTextContent(SPECIES[0].svg);
		expect(screen.getByTestId("modal-name")).toHaveTextContent(SPECIES[0].label);
		expect(screen.getByTestId("modal-text").textContent?.replace(/\s+/g, " ").trim()).toBe(
			SPECIES[0].text.replace(/\s+/g, " ").trim()
		);
	});

	it("ouvre la modale après la découverte d'un step et appelle la fin de partie sur le dernier step", () => {
		pageState.queryData = { totalScore: 3 };
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
		vi.useFakeTimers();

		renderPage(<DiscoverPage />);

		fireEvent.click(screen.getByText("reach-step"));
		expect(logSpy).toHaveBeenCalledWith("GAME END");
		expect(screen.getByTestId("modal-open")).toHaveTextContent("false");

		act(() => {
			vi.advanceTimersByTime(800);
		});

		expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
	});

	it("ferme la modale et passe à l'étape suivante quand on la clôture", () => {
		pageState.queryData = { totalScore: 6 };
		vi.useFakeTimers();

		renderPage(<DiscoverPage />);

		fireEvent.click(screen.getByText("reach-step"));
		act(() => {
			vi.advanceTimersByTime(800);
		});

		expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
		expect(screen.getByTestId("modal-name")).toHaveTextContent(SPECIES[0].label);

		fireEvent.click(screen.getByText("close-modal"));
		expect(screen.getByTestId("modal-open")).toHaveTextContent("false");

		expect(screen.getByTestId("gauge-step-target")).toHaveTextContent(String(SPECIES[1].step));
		expect(screen.getByTestId("modal-name")).toHaveTextContent(SPECIES[1].label);
		expect(screen.getByTestId("modal-icon")).toHaveTextContent(SPECIES[1].svg);
	});

	it("désactive la requête quand hostId est manquant", () => {
		pageState.hostId = null;

		renderPage(<DiscoverPage />);

		expect(pageState.useQueryMock).toHaveBeenCalledWith(
			expect.objectContaining({
				enabled: false,
			})
		);
	});

    it("appelle confirm puis endGame et redirige si confirmé", async () => {
        pageState.queryData = { totalScore: 3 };

        vi.mocked(confirmEndGameMessage).mockResolvedValue(true);
        vi.mocked(endGame).mockResolvedValue({} as any);

        renderPage(<DiscoverPage />);

        fireEvent.click(screen.getByText("reach-step"));

        act(() => {
        });

        pageState.hostId = "host-123";

        fireEvent.click(screen.getByText("complete"));

        const button = await screen.findByRole("button", {
            name: /terminer la partie/i,
        });

        await userEvent.click(button);

        expect(confirmEndGameMessage).toHaveBeenCalled();
        expect(endGame).toHaveBeenCalledWith("GAME-456", "host-123");
        expect(pushMock).toHaveBeenCalledWith("/endGame?win=true");
    });

    it("n'appelle pas l'API si confirmation refusée", async () => {
        pageState.queryData = { totalScore: 3 };

        vi.mocked(confirmEndGameMessage).mockResolvedValue(false);

        renderPage(<DiscoverPage />);

        fireEvent.click(screen.getByText("complete"));
        const button = await screen.findByRole("button", {
            name: /terminer la partie/i,
        });
        await userEvent.click(button);
        expect(confirmEndGameMessage).toHaveBeenCalled();
        expect(endGame).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });
});


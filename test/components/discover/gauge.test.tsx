import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Gauge from "@/components/discover/Gauge";

const testState = vi.hoisted(() => {
	const useGaugeAnimationMock = vi.fn();
	const gaugeBarMock = vi.fn((props: any) => (
		<div data-testid="gauge-bar">{JSON.stringify(props)}</div>
	));
	const iconSpeciesMock = vi.fn((props: any) => (
		<div data-testid={`icon-${props.marker}`}>
			<span data-testid={`icon-current-${props.marker}`}>{String(props.isCurrentStep)}</span>
			<span data-testid={`icon-size-${props.marker}`}>{String(props.iconSize)}</span>
			<button type="button" onClick={props.onPopInComplete}>
				icon-complete-{props.marker}
			</button>
		</div>
	));
	const smoothProgress = { value: 0 };

	return {
		useGaugeAnimationMock,
		gaugeBarMock,
		iconSpeciesMock,
		smoothProgress,
		lastAnimationArgs: null as any,
		resizeObserverObserve: vi.fn(),
		resizeObserverDisconnect: vi.fn(),
	};
});

vi.mock("@/utils/gaugeData", () => ({
	STEPS: [0.25, 0.5, 0.75],
	SPECIES: [
		{ step: 0.25, svg: "/species/s1.svg" },
		{ step: 0.5, svg: "/species/s2.svg" },
	],
}));

vi.mock("@/hooks/useGaugeAnimation", () => ({
	useGaugeAnimation: (args: any) => {
		testState.lastAnimationArgs = args;
		testState.useGaugeAnimationMock(args);
		return { smoothProgress: testState.smoothProgress };
	},
}));

vi.mock("@/components/discover/GaugeBar", () => ({
	GaugeBar: (props: any) => testState.gaugeBarMock(props),
}));

vi.mock("@/components/discover/IconSpecies", () => ({
	IconSpecies: (props: any) => testState.iconSpeciesMock(props),
}));

describe("Gauge", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		testState.lastAnimationArgs = null;

		vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue({
			width: 130,
			height: 230,
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: 130,
			bottom: 230,
			toJSON: () => ({}),
		} as DOMRect);

		(globalThis as any).ResizeObserver = class {
			observe = testState.resizeObserverObserve;
			disconnect = testState.resizeObserverDisconnect;
			constructor(_cb: ResizeObserverCallback) {}
		};
	});

	it("passe les bonnes props à useGaugeAnimation et GaugeBar", async () => {
		render(
			<Gauge
				stepTarget={0.5}
				onStepReached={vi.fn()}
				onComplete={vi.fn()}
				discoveredSteps={[]}
			/>
		);

		expect(testState.useGaugeAnimationMock).toHaveBeenCalledWith(
			expect.objectContaining({
				stepTarget: 0.5,
				onComplete: expect.any(Function),
				onStepReached: expect.any(Function),
			})
		);

		await waitFor(() => {
			expect(testState.gaugeBarMock).toHaveBeenCalledWith(
				expect.objectContaining({
					gaugeWidth: 180,
					gaugeHeight: 460,
					bw: 2,
					smoothProgress: testState.smoothProgress,
				})
			);
		});
	});

	it("rend les icônes découvertes et l'icône courante après onStepReached interne", async () => {
		render(
			<Gauge
				stepTarget={0.5}
				onStepReached={vi.fn()}
				onComplete={vi.fn()}
				discoveredSteps={[0.25]}
			/>
		);

		await waitFor(() => {
			expect(screen.getByTestId("icon-0.25")).toBeInTheDocument();
		});
		expect(screen.queryByTestId("icon-0.5")).not.toBeInTheDocument();

		act(() => {
			testState.lastAnimationArgs.onStepReached();
		});

		expect(screen.getByTestId("icon-0.5")).toBeInTheDocument();
		expect(screen.getByTestId("icon-current-0.25")).toHaveTextContent("false");
		expect(screen.getByTestId("icon-current-0.5")).toHaveTextContent("true");
	});

	it("transmet onPopInComplete vers le callback parent et applique le layout redimensionné", async () => {
		const onStepReached = vi.fn();

		render(
			<Gauge
				stepTarget={0.25}
				onStepReached={onStepReached}
				onComplete={vi.fn()}
				discoveredSteps={[0.25]}
			/>
		);

		await waitFor(() => {
			expect(testState.iconSpeciesMock).toHaveBeenCalled();
		});

		const lastIconCall = testState.iconSpeciesMock.mock.calls.at(-1)?.[0];
		expect(lastIconCall.iconSize).toBeCloseTo(30, 6);
		expect(lastIconCall.position.x).toBeCloseTo(94, 6);
		expect(lastIconCall.position.y).toBeCloseTo(162, 6);

		fireEvent.click(screen.getByText("icon-complete-0.25"));
		expect(onStepReached).toHaveBeenCalledTimes(1);
	});

	it("observe le conteneur et nettoie ResizeObserver au unmount", () => {
		const { unmount } = render(
			<Gauge
				stepTarget={0.25}
				onStepReached={vi.fn()}
				onComplete={vi.fn()}
				discoveredSteps={[]}
			/>
		);

		expect(testState.resizeObserverObserve).toHaveBeenCalledTimes(1);

		unmount();
		expect(testState.resizeObserverDisconnect).toHaveBeenCalledTimes(1);
	});
});


import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGaugeAnimation } from "@/hooks/useGaugeAnimation";
import { STEPS } from "@/utils/gaugeData";

const framerMotionState = vi.hoisted(() => {
	let changeListener: ((value: number) => void) | null = null;
	const progressSet = vi.fn();
	const unsubscribe = vi.fn(() => {
		changeListener = null;
	});
	const on = vi.fn((event: string, callback: (value: number) => void) => {
		if (event === "change") {
			changeListener = callback;
		}
		return unsubscribe;
	});

	return {
		progressSet,
		unsubscribe,
		on,
		motionValue: {
			value: 0,
			set: progressSet,
		},
		springValue: {
			on,
		},
		emitChange: (value: number) => changeListener?.(value),
		reset: () => {
			changeListener = null;
			progressSet.mockClear();
			unsubscribe.mockClear();
			on.mockClear();
		},
	};
});

vi.mock("framer-motion", () => ({
	useMotionValue: () => framerMotionState.motionValue,
	useSpring: () => framerMotionState.springValue,
}));

describe("useGaugeAnimation", () => {
	beforeEach(() => {
		framerMotionState.reset();
	});

	it("n'active aucun abonnement ni set si stepTarget est null", () => {
		const onStepReached = vi.fn();
		const onComplete = vi.fn();

		renderHook(() =>
			useGaugeAnimation({
				stepTarget: null,
				onStepReached,
				onComplete,
			})
		);

		expect(framerMotionState.springValue.on).not.toHaveBeenCalled();
		expect(framerMotionState.progressSet).not.toHaveBeenCalled();
		expect(onStepReached).not.toHaveBeenCalled();
		expect(onComplete).not.toHaveBeenCalled();
	});

	it("déclenche onStepReached pour un step marqueur lorsque la progression atteint la cible", () => {
		const onStepReached = vi.fn();
		const onComplete = vi.fn();
		const markerStep = STEPS[0];

		renderHook(() =>
			useGaugeAnimation({
				stepTarget: markerStep,
				onStepReached,
				onComplete,
			})
		);

		expect(framerMotionState.springValue.on).toHaveBeenCalledWith("change", expect.any(Function));
		expect(framerMotionState.progressSet).toHaveBeenCalledWith(markerStep);

		act(() => {
			framerMotionState.emitChange(markerStep + 0.001);
		});

		expect(onStepReached).toHaveBeenCalledTimes(1);
		expect(onComplete).not.toHaveBeenCalled();
		expect(framerMotionState.unsubscribe).toHaveBeenCalledTimes(1);
	});

	it("déclenche onComplete pour un step non-marqueur", () => {
		const onStepReached = vi.fn();
		const onComplete = vi.fn();
		const nonMarkerStep = 0.37;

		renderHook(() =>
			useGaugeAnimation({
				stepTarget: nonMarkerStep,
				onStepReached,
				onComplete,
			})
		);

		act(() => {
			framerMotionState.emitChange(nonMarkerStep + 0.001);
		});

		expect(onStepReached).not.toHaveBeenCalled();
		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(framerMotionState.unsubscribe).toHaveBeenCalledTimes(1);
	});

	it("nettoie l'abonnement au unmount", () => {
		const onStepReached = vi.fn();
		const onComplete = vi.fn();

		const { unmount } = renderHook(() =>
			useGaugeAnimation({
				stepTarget: STEPS[1],
				onStepReached,
				onComplete,
			})
		);

		unmount();

		expect(framerMotionState.unsubscribe).toHaveBeenCalledTimes(1);

		act(() => {
			framerMotionState.emitChange(STEPS[1]);
		});

		expect(onStepReached).not.toHaveBeenCalled();
		expect(onComplete).not.toHaveBeenCalled();
	});
});


import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GaugeBar } from "@/components/discover/GaugeBar";
import { STEPS } from "@/utils/gaugeData";

const { useTransformMock, framerMotionMock } = vi.hoisted(() => {
	const useTransformMock = vi.fn((source: any, transformer: (value: number) => number) => {
		return transformer(source.value);
	});

	const framerMotionMock: any = {
		motion: {
			rect: (props: any) => <rect {...props} />,
		},
		useTransform: (source: any, transformer: (value: number) => number) =>
			useTransformMock(source, transformer),
	};

	return { useTransformMock, framerMotionMock };
});

vi.mock("framer-motion", async (importOriginal) => ({
	...(await importOriginal<typeof import("framer-motion")>()),
	...framerMotionMock,
}));

describe("GaugeBar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("rend le dégradé, les graduations et les rectangles de remplissage avec les bonnes valeurs", () => {
		const smoothProgress = { value: 0.25 } as any;

		const { container } = render(
			<svg>
				<GaugeBar gaugeWidth={180} gaugeHeight={460} bw={2} smoothProgress={smoothProgress} />
			</svg>
		);

		const gradient = container.querySelector('[id="degrade"]');
		expect(gradient).toBeInTheDocument();
		expect(gradient).toHaveAttribute("y1", "460");
		expect(gradient).toHaveAttribute("y2", "0");

		const rects = container.querySelectorAll("rect");
		expect(rects).toHaveLength(3);
		expect(rects[0]).toHaveAttribute("x", "2");
		expect(rects[0]).toHaveAttribute("y", "344");
		expect(rects[0]).toHaveAttribute("height", "122");
		expect(rects[2]).toHaveAttribute("clip-path", "url(#gaugeFillClip)");
		expect(rects[2]).toHaveAttribute("fill", "url(#degrade)");

		const lines = container.querySelectorAll("line");
		expect(lines).toHaveLength(STEPS.length - 1);

		const expectedY = [382, 306, 230, 154, 78];
		expectedY.forEach((value, index) => {
			expect(Number(lines[index].getAttribute("y1"))).toBeCloseTo(value, 6);
		});
	});

	it("appelle useTransform avec les bonnes fonctions de calcul", () => {
		const smoothProgress = { value: 0.5 } as any;

		render(
			<svg>
				<GaugeBar gaugeWidth={180} gaugeHeight={460} bw={2} smoothProgress={smoothProgress} />
			</svg>
		);

		expect(useTransformMock).toHaveBeenCalledTimes(2);
	});
});


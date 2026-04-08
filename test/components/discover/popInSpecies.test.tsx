import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PopInSpecies } from "@/components/discover/PopInSpecies";

const particles = vi.hoisted(() => [
	{ id: "particle-1", size: 4, x: 10, y: -5 },
	{ id: "particle-2", size: 6, x: -20, y: 15 },
	{ id: "particle-3", size: 5, x: 0, y: 30 },
]);

vi.mock("next/image", () => ({
	default: ({ alt = "", fill: _fill, ...props }: any) => <img alt={alt} {...props} />,
}));

const motionDivMock = vi.fn((props: any) => {
	const { children, className, onAnimationComplete, ...rest } = props;
	const isMainWrapper = typeof className === "string" && className.includes("inset-0");

	if (isMainWrapper && onAnimationComplete) {
		onAnimationComplete();
	}

	return (
		<div
			data-testid={isMainWrapper ? "popin-main" : "particle"}
			className={className}
			{...rest}
		>
			{children}
		</div>
	);
});

vi.mock("framer-motion", () => ({
	motion: {
		div: (props: any) => motionDivMock(props),
	},
}));

vi.mock("@/utils/gaugeData", () => ({
	PARTICLES: particles,
}));

describe("PopInSpecies", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("rend une particule par entrée de PARTICLES avec les bons styles de base", () => {
		render(<PopInSpecies src="/species/adn.svg" iconSize={120} />);

		const renderedParticles = screen.getAllByTestId("particle");

		expect(renderedParticles).toHaveLength(particles.length);
		expect(renderedParticles[0]).toHaveStyle({
			left: "60px",
			top: "60px",
			width: "4px",
			height: "4px",
			backgroundColor: "rgb(255, 255, 255)",
		});
	});

	it("affiche l'image de l'espèce avec le bon src et appelle le callback de fin d'animation", () => {
		const onAnimationComplete = vi.fn();

		render(
			<PopInSpecies
				src="/species/bacterie.svg"
				iconSize={120}
				onAnimationComplete={onAnimationComplete}
			/>
		);

		const image = screen.getByAltText("espèce découverte");

		expect(image).toHaveAttribute("src", "/species/bacterie.svg");
		expect(screen.getByTestId("popin-main")).toBeInTheDocument();
		expect(onAnimationComplete).toHaveBeenCalledTimes(1);
	});
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ResourceCard } from "@/components/launcher/ResourceCard";

vi.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => <img {...props} data-testid="mock-image" />,
}));

describe("ResourceCard", () => {
	it("affiche l'image normale quand autoValidated = false", () => {
		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={false}
				validated={false}
			/>
		);

		const img = screen.getByTestId("mock-image");
		expect(img).toHaveAttribute("src", "/img/test.png");
	});

	it("affiche l'image bonus quand autoValidated = true et bonus fourni", () => {
		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={true}
				validated={false}
				bonus={{ team: "EXPE", nb: "1" }}
			/>
		);

		const img = screen.getByTestId("mock-image");
		expect(img).toHaveAttribute("src", "/badges/bonus/EXPE_bonus1.svg");
	});

	it("désactive le clic quand autoValidated = true", () => {
		const onClick = vi.fn();

		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={true}
				validated={false}
				onClick={onClick}
			/>
		);

		const btn = screen.getByRole("button");
		expect(btn).toBeDisabled();

		fireEvent.click(btn);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("active le clic quand autoValidated = false", () => {
		const onClick = vi.fn();

		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={false}
				validated={false}
				onClick={onClick}
			/>
		);

		const btn = screen.getByRole("button");
		expect(btn).not.toBeDisabled();

		fireEvent.click(btn);
		expect(onClick).toHaveBeenCalled();
	});

	it("affiche le check ✓ quand validated = true", () => {
		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={false}
				validated={true}
			/>
		);

		expect(screen.getByText("✓")).toBeInTheDocument();
	});

	it("affiche le titre et texte bonus quand autoValidated = true", () => {
		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={true}
				validated={false}
				bonus={{
					team: "EXPE",
					nb: "1",
					title: "Bonus EXPE",
					text: "Bravo pour votre découverte",
				}}
			/>
		);

		expect(screen.getByText("Bonus EXPE")).toBeInTheDocument();
		expect(screen.getByText("Bravo pour votre découverte")).toBeInTheDocument();
	});

	it("utilise bonus.title comme title du bouton si présent", () => {
		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={false}
				validated={false}
				bonus={{ team: "EXPE", nb: "1", title: "Titre Bonus" }}
			/>
		);

		const btn = screen.getByRole("button");
		expect(btn).toHaveAttribute("title", "Titre Bonus");
	});

	it("utilise id comme title du bouton si pas de bonus.title", () => {
		render(
			<ResourceCard
				id="res1"
				imgSrc="/img/test.png"
				autoValidated={false}
				validated={false}
			/>
		);

		const btn = screen.getByRole("button");
		expect(btn).toHaveAttribute("title", "res1");
	});
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LauncherPage from "@/app/student/game/[gameId]/[teamName]/launcher/page";

describe("LauncherPage", () => {

	it("affiche le titre principal", () => {
		render(<LauncherPage />);

		expect(
			screen.getByRole("heading", {
				name: /la suite se passe sur l'écran principal/i,
			})
		).toBeInTheDocument();
	});

	it("affiche le sous-titre de mission", () => {
		render(<LauncherPage />);

		expect(
			screen.getByText(/cap sur europe/i)
		).toBeInTheDocument();
	});

	it("affiche le texte d'instruction", () => {
		render(<LauncherPage />);

		expect(
			screen.getByText(/suivez les instructions de votre animateur/i)
		).toBeInTheDocument();
	});

	it("affiche l'emoji satellite", () => {
		render(<LauncherPage />);

		expect(screen.getByText("🛰️")).toBeInTheDocument();
	});

});
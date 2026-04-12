import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DiscoverPage from "@/app/student/game/[gameId]/[teamName]/discover/page";


describe("DiscoverPage", () => {
	describe("Rendu", () => {
		it("affiche le titre principal", () => {
			render(<DiscoverPage />);

			expect(
				screen.getByText(/La suite se passe sur l’écran principal/i)
			).toBeInTheDocument();
		});

		it("affiche le sous-titre", () => {
			render(<DiscoverPage />);

			expect(
				screen.getByText(/Découverte en cours/i)
			).toBeInTheDocument();
		});

		it("affiche la description", () => {
			render(<DiscoverPage />);

			expect(
				screen.getByText(/pilotée par le professeur/i)
			).toBeInTheDocument();
		});

		it("affiche l’emoji satellite", () => {
			render(<DiscoverPage />);

			expect(screen.getByText("📡")).toBeInTheDocument();
		});
	});
});
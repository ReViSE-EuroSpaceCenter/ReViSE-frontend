import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect} from "vitest";
import {Banner} from "@/components/teacher/Banner";
import {renderPage} from "@/test/utils/renderPage";

describe("Banner", () => {
	it("affiche le message", () => {
		renderPage(<Banner message="Attention !" />);

		expect(screen.getByText("Attention !")).toBeInTheDocument();
	});

	it("affiche la croix de fermeture", () => {
		renderPage(<Banner message="Attention !" />);

		expect(screen.getByRole("button", {name: "Fermer"})).toBeInTheDocument();
	});

	it("masque le bandeau après clic sur la croix", async () => {
		const user = userEvent.setup();

		renderPage(<Banner message="Attention !" />);

		await user.click(screen.getByRole("button", {name: "Fermer"}));

		expect(screen.queryByText("Attention !")).not.toBeInTheDocument();
	});
});
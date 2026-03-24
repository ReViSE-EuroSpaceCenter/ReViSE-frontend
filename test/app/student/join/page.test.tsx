import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JoinPage from "@/app/student/join/page";
import {renderPage} from "@/test/utils/renderPage";

// ---------- Mocks ----------
const mutateMock = vi.fn();
const useJoinLobbyMock = () => ({
    mutate: mutateMock,
    isPending: false,
});
vi.mock("@/hooks/useJoinLobby", () => ({
    useJoinLobby: () => useJoinLobbyMock(),
}));

// ---------- Tests ----------
describe("JoinPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("affiche le titre et les éléments du formulaire", () => {
        renderPage(<JoinPage />);

        expect(screen.getByText("Rejoindre")).toBeInTheDocument();
        expect(screen.getByLabelText("Code d'accès session")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("EX: XKABDE")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("bloque la soumission quand le code fait moins de 6 lettres", async () => {
        renderPage(<JoinPage />);

        const input = screen.getByPlaceholderText("EX: XKABDE");
        const submit = screen.getByRole("button");

        await userEvent.type(input, "ABC"); // trop court
        await userEvent.click(submit);

        expect(mutateMock).not.toHaveBeenCalled();

        expect(input).toHaveValue("ABC");
    });


    it("force la mise en majuscules et supprime les caractères invalides", async () => {
        renderPage(<JoinPage />);

        const input = screen.getByPlaceholderText("EX: XKABDE");

        await userEvent.type(input, "ab12$c");

        expect(input).toHaveValue("ABC");
    });

    it("appelle joinLobbyMutation.mutate avec un code valide", async () => {
        renderPage(<JoinPage />);

        const input = screen.getByPlaceholderText("EX: XKABDE");
        const submit = screen.getByRole("button");

        await userEvent.type(input, "abcdef");
        await userEvent.click(submit);

        await waitFor(() => {
            expect(mutateMock).toHaveBeenCalledWith("ABCDEF");
        });
    });

    it("retire le blocage et permet la soumission correcte après une tentative invalide", async () => {
        renderPage(<JoinPage />);

        const input = screen.getByPlaceholderText("EX: XKABDE");
        const submit = screen.getByRole("button");

        await userEvent.type(input, "abc"); // trop court
        await userEvent.click(submit);

        expect(mutateMock).not.toHaveBeenCalled();

        await userEvent.clear(input);
        await userEvent.type(input, "ABCDEF");
        await userEvent.click(submit);

        await waitFor(() => {
            expect(mutateMock).toHaveBeenCalledWith("ABCDEF");
        });
    });
});
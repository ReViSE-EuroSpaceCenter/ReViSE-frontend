import Swal from "sweetalert2";
import { confirmEndGameMessage } from "@/utils/endGameMessage";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sweetalert2");

describe("confirmEndGameMessage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("affiche le message avec le bon texte et style", async () => {
        (Swal.fire as any).mockResolvedValue({ isConfirmed: true });

        const result = await confirmEndGameMessage();

        expect(result).toBe(true);
        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Confirmation",
                html: expect.stringContaining("Cette action est irréversible"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: "Annuler",
                confirmButtonText: "Continuer",
            })
        );
    });
    it("retourne false si l'utilisateur annule", async () => {
        (Swal.fire as any).mockResolvedValue({ isConfirmed: false });

        const result = await confirmEndGameMessage();
        expect(result).toBe(false);
    });
});
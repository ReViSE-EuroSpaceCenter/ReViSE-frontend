import Swal from "sweetalert2";

const BACKGROUND = "#1a1f3a";
const TEXT_COLOR = "#ffffff";
const CONFIRM_BUTTON_COLOR = "#834291";

export async function confirmEndGameMessage(): Promise<boolean> {
    const result = await Swal.fire({
        title: "Confirmation",
        html: `
        Cette action est irréversible.
        <br />
        Êtes-vous sûr de vouloir mettre fin à la partie ?`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Continuer",
        reverseButtons: true,
        confirmButtonColor: CONFIRM_BUTTON_COLOR,
        background: BACKGROUND,
        color: TEXT_COLOR,
        showClass: {
            popup: "animate__animated animate__zoomIn"
        },
        hideClass: {
            popup: "animate__animated animate__zoomOut"
        },
        customClass: { actions: "gap-10"},
    });
    return result.isConfirmed;
}
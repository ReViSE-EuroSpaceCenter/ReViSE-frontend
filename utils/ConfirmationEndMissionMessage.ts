import Swal from "sweetalert2";


const BACKGROUND = "#1a1f3a";
const TEXT_COLOR = "#ffffff";
const CONFIRM_BUTTON_COLOR = "#834291";

export async function confirmEndMissionMessage(): Promise<boolean> {
    const result = await Swal.fire({
        title: "Confirmation",
        html: `
        Cette action est irréversible. Une fois effectuée, les étudiants ne pourront plus modifier l'état des missions réalisées.
        <br />
        Êtes-vous sûr de vouloir continuer ?`,
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
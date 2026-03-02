import Swal from "sweetalert2";
import { errorMessages } from "./errorMessages";
import type { ErrorKey } from "./errorKeys";

export function showError(key: string, message = "Une erreur est survenue.") {

	if (key && key in errorMessages) {
		message = errorMessages[key as ErrorKey];
	}

	Swal.fire({
		icon: "error",
		title: message,
		toast: true,
		position: "top-right",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	});
}
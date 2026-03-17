import Swal from "sweetalert2";

const BACKGROUND = "#1a1f3a";
const TEXT_COLOR = "#ffffff";
const CONFIRM_BUTTON_COLOR = "#7c3aed";

export const showMissionAlert = (team: string, nbMission: number) => {
	Swal.fire({
		title: "Mission Bonus Accomplie !",
		text: `L'équipe ${team} a réalisé sa mission bonus ${nbMission}`,
		imageUrl: `/badges/${team}.png`,
		imageWidth: 120,
		imageHeight: 120,
		imageAlt: `Badge ${team}`,
		confirmButtonText: "OK",
		backdrop: true,
		background: BACKGROUND,
		color: TEXT_COLOR,
		confirmButtonColor: CONFIRM_BUTTON_COLOR,
		showClass: {
			popup: "animate__animated animate__zoomIn"
		},
		hideClass: {
			popup: "animate__animated animate__zoomOut"
		}
	});
}

export const showHint = (hint: string) => {
	Swal.fire({
		text: hint,
		icon: "info",
		confirmButtonText: "OK",
		background: BACKGROUND,
		color: TEXT_COLOR,
		confirmButtonColor: CONFIRM_BUTTON_COLOR,
	});
};
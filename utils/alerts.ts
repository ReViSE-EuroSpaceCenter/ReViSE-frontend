import Swal from "sweetalert2";

const BACKGROUND = "#1a1f3a";
const TEXT_COLOR = "#ffffff";
const CONFIRM_BUTTON_COLOR = "#7c3aed";

export const showMissionAlert = (team: string, nbMission: number) => {
	Swal.fire({
		title: "Mission Bonus Accomplie !",
		text: `L'équipe ${team} a réalisé sa mission bonus ${nbMission}`,
		imageUrl: `/badges/teams/${team}.svg`,
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

export const showEnergyBonusAlert = (
	bonus: { team: string; nb: string; title?: string },
	energyBonus: number
) => {
	return Swal.fire({
		imageUrl: `/badges/bonus/${bonus.team}_bonus${bonus.nb}.svg`,
		imageWidth: 140,
		imageHeight: 140,
		imageAlt: "Badge bonus",

		html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:20px;
        text-align:center;
      ">

        <h2 style="
          font-size:1.4rem;
          font-weight:600;
          color:#ffffff;
          margin:0;
        ">
          Énergies remportées !
        </h2>

        <p style="
          font-size:1rem;
          color:#cbd5e1;
          margin:0;
          max-width:260px;
          line-height:1.4;
        ">
          Grâce au bonus <strong style="color:#fff">${
			bonus.title ?? ""
		}</strong>, votre équipe gagne
        </p>

        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:10px;
        ">
          <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            gap:6px;
          ">
            ${Array.from({ length: energyBonus })
			.map(
				() => `
                <img 
                  src="/badges/launchers/energie.svg" 
                  alt="" 
                  width="40" 
                  height="40" 
                  style="display:block; filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));"
                />
              `
			)
			.join("")}
          </div>

          <span style="
            font-size:1.3rem;
            font-weight:700;
            color:#ffffff;
          ">
            +${energyBonus} énergies
          </span>
        </div>
      </div>
    `,
		confirmButtonText: "Continuer",
		backdrop: true,
		background: BACKGROUND,
		color: "#ffffff",
		confirmButtonColor: CONFIRM_BUTTON_COLOR,
		showClass: {
			popup: "animate__animated animate__zoomIn animate__faster",
		},
		hideClass: {
			popup: "animate__animated animate__fadeOutDown animate__faster",
		},
	});
};
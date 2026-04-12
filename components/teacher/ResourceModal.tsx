import { Dialog, DialogPanel } from "@headlessui/react";
import { TeamsFullProgression } from "@/types/TeamData";
import TeamBadgeGrid from "@/components/teacher/TeamBadgeGrid";
import {TeamBadgeItem, TeamBadgeStatus} from "@/types/TeamBadge";

type Props = {
	isOpen: boolean;
	gameData: TeamsFullProgression | undefined;
	submittedTeams: Set<string>;
	allResourcesSubmitted: boolean;
	onConfirm: () => void;
};

export default function ResourceModal({ isOpen, gameData, onConfirm, submittedTeams, allResourcesSubmitted }: Readonly<Props>) {
	const teams = Object.keys(gameData?.teamsFullProgression ?? {});
	const submittedCount = teams.filter((label) => submittedTeams.has(label)).length;

	const getGridColsClass= (count: number) => {
		if (count === 4) return "grid-cols-4";
		if (count === 6) return "grid-cols-3";
		return "grid-cols-2 sm:grid-cols-3";
	}

	const badgeItems: TeamBadgeItem[] = teams.map((label) => ({
		label,
		status: (submittedTeams.has(label) ? "validated" : "waiting") as TeamBadgeStatus,
	}));

	const gridColsClass = getGridColsClass(teams.length);

	return (
		<Dialog
			open={isOpen}
			className="relative z-50"
			onClose={() => {}}
		>
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="relative w-full max-w-lg bg-slate-800/90 border border-slate-700/60 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl">

					<div className="w-full bg-purpleReViSE/10 border border-purpleReViSE/20 rounded-2xl px-5 py-4 text-center space-y-1">
						<p className="text-xs font-semibold tracking-widest text-purpleReViSE uppercase">
							Arrivée sur Europe
						</p>
						<p className="text-slate-300 text-sm leading-relaxed">
							Décollage réussi ! Demandez aux équipes de reprendre leur appareil
							et d&apos;encoder leurs ressources restantes pour découvrir les espèces de cette lune.
						</p>
					</div>

					<div className="text-center">
						<h2 className="text-2xl font-black text-white tracking-tight">
							Progression des équipes
						</h2>
						<p className="text-slate-400 text-sm mt-1">
							{submittedCount} / {teams.length} équipes ont soumis leurs ressources
						</p>
					</div>

					<TeamBadgeGrid teams={badgeItems} gridColsClass={gridColsClass} />

					<button
						onClick={() => onConfirm()}
						disabled={!allResourcesSubmitted}
						className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-500 shadow-xl ${
							allResourcesSubmitted
								? "bg-purpleReViSE hover:bg-purpleReViSE/80 text-white cursor-pointer shadow-purpleReViSE/20"
								: "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
						}`}
					>
						{allResourcesSubmitted ? (
							"Révéler les espèces découvertes"
						) : (
							<span className="tracking-widest uppercase text-xs opacity-50 italic">
                En attente des équipes...
            </span>
						)}
					</button>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
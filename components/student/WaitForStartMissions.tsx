import Image from "next/image";

export const WaitForStartMissions = ({ chosenTeam }: { chosenTeam: string}) => {
	return (
		<div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-6 pt-24">
			<div className="max-w-md w-full bg-slate-800/30 border border-purpleReViSE/50 rounded-lg p-10 text-center space-y-6">
				<div className="w-36 h-36 mx-auto">
					<Image
						src={`/badges/teams/${chosenTeam}.svg`}
						alt={`Badge ${chosenTeam}`}
						width={144}
						height={144}
						className="w-full h-full object-contain drop-shadow-[0_0_18px_rgba(139,92,246,0.5)]"
					/>
				</div>
				<div className="space-y-2">
					<h2 className="text-xl xl:text-2xl font-bold text-white">
						Vous êtes l{"'"}équipe
					</h2>
					<p className="text-2xl font-semibold text-purpleReViSE">
						{chosenTeam}
					</p>
				</div>
				<div className="border-t border-slate-700 pt-6">
					<p className="text-sm text-slate-400">
						En attente que tout le monde choisisse une équipe...
					</p>
				</div>
			</div>
		</div>
	)
}
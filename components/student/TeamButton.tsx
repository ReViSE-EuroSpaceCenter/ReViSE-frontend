import Image from "next/image";

type TeamButtonProps = {
	team: string;
	isTaken: boolean;
	onJoin: (team: string) => void;
};

export const TeamButton = ({ team, isTaken, onJoin }: TeamButtonProps) => (
	<button
		type="button"
		onClick={() => onJoin(team)}
		disabled={isTaken}
		className={`group bg-slate-800/30 border rounded-lg p-6 transition-all duration-300 flex flex-col items-center space-y-4 ${
			isTaken
				? "border-slate-700/30 opacity-40 cursor-not-allowed"
				: "border-slate-700/50 hover:border-purpleReViSE hover:bg-slate-800/50 cursor-pointer"
		}`}
	>
		<div className="w-32 h-32 flex items-center justify-center">
			<Image
				src={`/badges/${team}.png`}
				alt={`Badge ${team}`}
				width={128}
				height={128}
				className={`w-full h-full object-contain transition-transform duration-300 ${
					isTaken ? "grayscale" : "group-hover:scale-110"
				}`}
			/>
		</div>
		<h3
			className={`text-xl font-semibold transition-colors 
									${isTaken ? "text-slate-600" : "text-white group-hover:text-purpleReViSE"}`}
		>
			{team}
		</h3>
		<span
			className={`text-sm transition-colors 
									${isTaken ? "text-slate-600" : "text-slate-400 group-hover:text-slate-300"}`}
		>
			{isTaken ? "Équipe prise" : "Rejoindre l'équipe"}
		</span>
	</button>
);
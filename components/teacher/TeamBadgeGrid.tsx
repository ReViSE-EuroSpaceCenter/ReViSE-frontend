import Image from "next/image";
import {TeamBadgeItem, TeamBadgeStatus} from "@/types/TeamBadge";

type Props = {
	teams: TeamBadgeItem[];
	gridColsClass?: string;
};

const statusStyles: Record<TeamBadgeStatus, string> = {
	waiting: "bg-white/5 border-white/5 opacity-35 grayscale",
	validated: "bg-purpleReViSE/10 border-purpleReViSE/40"
};

export default function TeamBadgeGrid({ teams, gridColsClass = "grid-cols-3" }: Readonly<Props>) {
	return (
		<div className={`grid w-full gap-3 ${gridColsClass}`}>
			{teams.map((team) => (
				<div
					key={team.label}
					className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-500 ${statusStyles[team.status]}`}
				>
					<Image
						src={`/badges/teams/${team.label}.svg`}
						alt={team.label}
						width={80}
						height={80}
						className="sm:w-24 sm:h-24"
					/>
				</div>
			))}
		</div>
	);
}
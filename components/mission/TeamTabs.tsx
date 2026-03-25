import {teamColorMap} from "@/utils/teamColor";

type Props = {
	teamKeys: string[];
	selectedTeam: string;
	setSelectedIndex: (index: number) => void;
}

export const TeamTabs = (props: Props) => {
	return (
		<div className="flex items-end gap-2 min-w-max">
			{props.teamKeys.map((key, i) => (
				<button
					key={key}
					type="button"
					onClick={() => props.setSelectedIndex(i)}
					className={[
							"px-4 py-2 text-sm font-medium transition cursor-pointer rounded-t-xl border border-b-0 flex items-center gap-2 whitespace-nowrap",
							props.selectedTeam === key
								? "bg-slate-800 text-white border-slate-500"
								:	"bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white",
					].join(" ")}
				>
					<span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: teamColorMap[key] }} />
					{key}
				</button>
			))}
		</div>
	)
}
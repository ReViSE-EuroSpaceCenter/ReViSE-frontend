"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import { LobbyEventType } from "@/types/LobbyEventType";
import { getTeamsProgression } from "@/api/lobbyApi";

import Toolbox from "@/components/Toolbox";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import SideRow from "@/components/SideRow";
import {showError} from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";

type TeamData = {
	id: number;
	team: string;
	percent: number;
	mission1_check: boolean;
	mission2_check: boolean;
};

export default function Dashboard() {
	const params = useParams();
	const lobbyCode = params.gameId as string;
	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);
	const { subscribe, connected } = useWebSocket();

	const [teamsData, setTeamsData] = useState<TeamData[]>([]);
	const isMounted = useHasMounted();
	function useHasMounted() {
		const [hasMounted, setHasMounted] = useState(false);
		useEffect(() => {
			setHasMounted(true);
		}, []);
		return hasMounted;
	}

	interface TeamStats {
		classicMissionPercentage: number;
		firstBonusMissionCompleted: boolean;
		secondBonusMissionCompleted: boolean;
	}

	useEffect(() => {
		const fetchProgression = async () => {
			if (!lobbyCode) return;
			try {
				const data = await getTeamsProgression(lobbyCode);
				const progression = data.teamsProgression as Record<string, TeamStats>;

				const formattedTeams: TeamData[] = Object.entries(progression).map(
					([teamName, stats], index) => ({
						id: index,
						team: teamName,
						percent: stats.classicMissionPercentage,
						mission1_check: stats.firstBonusMissionCompleted,
						mission2_check: stats.secondBonusMissionCompleted,
					})
				);

				setTeamsData(formattedTeams);
			} catch (error) {
				const message = error instanceof Error ? error.message : "Erreur inconnue";
				showError(error instanceof ApiError ? error.key : "", `Erreur API: ${message}`);
			}
		};
		if (isMounted) void fetchProgression();
	}, [lobbyCode, isMounted]);

	useEffect(() => {
		if (!connected || !lobbyCode) return;
		const subscription = subscribe((message) => {
			if (!message?.body) return;

			const event: LobbyEventType = JSON.parse(message.body);

			if (event.type === "TEAM_PROGRESSION") {
				setTeamsData((prevTeams) =>
					prevTeams.map((t) =>
						t.team === event.payload.teamLabel
							? { ...t, percent: event.payload.percent }
							: t
					)
				);
			}
		});

		return () => subscription?.unsubscribe();
	}, [connected, subscribe, lobbyCode]);

	if (!isMounted) return null;

	const half = Math.ceil(teamsData.length / 2);
	const leftTeams = teamsData.slice(0, half);
	const rightTeams = teamsData.slice(half);

	return (
		<div className="min-h-[calc(100vh-120px)] w-full max-w-450 mx-auto flex flex-wrap xl:flex-nowrap items-center justify-center px-8 md:px-26 gap-8 xl:gap-0 overflow-x-hidden py-10 xl:py-4">

			<div className="flex flex-col gap-12 xl:gap-28 w-full md:w-[calc(50%-1rem)] xl:flex-1 order-2 xl:order-1 items-center xl:items-start xl:pr-12">
				{leftTeams.map((data) => (
					<SideRow
						key={`left-${data.team}`}
						percent={data.percent}
						team={data.team}
						mission1_check={data.mission1_check}
						mission2_check={data.mission2_check}
					/>
				))}
			</div>

			<div className="w-full max-w-[min(600px,calc(100vh-160px))] shrink-0 order-1 xl:order-2 flex justify-center px-4 xl:px-12">
				<Toolbox
					actions={[
						{ label: "Missions terminées", onClick: () => console.log("4") },
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
						{ label: "Tutoriel", onClick: () => console.log("3") },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>

			<div className="flex flex-col gap-12 xl:gap-28 w-full md:w-[calc(50%-1rem)] xl:flex-1 order-3 items-center xl:items-end xl:pl-12">
				{rightTeams.map((data) => (
					<SideRow
						key={`right-${data.team}`}
						percent={data.percent}
						team={data.team}
						mission1_check={data.mission1_check}
						mission2_check={data.mission2_check}
					/>
				))}
			</div>
		</div>
	);
}
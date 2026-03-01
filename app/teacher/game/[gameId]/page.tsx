"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import { LobbyEventType } from "@/types/LobbyEventType";
import { getTeamsProgression } from "@/api/lobbyApi";

import Toolbox from "@/components/Toolbox";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import SideRow from "@/components/SideRow";
import {StompSubscription} from "@stomp/stompjs";

type TeamData = {
	id: number;
	team: string;
	percent: number;
	mission1_check: boolean;
	mission2_check: boolean;
};

export default function Dashboard() {
	const searchParams = useSearchParams();
	const params = useParams();
	const lobbyCode = params.gameId as string;
	const nbTeams = Number(searchParams.get("nbTeams")) || 6;
	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);
	const { subscribe, connected } = useWebSocket();

	const [teamsData, setTeamsData] = useState<TeamData[]>([]);

	useEffect(() => {
		try {
			const match = document.cookie.match(/(^| )allTeams=([^;]+)/);
			const allRaw = match ? decodeURIComponent(match[2]) : null;
			const parsedCookie = allRaw ? JSON.parse(allRaw) : [];
			const allTeams: string[] = Array.isArray(parsedCookie) ? parsedCookie : [];

			if (allTeams.length > 0) {
				const formattedData: TeamData[] = allTeams.map((teamName: string, index: number) => {
					return {
						id: index + 1,
						team: teamName,
						label_mission: "",
						percent: 0,
						mission1_check: false,
						mission2_check: false
					};
				});
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setTeamsData(formattedData);
			}
		} catch (error) {
			console.error("Erreur cookie :", error);
		}
	}, []);

	useEffect(() => {
		const fetchProgression = async () => {
			if (!lobbyCode) return;
			try {
				const data = await getTeamsProgression(lobbyCode);
				const progression = data.teamsProgression;

				setTeamsData((prevTeams) =>
					prevTeams.map((t) => {
						const stats = progression[t.team];
						if (stats) {
							return {
								...t,
								percent: stats.classicMissionPercentage,
								mission1_check: stats.firstBonusMissionCompleted,
								mission2_check: stats.secondBonusMissionCompleted,
							};
						}
						return t;
					})
				);
			} catch (err) {
				console.error("Erreur API:", err);
			}
		};

		void fetchProgression();
	}, [lobbyCode]);

	useEffect(() => {
		if (!connected || !lobbyCode) return;

		let subscription: StompSubscription | null = null;
		try {
			subscription = subscribe((message) => {
				if (!message?.body) return;
				const event: LobbyEventType = JSON.parse(message.body);

				if (event.type === "TEAM_PROGRESSION") {
					setTeamsData((prevTeams) =>
						prevTeams.map((t) => {
							if (t.team === event.payload.teamLabel) {
								return { ...t, percent: event.payload.percent };
							}
							return t;
						})
					);
				}
			});
		} catch (error) {
			console.warn("La connexion STOMP n'était pas tout à fait prête :", error);
		}

		return () => {
			if (subscription && typeof subscription.unsubscribe === 'function') {
				subscription.unsubscribe();
			}
		};
	}, [connected, subscribe, lobbyCode]);
	const activeTeamsData = teamsData.slice(0, nbTeams);
	const half = Math.ceil(nbTeams / 2);
	const leftTeams = activeTeamsData.slice(0, half);
	const rightTeams = activeTeamsData.slice(half, nbTeams);

	return (
		<div className="min-h-[calc(100vh-120px)] w-full max-w-450 mx-auto flex flex-wrap xl:flex-nowrap items-center justify-center px-8 md:px-26 gap-8 xl:gap-0 overflow-x-hidden py-10 xl:py-4">


			<div className="flex flex-col gap-12 xl:gap-28 w-full md:w-[calc(50%-1rem)] xl:flex-1 order-2 xl:order-1 items-center xl:items-start xl:pr-12">
				{leftTeams.map((data) => (
					<SideRow
						key={data.id}
						percent={data.percent}
						team={data.team}
						mission1_check={data.mission1_check}
						mission2_check={data.mission2_check}
					/>
				))}
			</div>


			<div className="w-full max-w-[min(600px,calc(100vh-160px))] shrink-0 order-1 xl:order-2 flex justify-center px-4 xl:px-12">
				<Toolbox
					centerContent={"Boîte à outils"}
					actions={[
						{ label: "Missions terminées", onClick: () => console.log("4") },
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "Aide technologies IA", onClick: () => setIsIAOpen(true) },
						{ label: "Tutoriel", onClick: () => console.log("3") },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>


			<div className="flex flex-col gap-12 xl:gap-28 w-full md:w-[calc(50%-1rem)] xl:flex-1 order-3 items-center xl:items-end xl:pl-12">
				{rightTeams.map((data) => (
					<SideRow
						key={data.id}
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
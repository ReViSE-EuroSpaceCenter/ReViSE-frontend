"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useWebSocket} from "@/contexts/WebSocketProvider";
import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {showError} from "@/errors/getErrorMessage";
import {LobbyEventType} from "@/types/LobbyEventType";
import {ApiError} from "@/api/apiError";
import LoadingPage from "@/app/loading";
import {useLobby} from "@/hooks/useLobby";
import {TeamInfo} from "@/types/TeamInfo";
import {TeamButton} from "@/components/student/TeamButton";
import {WaitForStartMissions} from "@/components/student/WaitForStartMissions";

export default function TeamPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useParams();
	const queryClient = useQueryClient();
	const { subscribe, connected } = useWebSocket();

    const clientId =
        globalThis.window === undefined
            ? null
            : sessionStorage.getItem("clientId");
    
	const lobbyCode = params.gameId as string;
	const { lobbyQuery, handleJoinTeam } = useLobby(lobbyCode);
	const { data, isError, error, isLoading } = lobbyQuery;

	const chosenTeam = searchParams.get("chosenTeam");
	const waitForStart = chosenTeam !== null;

	const availableTeams = data?.availableTeams ?? [];
	const allTeams = data?.allTeams ?? [];

	useEffect(() => {
		if (isError) {
			showError(error instanceof ApiError ? error.key : "");
		}
	}, [isError, error]);

	const removeTakenTeam = (teams: string[], teamToRemove: string) =>
		teams.filter((team) => team !== teamToRemove);

	useEffect(() => {
		if (!connected) return;

		const subscription = subscribe("lobby", (message) => {
			const event: LobbyEventType = JSON.parse(message.body);

			switch (event.type) {
				case "TEAM_JOINED":
					queryClient.setQueryData(
						["lobbyInfo", lobbyCode],
						(oldData: TeamInfo) => {
							if (!oldData) return oldData;

							return {
								...oldData,
								availableTeams: removeTakenTeam(oldData.availableTeams, event.payload.teamLabel),
							};
						}
					);
					break;
				case "GAME_STARTED":
					router.push(`/student/game/${lobbyCode}/${chosenTeam}?presentation=true`);
					break;
			}
		});

		return () => subscription?.unsubscribe();
	}, [connected, subscribe, router, chosenTeam, lobbyCode, queryClient]);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (waitForStart) {
		return <WaitForStartMissions chosenTeam={chosenTeam} />;
	}

	return (
		<div className="min-h-[calc(100vh-80px)]">
			<div className="px-6 lg:px-12 py-6 lg:py-12 max-w-7xl mx-auto">
				<div className="text-center space-y-4 mb-12">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
						Rejoignez votre équipe
					</h1>
					<p className="text-lg sm:text-xl text-slate-300">
						Chaque équipe joue un rôle clé dans l{"'"}expédition vers Europe. Choisissez la vôtre.
					</p>
				</div>

				<div
					className={`grid gap-6 max-w-5xl mx-auto ${
						allTeams.length === 4
							? "grid-cols-1 sm:grid-cols-2" 
							: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
					}`}
				>
					{allTeams.map((team) => (
						<TeamButton
							key={team}
							team={team}
							isTaken={!availableTeams.includes(team)}
							onJoin={team => handleJoinTeam(team, availableTeams, clientId as string)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

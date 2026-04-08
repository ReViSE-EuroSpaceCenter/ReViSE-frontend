"use client";

import React, {SyntheticEvent, useState} from "react";
import { useJoinLobby } from "@/hooks/useJoinLobby";
import {JoinSubmitButton} from "@/components/student/JoinSubmitButton";

export default function JoinPage() {
	const joinLobbyMutation = useJoinLobby();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const rawCode = formData.get("lobbyCode") as string;
		const lobbyCode = rawCode?.trim().toUpperCase() ?? "";

		if (lobbyCode.length !== 6) {
			setError("Le code doit contenir exactement 6 lettres.");
			return;
		}
		joinLobbyMutation.mutate(lobbyCode);
	};

	return (
		<div className="flex items-center justify-center pt-16 sm:pt-24 p-4 sm:p-6 w-full">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl
        bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl shadow-2xl
        rounded-3xl sm:rounded-[2.5rem]
        p-6 sm:p-10
        flex flex-col items-center gap-6 sm:gap-10"
			>
				<header className="text-center">
					<h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
						Rejoindre une partie
					</h1>
				</header>

				{error && (
					<div className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
						<span className="text-red-400 text-lg">⚠️</span>
						<p className="text-red-400 text-xs sm:text-sm font-bold italic uppercase tracking-wider">
							{error}
						</p>
					</div>
				)}

				<div className="w-full space-y-4">
					<input
						id="lobbyCode"
						type="text"
						name="lobbyCode"
						placeholder="EX: XKABDE"
						required
						autoComplete="off"
						onInput={(e) => {
							const target = e.target as HTMLInputElement;
							target.value = target.value
								.toUpperCase()
								.replaceAll(/[^A-Z]/g, "");

							if (error) setError(null);
						}}
						className="w-full px-6 py-4 sm:py-5
                bg-white/5 border border-white/10
                rounded-xl sm:rounded-2xl
                text-xl sm:text-3xl font-black tracking-[0.4em]
                uppercase text-white text-center
                focus:outline-none focus:border-purpleReViSE/50 focus:bg-white/10 transition"
					/>
				</div>
				<JoinSubmitButton isPending={joinLobbyMutation.isPending} />
			</form>
		</div>
	);
}
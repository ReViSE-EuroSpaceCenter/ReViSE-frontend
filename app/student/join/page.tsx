"use client";

import React, {SyntheticEvent, useState} from "react";
import { useJoinLobby } from "@/hooks/useJoinLobby";
import { JoinSubmitButton } from "@/components/student/JoinSubmitButton";

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

		setError(null);
		joinLobbyMutation.mutate(lobbyCode);
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0f0e1c]">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md md:max-w-lg lg:max-w-xl
             bg-[#1a1635]/50 backdrop-blur-2xl shadow-2xl rounded-4xl
             sm:rounded-[3rem] p-8 md:p-12 border
             border-white/10 flex flex-col gap-8 transition-all duration-300"
			>
				<header className="text-center">
					<h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
						Rejoindre
					</h1>
				</header>

				{error && (
					<div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
						<span className="text-red-400 text-lg">⚠️</span>
						<p className="text-red-400 text-xs sm:text-sm font-bold italic uppercase tracking-wider">
							{error}
						</p>
					</div>
				)}

				<div className="flex flex-col gap-5">
					<label
						htmlFor="lobbyCode"
						className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] px-1"
					>
						Code d{"'"}accès session
					</label>

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
						}}
						pattern="[A-Z]{6}"
						minLength={6}
						maxLength={6}
						className="w-full px-6 py-5 bg-black/20 rounded-2xl border border-white/10
                        text-2xl font-black tracking-[0.4em] uppercase text-white text-center"
					/>
				</div>

				<div className="mt-2">
					<JoinSubmitButton pending={joinLobbyMutation.isPending} />
				</div>
			</form>
		</div>
	);
}
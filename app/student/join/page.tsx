"use client";

import { useState } from "react";
import {joinLobby} from "@/api/lobbyApi";
import { useRouter } from "next/navigation";


export default function JoinPage() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	async function handleJoin(formData: FormData) {
		setIsLoading(true);
		setError(null);

		const rawCode = formData.get("lobbyCode") as string;
		const lobbyCode = rawCode ? rawCode.trim().toUpperCase() : "";


		if (lobbyCode.length !== 6) {
			setError("Le code doit contenir exactement 6 lettres.");
			setIsLoading(false);
			return;
		}

		try {
			const { clientId, availableTeams } = await joinLobby(lobbyCode);
			document.cookie = `clientId=${clientId}; path=/; max-age=3600; SameSite=Lax`;
			const teamsParam = encodeURIComponent(JSON.stringify(availableTeams));
			console.log("lobbyCode", lobbyCode);
			router.push(`/student/game/${lobbyCode}/team?teams=${teamsParam}`);

		} catch (error: unknown) { // On remplace any par unknown
			if (error instanceof Error) {
				setError(`${error.message || "Erreur"} : Code introuvable ou invalide.`);
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4 pb-32 md:pb-48">
			<form
				action={handleJoin}
				className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-6 transition-all duration-300"
			>
				<div className="text-center">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
						Rejoindre la partie
					</h1>
					{error && (
						<p className="text-red-500 text-sm font-semibold bg-red-50 p-2 rounded border border-red-200">
							⚠️ {error}
						</p>
					)}
					<p className="text-sm md:text-base text-gray-500">
						Entrez le code affiché sur l&#39;écran principal
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="lobbyCode" className="text-sm md:text-base font-medium text-gray-700">
						Code de connexion
					</label>
					<input
						id="lobbyCode"
						type="text"
						name="lobbyCode"
						placeholder="Ex: Xop45E"
						required
						className="w-full px-4 py-3 md:py-4 rounded-lg border
						border-gray-300 focus:ring-2 focus:ring-blue-500
						focus:border-blue-500 outline-none transition-all text-lg md:text-xl text-black
						${error ? 'border-red-500' : 'border-gray-300'}\`}"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full py-3.5 md:py-4 px-4 bg-blue-600
					hover:bg-blue-700 text-white font-semibold rounded-lg
					shadow-md transition-colors text-lg md:text-xl active:scale-[0.98]"
				>
					{isLoading ? "Connexion..." : "Rejoindre"}
				</button>
			</form>
		</main>
	);
}
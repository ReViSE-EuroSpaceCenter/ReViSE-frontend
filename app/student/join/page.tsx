"use client";

import { useActionState } from "react";
import { handleJoin } from "@/actions/joinLobby";
import { useFormStatus } from 'react-dom';

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full py-3.5 md:py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors text-lg md:text-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
		>
			{pending ? "Connexion..." : "Rejoindre"}
		</button>
	);
}


export default function JoinPage() {
	const [state, formAction] = useActionState(handleJoin, null);
	console.log(state?.error);
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4 pb-32 md:pb-48">
			<form
				action={formAction}
				className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-6 transition-all duration-300"
			>
				<div className="text-center">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
						Rejoindre la partie
					</h1>
					{state?.error && (
						<p className="text-red-500 text-sm font-semibold bg-red-50 p-2 rounded border border-red-200">
							⚠️ {state.error}
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
						{state?.error ? 'border-red-500' : 'border-gray-300'}
						border-gray-300 focus:ring-2 focus:ring-blue-500
						focus:border-blue-500 outline-none transition-all text-lg md:text-xl text-black
						${error ? 'border-red-500' : 'border-gray-300'}\`}"
					/>
				</div>

				<SubmitButton />
			</form>
		</main>
	);
}
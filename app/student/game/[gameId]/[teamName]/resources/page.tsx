"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import {updateResources} from "@/api/launcherApi";

export default function Resources() {
	const router = useRouter();
	const params = useParams();

	const lobbyCode = params.gameId as string;
	const clientId =
		globalThis.window === undefined
			? null
			: sessionStorage.getItem("clientId");

	const [resources, setResources] = useState(0);
	const [humans, setHumans] = useState(0);
	const [time, setTime] = useState(0);

	const mutation = useMutation({
		mutationFn: async () => {
			const resourcesPayload = {
				resources: {
					ENERGY: resources || 0,
					HUMAN: humans || 0,
					CLOCK: time || 0,
				},
			};
			await updateResources(lobbyCode, clientId as string, resourcesPayload);
		},
		onSuccess: () => {
			router.push("/");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate();
	};

	return (
		<div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-4 py-8 sm:py-12">
			<div className="w-full max-w-md space-y-8">

				<div className="space-y-2">
					<h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
						Ressources de votre équipe
					</h1>
					<p className="text-slate-400 text-sm sm:text-base">
						Indiquez les ressources restantes pour passer à la phase suivante.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 space-y-5"
				>

					{[
						{
							label: "Ressources restantes",
							icon: "🪫",
							value: resources,
							max: 40,
							setter: setResources,
						},
						{
							label: "Humains restants",
							icon: "👤",
							value: humans,
							max: 6,
							setter: setHumans,
						},
						{
							label: "Horloge restante",
							icon: "🕐",
							value: time,
							max: 6,
							setter: setTime,
						},
					].map(({ label, icon, value, max, setter }) => (
						<div key={label} className="flex flex-col space-y-1.5">
							<label className="text-slate-300 text-sm font-medium flex items-center gap-2">
								<span className="text-base">{icon}</span>
								{label}
							</label>
							<input
								type="number"
								min={0}
								max={max}
								value={value}
								inputMode="numeric"
								pattern="[0-9]*"
								onChange={(e) => {
									const v = Number(e.target.value);
									setter(Math.min(max, Math.max(0, v)));
								}}
								className="
									bg-slate-900/80 border border-slate-700 rounded-xl
									px-4 py-3 text-white text-lg
									placeholder:text-slate-600
									focus:outline-none focus:border-purpleReViSE focus:ring-2 focus:ring-purpleReViSE/20
									transition-all duration-150
									w-full
              	"
								placeholder="0"
							/>
						</div>
					))}

					<div className="pt-1">
						<button
							type="submit"
							disabled={mutation.isPending}
							className="
              w-full bg-purpleReViSE hover:bg-purpleReViSE/85 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold py-3.5 rounded-xl
              transition-all duration-150
              text-base sm:text-lg
            "
						>
							{mutation.isPending ? (
								<span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Envoi en cours…
              </span>
							) : (
								"Valider les ressources"
							)}
						</button>
					</div>

					{mutation.isError && (
						<div className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg py-2.5 px-4">
							<span className="text-red-400 text-sm">Une erreur est survenue. Veuillez réessayer.</span>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
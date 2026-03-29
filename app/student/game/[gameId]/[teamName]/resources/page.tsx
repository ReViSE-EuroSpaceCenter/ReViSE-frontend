"use client";

import {SyntheticEvent, useState} from "react";
import {useResources} from "@/hooks/useResources";

export default function Resources() {
	const resourcesMutation = useResources()
	const [resources, setResources] = useState<string>("");
	const [humans, setHumans] = useState<string>("");
	const [time, setTime] = useState<string>("");


	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		resourcesMutation.mutate({
			resources: Number(resources),
			humans: Number(humans),
			time: Number(time),
		});
	};

	return (
		<div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-4 py-8 sm:py-12">
			<div className="w-full max-w-md space-y-8">

				<div className="space-y-2 text-center">
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
							label: "Énergies restantes",
							value: resources,
							max: 40,
							setter: setResources,
						},
						{
							label: "Humains restants",
							value: humans,
							max: 6,
							setter: setHumans,
						},
						{
							label: "Horloges restantes",
							value: time,
							max: 6,
							setter: setTime,
						},
					].map(({ label, value, max, setter }) => (
						<div key={label} className="flex flex-col space-y-1.5">
							<label className="text-slate-300 text-sm font-medium flex items-center gap-2">
								{label}
							</label>
							<input
								type="number"
								min={0}
								max={max}
								value={value}
								inputMode="numeric"
								pattern="[0-9]*"
								placeholder="0"
								onKeyDown={(e) => {
									if (["e", "E", "+", "-"].includes(e.key)) {
										e.preventDefault();
									}
								}}
								onChange={(e) => {
									const raw = e.target.value;
									if (raw === "") { setter(""); return; }
									const v = Math.min(max, Math.max(0, Number(raw)));
									setter(String(v));
								}}
								className="
									bg-slate-900/80 border border-slate-700 rounded-xl
									px-4 py-3 text-white text-lg
									placeholder:text-slate-600
									focus:outline-none focus:border-purpleReViSE focus:ring-2 focus:ring-purpleReViSE/20
									transition-all duration-150 w-full
								"
								enterKeyHint="done"
							/>
						</div>
					))}

					<div className="pt-1">
						<button
							type="submit"
							disabled={resourcesMutation.isPending}
							className="
              w-full bg-purpleReViSE hover:bg-purpleReViSE/85 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold py-3.5 rounded-xl
              transition-all duration-150
              text-base sm:text-lg
            "
						>
							{resourcesMutation.isPending ? (
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
				</form>
			</div>
		</div>
	);
}
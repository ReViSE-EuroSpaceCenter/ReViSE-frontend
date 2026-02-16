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
			className={`
       group w-full py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-xl 
       transition-all duration-300 flex items-center justify-center gap-3 shadow-xl
       ${
			pending
				? "bg-white/5 text-white/10 cursor-not-allowed scale-[0.98]"
				: "bg-orange-300 hover:bg-orange-200 text-[#1e1b4b] cursor-pointer hover:shadow-orange-300/20 active:scale-95"
			}
     `}
		>
			{pending ? (
				<div className="flex items-center gap-3">
					<svg className="animate-spin h-5 w-5 text-orange-400" viewBox="0 0 24 24">
						<circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
						<path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>

					<div className="flex items-baseline text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
						<span>Connexion</span>
						<div className="flex ml-1 text-orange-300">
							<span className="animate-[bounce_1s_infinite_0ms]">.</span>
							<span className="animate-[bounce_1s_infinite_200ms]">.</span>
							<span className="animate-[bounce_1s_infinite_400ms]">.</span>
						</div>
					</div>
				</div>
			) : (
				<>
					<span>REJOINDRE LA SESSION</span>
					<span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:animate-bounce group-hover:scale-120">
                ⚡
             </span>
				</>
			)}
		</button>
	);
}


export default function JoinPage() {
	const [state, formAction] = useActionState(handleJoin, null);
	return (
		<div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6">
			<form
				action={formAction}
				className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-[#1e1b4b]/60 backdrop-blur-xl shadow-2xl rounded-3xl sm:rounded-[2.5rem] p-8 md:p-12 border border-orange-300/10 flex flex-col gap-8 transition-all duration-300"
			>

				<header className="text-center">
					<h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">
						Rejoindre la partie
					</h1>
					<div className="flex items-center justify-center gap-2">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-300 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
						</span>
						<p className="text-orange-100/50 font-medium text-[10px] sm:text-xs uppercase tracking-[0.2em]">
							Connexion en cours
						</p>
					</div>
				</header>

				{state?.error && (
					<div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
						<span className="text-red-400 text-lg">⚠️</span>
						<p className="text-red-400 text-xs sm:text-sm font-bold italic uppercase tracking-wider">
							{state.error}
						</p>
					</div>
				)}

				<div className="flex flex-col gap-4">
					<label
						htmlFor="lobbyCode"
						className="text-[10px] sm:text-[11px] font-bold text-orange-200/40 uppercase tracking-[0.4em] px-1"
					>
						Code d&#39;accès session
					</label>
					<div className="relative">
						<input
							id="lobbyCode"
							type="text"
							name="lobbyCode"
							placeholder="EX: XKABDE"
							required
							className={`w-full px-6 py-4 sm:py-5 bg-orange-200/5 rounded-2xl border transition-all outline-none text-xl sm:text-2xl font-black tracking-[0.3em] uppercase text-orange-300 placeholder:text-orange-200/10 text-center ${
								state?.error
									? 'border-red-500/50 ring-2 ring-red-500/20'
									: 'border-orange-200/20 focus:border-orange-300/50 focus:ring-4 focus:ring-orange-300/10'
							}`}
						/>
					</div>
					<p className="text-[9px] sm:text-[10px] text-center text-orange-100/30 font-medium">
						Entrez le code affiché sur l&#39;écran principal
					</p>
				</div>

				<div className="mt-4">
					<SubmitButton />
				</div>
			</form>
		</div>
	);
}
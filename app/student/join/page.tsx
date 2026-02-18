"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { handleJoin } from "@/actions/joinLobby";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className={`
           group w-full px-8 py-4 sm:py-5 rounded-xl font-black text-sm sm:text-xl 
           transition-all duration-300 flex items-center justify-center gap-3 shadow-xl
           ${
				pending
					? "bg-white/5 text-white/10 cursor-not-allowed scale-[0.98]"
					: "bg-purpleReViSE hover:bg-purpleReViSE/90 text-white cursor-pointer hover:shadow-purpleReViSE/20 active:scale-95"
			}
         `}
		>
			{pending ? (
				<div className="flex items-center gap-3">
					<svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
						<circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
						<path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>

					<div className="flex items-baseline text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
						<span>Connexion</span>
						<div className="flex ml-1 text-white/50">
							<span className="animate-[bounce_1s_infinite_0ms]">.</span>
							<span className="animate-[bounce_1s_infinite_200ms]">.</span>
							<span className="animate-[bounce_1s_infinite_400ms]">.</span>
						</div>
					</div>
				</div>
			) : (
				<>
					<span className="text-lg">REJOINDRE LA SESSION</span>
					<span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    🚀
             </span>
				</>
			)}
		</button>
	);
}

export default function JoinPage() {
	const [state, formAction] = useActionState(handleJoin, null);

	return (
		<div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0f0e1c]">
			<form
				action={formAction}
				className="w-full max-w-md md:max-w-lg lg:max-w-xl
             bg-[#1a1635]/50 backdrop-blur-2xl shadow-2xl rounded-4xl
             sm:rounded-[3rem] p-8 md:p-12 border
             border-white/10 flex flex-col gap-8 transition-all duration-300"
			>
				<header className="text-center">
					<h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
						Rejoindre
					</h1>
					<div className="flex items-center justify-center gap-3">
                   <span className="relative flex h-2.5 w-2.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purpleReViSE opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purpleReViSE"></span>
                   </span>
						<p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em]">
							Session d&#39;exploration
						</p>
					</div>
				</header>

				{state?.error && (
					<div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
						<span className="text-red-400 text-lg">⚠️</span>
						<p className="text-red-400 text-xs sm:text-sm font-bold italic uppercase tracking-wider">
							{state.error}
						</p>
					</div>
				)}

				<div className="flex flex-col gap-5">
					<label
						htmlFor="lobbyCode"
						className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] px-1"
					>
						Code d&#39;accès session
					</label>
					<div className="relative group/input">
						<input
							id="lobbyCode"
							type="text"
							name="lobbyCode"
							placeholder="EX: XKABDE"
							required
							autoComplete="off"
							onInput={(e) => {
								const target = e.target as HTMLInputElement;
								target.value = target.value.toUpperCase().replace(/[^A-Z]/g, '');
							}}
							pattern="[A-Z]{6}"
							minLength={6}
							maxLength={6}
							className={`w-full px-6 py-5 sm:py-6 bg-black/20 rounded-2xl border transition-all 
							outline-none text-2xl sm:text-3xl font-black tracking-[0.4em] 
							uppercase text-white placeholder:text-white/5 text-center 
							${
								state?.error
									? 'border-red-500/50 ring-2 ring-red-500/10'
									: 'border-white/10 group-hover/input:border-purpleReViSE/50 focus:border-purpleReViSE focus:ring-4 focus:ring-purpleReViSE/10'
							}`}
						/>
					</div>
					<p className="text-[10px] text-center text-slate-400 font-medium italic">
						Le code est visible sur l&#39;écran de l&#39;hôte
					</p>
				</div>

				<div className="mt-2">
					<SubmitButton />
				</div>
			</form>
		</div>
	);
}
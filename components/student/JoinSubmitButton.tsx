type Props = {
		pending: boolean;
}

export const JoinSubmitButton = (props: Props) => {
	return (
		<button
			type="submit"
			disabled={props.pending}
			className={`
           group w-full px-8 py-4 sm:py-5 rounded-xl font-black text-sm sm:text-xl 
           transition-all duration-300 flex items-center justify-center gap-3 shadow-xl
           ${
				props.pending
					? "bg-white/5 text-white/10 cursor-not-allowed scale-[0.98]"
					: "bg-purpleReViSE hover:bg-purpleReViSE/90 text-white cursor-pointer hover:shadow-purpleReViSE/20 active:scale-95"
			}
         `}
		>
			{props.pending ? (
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
export default function LoadingPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="relative h-16 w-16">
					<div className="absolute inset-0 rounded-full border-4 border-slate-200/20"></div>
					<div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-sky-300 border-r-sky-300"></div>
				</div>

				<p className="animate-pulse text-lg font-medium text-slate-200">
					Chargement en cours...
				</p>
			</div>
		</div>
	);
}

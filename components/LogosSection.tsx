import Image from "next/image";

export const LogosSection = () => (
	<div className="space-y-4 pt-4 border-t border-slate-700/50">
		<div className="space-y-2">
			<p className="text-xs uppercase tracking-widest text-slate-300 font-medium">En partenariat avec</p>
			<div className="flex items-center gap-8 flex-wrap">
				<Image src="/logos/eurospace.png" alt="Euro Space Center" width={200} height={56}
				       className="h-12 w-auto object-contain" />
				<Image src="/logos/unamur_blanc.png" alt="UNamur" width={200} height={56} className="h-12 w-auto object-contain" />
				<Image src="/logos/B12.png" alt="B12 Consulting" width={200} height={56} className="h-12 w-auto object-contain" />
			</div>
		</div>

		<div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
			<div className="space-y-2">
				<p className="text-xs uppercase tracking-widest text-slate-300 font-medium">Designed by</p>
				<Image src="/logos/acritarche.png" alt="Acritarche" width={200} height={56}
				       className="h-12 w-auto object-contain" />
			</div>

			<div className="space-y-2">
				<p className="text-xs uppercase tracking-widest text-slate-300 font-medium">Avec le soutien de</p>
				<Image src="/logos/WR.png" alt="Les talents du Futur (RW)" width={200} height={56}
				       className="h-12 w-auto object-contain" />
			</div>
		</div>
	</div>
);
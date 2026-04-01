import Image from "next/image";
import React from "react";

type BonusInfo = {
	team: string;
	nb: string;
	title?: string;
	text?: string;
};

type ResourceCardProps = {
	id: string;
	imgSrc: string;
	autoValidated: boolean;
	validated: boolean;
	onClick?: () => void;
	bonus?: BonusInfo;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
																														id,
																														imgSrc,
																														autoValidated,
																														validated,
																														onClick,
																														bonus,
																													}) => {
	const isActive = autoValidated || validated;
	const isClickable = !autoValidated;

	const mainImageSrc =
		autoValidated && bonus
			? `/badges/bonus/${bonus.team}_bonus${bonus.nb}.svg`
			: imgSrc;

	return (
		<button
			type="button"
			onClick={isClickable ? onClick : undefined}
			disabled={!isClickable}
			title={bonus?.title ?? id}
			className={[
				"relative max-w-1/4 rounded-2xl border p-5 transition-all duration-300 shadow-md text-left",
				isActive
					? "bg-green-500/20 border-green-500"
					: "bg-white/5 border-white/10 hover:bg-white/10",
				isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-100",
				autoValidated ? "" : "flex items-center justify-center",
			]
				.filter(Boolean)
				.join(" ")}
		>
			{isActive && (
				<div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow">
					<span className="text-white text-xs font-bold">✓</span>
				</div>
			)}

			<div className="flex flex-col items-center gap-2">
				<Image
					src={mainImageSrc}
					alt={bonus?.title ?? id}
					width={80}
					height={80}
					className="object-contain"
				/>

				{autoValidated && bonus && (bonus.title || bonus.text) && (
					<div className="text-center">
						{bonus.title && (
							<h4 className="text-white font-semibold text-sm">{bonus.title}</h4>
						)}
						{bonus.text && (
							<p className="text-white/70 text-xs">{bonus.text}</p>
						)}
					</div>
				)}
			</div>
		</button>
	);
};
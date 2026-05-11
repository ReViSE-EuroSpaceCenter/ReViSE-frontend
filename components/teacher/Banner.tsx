'use client'

import {useState} from "react";

export const Banner = ({ message }: { message: string }) => {
	const [visible, setVisible] = useState(true);

	if (!visible) return null;

	return (
		<div className="w-full bg-purple-950/60 border-b border-purple-500/30 border-l-4 border-l-purple-400 px-4 py-3 flex items-center justify-between">
			<span className="flex-1 text-purple-100 text-sm">{message}</span>
			<button
				onClick={() => setVisible(false)}
				aria-label="Fermer"
				className="ml-4 text-purple-300 hover:text-white text-lg leading-none cursor-pointer transition-colors"
			>
				✕
			</button>
		</div>
	);
}
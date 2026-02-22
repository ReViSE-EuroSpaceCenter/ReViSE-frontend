"use client";

import Toolbox from "@/components/toolbox";

export default function Dashboard() {
	return (
		<div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
			<div className="w-full max-w-[min(600px,calc(100vh-160px))]">
				<Toolbox
					centerContent={"Boîte à outils"}
					actions={[
						{ label: "Etat mission", onClick: () => console.log("4") },
						{ label: "Fin du tour", onClick: () => console.log("1") },
						{ label: "Technologies d'IA", onClick: () => console.log("2") },
					]}
				/>
			</div>
		</div>
	);
}
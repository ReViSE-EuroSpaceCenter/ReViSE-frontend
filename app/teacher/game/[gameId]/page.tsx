"use client";

import Toolbox from "@/components/Toolbox";
import {useState} from "react";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";

export default function Dashboard() {
	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);

	return (
		<div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
			<div className="w-full max-w-[min(600px,calc(100vh-160px))]">
				<Toolbox
					actions={[
						{ label: "Missions terminées", onClick: () => console.log("4") },
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
						{ label: "Tutoriel", onClick: () => console.log("3") },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>
		</div>
	);
}
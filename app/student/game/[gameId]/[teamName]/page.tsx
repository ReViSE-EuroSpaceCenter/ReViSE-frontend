"use client";

import Toolbox from "@/components/Toolbox";
import {usePathname, useRouter} from "next/navigation";
import {useState} from "react";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";

export default function Dashboard() {
	const router = useRouter();
	const pathname = usePathname();
	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);

	return (
		<div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
			<div className="w-full max-w-[min(600px,calc(100vh-160px))]">
				<Toolbox
					actions={[
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "État des mission", onClick: () => router.push(`${pathname}/mission`), },
						{ label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>
		</div>
	);
}
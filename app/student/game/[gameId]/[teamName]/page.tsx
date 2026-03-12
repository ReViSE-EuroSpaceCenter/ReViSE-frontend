"use client";

import Toolbox from "@/components/Toolbox";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import PresentationModal from "@/components/PresentationModal";
import { showError } from "@/errors/getErrorMessage";

export default function Dashboard() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);
	const [texts, setTexts] = useState<Record<string, string>>({});
	const [isPresentationOpen, setIsPresentationOpen] = useState(false);

	const teamPageMatch = /^\/student\/game\/[^/]+\/([^/]+)(?:\/(intro|mission))?$/.exec(pathname);
	const name = teamPageMatch && teamPageMatch[1] !== "team" ? teamPageMatch[1] : null;

	const teamColorMap: Record<string, string> = {
		MEDI: "#a2d49f",
		COOP: "#1783c2",
		AERO: "#84298e",
		MECA: "#e4dec8",
		EXPE: "#da5437",
		GECO: "#234e6f",
	};

	const iconMap: Record<string, string> = {
		MEDI: "/badges/MEDI.png",
		COOP: "/badges/COOP.png",
		AERO: "/badges/AERO.png",
		MECA: "/badges/MECA.png",
		EXPE: "/badges/EXPE.png",
		GECO: "/badges/GECO.png",
	};

	useEffect(() => {
		const showPresentation = searchParams.get("presentation");
		if (showPresentation === "true") {
			fetch("/presentation_texts.json")
				.then((res) => res.json())
				.then((data) => {
					setTexts(data)
					setIsPresentationOpen(true);
                    router.replace(pathname);
				})
				.catch(() => showError("", "Erreur lors du chargement des textes de présentation"));
		}
	}, [pathname, searchParams, router]);

	return (
		<div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
			<div className="w-full max-w-[min(600px,calc(100vh-160px))]">
				<Toolbox
					actions={[
						{ label: "Fin du tour", onClick: () => setIsChecklistOpen(true) },
						{ label: "États des missions", onClick: () => router.push(`${pathname}/mission`) },
						{ label: "Aide\nTechnologies IA", onClick: () => setIsIAOpen(true) },
					]}
				/>
				<Checklist isOpen={isChecklistOpen} setIsOpen={setIsChecklistOpen} />
				<IATech isOpen={isIAOpen} setIsOpen={setIsIAOpen} />
			</div>

			{name && texts[name] && (
				<PresentationModal
					isOpen={isPresentationOpen}
					setIsOpen={setIsPresentationOpen}
					icon={iconMap[name]}
					text={texts[name]}
					name={name}
					color={teamColorMap[name]}
				/>
			)}
		</div>
	);
}
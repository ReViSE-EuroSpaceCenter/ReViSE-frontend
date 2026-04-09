"use client";

import Toolbox from "@/components/Toolbox";
import {useCallback, useState} from "react";
import {usePathname, useParams, useRouter, useSearchParams} from "next/navigation";
import Checklist from "@/components/Checklist";
import IATech from "@/components/IATech";
import {teamColorMap} from "@/utils/teamColor";
import {presentationTexts} from "@/utils/presentationTexts";
const PresentationModal = dynamic(
	() => import("@/components/PresentationModal"),
	{ ssr: false, loading: () => null }
);
import dynamic from "next/dynamic";
import {useWSSubscription} from "@/hooks/useWSSubscription";

export default function Dashboard() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	const lobbyCode = params.gameId as string;
	const teamName = params.teamName as string;

	const searchParams = useSearchParams();
	const [isChecklistOpen, setIsChecklistOpen] = useState(false);
	const [isIAOpen, setIsIAOpen] = useState(false);

	const teamPageMatch = /^\/student\/game\/[^/]+\/([^/]+)(?:\/(intro|mission))?$/.exec(pathname);
	const name = teamPageMatch && teamPageMatch[1] !== "team" ? teamPageMatch[1] : null;
	const teamColor = teamColorMap[name!];

	const showPresentation = searchParams.get("presentation") === "true";
	const [isPresentationOpen, setIsPresentationOpen] = useState(showPresentation);
	const text = showPresentation ? presentationTexts[name!] : null

	useWSSubscription("mission", useCallback((event) => {
		if (event.type === "MISSION_ENDED") {
			router.push(`/student/game/${lobbyCode}/${teamName}/launcher`);
		}
	}, [router, lobbyCode, teamName]));

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

			{name && text && (
				<PresentationModal
					isOpen={isPresentationOpen}
					setIsOpen={setIsPresentationOpen}
					icon={`/badges/teams/${name}.svg`}
					text={text}
					name={name}
					color={teamColor}
					onClose={() => router.replace(pathname) }
				/>
			)}
		</div>
	);
}
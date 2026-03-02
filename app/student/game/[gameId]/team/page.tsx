
import { cookies } from "next/headers";
import TeamSelect from "@/components/student/TeamSelect";


export default async function TeamPage() {
	const cookieStore = await cookies();

	const allRaw = cookieStore.get("allTeams")?.value ?? null;
	const availableRaw = cookieStore.get("availableTeams")?.value ?? null;

	let allTeams: string[] = [];
	let takenTeams: string[] = [];

	if (allRaw) {
		const all = JSON.parse(allRaw);
		const available = availableRaw ? JSON.parse(availableRaw) : [];

		allTeams = all;
		takenTeams = all.filter((t: string) => !available.includes(t));
	}

	return (
		<TeamSelect
			allTeams={allTeams}
			initialTakenTeams={takenTeams}
		/>
	);
}

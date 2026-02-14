import {joinLobby} from "@/api/lobbyApi";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

async function handleJoin(formData: FormData) {
	"use server";

	const { clientId, availableTeams } = await joinLobby(formData.get("lobbyCode") as string);
	(await cookies()).set("clientId", clientId, {
		httpOnly: true,
		path: "/",
	});
	const teamsParam = encodeURIComponent(JSON.stringify(availableTeams));
	redirect(`/student/game/${formData.get("lobbyCode") as string}/team?teams=${teamsParam}`);
}

export default function JoinPage() {

	return (
		<form
			action={handleJoin}
			className={"flex flex-col gap-4"}
		>
			<h1>Page d{"'"}encodage pour le code de connexion</h1>
			<input
				type={"text"}
				name={"lobbyCode"}
				className="bg-white text-black border border-gray-300 rounded-lg"
			/>
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded"
			>
				Rejoindre
			</button>
		</form>

	)
}
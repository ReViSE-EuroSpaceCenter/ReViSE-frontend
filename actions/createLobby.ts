"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {createLobby} from "@/api/lobbyApi";

export async function handleCreateLobby(formData: FormData) {
	const nbTeams = Number(formData.get("nbTeams"));
	const { lobbyCode, hostId } = await createLobby(nbTeams);

	(await cookies()).set("hostId", hostId, {
		httpOnly: true,
		path: "/",
	});

	redirect(`/teacher/game/${lobbyCode}/setup?nbTeams=${nbTeams}`);
}
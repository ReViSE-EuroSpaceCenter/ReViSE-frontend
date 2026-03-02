"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { joinLobby } from "@/api/lobbyApi";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ApiError } from "@/api/apiError";

export type ActionState = {
    error?: string;
} | null;

export async function handleJoin(_prevState: ActionState, formData: FormData) {
    const rawCode = formData.get("lobbyCode") as string;
    const lobbyCode = rawCode ? rawCode.trim().toUpperCase() : "";

    if (lobbyCode.length !== 6) {
        return { error: "Le code doit contenir exactement 6 lettres." };
    }

    try {
        const result = await joinLobby(lobbyCode);
        const { clientId, availableTeams, allTeams } = result;
        const cookieStore = await cookies();

        cookieStore.set("clientId", clientId, { httpOnly: true, path: "/" });
        cookieStore.set("availableTeams", JSON.stringify(availableTeams), { path: "/" });
        cookieStore.set("allTeams", JSON.stringify(allTeams), { path: "/" });

        redirect(`/student/game/${lobbyCode}/team`);

    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { errorKey: error instanceof ApiError ? error.key : "" };
    }
}
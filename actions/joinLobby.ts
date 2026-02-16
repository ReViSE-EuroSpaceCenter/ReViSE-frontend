// @/actions/joinLobby.ts
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { joinLobby } from "@/api/lobbyApi";
import {isRedirectError} from "next/dist/client/components/redirect-error";

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
        const { clientId, availableTeams } = result;

        (await cookies()).set("clientId", clientId, {
            path: "/",
            maxAge: 3600,
            sameSite: "lax",
        });

        const teamsParam = encodeURIComponent(JSON.stringify(availableTeams));
        redirect(`/student/game/${lobbyCode}/team?teams=${teamsParam}`);

    } catch (error: unknown) {
        if (isRedirectError(error)) {
            throw error;
        }
        let errorMessage = "Code introuvable ou invalide";

        if (error instanceof Error) {
            if (error.message.includes("404")) {
                errorMessage = "Lobby introuvable";
            } else {
                errorMessage = error.message;
            }
        }
        return { error: errorMessage };
    }
}
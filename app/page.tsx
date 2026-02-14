import { createLobby } from "@/api/lobbyApi";
import { redirect } from "next/navigation";
import NumberTeamSelector from "../components/teacher/NumberTeamSelector";
import { cookies } from "next/headers";

async function handleCreateLobby(formData: FormData) {
    "use server";

    const nbTeams = Number(formData.get("nbTeams"));
    const { lobbyCode, hostId } = await createLobby(nbTeams);
    (await cookies()).set("hostId", hostId, {
        httpOnly: true,
        path: "/",
    });

    redirect(`/teacher/game/${lobbyCode}/setup?nbTeams=${nbTeams}`);
}

export default function HomePage() {
    return <NumberTeamSelector action={handleCreateLobby} />;
}

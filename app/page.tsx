import { createLobby } from "@/api/lobbyApi";
import { redirect } from "next/navigation";
import NumberTeamSelector from "../components/numberTeamSelector";

async function handleCreateLobby() {
    "use server";

    const lobbyCode = await createLobby();
    redirect(`/teacher/game/${lobbyCode}/setup`);
}

export default function HomePage() {
    return <NumberTeamSelector action={handleCreateLobby} />;
}

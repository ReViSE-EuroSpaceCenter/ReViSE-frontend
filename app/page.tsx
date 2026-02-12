import { createLobby } from "@/api/lobbyApi";
import { redirect } from "next/navigation";
import NumberTeamSelector from "../components/numberTeamSelector";

export default function HomePage() {

    async function handleCreateLobby() {
        "use server";

        const lobbyCode = await createLobby();
        redirect(`/lobby/${lobbyCode}`);
    }

    return <NumberTeamSelector action={handleCreateLobby} />;
}

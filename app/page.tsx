import { createLobby } from "@/api/lobbyApi";
import { redirect } from "next/navigation";
import NumberTeamSelector from "../components/numberTeamSelector";

export default function HomePage() {

    async function handleCreateLobby() {
        "use server";

        const lobbyCode = await createLobby();
        redirect(`/lobby/${lobbyCode}`);
    }

    return (
        <div>
        <h1 className="text-3xl font-bold">
            Page d{"'"}accueil du site
        </h1>
    <NumberTeamSelector action={handleCreateLobby} />;
        </div>
)
}

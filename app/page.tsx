import { createLobby } from "@/api/lobbyApi";
import { redirect } from "next/navigation";

export default function HomePage() {

    async function handleCreateLobby(formData: FormData) {
        "use server";

        const numberOfTeams = Number(formData.get("numberOfTeams"));
        console.log("Nombre d'équipes choisi :", numberOfTeams);

        const lobbyCode = await createLobby();
        redirect(`/lobby/${lobbyCode}`);
    }

    return (
        <form
            action={handleCreateLobby}
            className="flex flex-col items-center gap-6 h-screen justify-center"
        >
            <h1 className="text-3xl font-bold">Page d{"'"}accueil du site</h1>

            <label className="flex flex-col items-center gap-2">
                Nombre d{"'"}équipes :
                <select
                    name="numberOfTeams"
                    defaultValue={4}
                    className="px-4 py-2 border rounded-lg text-black"
                >
                    <option value={4}>4 équipes</option>
                    <option value={6}>6 équipes</option>
                </select>
            </label>

            <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
                Créer une partie
            </button>
        </form>
    );
}

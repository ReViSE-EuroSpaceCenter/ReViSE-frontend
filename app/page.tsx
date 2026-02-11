import {createLobby} from "@/api/lobbyApi";

export default async function HomePage() {
  const lobby = await createLobby();
  console.log(lobby)

  return (
    <h1 className="text-3xl">Page d{"'"}accueil du site</h1>
  );
}

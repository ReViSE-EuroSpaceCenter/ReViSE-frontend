"use client";

import { useRouter, useParams } from "next/navigation";

export default function IntroPage() {
    const router = useRouter();
    const params = useParams();
    const gameId = params.gameId;
    const teamName = params.teamName;

    const goToMission = () => {
        router.push(`/student/game/${gameId}/${teamName}/mission`);
    };

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Page pour présenter l{"'"}équipe</h1>
            <p className="mb-4">Bienvenue ! Préparez-vous à commencer les missions</p>
            <button
                onClick={goToMission}
                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Continuer vers les missions
            </button>
        </div>
    );
}

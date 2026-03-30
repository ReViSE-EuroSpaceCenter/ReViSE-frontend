"use client";

import {ValidationMissionModal} from "@/components/mission/ValidationMission";
import {useParams, useRouter} from "next/navigation";
import {useState} from "react";

export default function StepPage() {
    const router = useRouter();
    const params = useParams();

    const lobbyCode = params.gameId?.toString() as string;

    const stepParam = Number.parseInt(params.step?.toString() || "0", 10);
    const step = Number.isNaN(stepParam) ? 0 : stepParam

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer rounded-md bg-purpleReViSE px-5 py-3 text-lg text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Valider l’étape
            </button>

            <ValidationMissionModal
                title="Confirmation"
                message="Cette action validera l’étape actuelle. Êtes-vous sûr de vouloir continuer ?"
                isOpen={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={() => {
                    setShowModal(false);
                    router.replace(`/teacher/game/${lobbyCode}/launcher?step=${step}`);
                }}
            />
        </>
    );
}

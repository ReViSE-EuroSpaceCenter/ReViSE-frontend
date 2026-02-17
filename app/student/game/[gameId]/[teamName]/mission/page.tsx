"use client";

import { useState, useRef, useEffect } from "react";
import { teams } from "@/types/Teams";
import MissionBadge from "@/components/student/MissionBadge";
import ChecklistModal from "@/components/student/ChecklistModal";
import { defaultChecklist } from "@/types/Checklist";
import {useParams} from "next/navigation";
import { completeMission } from "@/api/lobbyApi";
import {useWebSocket} from "@/components/WebSocketProvider";

export default function MissionPage() {
    const params = useParams();
    const teamName = params.teamName as string;
    const lobbyCode = params.gameId as string;
    const currentTeam = teams[teamName] ?? teams["MECA"];
    const {id} = useWebSocket();

    const missions = currentTeam.missions;

    const [validatedMissions, setValidatedMissions] = useState<number[]>([]);
    const [activeMission, setActiveMission] = useState<number>(1); // la mission en cours
    const [selectedMission, setSelectedMission] = useState<number | null>(null);
    const [modalSteps] = useState(
        defaultChecklist.map((step) => ({ ...step, completed: false }))
    );

    const missionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // centrage de la mission actuelle
    useEffect(() => {
        const index = missions.findIndex((m) => m.id === activeMission);
        missionRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    }, [activeMission, missions]);

    // missions bloquées si la précédente n'est pas validée
    const isLocked = (missionId: number, bonus?: boolean) => {
        if (bonus) return false;
        const previous = missionId - 1;
        if (previous <= 0) return false;
        return !validatedMissions.includes(previous);
    };

    const openChecklist = (missionId: number) => {
        if (missionId !== activeMission) return;
        setSelectedMission(missionId);

    };

    // traduction de l'id de la mission en format backend (CLASSIC_1, BONUS_2, etc.)
    const missionToBackendTraduction = (missionId: number, bonus?: boolean) => {

        if (bonus) {
            const bonusMissions = missions.filter(m => m.bonus);
            const bonusIndex = bonusMissions.findIndex(m => m.id === missionId);
            return `BONUS_${bonusIndex + 1}`;
        }
        const classicMissions = missions.filter(m => !m.bonus);
        const classicIndex = classicMissions.findIndex(m => m.id === missionId);
        return `CLASSIC_${classicIndex + 1}`;
    };
    
    const handleValidateMission = async () => {
        if (selectedMission === null) return;

        const mission = missions.find(m => m.id === selectedMission);
        if (!mission) return;

        const missionNumber = missionToBackendTraduction(
            mission.id,
            mission.bonus
        );

        try {
            await completeMission(
                lobbyCode,
                id as string,
                missionNumber
            );

            setValidatedMissions((prev) => [...prev, selectedMission]);

            const nextMission = missions.find((m) => m.id === selectedMission + 1);
            if (nextMission) setActiveMission(nextMission.id);

        } catch (error) {
            console.error("Erreur validation mission", error);
        }

        setSelectedMission(null);
    };


    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold mb-10 text-center">
                Missions équipe {currentTeam.name}
            </h1>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-16 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[40vw] no-scrollbar">
                    {missions.map((mission, index) => {
                        const locked = isLocked(mission.id, mission.bonus);
                        const validated = validatedMissions.includes(mission.id);

                        return (
                            <div
                                key={mission.id}
                                ref={(el) => { missionRefs.current[index] = el; }}
                                className={`
                  snap-center flex-shrink-0 transition-all duration-300
                  ${activeMission === mission.id ? "scale-110 opacity-100" : "scale-90 opacity-50"}
                  ${locked || validated ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                                onClick={() => openChecklist(mission.id)}
                            >
                                <MissionBadge
                                    mission={mission}
                                    isLocked={locked || validated}
                                    isCompleted={validated}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <ChecklistModal
                isOpen={selectedMission !== null}
                onClose={() => setSelectedMission(null)}
                onValidate={handleValidateMission}
                initialSteps={modalSteps}
            />
        </div>
    );
}

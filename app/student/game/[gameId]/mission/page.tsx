"use client";

import { useState, useRef, useEffect } from "react";
import { teams } from "@/types/teams";
import MissionBadge from "@/components/student/MissionBadge";
import ChecklistModal from "@/components/student/ChecklistModal";
import { defaultChecklist } from "@/types/checklist";

export default function MissionPage() {
    const currentTeam = teams["MECA"]; // TODO: remplacer par l'équipe dynamique
    const missions = currentTeam.missions;


    const [validatedMissions, setValidatedMissions] = useState<number[]>([]);
    const [activeMission, setActiveMission] = useState<number>(1); // la mission en cours
    const [selectedMission, setSelectedMission] = useState<number | null>(null);
    const [modalSteps, setModalSteps] = useState(
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
        if (missionId !== activeMission) return; // bloque les autres missions
        setSelectedMission(missionId);

    };


    const handleValidateMission = () => {
        if (selectedMission === null) return;

        setValidatedMissions((prev) => [...prev, selectedMission]);

        const nextMission = missions.find((m) => m.id === selectedMission + 1);
        if (nextMission) setActiveMission(nextMission.id);
        setModalSteps(defaultChecklist.map((step) => ({ ...step, completed: false })));

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

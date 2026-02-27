"use client";

import { Mission } from "@/types/Mission";
import { changeTeamMissionState } from "@/api/lobbyApi";
import { missionNameTraduction } from "@/utils/MissionName";
import { ValidationMissionModal } from "@/components/student/ValidationMission";
import { useState } from "react";

export function MissionStructure({
                                     mission,
                                     missionMap,
                                     teamColor,
                                     teamName,
                                     lobbyCode,
                                     clientId,
                                     completedMissionCount,
                                     isBonus1Completed,
                                     isBonus2Completed,
                                     completedMissionsSet,
                                 }: {
    mission: Mission;
    missionMap: Record<number, Mission>;
    teamColor: string;
    teamName: string;
    lobbyCode: string;
    clientId: string;
    completedMissionCount: number;
    isBonus1Completed: boolean;
    isBonus2Completed: boolean;
    completedMissionsSet: Set<number>;

}) {
    const children = mission.unlocks
        .map((id) => missionMap[id])
        .filter(Boolean);

    const isDarkText = ["MECA", "MEDI", "EXPE"].includes(teamName);
    const textColorClass = isDarkText ? "text-black" : "text-white";

    const [showModal, setShowModal] = useState(false);

    const isNormalMissionCompleted = !mission.bonus && completedMissionsSet.has(mission.id);

    let message: string;
    if (mission.bonus) {
        const bonusCompleted =
            (mission.id === 8 || (mission.id === 9 && teamName === "MECA"))
                ? isBonus1Completed
                : (mission.id === 9 || (mission.id === 10 && teamName === "MECA"))
                    ? isBonus2Completed
                    : false;

        message = bonusCompleted
            ? "Voulez-vous invalider cette mission bonus ?"
            : "Voulez-vous valider cette mission bonus ?";
    } else {
        message = isNormalMissionCompleted
            ? "Voulez-vous invalider cette mission ?"
            : "Voulez-vous valider cette mission ?";
    }

    const handleMissionClick = () => setShowModal(true);
    const handleConfirm = async () => {
        setShowModal(false);
        try {
            const missionNumber = missionNameTraduction(mission, teamName);
            await changeTeamMissionState(lobbyCode, clientId, missionNumber);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour");
        }
    };
    const handleCancel = () => setShowModal(false);

    return (
        <>
            <div className="flex md:hidden flex-col items-center gap-3 w-full">
                <button
                    onClick={handleMissionClick}
                    style={{ backgroundColor: teamColor }}
                    className={`px-4 py-3 ${textColorClass} rounded-2xl border-2 border-black shadow-md active:scale-95 transition text-center whitespace-nowrap cursor-pointer`}                >
                    {mission.title}
                </button>

                {children.length > 0 && (
                    <div className="flex flex-row flex-wrap justify-center gap-3">
                        {children.map((child) => (
                            <div key={child.id} className="flex flex-col items-center">
                                <MissionStructure
                                    mission={child}
                                    missionMap={missionMap}
                                    teamColor={teamColor}
                                    teamName={teamName}
                                    lobbyCode={lobbyCode}
                                    clientId={clientId}
                                    completedMissionCount={completedMissionCount}
                                    isBonus1Completed={isBonus1Completed}
                                    isBonus2Completed={isBonus2Completed}
                                    completedMissionsSet={completedMissionsSet}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="hidden md:flex flex-row items-center">
                <button
                    onClick={handleMissionClick}
                    style={{ backgroundColor: teamColor }}
                    className={`shrink-0 px-4 py-3 ${textColorClass} rounded-2xl border-2 border-black shadow-md hover:scale-115 transition text-center whitespace-nowrap cursor-pointer`}                >
                    {mission.title}
                </button>

                {children.length === 1 && (
                    <>
                        <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                        <MissionStructure
                            mission={children[0]}
                            missionMap={missionMap}
                            teamColor={teamColor}
                            teamName={teamName}
                            lobbyCode={lobbyCode}
                            clientId={clientId}
                            completedMissionCount={completedMissionCount}
                            isBonus1Completed={isBonus1Completed}
                            isBonus2Completed={isBonus2Completed}
                            completedMissionsSet={completedMissionsSet}
                        />
                    </>
                )}

                {children.length > 1 && (
                    <div className="flex flex-row items-center">
                        <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                        <div className="relative flex flex-col">
                            {children.map((child, i) => (
                                <div key={child.id} className="relative flex flex-row items-center py-3">
                                    <div
                                        className="absolute left-0 w-0.5 bg-white/40"
                                        style={{
                                            top: i === 0 ? "50%" : 0,
                                            bottom: i === children.length - 1 ? "50%" : 0,
                                        }}
                                    />
                                    <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                                    <MissionStructure
                                        mission={child}
                                        missionMap={missionMap}
                                        teamColor={teamColor}
                                        teamName={teamName}
                                        lobbyCode={lobbyCode}
                                        clientId={clientId}
                                        completedMissionCount={completedMissionCount}
                                        isBonus1Completed={isBonus1Completed}
                                        isBonus2Completed={isBonus2Completed}
                                        completedMissionsSet={completedMissionsSet}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ValidationMissionModal
                isOpen={showModal}
                message={message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}
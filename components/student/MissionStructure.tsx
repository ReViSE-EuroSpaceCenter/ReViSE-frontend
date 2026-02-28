"use client";

import { Mission } from "@/types/Mission";
import { changeTeamMissionState } from "@/api/lobbyApi";
import { missionNameTraduction } from "@/utils/MissionName";
import { ValidationMissionModal } from "@/components/student/ValidationMission";
import React, { useState } from "react";

export function MissionStructure({
                                     mission,
                                     missionMap,
                                     teamColor,
                                     teamName,
                                     lobbyCode,
                                     clientId,
                                     isBonus1Completed,
                                     isBonus2Completed,
                                     completedMissions,
                                     onMissionUpdated,
                                     isUnlocked,
                                 }: {
    mission: Mission;
    missionMap: Record<number, Mission>;
    teamColor: string;
    teamName: string;
    lobbyCode: string;
    clientId: string;
    isBonus1Completed: boolean;
    isBonus2Completed: boolean;
    completedMissions: Record<string, boolean>;
    onMissionUpdated: () => Promise<void>;
    isUnlocked: boolean;
}) {
    const children = mission.unlocks
        .map((id) => missionMap[id])
        .filter(Boolean);

    const isDarkText = ["MECA", "MEDI", "EXPE"].includes(teamName);
    const textColorClass = isDarkText ? "text-black" : "text-white";

    const [showModal, setShowModal] = useState(false);

    const missionNumber = missionNameTraduction(mission, teamName);

    let isCompleted: boolean;

    if (mission.bonus) {
        isCompleted =
            missionNumber === "BONUS_1"
                ? isBonus1Completed
                : isBonus2Completed;
    } else {
        isCompleted = completedMissions[missionNumber];
    }
    const message = mission.bonus
        ? isCompleted
            ? "Voulez-vous invalider cette mission bonus ?"
            : "Voulez-vous valider cette mission bonus ?"
        : isCompleted
            ? "Voulez-vous invalider cette mission ?"
            : "Voulez-vous valider cette mission ?";

    const handleMissionClick = () => setShowModal(true);
    const handleConfirm = async () => {
        setShowModal(false);
        try {
            const missionNumber = missionNameTraduction(mission, teamName);
            await changeTeamMissionState(lobbyCode, clientId, missionNumber);
            await onMissionUpdated();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour");
        }
    };
    const handleCancel = () => setShowModal(false);

    const childUnlocked = isUnlocked && isCompleted;
    let displayText: React.ReactNode = mission.title;
    if (mission.bonus) {
        const parts = mission.title.split(" ");
        if (parts.length >= 2) {
            displayText = (
                <>
                    {parts[0]}<br />{parts.slice(1).join("")}
                </>
            );
        }
    }
    return (
        <>
            <div className="flex md:hidden flex-col items-center gap-3 w-full">
                <button
                    onClick={handleMissionClick}
                    disabled={!isUnlocked}
                    style={{
                        backgroundColor: isUnlocked ? teamColor : "#555"
                    }}
                    className={`px-4 py-3 rounded-2xl border-2 border-black shadow-md ${textColorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {displayText}
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
                                    isBonus1Completed={isBonus1Completed}
                                    isBonus2Completed={isBonus2Completed}
                                    completedMissions={completedMissions}
                                    onMissionUpdated={onMissionUpdated}
                                    isUnlocked={childUnlocked}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="hidden md:flex flex-row items-center">
                <button
                    onClick={handleMissionClick}
                    disabled={!isUnlocked}
                    style={{
                        backgroundColor: isUnlocked ? teamColor : "#555"
                    }}
                    className={`px-4 py-3 rounded-2xl border-2 border-black shadow-md ${textColorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {displayText}
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
                            isBonus1Completed={isBonus1Completed}
                            isBonus2Completed={isBonus2Completed}
                            completedMissions={completedMissions}
                            onMissionUpdated={onMissionUpdated}
                            isUnlocked={childUnlocked}
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
                                        isBonus1Completed={isBonus1Completed}
                                        isBonus2Completed={isBonus2Completed}
                                        completedMissions={completedMissions}
                                        onMissionUpdated={onMissionUpdated}
                                        isUnlocked={childUnlocked}
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
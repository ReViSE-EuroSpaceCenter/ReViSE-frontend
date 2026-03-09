"use client";

import { Mission } from "@/types/Mission";
import { changeTeamMissionState } from "@/api/missionApi";
import { missionNameTraduction } from "@/utils/missionName";
import { ValidationMissionModal } from "@/components/student/ValidationMission";
import React, { useState } from "react";
import { MissionButton } from "@/components/student/MissionButton";
import { useMissionContext } from "@/contexts/MissionContext";
import  getMissionModalMessage  from "@/utils/missionButtonMessage";
import {showError} from "@/errors/getErrorMessage";
import {ApiError} from "@/api/apiError";

export function MissionStructure({
                                     mission,
                                     missionMap,
                                     isBonus1Completed,
                                     isBonus2Completed,
                                     completedMissions,
                                     onMissionUpdated,
                                     isUnlocked,
                                 }: Readonly<{
    mission: Mission;
    missionMap: Record<number, Mission>;
    isBonus1Completed: boolean;
    isBonus2Completed: boolean;
    completedMissions: Record<string, boolean>;
    onMissionUpdated: () => Promise<void>;
    isUnlocked: boolean;
}>) {

    const {
        lobbyCode,
        clientId,
        teamColor,
        teamName,
    } = useMissionContext();

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

    const message = getMissionModalMessage(
        !!mission.bonus,
        isCompleted
    );

    const handleMissionClick = () => setShowModal(true);
    const handleConfirm = async () => {
        setShowModal(false);
        try {
            const missionNumber = missionNameTraduction(mission, teamName);
            await changeTeamMissionState(lobbyCode, clientId, missionNumber);
            await onMissionUpdated();
        } catch (err) {
            showError(err instanceof ApiError ? err.key : "");
        }
    };
    const handleCancel = () => setShowModal(false);

    const childUnlocked = isUnlocked && isCompleted;

    return (
        <>
            <div className="flex md:hidden flex-col items-center gap-3 w-full">
                <MissionButton
                    mission={mission}
                    isUnlocked={isUnlocked}
                    teamColor={teamColor}
                    textColorClass={textColorClass}
                    onClick={handleMissionClick}
                />

                {children.length > 0 && (
                    <div className="flex flex-row flex-wrap justify-center gap-3">
                        {children.map((child) => (
                            <div key={child.id} className="flex flex-col items-center">
                                <MissionStructure
                                    mission={child}
                                    missionMap={missionMap}
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
                <MissionButton
                    mission={mission}
                    isUnlocked={isUnlocked}
                    teamColor={teamColor}
                    textColorClass={textColorClass}
                    onClick={handleMissionClick}
                />

                {children.length === 1 && (
                    <>
                        <div className="shrink-0 w-10 h-0.5 bg-white/40" />
                        <MissionStructure
                            mission={children[0]}
                            missionMap={missionMap}
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
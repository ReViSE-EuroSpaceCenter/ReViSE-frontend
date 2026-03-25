"use client";

import Image from "next/image";
import {useEffect, useRef} from "react";
import {showMissionAlert} from "@/utils/alerts";
import {ProgressionBar} from "@/components/mission/ProgressionBar";
import {teamColorMap} from "@/utils/teamColor";
import {TeamData} from "@/types/TeamData";

export default function SideRow({team, classicMissionsCompleted, firstBonusMissionCompleted, secondBonusMissionCompleted}: Readonly<TeamData>) {
    const prevMission1 = useRef(firstBonusMissionCompleted);
    const prevMission2 = useRef(secondBonusMissionCompleted);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio("/sounds/missionBonus.mp3");
        audioRef.current.volume = 0.7;
        audioRef.current.load();

        const unlock = () => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.muted = true;
            audio.play()
              .then(() => {
                  audio.pause();
                  audio.currentTime = 0;
                  audio.muted = false;
              })
              .catch(() => {});
            document.removeEventListener("click", unlock);
            document.removeEventListener("touchstart", unlock);
        };

        document.addEventListener("click", unlock);
        document.addEventListener("touchstart", unlock);

        return () => {
            document.removeEventListener("click", unlock);
            document.removeEventListener("touchstart", unlock);
        };
    }, []);

    const playMissionSound = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        audio.muted = false;
        audio.play().catch(() => {});
    };

    useEffect(() => {
        if (!prevMission1.current && firstBonusMissionCompleted) {
            playMissionSound();
            setTimeout(() => {
                showMissionAlert(team, 1);
            }, 800);
        }
        if (!prevMission2.current && secondBonusMissionCompleted) {
            playMissionSound();
            setTimeout(() => {
                showMissionAlert(team, 2);
            }, 800);
        }
        prevMission1.current = firstBonusMissionCompleted;
        prevMission2.current = secondBonusMissionCompleted;
    }, [firstBonusMissionCompleted, secondBonusMissionCompleted, team]);

    const bonus1Badge = `/badges/bonus/${team}_bonus1${firstBonusMissionCompleted ? "" : "_gris"}.svg`;
    const bonus2Badge = `/badges/bonus/${team}_bonus2${secondBonusMissionCompleted ? "" : "_gris"}.svg`;

    return (
        <div className="flex flex-col items-center w-full max-w-187.5 py-6 group transition-all">
            <div className="flex flex-row items-center gap-10 xl:gap-[clamp(10px,2vw,40px)] w-full justify-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 xl:w-[clamp(70px,7vw,140px)] xl:h-[clamp(70px,7vw,140px)] shrink-0 flex items-center justify-center">
                    <Image
                        src={`/badges/teams/${team}.svg`}
                        alt={`Badge ${team}`}
                        width={140}
                        height={140}
                        className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-row gap-6 px-1">
                    {[
                        { badge: bonus1Badge, completed: firstBonusMissionCompleted, label: 1 },
                        { badge: bonus2Badge, completed: secondBonusMissionCompleted, label: 2 },
                    ].map(({ badge, completed }) => (
                        <div
                            key={badge}
                            className="w-14 h-14 sm:w-16 sm:h-16 xl:w-[clamp(60px,7vw,100px)] xl:h-[clamp(60px,6vw,100px)] shrink-0 relative"
                        >
                            <Image
                                src={badge}
                                alt={`Badge bonus équipe ${team}`}
                                width={80}
                                height={80}
                                className={`object-contain transition-all duration-500 ${
                                    completed
                                        ? "opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                        : "opacity-25 brightness-125 contrast-75"
                                }`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full max-w-xl">
                    <ProgressionBar
                        completed={classicMissionsCompleted}
                        totalMission={team === "MECA" ? 8 : 7}
                        color={teamColorMap[team]}
                    />
                </div>
            </div>

        </div>
    );
}
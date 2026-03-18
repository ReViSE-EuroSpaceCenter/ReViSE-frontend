"use client";

import Image from "next/image";
import {useEffect, useRef} from "react";
import {showMissionAlert} from "@/utils/alerts";
import {ProgressionBar} from "@/components/student/ProgressionBar";
import {teamColorMap} from "@/utils/teamColor";

type StatRowProps = {
    team: string;
    completed: number;
    mission1_check: boolean;
    mission2_check: boolean;
};

export default function SideRow({team , completed ,  mission2_check , mission1_check}: Readonly<StatRowProps>) {
    const prevMission1 = useRef(mission1_check);
    const prevMission2 = useRef(mission2_check);
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
        if (!prevMission1.current && mission1_check) {
            playMissionSound();
            setTimeout(() => {
                showMissionAlert(team, 1);
            }, 800);
        }
        prevMission1.current = mission1_check;
    }, [mission1_check, team]);

    useEffect(() => {
        if (!prevMission2.current && mission2_check) {
            playMissionSound();
            setTimeout(() => {
                showMissionAlert(team, 2);
            }, 800);
        }
        prevMission2.current = mission2_check;
    }, [mission2_check, team]);

    return (
        <div className="flex flex-col items-center w-full max-w-187.5 py-6 group transition-all">
            <div className="flex flex-row items-center ap-10 xl:gap-[clamp(10px,2vw,40px)] w-full justify-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 xl:w-[clamp(70px,7vw,140px)] xl:h-[clamp(70px,7vw,140px)] shrink-0 flex items-center justify-center">
                    <Image
                        src={`/badges/${team}.png`}
                        alt={`Badge ${team}`}
                        width={120}
                        height={120}
                        className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-transform duration-500"
                    />
                </div>

                <div className="flex flex-row gap-6 px-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-[clamp(40px,4vw,64px)] xl:h-[clamp(40px,4vw,64px)] shrink-0 relative">
                        <Image
                            src={`/badges_missions/${team}_mission1.png`}
                            alt="Mission 1"
                            width={64}
                            height={64}
                            className={`object-contain transition-all duration-500 ${
                                mission1_check
                                    ? "grayscale-0 opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                    : "grayscale opacity-25 brightness-125 contrast-75"
                            }`}
                        />
                    </div>

                    <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-[clamp(40px,4vw,64px)] xl:h-[clamp(40px,4vw,64px)] shrink-0 relative">
                        <Image
                            src={`/badges_missions/${team}_mission2.png`}
                            alt="Mission 2"
                            width={64}
                            height={64}
                            className={`object-contain transition-all duration-500 ${
                                mission2_check
                                    ? "grayscale-0 opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                    : "grayscale opacity-25 brightness-125 contrast-75"
                            }`}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full max-w-xl">
                    <ProgressionBar
                        completed={completed}
                        totalMission={team === "MECA" ? 8 : 7}
                        color={teamColorMap[team]}
                    />
                </div>
            </div>

        </div>
    );
}
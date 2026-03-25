"use client";

import LauncherBackground from "@/components/LauncherBackground";
import LauncherPath from "@/components/LauncherPath";
import {useState} from "react";

export default function Launcher() {
    const [step, setStep] = useState(0)

    return (
        <div className="relative w-full h-full min-h-screen">
            {step !== 8 && (
                <button
                    className="fixed bottom-5 right-5 z-10 px-8 py-4 bg-purpleReViSE hover:bg-purpleReViSE/80 cursor-pointer rounded-lg font-semibold text-lg transition-colors"
                    onClick={() => setStep((s) => s + 1)}
                >
                    Suivant
                </button>
            )}

            <div className="absolute inset-0">
                <LauncherBackground />
            </div>

            <div className="absolute inset-0">
                <LauncherPath step={step} />
            </div>

        </div>
    );
}
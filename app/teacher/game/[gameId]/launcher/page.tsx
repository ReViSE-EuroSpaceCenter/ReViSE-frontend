"use client";

import LauncherBackground from "@/components/LauncherBackground";
import LauncherPath from "@/components/LauncherPath";
import {useState} from "react";

export default function Launcher() {
    const [step, setStep] = useState(0)

    return (
        <div className="relative w-full h-full">
            <button
                onClick={() => setStep((s) => s + 1)}
                className="absolute top-4 right-4 z-20 bg-black px-4 py-2 rounded"
            >
                Next
            </button>

            <div className="absolute inset-0">
                <LauncherBackground />
            </div>

            <div className="absolute inset-0">
                <LauncherPath step={step} />
            </div>

        </div>
    );
}
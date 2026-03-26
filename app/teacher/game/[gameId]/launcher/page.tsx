"use client";

import dynamic from "next/dynamic";

const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);
import LauncherBackground from "@/components/LauncherBackground";
import LauncherPath from "@/components/LauncherPath";
import {useState} from "react";
import {launcherTexts} from "@/utils/launcherTexts";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function Launcher() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [step, setStep] = useState(0)
    const showPresentation = searchParams.get("presentation") === "true";
    const [isPresentationOpen, setIsPresentationOpen] = useState(showPresentation);
    const text = showPresentation ? launcherTexts.PRESENTATION : null

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

            {text && (
                <PresentationModal
                    isOpen={isPresentationOpen}
                    setIsOpen={setIsPresentationOpen}
                    icon="/logo.png"
                    text={text}
                    name="PRESENTATION"
                    color="#fff"
                    onClose={() => router.replace(pathname) }
                />
            )}
        </div>
    );
}
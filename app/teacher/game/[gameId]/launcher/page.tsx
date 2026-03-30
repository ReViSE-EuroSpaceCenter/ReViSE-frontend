"use client";

import dynamic from "next/dynamic";

const PresentationModal = dynamic(
    () => import("@/components/PresentationModal"),
    { ssr: false, loading: () => null }
);
import LauncherBackground from "@/components/launcher/LauncherBackground";
import LauncherPath from "@/components/launcher/LauncherPath";
import {useState} from "react";
import {launcherTexts} from "@/utils/launcherTexts";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function Launcher() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const stepParam = Number.parseInt(searchParams.get("step") || "0", 10);
    let step = Number.isNaN(stepParam) ? 0 : stepParam
    const showPresentation = searchParams.get("presentation") === "true";
    const [isPresentationOpen, setIsPresentationOpen] = useState(showPresentation);
    const text = showPresentation ? launcherTexts.PRESENTATION : null

    const handleStepAnimationComplete = () => {
        step++;
        router.replace(`${pathname}?step=${step}`);
    }

    return (
        <div className="relative w-full h-full min-h-screen">
            <div className="absolute inset-0">
                <LauncherBackground />
            </div>

            <div className="absolute inset-0">
                <LauncherPath step={step} onStepAnimationComplete={handleStepAnimationComplete} />
            </div>

            {text && (
                <PresentationModal
                    isOpen={isPresentationOpen}
                    setIsOpen={setIsPresentationOpen}
                    icon="/logo.svg"
                    text={text}
                    name="PRESENTATION"
                    color="#fff"
                    onClose={() => router.replace(pathname) }
                />
            )}
        </div>
    );
}
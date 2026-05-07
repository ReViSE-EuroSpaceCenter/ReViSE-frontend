"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isJustify?: boolean;
    icon?: string;
    text?: string;
    name?: string;
    color?: string;
    onClose?: () => void;
}

export default function PresentationModal({ isOpen, setIsOpen, isJustify = false, icon, text, name, color, onClose }: Readonly<Props>) {

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    if (!name || !icon || !text) return null;

    const hashString = (str: string) =>
        str.split("").reduce((hash, char) => {
            hash = (hash << 5) - hash + char.codePointAt(0)!;
            return hash & hash;
        }, 0);

    const renderBold = (text: string) =>
        text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <strong key={`${hashString(part)}-${index}`}>{part.slice(2, -2)}</strong>
            ) : (
                part
            )
        );

    const renderText = (text: string) =>
        text.split("\n").map((line, lineIndex) => {
            const trimmed = line.trimStart();
            const match = /^(\u2022|\p{Emoji})\s*/u.exec(trimmed);
            const isList = match !== null;

            const paragraphClassName = isList
                ? "flex items-start gap-2 mb-2"
                : isJustify
                    ? "text-justify mb-4"
                    : "text-center mb-4";

            return (
                <p
                    key={`${hashString(line)}-${lineIndex}`}
                    className={paragraphClassName}
                >
                    {line.split("\t").map((chunk, chunkIndex) => (
                        <span
                            key={`${hashString(chunk)}-${chunkIndex}`}
                            style={{ marginLeft: line.startsWith(chunk) ? 0 : "1em" }}
                        >
                        {renderBold(chunk)}
                    </span>
                    ))}
                </p>
            );
        });

    let title: string;

    switch (name) {
        case "TEACHER":
            title = "Présentation du jeu - ReViSE";
            break;
        case "MECA":
            title = "Équipe Ingénierie Mécatronique – MECA";
            break;
        case "GECO":
            title = "Équipe Gestion Écosystémique – GECO";
            break;
        case "EXPE":
            title = "Équipe Exploration d’Europe – EXPE";
            break;
        case "MEDI":
            title = "Équipe Accompagnement Psycho Médical – MEDI";
            break;
        case "AERO":
            title = "Équipe Ingénierie Aérospatiale – AERO";
            break;
        case "COOP":
            title = "Équipe Coordination opérationnelle – COOP";
            break;

        case "IA":
            title = "Fiabilité des systèmes d’IA"
            break;

        case "LAUNCHER":
            title = "Voyage interplanétaire";
            break;

        default:
            title = `${name}`;

    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    className="relative bg-darkBlueReViSE text-foreground rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl px-6 py-3 md:px-10 md:py-3 max-h-[92vh] overflow-y-auto flex flex-col items-center"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                    <Image
                        key={icon}
                        src={icon}
                        alt={`${icon} image`}
                        width={100}
                        height={100}
                        className={icon == '/logo.svg' ? "w-35 h-35 object-contain my-4" : "w-20 h-20 object-contain mb-2"}
                    />

                    <DialogTitle className="text-2xl md:text-2xl font-bold mb-2 md:mb-6 text-center" style={{ color }}>
                        {title}
                    </DialogTitle>

                    <div className={`text-lg ${isJustify ? "text-justify" : "text-center"}`}>{renderText(text)}</div>

                    <button
                        className="px-8 py-4 bg-purpleReViSE hover:bg-purpleReViSE/80 cursor-pointer rounded-lg font-semibold text-lg transition-colors"
                        onClick={handleClose}
                    >
                        Continuer
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

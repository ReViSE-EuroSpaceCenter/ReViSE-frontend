"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    icon?: string;
    text?: string;
    isJustify?: boolean;
    name?: string;
    color?: string;
    onClose?: () => void;
}

export default function PresentationModal({ isOpen, setIsOpen, icon, text, isJustify, name, color, onClose  }: Readonly<Props>) {

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
            const match = trimmed.match(/^(\u2022|\p{Emoji})\s*/u);
            const isList = !!match;
            const bullet = match?.[0]?.trim() ?? "";
            const content = isList ? trimmed.slice(match![0].length) : line;

            return (
                <div
                    key={`${hashString(line)}-${lineIndex}`}
                    className={
                        isList
                            ? "flex items-start gap-2 mb-2"
                            : isJustify
                                ? "text-justify mb-4"
                                : "text-center mb-4"
                    }
                >
                    {isList ? (
                        <>
                            <span className="w-5 text-center shrink-0">{bullet}</span>
                            <p className="flex-1">
                                {content.split("\t").map((chunk, chunkIndex) => (
                                    <span
                                        key={`${hashString(chunk)}-${chunkIndex}`}
                                        style={{ marginLeft: chunkIndex === 0 ? 0 : "1em" }}
                                    >
                  {renderBold(chunk)}
                </span>
                                ))}
                            </p>
                        </>
                    ) : (
                        <p>
                            {line.split("\t").map((chunk, chunkIndex) => (
                                <span
                                    key={`${hashString(chunk)}-${chunkIndex}`}
                                    style={{ marginLeft: chunkIndex === 0 ? 0 : "1em" }}
                                >
                {renderBold(chunk)}
              </span>
                            ))}
                        </p>
                    )}
                </div>
            );
        });

    let title: string;

    switch (name) {
        case "PRESENTATION":
            title = "Présentation du voyage vers Europe";
            break;
        case "TEACHER":
            title = "Présentation du jeu - ReViSE";
            break;

        case "MECA":
        case "GECO":
        case "EXPE":
        case "MEDI":
        case "AERO":
        case "COOP":
            title = `Présentation de l'équipe - ${name}`;
            break;

        case "IA":
            title = "Fiabilité des systèmes d’IA"
            break;

        case "LAUNCHER":
            title = "Voyage interplanétaire";
            break;

        default:
            title = `Nouvelle espèce découverte : ${name}`;

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

                    <div className={isJustify ? "text-justify text-lg" : "text-center text-lg"}>{renderText(text)}</div>

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

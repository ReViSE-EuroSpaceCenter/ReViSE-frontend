"use client";

import { useState } from "react";

export default function Checklist() {
    const [isOpen, setIsOpen] = useState(false);

    const steps = [
        {
            id: 1,
            title: "Mettre les hallucinations à droite du marqueur temporel dans le pot.",
            hint: "Les point noirs et blancs sont les hallucinations.",
        },
        {
            id: 2,
            title: "Déplacer le marqueur temporel.",
            hint: "",
        },
        {
            id: 3,
            title: "Payer les technologies transférées.",
            hint: "Faire la somme des piles sur le plateau",
        },
        {
            id: 4,
            title: "Placer le pion sur la case départ.",
            hint: "",
        },
    ];

    return (
        <>
            <div className="fixed bottom-10 right-8 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-10 py-3 bg-purpleReViSE text-white rounded-lg shadow-lg hover:bg-purple-600 transition"
                >
                    Rappel des règles
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

                    <div
                        className="relative bg-darkBlueReViSE text-foreground rounded-xl shadow-2xl w-175 p-10"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                        <h2 className="text-xl font-bold mb-4 text-purpleReViSE">
                            Rappel des règles
                        </h2>

                        <ul className="space-y-3 list-disc list-inside text-white">
                            {steps.map((step) => (
                                <li
                                    key={step.id}
                                    className="flex justify-between items-start gap-2 hover:bg-gray-700/20 p-2 rounded transition"
                                >
                                    <span>{step.title}</span>
                                    {step.hint && (
                                        <button
                                            className="text-sm text-orangeReViSE underline hover:text-orange-400"
                                            onClick={() => alert(step.hint)}
                                        >
                                            ?
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
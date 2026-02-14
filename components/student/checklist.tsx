"use client";

import { useState } from "react";

export default function ChecklistModal() {
    const [steps, setSteps] = useState([
        { id: 1, title: "Élément 1", completed: false, hint: "Aide pour l'élément 1" },
        { id: 2, title: "Élément 2", completed: false, hint: "Aide pour l'élément 1" },
        { id: 3, title: "Élément 3", completed: false, hint: "Aide pour l'élément 1" },
        { id: 4, title: "Élément 4", completed: false, hint: "Aide pour l'élément 1" },
    ]);


    const [isOpen, setIsOpen] = useState(false);

    const toggleStep = (id: number) => {
        setSteps((prev) =>
            prev.map((step) =>
                step.id === id ? { ...step, completed: !step.completed } : step
            )
        );
    };

    const allCompleted = steps.every((step) => step.completed);

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600"
                >
                    Checklist
                </button>
            </div>


            {isOpen && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black rounded shadow-lg w-80 p-4 relative">
                        <h2 className="text-lg font-bold mb-3">Checklist</h2>

                        <ul className="space-y-2">
                            {steps.map((step) => (
                                <li key={step.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={step.completed}
                                            onChange={() => toggleStep(step.id)}
                                            className="w-4 h-4"
                                        />
                                        <span>{step.title}</span>
                                    </div>
                                    {step.hint && (
                                        <button
                                            className="text-sm text-gray-500 underline"
                                            onClick={() => alert(step.hint)}
                                        >
                                            ?
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={!allCompleted}
                            className={`mt-4 w-full px-3 py-2 rounded ${
                                allCompleted ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={() => {
                                alert("Tour validé !");

                                setSteps((prev) =>
                                    prev.map((step) => ({ ...step, completed: false }))
                                );

                                setIsOpen(false);
                            }}
                        >
                            Valider le tour
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

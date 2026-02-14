"use client";

import { useState, useEffect } from "react";

type Step = {
    id: number;
    title: string;
    completed: boolean;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onValidate: () => void;
    initialSteps: Step[];
};

export default function ChecklistModal({ isOpen, onClose, onValidate, initialSteps }: Props) {
    const [steps, setSteps] = useState<Step[]>(initialSteps);

    useEffect(() => {
        setSteps(initialSteps);
    }, [initialSteps]);

    const toggleStep = (id: number) => {
        setSteps((prev) =>
            prev.map((step) =>
                step.id === id ? { ...step, completed: !step.completed } : step
            )
        );
    };

    const allCompleted = steps.length > 0 && steps.every((s) => s.completed);

    const handleValidate = () => {
        if (!allCompleted) return;

        onValidate();
        onClose();

        setSteps(initialSteps.map(step => ({ ...step, completed: false })));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white text-black rounded-lg shadow-lg w-96 p-6 relative">
                <h2 className="text-xl font-bold mb-4">Checklist de mission</h2>

                <ul className="space-y-3">
                    {steps.map((step) => (
                        <li key={step.id} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={step.completed}
                                onChange={() => toggleStep(step.id)}
                                className="w-4 h-4"
                            />
                            <span className={`${step.completed ? "line-through text-gray-400" : ""}`}>
                {step.title}
              </span>
                        </li>
                    ))}
                </ul>

                <button
                    disabled={!allCompleted}
                    onClick={handleValidate}
                    className={`mt-6 w-full py-2 rounded transition ${
                        allCompleted
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Valider la mission
                </button>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

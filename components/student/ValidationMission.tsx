"use client";

import React from "react";

interface ModalProps {
    title?: string;
    message: string;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ValidationMissionModal({ title, message, isOpen, onConfirm, onCancel }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-500 transition cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-purpleReViSE text-white hover:bg-purple-700 transition cursor-pointer"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}
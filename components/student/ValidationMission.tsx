"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface ModalProps {
    title?: string;
    message: string;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ValidationMissionModal({ title, message, isOpen, onConfirm, onCancel }: ModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onCancel}
            className="relative z-50"
        >
            <div
                className="fixed inset-0 bg-black/50"
                aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    className="bg-slate-800 rounded-lg p-6 w-[90%] max-w-md shadow-lg"
                >
                    {title && (
                        <DialogTitle className="text-xl font-bold mb-4">
                            {title}
                        </DialogTitle>
                    )}

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
                </DialogPanel>
            </div>
        </Dialog>
    );
}
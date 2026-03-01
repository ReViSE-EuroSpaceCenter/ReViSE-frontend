"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Checklist({ isOpen, setIsOpen }: Readonly<Props>) {

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
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center">
              <DialogPanel
                className="relative bg-darkBlueReViSE text-foreground rounded-xl shadow-2xl w-175 p-10"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                  <DialogTitle className="text-xl font-bold mb-4 text-purpleReViSE">
                      Rappel des règles
                  </DialogTitle>

                  <ul className="space-y-3 list-disc list-inside text-white">
                      {steps.map((step) => (
                        <li
                          key={step.id}
                          className="flex justify-between items-start gap-2 p-2 rounded"
                        >
                            <span>{step.title}</span>
                            {step.hint && (
                              <button
                                className="text-sm text-orangeReViSE underline hover:text-orange-400"
                                aria-label={`Indice : ${step.title}`}
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
                    aria-label="Fermer"
                    className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg"
                  >
                      ✕
                  </button>
              </DialogPanel>
          </div>
      </Dialog>
    );
}
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Checklist({ isOpen, setIsOpen }: Readonly<Props>) {

    const steps = [
        {
            id: 1,
            title: "Si les dominos placés à droite du marqueur de temps contiennent des hallucinations, placez-les dans le pot d'accumulation d'hallucination.",
            hint: "Les point noirs et blancs sont les hallucinations.",
        },
        {
            id: 2,
            title: "Déplacez le marqueur de temps sur la ligne verticale située juste après le dernier domino.",
            hint: "",
        },
        {
            id: 3,
            title: "Retirez de votre réserve d'énergie le coût TOTAL d'énergies des dominos présents sur votre plateau.",
            hint: "Faire la somme des piles sur le plateau",
        },
        {
            id: 4,
            title: "Placez le pion sur la case départ de l'espace HUMAIN.",
            hint: "",
        },
    ];

    const [checked, setChecked] = useState<number[]>([]);

    const getStepIndex = (stepId: number) => steps.findIndex((s) => s.id === stepId);

    const toggle = (id: number) => {
        setChecked((prev) => {
            const index = getStepIndex(id);
            const isChecked = prev.includes(id);

            if (isChecked) {
                return prev.filter((i) => getStepIndex(i) < index);
            }

            return [...prev, id];
        });
    };

    const showHint = (hint: string) => {
        Swal.fire({
            text: hint,
            icon: "info",
            confirmButtonText: "OK",
            background: "#1a1f3a",
            color: "#ffffff",
            confirmButtonColor: "#7c3aed",
        });
    };

    const handleClose = () => {
        setIsOpen(false);
        setChecked([]);
    };

    const isVisible = (index: number) => {
        if (index === 0) return true;
        return checked.includes(steps[index - 1].id);
    };

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50"
      >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel
                className="relative bg-darkBlueReViSE text-foreground rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl p-6 md:p-10 max-h-[90vh] overflow-y-auto"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                  <DialogTitle className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-purpleReViSE pr-8">
                      Check-List — Fin du tour
                  </DialogTitle>

                  <ul className="space-y-2 md:space-y-3 text-white">
                      {steps.map((step, index) => {
                          if (!isVisible(index)) return null;
                          const done = checked.includes(step.id);

                          return (
                            <li
                              key={step.id}
                              className={`flex items-start gap-3 p-2 md:p-3 rounded-lg transition-all duration-300 opacity-100
                                          ${done ? "bg-white/5" : "bg-white/0"}`}
                            >
                                <button
                                  onClick={() => toggle(step.id)}
                                  aria-label={done ? `Décocher : ${step.title}` : `Cocher : ${step.title}`}
                                  className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 transition-colors duration-200 flex items-center justify-center ${
                                    done
                                      ? "bg-purpleReViSE border-purpleReViSE"
                                      : "border-gray-400 hover:border-purpleReViSE"
                                  }`}
                                >
                                    {done && (
                                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                </button>

                                <span className={`flex-1 text-sm md:text-base leading-snug transition-colors duration-200 ${done ? "line-through text-gray-400" : ""}`}>
                                        {step.title}
                                    </span>

                                {step.hint && (
                                  <button
                                    className="shrink-0 w-6 h-6 rounded-full border border-orangeReViSE text-orangeReViSE text-xs font-bold hover:bg-orangeReViSE hover:text-white transition-colors"
                                    aria-label={`Indice : ${step.title}`}
                                    onClick={() => showHint(step.hint)}
                                  >
                                      ?
                                  </button>
                                )}
                            </li>
                          );
                      })}
                  </ul>

                  <button
                    onClick={handleClose}
                    aria-label="Fermer"
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition text-lg"
                  >
                      ✕
                  </button>
              </DialogPanel>
          </div>
      </Dialog>
    );
}
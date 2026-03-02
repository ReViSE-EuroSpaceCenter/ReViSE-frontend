"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  action: (formData: FormData) => void;
}

export default function NumberTeamSelector({ isOpen, onClose, action }: Readonly<Props>) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center min-h-screen">
        <DialogPanel className="bg-darkBlueReViSE border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-xl max-w-md w-full mx-4">
          <form
            action={action}
            className="flex flex-col items-center gap-6 w-full"
          >
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Choisissez le nombre d{"'"}équipes
            </DialogTitle>

            <button
              type="submit"
              name="nbTeams"
              value="4"
              className="w-full px-4 py-4 bg-orangeReViSE text-white rounded-xl font-semibold transition-all duration-200
                         hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              4 équipes
            </button>

            <button
              type="submit"
              name="nbTeams"
              value="6"
              className="w-full px-4 py-4 bg-orangeReViSE text-white rounded-xl font-semibold transition-all duration-200
                         hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              6 équipes
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Annuler
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
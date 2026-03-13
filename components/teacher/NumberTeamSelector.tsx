"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {createLobby} from "@/api/lobbyApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

export default function NumberTeamSelector({ isOpen, onClose }: Readonly<Props>) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (nbTeams: number) => createLobby(nbTeams),
    onSuccess: ({ lobbyCode, hostId }, nbTeams) => {
      sessionStorage.setItem("hostId", hostId);
      onClose();
      router.push(`/teacher/game/${lobbyCode}/setup?nbTeams=${nbTeams}`);
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center min-h-screen">
        <DialogPanel className="bg-darkBlueReViSE border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-xl max-w-md w-full mx-4">

          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            Choisissez le nombre d{"'"}équipes
          </DialogTitle>

          <button
            onClick={() => mutation.mutate(4)}
            className="w-full px-4 py-4 bg-orangeReViSE text-white rounded-xl font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
          >
            4 équipes
          </button>

          <button
            onClick={() => mutation.mutate(6)}
            className="w-full px-4 py-4 bg-orangeReViSE text-white rounded-xl font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
          >
            6 équipes
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Annuler
          </button>

        </DialogPanel>
      </div>
    </Dialog>
  );
}
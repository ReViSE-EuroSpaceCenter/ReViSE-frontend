"use client";

import { useState } from "react";

export default function NumberTeamSelector({
                                             action
                                           }: Readonly<{
  action: (formData: FormData) => void
}>) {
  const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <button
                onClick={() => setIsOpen(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl"
            >
                Créer une partie
            </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form
            action={action}
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold">
              Choisissez le nombre d{"'"}équipes
            </h2>

            <button
              type="submit"
              name="nbTeams"
              value="4"
              className="px-6 py-3 bg-green-600 text-white rounded-xl"
            >
              4 équipes
            </button>

            <button
              type="submit"
              name="nbTeams"
              value="6"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl"
            >
              6 équipes
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500"
            >
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
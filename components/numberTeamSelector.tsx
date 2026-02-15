"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  action: (formData: FormData) => void;
}

export default function NumberTeamSelector({ isOpen, onClose, action }: Readonly<Props>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        action={action}
        className="bg-darkBlueReViSE border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-xl max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-semibold text-white">
          Choisissez le nombre d{"'"}équipes
        </h2>

        <button
          type="submit"
          name="nbTeams"
          value="4"
          className="w-full px-6 py-4 bg-purpleReViSE hover:bg-purpleReViSE/80 text-white rounded-xl font-semibold transition-colors"
        >
          4 équipes
        </button>

        <button
          type="submit"
          name="nbTeams"
          value="6"
          className="w-full px-6 py-4 bg-purpleReViSE hover:bg-purpleReViSE/80 text-white rounded-xl font-semibold transition-colors"
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
      </form>
    </div>
  );
}
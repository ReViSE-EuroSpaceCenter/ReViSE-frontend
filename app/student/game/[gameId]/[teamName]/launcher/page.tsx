export default function LauncherPage() {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-6 pt-16 sm:pt-20">

          <div className="w-full max-w-md">

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center space-y-8">

                  <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-purpleReViSE/20 flex items-center justify-center text-3xl">
                          🛰️
                      </div>
                  </div>

                  <div className="space-y-3">
                      <p className="text-xs font-semibold tracking-widest text-purpleReViSE uppercase">
                          Cap sur Europe
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                          La suite se passe sur l&apos;écran principal
                      </h1>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                          Suivez les instructions de votre animateur et regardez l&apos;écran
                          central pour la prochaine étape de la mission.
                      </p>
                  </div>

              </div>

          </div>

      </div>
    );
}
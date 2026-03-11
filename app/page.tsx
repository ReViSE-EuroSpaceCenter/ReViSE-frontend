import HomeButtons from "@/components/HomeButtons";

export default function Home() {

    return (
      <div className="min-h-[calc(100vh-80px)]">
          <div className="grid lg:grid-cols-2 gap-12 px-6 lg:px-12 py-6 lg:py-12 max-w-7xl mx-auto">
              <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
                          Cap sur Europe
                      </h1>
                      <p className="text-xl sm:text-2xl text-purpleReViSE font-medium">
                          La lune glacée de Jupiter
                      </p>
                  </div>

                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                      À plus de 600 millions de kilomètres de la Terre, embarquez pour une aventure unique
                      d{"'"}exploration et de coopération. Six équipes travaillent ensemble pour résoudre des défis
                      concrets autour de l{"'"}intelligence artificielle.
                  </p>

                  <HomeButtons />

                  <p className="text-sm text-slate-400 pt-4">
                      Développé par l{"'"}Euro Space Center, l{"'"}Université de Namur et B12 Consulting
                  </p>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Les phases du voyage
                  </h2>

                  <div className="space-y-4">
                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5 hover:border-purpleReViSE/50 transition-colors">
                          <h3 className="text-lg sm:text-xl font-semibold text-purpleReViSE mb-2">
                              📡 Introduction
                          </h3>
                          <p className="text-sm sm:text-base text-slate-300">
                              Formez vos équipes et découvrez votre mission. Chaque équipe reçoit une présentation
                              détaillée de son rôle dans l{"'"}expédition.
                          </p>
                      </div>

                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5 hover:border-purpleReViSE/50 transition-colors">
                          <h3 className="text-lg sm:text-xl font-semibold text-purpleReViSE mb-2">
                              🎯 Missions
                          </h3>
                          <p className="text-sm sm:text-base text-slate-300">
                              Accomplissez des missions normales et bonus. Utilisez les technologies à votre
                              disposition et suivez votre progression en temps réel.
                          </p>
                      </div>

                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5 hover:border-purpleReViSE/50 transition-colors">
                          <h3 className="text-lg sm:text-xl font-semibold text-purpleReViSE mb-2">
                              🚀 Décollage
                          </h3>
                          <p className="text-sm sm:text-base text-slate-300">
                              Gérez vos ressources énergétiques et suivez la trajectoire du vaisseau vers Europe.
                              Chaque étape révèle de nouveaux défis.
                          </p>
                      </div>

                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5 hover:border-purpleReViSE/50 transition-colors">
                          <h3 className="text-lg sm:text-xl font-semibold text-purpleReViSE mb-2">
                              🔬 Découverte
                          </h3>
                          <p className="text-sm sm:text-base text-slate-300">
                              Analysez vos découvertes et révélez les espèces trouvées sur Europe.
                              Vos ressources déterminent l{"'"}ampleur de vos découvertes scientifiques.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}
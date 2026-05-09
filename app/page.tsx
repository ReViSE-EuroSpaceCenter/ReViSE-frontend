import HomeButtons from "@/components/HomeButtons";
import {LogosSection} from "@/components/LogosSection";

export default function Home() {
    return (
      <div className="min-h-[calc(100vh-85px)] flex flex-col items-center">
          <div className="grid lg:grid-cols-2 gap-16 px-16 lg:px-32 pt-4 md:pt-12 pb-4 md:pb-2 w-full">
              <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-3">
                      <p className="text-purpleReViSE font-semibold uppercase tracking-widest text-sm">
                          Recherche de Vie Sur Europe
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                          Repoussez les frontières de la science avec les technologies d{"'"}intelligence artificielle.
                      </h1>
                      <p className="text-xl sm:text-2xl text-purpleReViSE font-medium">
                          Cette interface vous plonge au cœur du jeu <em>ReVisE</em>.
                      </p>
                  </div>

                  <div className="border-l-2 border-purpleReViSE pl-4 text-slate-300 leading-relaxed text-sm md:text-base">
                      Concevez les conditions d{"'"}une exploration scientifique d{"'"}Europe, lune glacée de Jupiter, potentiellement porteuse de traces de vie. <br />
                      Votre mission ne pourra aboutir qu{"'"}à une condition : <strong className="text-white">Apprendre à utiliser les technologies d{"'"}intelligence artificielle avec discernement.</strong> <br /><br />
                      Prêts à relever le défi ?
                  </div>

                  <HomeButtons />

                  <div className="hidden lg:block">
                      <LogosSection />
                  </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Les phases du voyage
                  </h2>
                  <div className="space-y-3">
                      {[
                          { emoji: "🧑‍🚀", title: "Préparation", desc: "Formez vos équipes puis, à travers les deux premières missions, apprenez à manier les technologies d'IA en expérimentant directement le jeu." },
                          { emoji: "⚙️", title: "Déploiement", desc: "Accomplissez toutes les missions nécessaires et bonus pour rendre la mission spatiale possible. Utilisez les technologies d'IA à votre disposition et suivez votre progression en temps réel." },
                          { emoji: "🚀", title: "Voyage interplanétaire", desc: "L'heure du voyage est enfin arrivée. Votre vaisseau et ses technologies d'IA seront confrontées aux conditions inhospitalières de l'espace…" },
                          { emoji: "🔬", title: "Découvertes scientifiques", desc: "Une fois arrivé·es sur Europe, utilisez les ressources restantes (temps, humains, énergie) pour explorer sa surface et ses profondeurs à la recherche de traces de vie." },
                      ].map(({ emoji, title, desc }) => (
                        <div key={title} className="flex gap-4 bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:border-purpleReViSE/50 transition-colors">
                            <span className="text-3xl mt-0.5">{emoji}</span>
                            <div>
                                <h3 className="font-semibold text-purpleReViSE mb-1">{title}</h3>
                                <p className="text-md text-slate-300">{desc}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="lg:hidden w-full px-16 pb-8 pt-2">
              <LogosSection />
          </div>
      </div>
    );
}
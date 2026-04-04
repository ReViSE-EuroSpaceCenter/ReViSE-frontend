import Link from "next/link";

export default function EndGamePage() {
    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 lg:px-12 py-12">
            <div className="max-w-3xl w-full space-y-8 text-center">

                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purpleReViSE">
                        Voyage terminé !
                    </h1>

                    <p className="text-xl sm:text-2xl text-white font-medium">
                        Félicitations à tous les membres de l’équipage pour avoir mené à bien la mission ReViSE et atteint Europe, la lune de Jupiter !
                    </p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 space-y-5 text-slate-300 text-lg leading-relaxed">

                    <p>
                        Après des années de préparation, de coopération et de défis technologiques,
                        la mission <span className="text-purpleReViSE font-semibold">ReViSE – Recherche de Vie Sur Europe</span> arrive à son terme.
                    </p>

                    <p>
                        Votre vaisseau a traversé l’espace profond, affronté les tempêtes solaires,
                        contourné les astéroïdes et surmonté les défis d’un long voyage spatial.
                    </p>

                    <p>
                        Grâce à votre travail d’équipe et à votre maîtrise des technologies d’intelligence artificielle,
                        l’humanité a franchi une nouvelle étape dans l’exploration spatiale.
                    </p>

                </div>

                <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-lg bg-purpleReViSE text-white font-semibold hover:opacity-90 transition"
                >
                    Retour à l’accueil
                </Link>

            </div>
        </div>
    );
}
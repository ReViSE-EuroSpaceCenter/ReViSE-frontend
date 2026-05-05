"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EndGamePage() {
    const searchParams = useSearchParams();
    const isWin = searchParams.get("win") === "true";

    const title = isWin
        ? "Merci d’avoir joué à ReVisE !"
        : "Merci d’avoir joué à ReVisE ! Vous avez perdu !";

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 lg:px-12 py-12">
            <div className="max-w-4xl w-full space-y-8 text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purpleReViSE">
                        {title}
                    </h1>
                    <p className="text-xl sm:text-2xl text-white font-medium">
                        Crédits
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
"use client";

import { ValidationMissionModal } from "@/components/mission/ValidationMission";
import { useParams, useRouter } from "next/navigation";
import {useCallback, useEffect, useMemo, useState} from "react";
import { stepsData } from "@/utils/stepsData";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { TeamsFullProgression } from "@/types/TeamData";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";
import LoadingPage from "@/app/loading";
import { ResourceCard } from "@/components/launcher/ResourceCard";
import {showEnergyBonusAlert} from "@/utils/alerts";
import {getBonusKey, parseBonusId} from "@/utils/launcherUtils";
import {getTeamsInfo, gameOver} from "@/api/launcherApi";
import {confirmEndGameMessage} from "@/utils/endGameMessage";
import {useSessionId} from "@/hooks/useSessionId";

export default function StepPage() {
    const router = useRouter();
    const params = useParams();
    const hostId = useSessionId("hostId");

    const [showModal, setShowModal] = useState(false);
    const [validatedResources, setValidatedResources] = useState<string[]>([]);

    const lobbyCode = params.gameId?.toString() as string;

    const stepParam = Number.parseInt(params.step?.toString() || "0", 10);
    const step = Number.isNaN(stepParam) ? 0 : stepParam;

  const { data: gameData, isLoading, isError, error } = useQuery<TeamsFullProgression>({
    queryKey: ["gameInfo", lobbyCode],
    queryFn: () => getTeamsInfo(lobbyCode),
    enabled: !!lobbyCode,
  });

    useEffect(() => {
        if (isError) {
            showError(
                error instanceof ApiError ? error.key : "",
                "Impossible de récupérer les données de la partie"
            );
        }
    }, [isError, error]);

    const toggleResource = (resource: string) => {
        setValidatedResources((prev) =>
            prev.includes(resource)
                ? prev.filter((r) => r !== resource)
                : [...prev, resource]
        );
    };

    const isBonusAutoValidated = useCallback(
        (id: string): boolean => {
            const { team, nb } = parseBonusId(id);
            const key = getBonusKey(nb);
            return !!gameData?.teamsFullProgression?.[team]?.teamProgression?.[key];
        },
        [gameData]
    );

    const allValidated = useMemo(() => {
        if (!gameData) return false;

        const stepData = stepsData[step - 1];
        const nbTeams = Object.keys(gameData.teamsFullProgression ?? {}).length as 4 | 6;
        const resources = stepData[nbTeams.toString() as "4" | "6"];
        const allIds = [
            ...resources.resources,
            ...resources.bonuses.filter((b) => b.replacement).map((b) => b.id),
        ];

        return allIds.every(
            (id) => validatedResources.includes(id) || isBonusAutoValidated(id)
        );
    }, [gameData, isBonusAutoValidated, step, validatedResources]);

    if (isLoading || !gameData) return <LoadingPage />;
    if (step < 1) return null;

    const stepData = stepsData[step - 1];
    const nbTeams = Object.keys(gameData.teamsFullProgression ?? {}).length as 4 | 6;
    const resources = stepData[nbTeams.toString() as "4" | "6"];

    const energyBonus = nbTeams === 4 ? 3 : 5;

    const energies = resources.bonuses.find(
        (b) => !b.replacement && isBonusAutoValidated(b.id)
    );

    const handleConfirm = async () => {
        setShowModal(false);
        if (energies) {
            const { team, nb } = parseBonusId(energies.id);
            await showEnergyBonusAlert(
                { team, nb, title: energies.title },
                energyBonus
            );
        }
        router.replace(`/teacher/game/${lobbyCode}/launcher?step=${step + 1}`);
    };

    const handleEndGame = async () => {
        const confirmed = await confirmEndGameMessage();

        if (!confirmed) return;
        if (!hostId) {
            showError("", "Identifiant de connexion manquant, impossible de terminer la partie");
            return;
        }
        await gameOver(lobbyCode, hostId);
        router.push(`/endGame?win=false`);
    };

    return (
        <div className="text-white font-sans px-6 py-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4 text-center lg:text-left">
                    <div className="relative w-14 h-14 shrink-0">
                        <Image
                            src={`/badges/checkpoints/checkpoint_${step}.svg`}
                            alt={`Étape ${step}`}
                            width={56}
                            height={56}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-wide text-[#FABAA3]">
                        {stepData.title}
                    </h1>
                </div>

        <div className="w-85 h-42.5 shrink-0 bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden flex items-center justify-center">
          <Image
            src={`/steps/step${step}.svg`}
            alt={`Carte étape ${step}`}
            width={340}
            height={240}
            className="object-contain object-left"
          />
        </div>
      </div>

            <hr className="border-white/10 mb-8" />

            <p className="text-white/80 text-base leading-relaxed max-w-3xl mx-auto text-center mb-8">
                {stepData.text}
            </p>

            <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Ressources nécessaires pour continuer le voyage
            </h3>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
                {resources.bonuses.map((b) => {
                    if (!b.replacement) return;
                    const { team, nb } = parseBonusId(b.id);
                    const autoValidated = isBonusAutoValidated(b.id);

                    return (
                        <ResourceCard
                            key={b.id}
                            id={b.id}
                            imgSrc={`/badges/launchers/${b.replacement}_orange.svg`}
                            autoValidated={autoValidated}
                            validated={validatedResources.includes(b.id)}
                            bonus={{ team, nb, title: b.title ?? "", text: b.text ?? "" }}
                            onClick={() => toggleResource(b.id)}
                        />
                    );
                })}

                {resources.resources.map((r) => (
                    <ResourceCard
                        key={r}
                        id={r}
                        imgSrc={`/badges/launchers/${r}_orange.svg`}
                        autoValidated={false}
                        validated={validatedResources.includes(r)}
                        onClick={() => toggleResource(r)}
                    />
                ))}
            </div>

            <div className="flex justify-end">
                {allValidated ? (
                    <button
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer rounded-lg bg-purpleReViSE px-6 py-3 text-lg text-white transition hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                        Valider l{"'"}étape
                    </button>
                ) : (
                    <button
                    onClick={handleEndGame}
                className="cursor-pointer rounded-lg bg-orangeReViSE px-6 py-3 text-lg text-white transition hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
                Fin du jeu
            </button>
                )}
            </div>

            <ValidationMissionModal
                title="Confirmation"
                message="Cette action validera l'étape actuelle. Êtes-vous sûr de vouloir continuer ?"
                isOpen={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BonusCard from "@/components/decollage/bonusCard";
import ResourceCard from "@/components/decollage/resourceCard";
import {ValidationMissionModal} from "@/components/mission/ValidationMission";


type TeamBonusState = {
    team: string;
    bonus1_check: boolean;
    bonus2_check: boolean;
};

type DecollageData = {
    nbTeams: number;
    step: string;
    teamsBonuses: TeamBonusState[];
};

type ResourceKey = "preparer" | "adapter" | "forcer" | "anticiper" | "reparer";
type StepKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type TeamCount = 4 | 6;

type BonusKey =
    | "coop1"
    | "coop2"
    | "meca1"
    | "meca2"
    | "aero1"
    | "aero2"
    | "expe1"
    | "expe2"
    | "medi1"
    | "medi2"
    | "geco1"
    | "geco2";

type BonusSubstituteType =
    | "preparer_no_bonus"
    | "adapter_no_bonus"
    | "forcer_no_bonus"
    | "anticiper_no_bonus"
    | "reparer_no_bonus"
    | "energy";

type ResourceItem = {
    key: ResourceKey;
    image: string;
};

type BonusBadgeItem = {
    key: BonusKey;
    image: string;
    completed: boolean;
    alt: string;
    substitute?: {
        type: BonusSubstituteType;
        image: string;
        quantity?: number;
    };
};

type StepConfig = {
    bonuses: BonusKey[];
    resources: ResourceKey[];
};

type StepContent = {
    title: string;
    description: string;
    bonusTexts: Partial<Record<BonusKey, string>>;
};

type BonusSubstituteConfig = {
    type: BonusSubstituteType;
    quantity?: number;
};

const ICON_SIZE = "w-[100px] h-[100px] md:w-[120px] md:h-[120px]";
const SUBSTITUTE_SIZE = "w-[70px] h-[70px] md:w-[85px] md:h-[85px]";

const resourceImages: Record<ResourceKey, string> = {
    preparer: "/badges/decollage/preparer_orange.svg",
    adapter: "/badges/decollage/adapter_orange.svg",
    forcer: "/badges/decollage/forcer_orange.svg",
    anticiper: "/badges/decollage/anticiper_orange.svg",
    reparer: "/badges/decollage/reparer_orange.svg",
};

const noBonusImages: Record<BonusSubstituteType, string> = {
    preparer_no_bonus: "/badges/decollage/preparer_rose.svg",
    adapter_no_bonus: "/badges/decollage/adapter_rose.svg",
    forcer_no_bonus: "/badges/decollage/forcer_rose.svg",
    anticiper_no_bonus: "/badges/decollage/anticiper_rose.svg",
    reparer_no_bonus: "/badges/decollage/reparer_rose.svg",
    energy: "/badges/decollage/energie.svg",
};

const resourceLabels: Record<ResourceKey, string> = {
    preparer: "Check",
    adapter: "Recyclage",
    forcer: "Anneau",
    anticiper: "Temps",
    reparer: "Outils",
};

const bonusImages: Record<BonusKey, string> = {
    coop1: "/badges/bonus/coop_bonus1.svg",
    coop2: "/badges/bonus/coop_bonus2.svg",
    meca1: "/badges/bonus/meca_bonus1.svg",
    meca2: "/badges/bonus/meca_bonus2.svg",
    aero1: "/badges/bonus/aero_bonus1.svg",
    aero2: "/badges/bonus/aero_bonus2.svg",
    expe1: "/badges/bonus/expe_bonus1.svg",
    expe2: "/badges/bonus/expe_bonus2.svg",
    medi1: "/badges/bonus/medi_bonus1.svg",
    medi2: "/badges/bonus/medi_bonus2.svg",
    geco1: "/badges/bonus/geco_bonus1.svg",
    geco2: "/badges/bonus/geco_bonus2.svg",
};

const bonusLabels: Record<BonusKey, string> = {
    coop1: "COOP",
    coop2: "COOP",
    meca1: "MECA",
    meca2: "MECA",
    aero1: "AERO",
    aero2: "AERO",
    expe1: "EXPE",
    expe2: "EXPE",
    medi1: "MEDI",
    medi2: "MEDI",
    geco1: "GECO",
    geco2: "GECO",
};

const stepConfigs: Record<TeamCount, Record<StepKey, StepConfig>> = {
    4: {
        "1": { bonuses: ["coop1"], resources: ["preparer"] },
        "2": { bonuses: ["coop2"], resources: ["anticiper", "adapter"] },
        "3": { bonuses: ["meca1"], resources: ["anticiper", "preparer"] },
        "4": { bonuses: ["aero1", "expe1"], resources: ["adapter", "reparer"] },
        "5": { bonuses: ["aero2", "expe2"], resources: ["forcer", "reparer"] },
        "6": { bonuses: ["medi1", "geco1"], resources: ["preparer", "reparer"] },
        "7": { bonuses: ["medi2", "geco2"], resources: ["anticiper", "forcer"] },
        "8": { bonuses: ["meca2"], resources: ["adapter"] },
    },
    6: {
        "1": { bonuses: ["coop1"], resources: ["preparer", "forcer"] },
        "2": { bonuses: ["coop2"], resources: ["anticiper", "preparer"] },
        "3": { bonuses: ["meca1"], resources: ["anticiper", "forcer"] },
        "4": { bonuses: ["aero1", "expe1"], resources: ["adapter", "reparer", "preparer"] },
        "5": { bonuses: ["aero2", "expe2"], resources: ["forcer", "reparer", "anticiper"] },
        "6": { bonuses: ["medi1", "geco1"], resources: ["preparer", "reparer", "adapter"] },
        "7": { bonuses: ["medi2", "geco2"], resources: ["anticiper", "forcer", "reparer"] },
        "8": { bonuses: ["meca2"], resources: ["adapter", "forcer"] },
    },
};

const bonusSubstitutes: Record<TeamCount, Record<StepKey, Partial<Record<BonusKey, BonusSubstituteConfig>>>> = {
    4: {
        "1": { coop1: { type: "forcer_no_bonus" } },
        "2": { coop2: { type: "energy", quantity: 3 } },
        "3": { meca1: { type: "energy", quantity: 3 } },
        "4": {
            aero1: { type: "reparer_no_bonus" },
            expe1: { type: "adapter_no_bonus" },
        },
        "5": {
            aero2: { type: "anticiper_no_bonus" },
            expe2: { type: "adapter_no_bonus" },
        },
        "6": {
            medi1: { type: "anticiper_no_bonus" },
            geco1: { type: "preparer_no_bonus" },
        },
        "7": {
            medi2: { type: "preparer_no_bonus" },
            geco2: { type: "reparer_no_bonus" },
        },
        "8": { meca2: { type: "forcer_no_bonus" } },
    },
    6: {
        "1": { coop1: { type: "forcer_no_bonus" } },
        "2": { coop2: { type: "energy", quantity: 5 } },
        "3": { meca1: { type: "energy", quantity: 5 } },
        "4": {
            aero1: { type: "reparer_no_bonus" },
            expe1: { type: "adapter_no_bonus" },
        },
        "5": {
            aero2: { type: "anticiper_no_bonus" },
            expe2: { type: "adapter_no_bonus" },
        },
        "6": {
            medi1: { type: "anticiper_no_bonus" },
            geco1: { type: "preparer_no_bonus" },
        },
        "7": {
            medi2: { type: "preparer_no_bonus" },
            geco2: { type: "reparer_no_bonus" },
        },
        "8": { meca2: { type: "forcer_no_bonus" } },
    },
};

const stepContents: Record<StepKey, StepContent> = {
    "1": {
        title: "Décoller de la Terre",
        description:
            "Votre vaisseau mesure 142 mètres de haut pour une masse de 5200 tonnes. Faire décoller votre vaisseau depuis la Terre est un défi colossal.",
        bonusTexts: {
            coop1: "Intelligence artificielle de supervision d’IA. La coordination des IA du vaisseau facilite la gestion de l’énergie et la priorisation des tâches.",
        },
    },
    "2": {
        title: "Assistance gravitationnelle",
        description:
            "Pour atteindre Europe en 6 ans, vous devez atteindre la vitesse de 20 km/s (72 000 km/h). Utilisez la manœuvre la moins couteuse : l’assistance gravitationnelle. Profitez de la force d’attraction de Vénus pour accélérer votre vaisseau. Pendant cette manœuvre près de Vénus vous perdez la communication avec le centre de commande de la Terre.",
        bonusTexts: {
            coop2: "Centre de commandement virtuel embarqué. Un centre de commandement virtuel vous accompagnera dans la prise de décision, coupés de toutes communication avec la Terre.",
        },
    },
    "3": {
        title: "Cargo de ressources vitales",
        description:
            "Dans votre trajectoire elliptique, vous repassez près de la Terre pour récupérer eau, air et nourriture. Amarrez à votre vaisseau à pleine vitesse un cargo de ravitaillement.",
        bonusTexts: {
            meca1: "Pilotage en réalité virtuelle. Une interface de pilotage en réalité virtuelle facilite la prise en charge de l’amarrage.",
        },
    },
    "4": {
        title: "Tempête solaire",
        description:
            "Une tempête solaire menace votre vaisseau. Les puissantes radiations peuvent endommager les systèmes électroniques et la santé des astronautes : Préparez-vous y pour limiter les dégâts !",
        bonusTexts: {
            aero1: "Automatisation du bouclier magnétique. Le bouclier magnétique permet de dévier une partie des radiations.",
            expe1: "Combinaison adaptative de sortie extravéhiculaire. Des combinaisons adaptées réduisent l’impact des radiations sur le corps des astronautes.",
        },
    },
    "5": {
        title: "Ceinture d’astéroïdes",
        description:
            "Après deux ans de voyage, vous arrivez aux abords de la ceinture d’astéroïdes. Les gros astéroïdes seront facilement évitables, mais les plus petits sont imprévisibles. Limitez les dégâts causés par leur impact à 72 000 km/h.",
        bonusTexts: {
            aero2: "Bras robotisé autonome de réparation. Un bras robotique permet de réparer les dégâts externes et de repousser les petits astéroïdes lors de la traversée.",
            expe2: "Cobot d’exploration. Les cobots facilitent les réparations des dégâts interne au vaisseau subis lors de la traversée en accompagnant les astronautes.",
        },
    },
    "6": {
        title: "Tensions sociales",
        description:
            "Après plus de trois ans de voyage, l’équipage, confiné les uns sur les autres les uns sur les autres dans un environnement confiné et stressant. Le problème que vous rencontrez est cette fois-ci interne au vaisseau. Des tensions apparaissent au sein de l’équipage, mettant la mission en danger.",
        bonusTexts: {
            medi1: "Activités collectives pour la cohésion de groupe. Des systèmes favorisant les interactions sociales, compte tenu des préférences de chacun, aident à apaiser les tensions sociales et à recréer du lien.",
            geco1: "Plantes utiles au bien-être de l’équipage. Un environnement végétalisé ainsi qu’une assiette variée permet de remonter le moral de l’équipage et d’apaiser les tensions.",
        },
    },
    "7": {
        title: "Déséquilibre écologique",
        description:
            "Après plus de quatre ans de recyclage biologique continu, des déséquilibres apparaissent dans l’air, l’eau et les micro-organismes (maladies). Assainissez votre environnement.",
        bonusTexts: {
            medi2: "Suivi des souches bactériennes. Un système de veille sanitaire permet d’éviter le développement de maladies bactériologiques ou virales.",
            geco2: "Système mécanique de recyclage de secours. Un système mécanique de recyclage aide à compenser les manquements des systèmes biologiques pour stabiliser les paramètres de l’environnement.",
        },
    },
    "8": {
        title: "Repérage sur Europe",
        description:
            "Après 6 ans de voyage, vous vous installez enfin en orbite d’Europe. Depuis la Terre, nous n’avons pu qu’estimer les conditions à la surface et dans les profondeurs d’Europe. Afin d’adapter vos plans à la réalité de terrain, envoyez une flotte robotique d’exploration.",
        bonusTexts: {
            meca2: "Robots mous adaptés à l’exploration. Des robots mous spécialisés dans la collecte de données topographiques et climatiques vous faciliteront la collecte de données.",
        },
    },
};

function getInitialDecollageData(): DecollageData | null {
    if (typeof globalThis.window === "undefined") return null;

    const raw = sessionStorage.getItem("decollageData");
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as Partial<DecollageData>;
        return {
            nbTeams: parsed.nbTeams ?? 0,
            step: parsed.step ?? "1",
            teamsBonuses: parsed.teamsBonuses ?? [],
        };
    } catch {
        return null;
    }
}

function normalizeTeamName(teamName: string | undefined): string {
    if (!teamName) return "";

    const value = teamName.toLowerCase().trim();

    if (value.includes("coop")) return "coop";
    if (value.includes("meca")) return "meca";
    if (value.includes("aero")) return "aero";
    if (value.includes("expe")) return "expe";
    if (value.includes("medi")) return "medi";
    if (value.includes("geco")) return "geco";

    return value;
}

function getBonusTeamKey(bonusKey: BonusKey): string {
    if (bonusKey.startsWith("coop")) return "coop";
    if (bonusKey.startsWith("meca")) return "meca";
    if (bonusKey.startsWith("aero")) return "aero";
    if (bonusKey.startsWith("expe")) return "expe";
    if (bonusKey.startsWith("medi")) return "medi";
    return "geco";
}

function isBonusCompleted(
    bonusKey: BonusKey,
    teamsBonuses: TeamBonusState[]
): boolean {
    const expectedTeam = getBonusTeamKey(bonusKey);
    const field: keyof Pick<TeamBonusState, "bonus1_check" | "bonus2_check"> =
        bonusKey.endsWith("1") ? "bonus1_check" : "bonus2_check";

    const matchingTeam = teamsBonuses.find(
        (team) => normalizeTeamName(team.team) === expectedTeam
    );

    return Boolean(matchingTeam?.[field]);
}

function normalizeTeamCount(nbTeams: number): TeamCount {
    return nbTeams === 6 ? 6 : 4;
}

function normalizeStep(step: string): StepKey {
    return step in stepContents ? (step as StepKey) : "1";
}

function getBonusSubstitute(
    nbTeams: TeamCount,
    step: StepKey,
    bonusKey: BonusKey
): BonusBadgeItem["substitute"] {
    const config = bonusSubstitutes[nbTeams][step][bonusKey];
    if (!config) return undefined;

    return {
        type: config.type,
        image: noBonusImages[config.type],
        quantity: config.quantity,
    };
}

/* à ajouter pour le bouton next et rediriger ici
const handleGoToDecollage = () => {
        const data = {
            nbTeams: teamsData.length,
            step: "1",
            teamsBonuses: teamsData.map((teamItem) => ({
                team: teamItem.team,
                bonus1_check: teamItem.bonus1_check,
                bonus2_check: teamItem.bonus2_check,
            })),
        };

        sessionStorage.setItem("decollageData", JSON.stringify(data));
        router.push(`/teacher/game/${lobbyCode}/decollage`);
    };

 */

export default function DecollagePage() {
    const [data] = useState<DecollageData | null>(getInitialDecollageData);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const lobbyCode = params.gameId as string;

    const pageData = useMemo(() => {
        if (!data) return null;

        const nbTeams = normalizeTeamCount(data.nbTeams);
        const step = normalizeStep(data.step);
        const config = stepConfigs[nbTeams][step];
        const content = stepContents[step];

        const bonusBadges: BonusBadgeItem[] = config.bonuses.map((bonusKey) => ({
            key: bonusKey,
            image: bonusImages[bonusKey],
            completed: isBonusCompleted(bonusKey, data.teamsBonuses),
            alt: `Badge mission bonus ${bonusKey}`,
            substitute: getBonusSubstitute(nbTeams, step, bonusKey),
        }));
        console.log(bonusBadges)
        const resources: ResourceItem[] = config.resources.map((key) => ({
            key,
            image: resourceImages[key],
        }));

        return {
            step,
            content,
            bonusBadges,
            resources,
        };
    }, [data]);

    if (!pageData) {
        return <div className="text-white">Aucune donnée trouvée.</div>;
    }

    return (
        <>
            <div className=" flex items-center justify-center px-2 py-3">
                <div className="w-full max-w-2xl min-h-[70vh] overflow-hidden rounded-md bg-darkBlueReViSE shadow-lg flex flex-col">
                    <div className="flex flex-1 flex-col px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#f3b29c] text-2xl font-bold text-[#f3b29c] md:h-14 md:w-14 md:text-3xl">
                                {pageData.step}
                            </div>

                            <h1 className="text-2xl font-bold text-[#f3b29c] md:text-4xl">
                                {pageData.content.title}
                            </h1>
                        </div>

                        <div className="mt-8 space-y-4 text-white md:mt-10">
                            <p className="text-base leading-7 md:text-xl">
                                {pageData.content.description}
                            </p>
                        </div>

                        <div className="mt-12 md:mt-16">
                            <h2 className="text-xl font-semibold text-white md:text-2xl">
                                Missions bonus et ressources
                            </h2>

                            <div className="mt-8 flex flex-wrap items-start justify-center gap-10 md:justify-start">
                                {pageData.bonusBadges.map((bonus) => (
                                    <BonusCard
                                        key={bonus.key}
                                        bonus={bonus}
                                        label={bonusLabels[bonus.key]}
                                        text={pageData.content.bonusTexts[bonus.key]}
                                        iconSize={ICON_SIZE}
                                        substituteSize={SUBSTITUTE_SIZE}
                                    />
                                ))}

                                {pageData.resources.map((resource) => (
                                    <ResourceCard
                                        key={resource.key}
                                        image={resource.image}
                                        label={resourceLabels[resource.key]}
                                        alt={resourceLabels[resource.key]}
                                        iconSize={ICON_SIZE}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-16">
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="cursor-pointer rounded-md bg-purpleReViSE px-5 py-3 text-lg text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Valider l’étape
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ValidationMissionModal
                title="Confirmation"
                message="Cette action validera l’étape actuelle. Êtes-vous sûr de vouloir continuer ?"
                isOpen={isConfirmOpen}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    router.push(`/teacher/game/${lobbyCode}`);
                }}
            />
        </>
    );
}
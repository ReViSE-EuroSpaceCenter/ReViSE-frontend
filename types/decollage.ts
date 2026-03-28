const TEAM_KEYS = ["coop", "meca", "aero", "expe", "medi", "geco"] as const;
const BONUS_INDEXES = [1, 2] as const;
const STEP_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

type ResourceKey = "preparer" | "adapter" | "forcer" | "anticiper" | "reparer";

export type StepKey = (typeof STEP_KEYS)[number];
export type TeamCount = 4 | 6;
export type BonusKey = `${(typeof TEAM_KEYS)[number]}${(typeof BONUS_INDEXES)[number]}`;
export type BonusSubstituteType = `${ResourceKey}_no_bonus` | "energy";

export type BonusBadgeItem = {
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

export type StepContent = {
    title: string;
    description: string;
    bonusTexts: Partial<Record<BonusKey, string>>;
};

export type TeamBonusState = {
    team: string;
    bonus1_check: boolean;
    bonus2_check: boolean;
};

export type GameInfoResponse = {
    allTeamsCompleted: boolean;
    teamsFullProgression: Record<
        string,
        {
            completedMissions: Record<string, boolean>;
            teamProgression: {
                teamLabel: string;
                firstBonusMissionCompleted: boolean;
                secondBonusMissionCompleted: boolean;
            };
        }
    >;
};

export type StepConfig = {
    bonuses: BonusKey[];
    resources: ResourceKey[];
};

export type ResourceItem = {
    key: ResourceKey;
    image: string;
};

const getTeamKeyFromBonus = (bonusKey: BonusKey) =>
    bonusKey.slice(0, -1) as (typeof TEAM_KEYS)[number];

const getBonusIndex = (bonusKey: BonusKey) =>
    Number(bonusKey.slice(-1)) as (typeof BONUS_INDEXES)[number];

const makeBonusImage = (bonusKey: BonusKey) => {
    const team = getTeamKeyFromBonus(bonusKey);
    const index = getBonusIndex(bonusKey);
    return `/badges/bonus/${team}_bonus${index}.svg`;
};

const makeBonusLabel = (bonusKey: BonusKey) =>
    getTeamKeyFromBonus(bonusKey).toUpperCase();

export const bonusImages: Record<BonusKey, string> = Object.fromEntries(
    TEAM_KEYS.flatMap((team) =>
        BONUS_INDEXES.map((index) => {
            const key = `${team}${index}` as BonusKey;
            return [key, makeBonusImage(key)];
        })
    )
) as Record<BonusKey, string>;

export const bonusLabels: Record<BonusKey, string> = Object.fromEntries(
    TEAM_KEYS.flatMap((team) =>
        BONUS_INDEXES.map((index) => {
            const key = `${team}${index}` as BonusKey;
            return [key, makeBonusLabel(key)];
        })
    )
) as Record<BonusKey, string>;

export const resourceImages: Record<ResourceKey, string> = {
    preparer: "/badges/decollage/preparer_orange.svg",
    adapter: "/badges/decollage/adapter_orange.svg",
    forcer: "/badges/decollage/forcer_orange.svg",
    anticiper: "/badges/decollage/anticiper_orange.svg",
    reparer: "/badges/decollage/reparer_orange.svg",
};

export const noBonusImages: Record<BonusSubstituteType, string> = {
    preparer_no_bonus: "/badges/decollage/preparer_rose.svg",
    adapter_no_bonus: "/badges/decollage/adapter_rose.svg",
    forcer_no_bonus: "/badges/decollage/forcer_rose.svg",
    anticiper_no_bonus: "/badges/decollage/anticiper_rose.svg",
    reparer_no_bonus: "/badges/decollage/reparer_rose.svg",
    energy: "/badges/decollage/energie.svg",
};

export const resourceLabels: Record<ResourceKey, string> = {
    preparer: "Check",
    adapter: "Recyclage",
    forcer: "Anneau",
    anticiper: "Temps",
    reparer: "Outils",
};

const sharedBonusSubstitutes: Record<
    StepKey,
    Partial<Record<BonusKey, { type: BonusSubstituteType; quantity?: number }>>
> = {
    "1": { coop1: { type: "forcer_no_bonus" } },
    "2": { coop2: { type: "energy", quantity: 0 } },
    "3": { meca1: { type: "energy", quantity: 0 } },
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
};

function withEnergyQuantity(
    config: typeof sharedBonusSubstitutes,
    quantity: number
): typeof sharedBonusSubstitutes {
    return {
        ...config,
        "2": { coop2: { type: "energy", quantity } },
        "3": { meca1: { type: "energy", quantity } },
    };
}

export const bonusSubstitutes: Record<
    TeamCount,
    Record<StepKey, Partial<Record<BonusKey, { type: BonusSubstituteType; quantity?: number }>>>
> = {
    4: withEnergyQuantity(sharedBonusSubstitutes, 3),
    6: withEnergyQuantity(sharedBonusSubstitutes, 5),
};

const sharedStepContents: Record<StepKey, StepContent> = {
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

export const stepContents = sharedStepContents;

export const stepConfigs: Record<TeamCount, Record<StepKey, StepConfig>> = {
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

function normalizeTeamName(teamName?: string): string {
    const value = teamName?.toLowerCase().trim() ?? "";
    return TEAM_KEYS.find((team) => value.includes(team)) ?? value;
}

export function getBonusTeamKey(bonusKey: BonusKey) {
    return getTeamKeyFromBonus(bonusKey);
}

export function isBonusCompleted(
    bonusKey: BonusKey,
    teamsBonuses: TeamBonusState[]
): boolean {
    const expectedTeam = getBonusTeamKey(bonusKey);
    const field = getBonusIndex(bonusKey) === 1 ? "bonus1_check" : "bonus2_check";

    const matchingTeam = teamsBonuses.find(
        (team) => normalizeTeamName(team.team) === expectedTeam
    );

    return Boolean(matchingTeam?.[field]);
}

export function normalizeTeamCount(nbTeams: number): TeamCount {
    return nbTeams === 6 ? 6 : 4;
}

export function normalizeStep(step: string | null): StepKey {
    return STEP_KEYS.includes(step as StepKey) ? (step as StepKey) : "1";
}

export function getBonusSubstitute(
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

export function mapGameInfoToTeamBonuses(gameInfo: GameInfoResponse): TeamBonusState[] {
    return Object.values(gameInfo.teamsFullProgression ?? {}).map((team) => ({
        team: team.teamProgression.teamLabel,
        bonus1_check: team.teamProgression.firstBonusMissionCompleted,
        bonus2_check: team.teamProgression.secondBonusMissionCompleted,
    }));
}
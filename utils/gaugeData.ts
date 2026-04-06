export const GAUGE_MAX_SCORE = 18;

export const SPECIES = [
    { step: 1/6, label: "Sucres", svg: "/species/sucre.svg", text: "Découverte : Vous détectez des molécules organiques simples !\nLes sucres sont des structures chimiques riches en carbone. Ils font partie des éléments de base nécessaire à la vie. Bien qu’étant à la base de la vie, sa présence n’est pas une preuve de la présence de vie.\nRepère temporel : Sur terre, ces molécules sont apparues très tôt, quelques millions d’années après la formation de la planète." },
    { step: 2/6, label: "Brins d’ADN", svg: "/species/adn.svg", text: "Découverte : Vous avez identifié des fragments d’ADN !\nL’ADN est une molécule qui contient les informations nécessaires au fonctionnement et à la reproduction du vivant. Sa présence indique la présence actuelle ou passée de vie sur Europe.\nRepère temporel : Sur Terre, les premières formes de matériel génétique sont apparus il y a trois à quatre milliards d’année."},
    { step: 3/6, label: "Bactéries", svg: "/species/bacterie.svg", text: "Découverte : Vous avez observé la présence de bactéries !\nCe sont des organismes vivant très simples, constitués d’une seule cellule sans noyau. Les bactéries sont les formes de vie les plus anciennes et les plus rependues.\nRepère temporel : Elles sont apparues sur terre il y a environ 3,2 milliards d’années."},
    { step: 4/6, label: "Cellules complexes", svg: "/species/eucaryote.svg", text: "Découverte : Vous avez identifié des cellules eucaryotes !\nContrairement aux bactéries, ces cellules possèdent un noyau et des structures internes organisées, indiquant une forme de vie plus évoluée, capable de se structurer et de se complexifier.\nRepère temporel : On estime que ces cellules sont apparues sur Terre il y a environ trois milliards d’années."},
    { step: 5/6, label: "Organismes simples", svg: "/species/invertebre.svg", text: "Découverte : Vous avez découvert des organismes multicellulaires simples.\nCe sont des êtres vivants complexes organisés en fonctions différenciées, mais sans squelette interne. Sur Europe, la vie a franchi un cap : elle s’organise en organismes complexes.\nRepère temporel : Sur Terre, ces formes de vie sont apparues seulement il y a environ six cents millions d’années."},
    { step: 6/6, label: "Organismes complexes", svg: "/species/vertebre.svg", text: "Découverte : Vous avez identifié des organismes très évolués avec une structure interne, comparable aux vertébrés.\nCes êtres vivants possèdent un squelette interne et des systèmes biologiques développés. C’est le niveau le plus avancé de complexité biologique.\nRepère temporel : Sur terre, ces formes de vie sont apparues il y a environ cinq cents millions d’année." },
] as const;

export const STEPS = SPECIES.map(c => c.step);

export const PARTICLES = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * Math.PI * 2;
    const distance = 100 + Math.random() * 60;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 3 + Math.random() * 3;

    return { angle, distance, size, x, y };
});

export function getStepsUpTo(score: number): number[] {
    const ratio = Math.min(score / GAUGE_MAX_SCORE, 1);

    const reachedSteps = STEPS.filter(step => step <= ratio);
    const lastStep = reachedSteps.at(-1) ?? 0;
    const isExactlyOnStep = Math.abs(lastStep - ratio) < 0.001;

    return !isExactlyOnStep && ratio > 0
        ? [...reachedSteps, ratio]
        : reachedSteps;
}
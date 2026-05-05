export const GAUGE_MAX_SCORE = 18;

export const SPECIES = [
    { step: 1/6, label: "Vous détectez des molécules organiques simples !", svg: "/species/sucre.svg", text: "Les sucres sont des structures chimiques riches en carbone. Ils font partie des éléments de base nécessaire à la vie. Bien qu’étant à la base de la vie, sa présence n’est pas une preuve de la présence de vie.\n" },
    { step: 2/6, label: "Vous identifiez des brins d’ADN !", svg: "/species/adn.svg", text: "L’ADN est une molécule qui contient les informations nécessaires au fonctionnement et à la reproduction du vivant. Sa présence indique la présence actuelle ou passée de vie sur Europe.\n"},
    { step: 3/6, label: "Vous observez la présence de bactéries !", svg: "/species/bacterie.svg", text: "Ce sont des organismes vivant très simples, constitués d’une seule cellule sans noyau. Les bactéries sont les formes de vie les plus anciennes et les plus rependues.\n"},
    { step: 4/6, label: "Vous identifiez des cellules eucaryotes !", svg: "/species/eucaryote.svg", text: "Contrairement aux bactéries, ces cellules possèdent un noyau et des structures internes organisées, indiquant une forme de vie plus évoluée, capable de se structurer et de se complexifier.\n"},
    { step: 5/6, label: "Vous découvrez des organismes multicellulaires simples.", svg: "/species/invertebre.svg", text: "Ce sont des êtres vivants complexes organisés en fonctions différenciées, mais sans squelette interne. Sur Europe, la vie a franchi un cap : elle s’organise en organismes complexes.\n"},
    { step: 1, label: "Vous identifiez des organismes très évolués avec une structure interne, comparable aux vertébrés.", svg: "/species/vertebre.svg", text: "Ces êtres vivants possèdent un squelette interne et des systèmes biologiques développés. C’est le niveau le plus avancé de complexité biologique.\n" },
] as const;

export const STEPS = SPECIES.map(c => c.step);

export const PARTICLES = Array.from({ length: 60 }, (_, i) => {
    const id = `particle-${i}`;
    const angle = (i / 60) * Math.PI * 2;
    const distance = 100 + Math.random() * 60;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 3 + Math.random() * 3;

    return { id, angle, distance, size, x, y };
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
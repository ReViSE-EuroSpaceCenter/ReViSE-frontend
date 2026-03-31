import {StepData} from "@/types/StepData";

export const stepsData: StepData[] = [
    {
        id: 1,
        title: "Décoller de la Terre",
        text: "Votre vaisseau mesure 142 mètres de haut pour une masse de 5200 tonnes. Faire décoller votre vaisseau depuis la Terre est un défi colossal.",
        4: {
            bonuses: [
                {
                    id: "COOP_bonus1",
                    title: "Intelligence artificielle de supervision d’IA",
                    text: "La coordination des IA du vaisseau facilite la gestion de l’énergie et la priorisation des tâches.",
                    replacement: "forcer"
                }
            ],
            resources: ["preparer"],
        },
        6: {
            bonuses: [
                {
                    id: "COOP_bonus1",
                    title: "Intelligence artificielle de supervision d’IA",
                    text: "La coordination des IA du vaisseau facilite la gestion de l’énergie et la priorisation des tâches.",
                    replacement: "forcer"
                }
            ],
            resources: ["preparer", "forcer"],
        }
    },
    {
        id: 2,
        title: "Assistance gravitationnelle",
        text: "Pour atteindre Europe en 6 ans, vous devez atteindre la vitesse de 20 km/s (72 000 km/h). Utilisez la manœuvre la moins couteuse : l’assistance gravitationnelle. Profitez de la force d’attraction de Vénus pour accélérer votre vaisseau. Pendant cette manœuvre près de Vénus vous perdez la communication avec le centre de commande de la Terre.",
        4: {
            bonuses: [
                {
                    id: "COOP_bonus2",
                    title: "Centre de commandement virtuel embarqué",
                    text: "Un centre de commandement virtuel vous accompagnera dans la prise de décision, coupés de toutes communication avec la Terre.",
                }
            ],
            resources: ["adapter", "anticiper"],
        },
        6: {
            bonuses: [
                {
                    id: "COOP_bonus2",
                    title: "Centre de commandement virtuel embarqué",
                    text: "Un centre de commandement virtuel vous accompagnera dans la prise de décision, coupés de toutes communication avec la Terre.",
                }
            ],
            resources: ["adapter", "preparer"],
        },
    },
    {
        id: 3,
        title: "Cargo de ressources vitales",
        text: "Dans votre trajectoire elliptique, vous repassez près de la Terre pour récupérer eau, air et nourriture. Amarrez à votre vaisseau à pleine vitesse un cargo de ravitaillement.",
        4: {
            bonuses: [
                {
                    id: "MECA_bonus1",
                    title: "Pilotage en réalité virtuelle",
                    text: "Une interface de pilotage en réalité virtuelle facilite la prise en charge de l’amarrage.",
                }
            ],
            resources: ["adapter", "preparer"],
        },
        6: {
            bonuses: [
                {
                    id: "MECA_bonus1",
                    title: "Pilotage en réalité virtuelle",
                    text: "Une interface de pilotage en réalité virtuelle facilite la prise en charge de l’amarrage.",
                }
            ],
            resources: ["adapter", "forcer"],
        },
    },
    {
        id: 4,
        title: "Tempête solaire",
        text: "Une tempête solaire menace votre vaisseau. Les puissantes radiations peuvent endommager les systèmes électroniques et la santé des astronautes : Préparez-vous y pour limiter les dégâts !",
        4: {
            bonuses: [
                {
                    id: "AERO_bonus1",
                    title: "Automatisation du bouclier magnétique",
                    text: "Le bouclier magnétique permet de dévier une partie des radiations.",
                    replacement: "reparer"
                },
                {
                    id: "EXPE_bonus1",
                    title: "Combinaison adaptative de sortie extravéhiculaire",
                    text: "Des combinaisons adaptées réduisent l’impact des radiations sur le corps des astronautes.",
                    replacement: "adapter"
                },
            ],
            resources: ["adapter", "reparer"],
        },
        6: {
            bonuses: [
                {
                    id: "AERO_bonus1",
                    title: "Automatisation du bouclier magnétique",
                    text: "Le bouclier magnétique permet de dévier une partie des radiations.",
                    replacement: "reparer"
                },
                {
                    id: "EXPE_bonus1",
                    title: "Combinaison adaptative de sortie extravéhiculaire",
                    text: "Des combinaisons adaptées réduisent l’impact des radiations sur le corps des astronautes.",
                    replacement: "adapter"
                },
            ],
            resources: ["preparer","adapter", "reparer"],
        },
    },
    {
        id: 5,
        title: "Ceinture d’astéroïdes",
        text: "Après deux ans de voyage, vous arrivez aux abords de la ceinture d’astéroïdes. Les gros astéroïdes seront facilement évitables, mais les plus petits sont imprévisibles. Limitez les dégâts causés par leur impact à 72 000 km/h.",
        4: {
            bonuses: [
                {
                    id: "EXPE_bonus2",
                    title: "Bras robotisé autonome de réparation",
                    text: "Un bras robotique permet de réparer les dégâts externes et de repousser les petits astéroïdes lors de la traversée.",
                    replacement: "adapter"
                },
                {
                    id: "AERO_bonus2",
                    title: "Cobot d’exploration",
                    text: "Les cobots facilitent les réparations des dégâts interne au vaisseau subis lors de la traversée en accompagnant les astronautes.",
                    replacement: "anticiper"
                },
            ],
            resources: ["forcer", "reparer"],
        },
        6: {
            bonuses: [
                {
                    id: "EXPE_bonus2",
                    title: "Bras robotisé autonome de réparation",
                    text: "Un bras robotique permet de réparer les dégâts externes et de repousser les petits astéroïdes lors de la traversée.",
                    replacement: "adapter"
                },
                {
                    id: "AERO_bonus2",
                    title: "Cobot d’exploration",
                    text: "Les cobots facilitent les réparations des dégâts interne au vaisseau subis lors de la traversée en accompagnant les astronautes.",
                    replacement: "anticiper"
                },
            ],
            resources: ["adapter","forcer", "reparer"],
        },
    },
    {
        id: 6,
        title: "Tensions sociales",
        text: "Après plus de trois ans de voyage, l’équipage, confiné les uns sur les autres les uns sur les autres dans un environnement confiné et stressant. Le problème que vous rencontrez est cette fois-ci interne au vaisseau. Des tensions apparaissent au sein de l’équipage, mettant la mission en danger.",
        4: {
            bonuses: [
                {
                    id: "GECO_bonus1",
                    title: "Plantes utiles au bien-être de l’équipage",
                    text: "Un environnement végétalisé ainsi qu’une assiette variée permet de remonter le moral de l’équipage et d’apaiser les tensions.",
                    replacement: "preparer"
                },
            ],
            resources: ["preparer", "reparer"],
        },
        6: {
            bonuses: [
                {
                    id: "MEDI_bonus1",
                    title: "Activités collectives pour la cohésion de groupe",
                    text: "Des systèmes favorisant les interactions sociales, compte tenu des préférences de chacun aident à apaiser les tensions sociales et à recréer du lien.",
                    replacement: "anticiper"
                },
                {
                    id: "GECO_bonus1",
                    title: "Plantes utiles au bien-être de l’équipage",
                    text: "Un environnement végétalisé ainsi qu’une assiette variée permet de remonter le moral de l’équipage et d’apaiser les tensions.",
                    replacement: "preparer"
                },
            ],
            resources: ["preparer", "adapter", "reparer"],
        },
    },
    {
        id: 7,
        title: "Déséquilibre écologique",
        text: "Après plus de quatre ans de recyclage biologique continu, des déséquilibres apparaissent dans l’air, l’eau et les micro-organismes (maladies). Assainissez votre environnement.",
        4: {
            bonuses: [
                {
                    id: "GECO_bonus2",
                    title: "Système mécanique de recyclage de secours",
                    text: "Un système mécanique de recyclage aide à compenser les manquements des systèmes biologiques pour stabiliser les paramètres de l’environnement.",
                    replacement: "reparer"
                }
            ],
            resources: ["adapter", "forcer"],
        },
        6: {
            bonuses: [
                {
                    id: "GECO_bonus2",
                    title: "Système mécanique de recyclage de secours",
                    text: "Un système mécanique de recyclage aide à compenser les manquements des systèmes biologiques pour stabiliser les paramètres de l’environnement.",
                    replacement: "reparer"
                },
                {
                    id: "MEDI_bonus2",
                    title: "Suivi des souches bactériennes",
                    text: "Un système de veille sanitaire permet d’éviter le développement de maladies bactériologiques ou virales.",
                    replacement: "preparer"
                },
            ],
            resources: ["adapter", "forcer", "reparer"],
        },
    },
    {
        id: 8,
        title: "Repérage sur Europe",
        text: "Après 6 ans de voyage, vous vous installez enfin en orbite d’Europe. Depuis la Terre, nous n’avons pu qu’estimer les conditions à la surface et dans les profondeurs d’Europe. Afin d’adapter vos plans à la réalité de terrain, envoyez une flotte robotique d’exploration.",
        4: {
            bonuses: [
                {
                    id: "MECA_bonus2",
                    title: "Robots mous adaptés à l’exploration",
                    text: "Des robots mous spécialisés dans la collecte de données topographiques et climatiques vous facilitera la collecte de données.",
                    replacement: "forcer"
                },
            ],
            resources: ["adapter"],
        },
        6: {
            bonuses: [
                {
                    id: "MECA_bonus2",
                    title: "Robots mous adaptés à l’exploration",
                    text: "Des robots mous spécialisés dans la collecte de données topographiques et climatiques vous facilitera la collecte de données.",
                    replacement: "forcer"
                },
            ],
            resources: ["adapter", "forcer"],
        },
    }
]
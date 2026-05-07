import {StepData} from "@/types/StepData";

export const stepsData: StepData[] = [
    {
        id: 1,
        title: "Décollage de la Terre",
        text: "Mobilisez les ressources nécessaires pour assurer un décollage stable et sécurisé pour votre vaisseau de 142 mètres de haut et de plus de 5200 tonnes. Un véritable défi technique.",
        4: {
            bonuses: [],
            resources: ["preparer", "forcer"],
        },
        6: {
            bonuses: [
                {
                    id: "COOP_bonus1",
                    title: "Intelligence artificielle de supervision d’IA",
                    text: "Un système de coordination des IA optimise la répartition de l’énergie et la priorisation des tâches.",
                    replacements: ["forcer", "anticiper"]
                }
            ],
            resources: ["preparer", "forcer"],
        }
    },
    {
        id: 2,
        title: "Assistance gravitationnelle",
        text: "Pour atteindre Europe en six ans, vous devez atteindre la vitesse de 72 000 km/h. Utilisez la manœuvre la moins couteuse en exploitant l’attraction de Vénus : une assistance gravitationnelle. Ajustez votre trajectoire malgré la perte de communication avec la Terre.",
        4: {
            bonuses: [],
            resources: ["anticiper", "preparer"],
        },
        6: {
            bonuses: [
                {
                    id: "COOP_bonus2",
                    title: "Centre de commandement virtuel embarqué",
                    text: "Un centre de commandement embarqué vous aide à prendre des décisions en autonomie, quand les communications avec la Terre sont impossibles ou trop longues.",
                }
            ],
            resources: ["anticiper", "preparer"],
        },
    },
    {
        id: 3,
        title: "Cargo de ressources vitales",
        text: "Sur votre trajectoire elliptique, vous repassez près de la Terre pour récupérer eau, de l’air et de la nourriture. Amarrez le cargo de ravitaillement à pleine vitesse.",
        4: {
            bonuses: [
                {
                    id: "MECA_bonus1",
                    title: "Pilotage en réalité virtuelle",
                    text: "Une interface de pilotage en réalité virtuelle améliore la précision des manœuvres.",
                }
            ],
            resources: ["anticiper", "forcer"],
        },
        6: {
            bonuses: [
                {
                    id: "MECA_bonus1",
                    title: "Pilotage en réalité virtuelle",
                    text: "Une interface de pilotage en réalité virtuelle améliore la précision des manœuvres.",
                }
            ],
            resources: ["anticiper", "forcer"],
        },
    },
    {
        id: 4,
        title: "Tempête solaire",
        text: "Une tempête solaire menace votre vaisseau. Ses puissantes radiations peuvent endommager les systèmes électroniques et mettre l’équipage en danger. Limitez les dégâts.",
        4: {
            bonuses: [
                {
                    id: "AERO_bonus1",
                    title: "Automatisation du bouclier magnétique",
                    text: "Un bouclier magnétique automatisé permet de dévier une partie des radiations.",
                    replacements: ["reparer", "anticiper"]
                },
                {
                    id: "EXPE_bonus1",
                    title: "Combinaison adaptative de sortie extravéhiculaire",
                    text: "Des combinaisons adaptées réduisent l’impact des radiations sur les astronautes.",
                    replacements: ["adapter"]
                },
            ],
            resources: ["reparer"],
        },
        6: {
            bonuses: [
                {
                    id: "AERO_bonus1",
                    title: "Automatisation du bouclier magnétique",
                    text: "Un bouclier magnétique automatisé permet de dévier une partie des radiations.",
                    replacements: ["reparer", "anticiper"]
                },
                {
                    id: "EXPE_bonus1",
                    title: "Combinaison adaptative de sortie extravéhiculaire",
                    text: "Des combinaisons adaptées réduisent l’impact des radiations sur les astronautes.",
                    replacements: ["adapter", "preparer"]
                },
            ],
            resources: ["adapter", "reparer"],
        },
    },
    {
        id: 5,
        title: "Ceinture d’astéroïdes",
        text: "Vous arrivez aux abords de la ceinture d’astéroïdes. Pour la traverser, vous éviterez facilement les gros astéroïdes, mais les plus petits sont imprévisibles. Limitez les impacts et réparez rapidement les dégâts.",
        4: {
            bonuses: [
                {
                    id: "EXPE_bonus2",
                    title: "Cobot d’exploration",
                    text: "Les cobots assistent les astronautes dans les réparations internes.",
                    replacements: ["adapter", "forcer"]
                },
                {
                    id: "AERO_bonus2",
                    title: "Bras robotisé autonome de réparation",
                    text: "Un bras robotisé autonome permet de réparer les dégâts externes.",
                    replacements: ["preparer"]
                },
            ],
            resources: ["forcer", "anticiper"],
        },
        6: {
            bonuses: [
                {
                    id: "EXPE_bonus2",
                    title: "Cobot d’exploration",
                    text: "Les cobots assistent les astronautes dans les réparations internes.",
                    replacements: ["adapter", "forcer"]
                },
                {
                    id: "AERO_bonus2",
                    title: "Bras robotisé autonome de réparation",
                    text: "Un bras robotisé autonome permet de réparer les dégâts externes.",
                    replacements: ["anticiper", "reparer"]
                },
            ],
            resources: ["forcer", "anticiper"],
        },
    },
    {
        id: 6,
        title: "Tensions sociales",
        text: "Après plusieurs années de voyage en milieu confiné, des tensions apparaissent au sein de l’équipage. La coordination devient difficile. Restaurez la cohésion et maintenez une collaboration efficace.",
        4: {
            bonuses: [
                {
                    id: "GECO_bonus1",
                    title: "Plantes utiles au bien-être de l’équipage",
                    text: "Un environnement végétalisé ainsi qu’une alimentation de qualité améliore le moral de l’équipage et apaise les tensions.",
                    replacements: ["preparer"]
                },
            ],
            resources: ["preparer", "adapter"],
        },
        6: {
            bonuses: [
                {
                    id: "MEDI_bonus1",
                    title: "Activités collectives pour la cohésion de groupe",
                    text: "Des dispositifs favorisant les interactions sociales, compte tenu des préférences de chacun, aident à apaiser les tensions sociales et à recréer du lien.",
                    replacements: ["adapter", "anticiper"]
                },
                {
                    id: "GECO_bonus1",
                    title: "Plantes utiles au bien-être de l’équipage",
                    text: "Un environnement végétalisé ainsi qu’une alimentation de qualité améliore le moral de l’équipage et apaise les tensions.",
                    replacements: ["reparer", "preparer"]
                },
            ],
            resources: ["preparer", "adapter"],
        },
    },
    {
        id: 7,
        title: "Déséquilibre écologique",
        text: "Après des années de recyclage biologique continu, l’environnement du vaisseau se déséquilibre : air, eau et micro-organismes (maladies) deviennent instables. Rétablissez des conditions viables pour la survie.",
        4: {
            bonuses: [
                {
                    id: "GECO_bonus2",
                    title: "Système mécanique de recyclage de secours",
                    text: "Un système de recyclage mécanique complète les systèmes biologiques existants.",
                    replacements: ["anticiper", "reparer"]
                }
            ],
            resources: ["reparer", "adapter"],
        },
        6: {
            bonuses: [
                {
                    id: "GECO_bonus2",
                    title: "Système mécanique de recyclage de secours",
                    text: "Un système de recyclage mécanique complète les systèmes biologiques existants.",
                    replacements: ["anticiper", "reparer"]
                },
                {
                    id: "MEDI_bonus2",
                    title: "Suivi des souches bactériennes",
                    text: "Un système de surveillance sanitaire permet d’anticiper les risques biologiques.",
                    replacements: ["adapter","preparer"]
                },
            ],
            resources: ["reparer", "forcer"],
        },
    },
    {
        id: 8,
        title: "Repérage sur Europe",
        text: "Après six ans de voyage, vous atteignez l’orbite d’Europe. Vérifiez-y les conditions réelles avant toute exploration et adaptez votre mission.",
        4: {
            bonuses: [
                {
                    id: "MECA_bonus2",
                    title: "Robots mous adaptés à l’exploration",
                    text: "Des robots spécialisés facilitent l’exploration et la collecte de données topographiques et climatiques.",
                    replacements: ["forcer"]
                },
            ],
            resources: ["adapter"],
        },
        6: {
            bonuses: [
                {
                    id: "MECA_bonus2",
                    title: "Robots mous adaptés à l’exploration",
                    text: "Des robots spécialisés facilitent l’exploration et la collecte de données topographiques et climatiques.",
                    replacements: ["reparer","forcer"]
                },
            ],
            resources: ["adapter", "forcer"],
        },
    }
]
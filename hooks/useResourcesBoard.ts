import {useCallback, useMemo, useState} from "react";
import { TeamResources } from "@/types/TeamsResources";

const RESOURCE_ICONS = [
    "/badges/resources/energies.svg",
    "/badges/resources/human.svg",
    "/badges/resources/clock.svg",
] as const;

function getTotalResources(teams: Record<string, TeamResources>) {
    return Object.values(teams).reduce(
        (acc, team) => ({
            ENERGY: acc.ENERGY + Math.floor((team.resources.ENERGY ?? 0) / 3),
            HUMAN: acc.HUMAN + (team.resources.HUMAN ?? 0),
            CLOCK: acc.CLOCK + (team.resources.CLOCK ?? 0),
        }),
        { ENERGY: 0, HUMAN: 0, CLOCK: 0 }
    );
}

function getTeamDetails(team: TeamResources) {
    const human = team.resources?.HUMAN ?? 0;
    const clock = team.resources?.CLOCK ?? 0;
    const energy = Math.floor((team.resources?.ENERGY ?? 0) / 3);
    return { human, clock, energy, total: human + clock + energy };
}

export function getScoreTable(teams: Record<string, TeamResources>) {
    const rows = Object.entries(teams).map(([name, team]) => ({
        name,
        ...getTeamDetails(team),
    }));
    const average = rows.reduce((acc, r) => acc + r.total, 0) / rows.length;
    return { rows, average };
}

export function useResourcesBoard(teamsResources: Record<string, TeamResources> | undefined) {
    const [index, setIndex] = useState(0);

    const teamKeys = useMemo(
        () => teamsResources ? ["ÉQUIPAGE COMPLET", ...Object.keys(teamsResources)] : [],
        [teamsResources]
    );

    const isGlobal = teamKeys[index] === "ÉQUIPAGE COMPLET";

    const rawResources = useMemo(() => {
        if (!teamsResources) return undefined;
        return isGlobal
            ? getTotalResources(teamsResources)
            : teamsResources[teamKeys[index]]?.resources;
    }, [teamsResources, isGlobal, teamKeys, index]);

    const resourceItems = useMemo(() =>
            RESOURCE_ICONS.map((icon, i) => {
                const values = [
                    isGlobal
                        ? rawResources?.ENERGY
                        : Math.floor((rawResources?.ENERGY ?? 0) / 3),
                    rawResources?.HUMAN ?? 0,
                    rawResources?.CLOCK ?? 0,
                ];
                return { icon, value: values[i] };
            }),
        [rawResources, isGlobal]
    );

    const prev = useCallback(() => setIndex((i) => (i - 1 + teamKeys.length) % teamKeys.length), [teamKeys.length]);
    const next = useCallback(() => setIndex((i) => (i + 1) % teamKeys.length), [teamKeys.length]);

    return { teamKeys, index, isGlobal, resourceItems, prev, next };
}
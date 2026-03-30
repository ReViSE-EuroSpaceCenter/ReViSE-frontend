import {TeamData, TeamsFullProgression} from "@/types/TeamData";

export function getTeamsColumns(gameData?: TeamsFullProgression) {
    if (!gameData) return { leftTeams: [], rightTeams: [] };

    const teamsData: TeamData[] = Object.entries(gameData.teamsFullProgression)
        .map(([team, data], index) => ({
            id: index,
            team,
            ...data.teamProgressionDTO,
        }));

    const half = Math.ceil(teamsData.length / 2);

    return {
        leftTeams: teamsData.slice(0, half),
        rightTeams: teamsData.slice(half),
    };
}
import React from "react";
import { screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "@/app/teacher/game/[gameId]/page";
import { getTeamsFullProgression } from "@/api/missionApi";
import { renderPage } from "@/test/utils/renderPage";

// ---------- Navigation mocks ----------
vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABCDEF" }),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    usePathname: () => "/teacher/game/ABCDEF",
    useSearchParams: () => ({ get: vi.fn(() => null) }),
}));

// ---------- API mocks ----------
vi.mock("@/api/missionApi", () => ({
    getTeamsFullProgression: vi.fn(),
    endMission: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

// ---------- WebSocket mock ----------
let missionWsCallback: ((event: any) => void) | undefined;
let launcherWsCallback: ((event: any) => void) | undefined;

vi.mock("@/hooks/useWSSubscription", () => ({
    useWSSubscription: (channel: string, callback: (event: any) => void) => {
        if (channel === "mission") missionWsCallback = callback;
        if (channel === "launcher") launcherWsCallback = callback;
    },
}));

// ---------- Component mocks ----------
vi.mock("@/components/teacher/TeamsColumn", () => ({
    default: ({ teams }: any) => (
      <div>
          {teams?.map((team: any) => (
            <div key={team.teamLabel}>
                SideRow-{team.teamLabel}-{team.classicMissionsCompleted}
            </div>
          ))}
      </div>
    ),
}));

vi.mock("@/utils/calculTeamColumn", () => ({
    getTeamsColumns: vi.fn((gameData) => {
        const entries = Object.values(gameData?.teamsFullProgression ?? {}) as any[];
        const teams = entries.map((e) => e.teamProgression);
        return { leftTeams: teams, rightTeams: [] };
    }),
}));

vi.mock("@/components/Toolbox", () => ({
    default: ({ centerAction }: any) => (
      <button
        data-testid="center-action-button"
        disabled={centerAction?.disabled}
        onClick={centerAction?.onClick}
      >
          {centerAction?.label}
      </button>
    ),
}));

vi.mock("@/components/Checklist", () => ({
    default: () => <div>Checklist</div>,
}));

vi.mock("@/components/IATech", () => ({
    default: () => <div>IATech</div>,
}));

vi.mock("@/components/teacher/MissionModal", () => ({
    default: () => <div>MissionModal</div>,
}));

// ---------- Fixtures ----------
const gameInfo = {
    allTeamsCompleted: false,
    teamsFullProgression: {
        MECA: {
            completedMissions: {},
            teamProgression: {
                teamLabel: "MECA",
                classicMissionsCompleted: 4,
                firstBonusMissionCompleted: false,
                secondBonusMissionCompleted: false,
            },
        },
    },
};

// ---------- Tests ----------
describe("Dashboard websocket", async () => {
    beforeEach(() => {
        vi.clearAllMocks();
        missionWsCallback = undefined;
        launcherWsCallback = undefined;
        vi.mocked(getTeamsFullProgression).mockResolvedValue(gameInfo as any);
    });

    await act(async () => {
        missionWsCallback?.({
            type: "TEAM_PROGRESSION",
            payload: {
                teamProgressionDTO: {
                    teamLabel: "MECA",
                    classicMissionsCompleted: 6,
                    firstBonusMissionCompleted: true,
                    secondBonusMissionCompleted: false,
                    allTeamsMissionsCompleted: false,
                },
                allTeamsMissionsCompleted: false,
            },
        });
    });

    it("ignore les événements websocket qui ne sont pas TEAM_PROGRESSION", async () => {
        renderPage(<Dashboard />);

        expect(await screen.findByText("SideRow-MECA-4")).toBeInTheDocument();

        await act(async () => {
            missionWsCallback?.({
                type: "UNKNOWN_EVENT",
                payload: {},
            });
        });

        expect(screen.getByText("SideRow-MECA-4")).toBeInTheDocument();
        expect(screen.queryByText("SideRow-MECA-6")).not.toBeInTheDocument();
    });

    it("désactive le bouton de décollage quand toutes les équipes n'ont pas terminé", async () => {
        renderPage(<Dashboard />);

        const button = await screen.findByTestId("center-action-button");
        expect(button).toBeDisabled();
    });
});
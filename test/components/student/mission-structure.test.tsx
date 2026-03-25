import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MissionStructure } from "@/components/mission/MissionStructure";
import { showError } from "@/errors/getErrorMessage";
import { changeTeamMissionState } from "@/api/missionApi";
import { getProjectMissionsToUpdate } from "@/utils/missionUpdate";

// ---------- Mocks ----------
const mockUseMissionContext = vi.fn();
const mockMissionNameTraduction = vi.fn();
const mockGetBonusMissionModalMessage = vi.fn();
const mockGetClassicMissionModalMessage = vi.fn();

vi.mock("@/contexts/MissionContext", () => ({
    useMissionContext: () => mockUseMissionContext(),
}));

vi.mock("@/api/missionApi", () => ({
    changeTeamMissionState: vi.fn(),
}));

vi.mock("@/utils/missionName", () => ({
    missionNameTraduction: (...args: unknown[]) => mockMissionNameTraduction(...args),
}));

vi.mock("@/utils/missionUpdate", () => ({
    getProjectMissionsToUpdate: vi.fn(),
}));

vi.mock("@/utils/missionButtonMessage", () => ({
    getBonusMissionModalMessage: (...args: unknown[]) =>
        mockGetBonusMissionModalMessage(...args),
    getClassicMissionModalMessage: (...args: unknown[]) =>
        mockGetClassicMissionModalMessage(...args),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/api/apiError", () => ({
    ApiError: class ApiError extends Error {
        key: string;

        constructor(key: string) {
            super(key);
            this.key = key;
        }
    },
}));

vi.mock("@/components/mission/MissionButton", () => ({
    MissionButton: ({
                        mission,
                        isUnlocked,
                        teamColor,
                        textColorClass,
                        onClick,
                        isCompleted,
                    }: {
        mission: { id: string };
        isUnlocked: boolean;
        teamColor: string;
        textColorClass: string;
        onClick: () => void;
        isCompleted: boolean;
    }) => (
        <button
            data-testid={`mission-button-${mission.id}`}
            data-unlocked={String(isUnlocked)}
            data-team-color={teamColor}
            data-text-color={textColorClass}
            data-completed={String(isCompleted)}
            onClick={onClick}
        >
            mission-{mission.id}
        </button>
    ),
}));

vi.mock("@/components/mission/ValidationMission", () => ({
    ValidationMissionModal: ({
                                 isOpen,
                                 message,
                                 onConfirm,
                                 onCancel,
                             }: {
        isOpen: boolean;
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
    }) =>
        isOpen ? (
            <div data-testid="validation-modal">
                <span>{message}</span>
                <button onClick={onConfirm}>confirmer</button>
                <button onClick={onCancel}>annuler</button>
            </div>
        ) : null,
}));

// ---------- Helpers ----------
function renderComponent(
    overrides?: Partial<React.ComponentProps<typeof MissionStructure>>
) {
    const missionMap = {
        1: { id: "CLASSIC_1", bonus: false, unlocks: [2], projectId: 1 },
        2: { id: "CLASSIC_2", bonus: false, unlocks: [], projectId: 1 },
        3: { id: "BONUS_1", bonus: true, unlocks: [], projectId: 1 },
        4: { id: "BONUS_2", bonus: true, unlocks: [], projectId: 1 },
        5: { id: "CLASSIC_PARENT", bonus: false, unlocks: [2, 3], projectId: 1 },
    };

    const defaultProps: React.ComponentProps<typeof MissionStructure> = {
        mission: missionMap[1] as any,
        missionMap: missionMap as any,
        isBonus1Completed: false,
        isBonus2Completed: false,
        completedMissions: {
            CLASSIC_1: true,
            CLASSIC_2: false,
            CLASSIC_PARENT: false,
        },
        onMissionUpdated: vi.fn().mockResolvedValue(undefined),
        isUnlocked: true,
    };

    return render(<MissionStructure {...defaultProps} {...overrides} />);
}

// ---------- Tests ----------
describe("MissionStructure coverage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseMissionContext.mockReturnValue({
            lobbyCode: "LOBBY123",
            clientId: "CLIENT123",
            teamColor: "#ff0000",
            teamName: "MECA",
        });

        mockMissionNameTraduction.mockImplementation((mission: { id: string }) => mission.id);
        mockGetBonusMissionModalMessage.mockImplementation(
            (isCompleted: boolean) => `bonus-message-${isCompleted}`
        );
        mockGetClassicMissionModalMessage.mockImplementation(
            (isCompleted: boolean) => `classic-message-${isCompleted}`
        );

        (getProjectMissionsToUpdate as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
            "CLASSIC_1",
        ]);
        (changeTeamMissionState as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
            undefined
        );

        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: vi.fn(() => "HOST123"),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });
    });


    it("calcule isCompleted pour BONUS_2", () => {
        renderComponent({
            mission: { id: "BONUS_2", bonus: true, unlocks: [], projectId: 1 } as any,
            isBonus2Completed: true,
        });

        expect(screen.getAllByTestId("mission-button-BONUS_2")[0]).toHaveAttribute(
            "data-completed",
            "true"
        );
    });


    it("confirme la mission en mode client si hostId est absent", async () => {
        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: vi.fn(() => null),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });

        const onMissionUpdated = vi.fn().mockResolvedValue(undefined);

        renderComponent({ onMissionUpdated });

        fireEvent.click(screen.getAllByTestId("mission-button-CLASSIC_1")[0]);
        fireEvent.click(screen.getByText("confirmer"));

        await waitFor(() => {
            expect(changeTeamMissionState).toHaveBeenCalledWith(
                "LOBBY123",
                "CLIENT123",
                ["CLASSIC_1"],
                undefined
            );
            expect(onMissionUpdated).toHaveBeenCalledWith(["CLASSIC_1"]);
        });
    });

    it("appelle showError avec la key ApiError en cas d'échec API", async () => {
        const { ApiError } = await import("@/api/apiError");

        (changeTeamMissionState as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
            new ApiError("MISSION_UPDATE_ERROR")
        );

        renderComponent();

        fireEvent.click(screen.getAllByTestId("mission-button-CLASSIC_1")[0]);
        fireEvent.click(screen.getByText("confirmer"));

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith("MISSION_UPDATE_ERROR");
        });
    });

    it("appelle showError avec une chaîne vide si l'erreur n'est pas une ApiError", async () => {
        (changeTeamMissionState as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error("boom")
        );

        renderComponent();

        fireEvent.click(screen.getAllByTestId("mission-button-CLASSIC_1")[0]);
        fireEvent.click(screen.getByText("confirmer"));

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith("");
        });
    });


    it("rend plusieurs enfants quand unlocks contient plusieurs missions", () => {
        renderComponent({
            mission: {
                id: "CLASSIC_PARENT",
                bonus: false,
                unlocks: [2, 3],
                projectId: 1,
            } as any,
            completedMissions: {
                CLASSIC_PARENT: true,
                CLASSIC_2: false,
            },
            isBonus1Completed: false,
        });

        expect(screen.getAllByTestId("mission-button-CLASSIC_2")[0]).toBeInTheDocument();
        expect(screen.getAllByTestId("mission-button-BONUS_1")[0]).toBeInTheDocument();
    });

});
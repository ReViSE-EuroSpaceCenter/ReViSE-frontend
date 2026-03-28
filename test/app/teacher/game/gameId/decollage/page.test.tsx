import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DecollagePage from "@/app/teacher/game/[gameId]/decollage/page";
import { useQuery } from "@tanstack/react-query";
import { getGameInfo } from "@/api/missionApi";
import { showError } from "@/errors/getErrorMessage";
import { ApiError } from "@/api/apiError";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    useParams: () => ({
        gameId: "ABC123",
    }),
    useSearchParams: () => ({
        get: (key: string) => (key === "utm" ? "6" : null),
    }),
}));

vi.mock("@tanstack/react-query", () => ({
    useQuery: vi.fn(),
}));

vi.mock("@/api/missionApi", () => ({
    getGameInfo: vi.fn(),
}));

vi.mock("@/errors/getErrorMessage", () => ({
    showError: vi.fn(),
}));

vi.mock("@/components/decollage/bonusCard", () => ({
    default: ({ bonus, label, text }: any) => (
        <div data-testid={`bonus-card-${bonus.key}`}>
            <span>{label}</span>
            <span>{bonus.alt}</span>
            <span>{bonus.completed ? "completed" : "not-completed"}</span>
            {bonus.substitute && (
                <span data-testid={`bonus-substitute-${bonus.key}`}>
                    {bonus.substitute.type}
                    {bonus.substitute.quantity
                        ? `:${bonus.substitute.quantity}`
                        : ""}
                </span>
            )}
            {text && <span>{text}</span>}
        </div>
    ),
}));

vi.mock("@/components/decollage/resourceCard", () => ({
    default: ({ image, label, alt }: any) => (
        <div data-testid={`resource-card-${label}`}>
            <span>{label}</span>
            <span>{alt}</span>
            <span>{image}</span>
        </div>
    ),
}));

vi.mock("@/components/mission/ValidationMission", () => ({
    ValidationMissionModal: ({
                                 title,
                                 message,
                                 isOpen,
                                 onConfirm,
                                 onCancel,
                             }: any) =>
        isOpen ? (
            <div data-testid="validation-modal">
                <span>{title}</span>
                <span>{message}</span>
                <button onClick={onCancel}>mock-cancel</button>
                <button onClick={onConfirm}>mock-confirm</button>
            </div>
        ) : null,
}));

vi.mock("@/app/loading", () => ({
    default: () => <div>Loading...</div>,
}));

const mockedUseQuery = vi.mocked(useQuery);
const mockedGetGameInfo = vi.mocked(getGameInfo);
const mockedShowError = vi.mocked(showError);

function getUseQueryOptions() {
    const firstCall = mockedUseQuery.mock.calls[0];
    expect(firstCall).toBeDefined();

    return firstCall[0] as {
        queryKey: [string, string];
        queryFn: () => Promise<unknown>;
        enabled: boolean;
        staleTime: number;
    };
}

describe("DecollagePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("queryFn appelle showError et relance l'erreur pour une ApiError", async () => {
        mockedUseQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        } as any);

        const error = new ApiError("TEST_KEY");
        mockedGetGameInfo.mockRejectedValue(error);

        render(<DecollagePage />);

        const useQueryArg = getUseQueryOptions();

        let caughtError: unknown;
        try {
            await useQueryArg.queryFn();
        } catch (e) {
            caughtError = e;
        }

        expect(caughtError).toBe(error);
        expect(mockedShowError).toHaveBeenCalledTimes(1);
        expect(mockedShowError).toHaveBeenCalledWith(
            "TEST_KEY",
            "Erreur lors de la récupération des données"
        );
    });

    it("ferme la modal quand on clique sur cancel", () => {
        mockedUseQuery.mockReturnValue({
            data: {
                allTeamsCompleted: false,
                teamsProgression: {},
            },
            isLoading: false,
            isError: false,
        } as any);

        render(<DecollagePage />);

        fireEvent.click(screen.getByRole("button", { name: "Valider l’étape" }));
        expect(screen.getByTestId("validation-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "mock-cancel" }));

        expect(screen.queryByTestId("validation-modal")).not.toBeInTheDocument();
    });

    it("ferme la modal et navigue vers /teacher/game/[gameId] quand on confirme", () => {
        mockedUseQuery.mockReturnValue({
            data: {
                allTeamsCompleted: false,
                teamsProgression: {},
            },
            isLoading: false,
            isError: false,
        } as any);

        render(<DecollagePage />);

        fireEvent.click(screen.getByRole("button", { name: "Valider l’étape" }));
        fireEvent.click(screen.getByRole("button", { name: "mock-confirm" }));

        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith("/teacher/game/ABC123");
        expect(screen.queryByTestId("validation-modal")).not.toBeInTheDocument();
    });

    it("affiche le loading pendant le chargement", () => {
        mockedUseQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        } as any);

        render(<DecollagePage />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
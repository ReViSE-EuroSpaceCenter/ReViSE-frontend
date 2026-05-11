import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import Launcher from "@/app/teacher/game/[gameId]/launcher/page";
import { endLauncher } from "@/api/launcherApi";
import { endResourceEncoding } from "@/api/resourcesApi";

// ----------------- Mocks -----------------

vi.mock("next/dynamic", () => ({
    default: (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
        let Component: React.ComponentType<any> | null = null;
        importFn().then((mod) => { Component = mod.default; });
        return (props: any) => (Component ? <Component {...props} /> : null);
    },
}));

const replaceMock = vi.fn();
const pushMock = vi.fn();

let stepValue: string | null = null;
let presentationValue: string | null = null;

vi.mock("next/navigation", () => ({
    useParams: () => ({ gameId: "ABC123" }),
    useRouter: () => ({ replace: replaceMock, push: pushMock }),
    usePathname: () => "/launcher",
    useSearchParams: () => ({
        get: (key: string) => {
            if (key === "step") return stepValue;
            if (key === "presentation") return presentationValue;
            return null;
        },
    }),
}));

let mockGameData: any = {
    teamsFullProgression: {
        MECA: { teamProgression: {} },
        AERO: { teamProgression: {} },
        EXPE: { teamProgression: {} },
        GECO: { teamProgression: {} },
    },
};

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
        "@tanstack/react-query"
    );
    return {
        ...actual,
        useQuery: vi.fn(() => ({ data: mockGameData })),
        useQueryClient: () => ({ setQueryData: vi.fn() }),
    };
});

let wsCallback: ((event: any) => void) | null = null;

vi.mock("@/hooks/useWSSubscription", () => ({
    useWSSubscription: vi.fn((_channel: string, cb: (event: any) => void) => {
        wsCallback = cb;
    }),
}));

vi.mock("@/api/launcherApi", () => ({
    getTeamsInfo: vi.fn(),
    endLauncher: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/api/resourcesApi", () => ({
    endResourceEncoding: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/components/launcher/LauncherBackground", () => ({
    default: () => <div data-testid="background" />,
}));

vi.mock("@/components/launcher/LauncherPath", () => ({
    default: ({ step, onStepAnimationComplete }: any) => (
        <div>
            <span data-testid="step">{step}</span>
            <button onClick={onStepAnimationComplete}>next-step</button>
        </div>
    ),
}));

vi.mock("@/components/teacher/ResourceModal", () => ({
    default: ({ isOpen, allResourcesSubmitted, onConfirm }: any) =>
        isOpen ? (
            <div data-testid="resource-modal" data-all-submitted={String(allResourcesSubmitted)}>
                <button onClick={onConfirm}>Confirmer ressources</button>
            </div>
        ) : null,
}));

vi.mock("@/components/PresentationModal", () => ({
    default: ({ isOpen, name, onClose, setIsOpen }: any) =>
        isOpen ? (
            <div data-testid="presentation-modal" data-name={name}>
                <button onClick={onClose}>Continuer</button>
                <button onClick={() => setIsOpen(false)}>Fermer</button>
            </div>
        ) : null,
}));

// ----------------- Helper -----------------

function renderLauncher() {
    let result: ReturnType<typeof render> = undefined!;
    act(() => {
        result = render(<Launcher />);
    });
    return result;
}

// ----------------- Tests -----------------

describe("Launcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        stepValue = null;
        presentationValue = null;
        wsCallback = null;
        sessionStorage.setItem("hostId", "host-42");
        mockGameData = {
            teamsFullProgression: {
                MECA: { teamProgression: {} },
                AERO: { teamProgression: {} },
                EXPE: { teamProgression: {} },
                GECO: { teamProgression: {} },
            },
        };
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ─── Rendu de base ────────────────────────────────────────────────────────

    describe("Rendu de base", () => {
        it("affiche le background et le path", () => {
            renderLauncher();
            expect(screen.getByTestId("background")).toBeInTheDocument();
            expect(screen.getByTestId("step")).toBeInTheDocument();
        });

        it("utilise step=0 par défaut si absent", () => {
            renderLauncher();
            expect(screen.getByTestId("step").textContent).toBe("0");
        });

        it("utilise le step depuis les query params", () => {
            stepValue = "3";
            renderLauncher();
            expect(screen.getByTestId("step").textContent).toBe("3");
        });

        it("retombe à 0 si step est invalide", () => {
            stepValue = "abc";
            renderLauncher();
            expect(screen.getByTestId("step").textContent).toBe("0");
        });

        it("n'affiche pas la ResourceModal si step != 9", () => {
            stepValue = "1";
            renderLauncher();
            expect(screen.queryByTestId("resource-modal")).not.toBeInTheDocument();
        });

        it("n'affiche pas la PresentationModal si presentation != true", () => {
            stepValue = "1";
            renderLauncher();
            expect(screen.queryByTestId("presentation-modal")).not.toBeInTheDocument();
        });
    });

    // ─── Navigation / step ───────────────────────────────────────────────────

    describe("Navigation / step", () => {
        it("met à jour l'URL quand l'animation est terminée", () => {
            vi.useFakeTimers();
            stepValue = "2";
            renderLauncher();

            fireEvent.click(screen.getByText("next-step"));
            act(() => { vi.advanceTimersByTime(800); });

            expect(replaceMock).toHaveBeenCalledWith("/launcher/2");
        });

        it("ne redirige pas avant 800ms", () => {
            vi.useFakeTimers();
            stepValue = "2";
            renderLauncher();

            fireEvent.click(screen.getByText("next-step"));
            act(() => { vi.advanceTimersByTime(799); });

            expect(replaceMock).not.toHaveBeenCalled();
        });

        it("utilise le step courant dans l'URL de redirection", () => {
            vi.useFakeTimers();
            stepValue = "5";
            renderLauncher();

            fireEvent.click(screen.getByText("next-step"));
            act(() => { vi.advanceTimersByTime(800); });

            expect(replaceMock).toHaveBeenCalledWith("/launcher/5");
        });
    });

    // ─── PresentationModal ───────────────────────────────────────────────────

    describe("PresentationModal", () => {
        it("affiche la modale si presentation=true", () => {
            presentationValue = "true";
            renderLauncher();
            expect(screen.getByTestId("presentation-modal")).toBeInTheDocument();
        });

        it("affiche name='IA' sur la première slide", () => {
            presentationValue = "true";
            renderLauncher();
            expect(screen.getByTestId("presentation-modal")).toHaveAttribute("data-name", "IA");
        });

        it("passe à la slide LAUNCHER après Continuer", async () => {
            presentationValue = "true";
            renderLauncher();

            await userEvent.click(screen.getByRole("button", { name: /continuer/i }));

            await waitFor(() => {
                expect(screen.getByTestId("presentation-modal")).toHaveAttribute("data-name", "LAUNCHER");
            });
        });

        it("redirige vers step=1 après la dernière slide", async () => {
            presentationValue = "true";
            renderLauncher();

            await userEvent.click(screen.getByRole("button", { name: /continuer/i })); // IA
            await userEvent.click(screen.getByRole("button", { name: /continuer/i })); // LAUNCHER

            expect(replaceMock).toHaveBeenCalledWith("/launcher?step=1");
        });

        it("ferme la modale via setIsOpen sans déclencher la navigation", async () => {
            presentationValue = "true";
            renderLauncher();

            await userEvent.click(screen.getByRole("button", { name: /fermer/i }));

            expect(screen.queryByTestId("presentation-modal")).not.toBeInTheDocument();
            expect(replaceMock).not.toHaveBeenCalled();
        });

        it("n'affiche pas la modale si presentation=false", () => {
            presentationValue = "false";
            renderLauncher();
            expect(screen.queryByTestId("presentation-modal")).not.toBeInTheDocument();
        });
    });

    // ─── ResourceModal (step=9) ───────────────────────────────────────────────

    describe("ResourceModal (step=9)", () => {
        beforeEach(() => {
            stepValue = "9";
        });

        it("affiche la ResourceModal quand step=9", () => {
            renderLauncher();
            expect(screen.getByTestId("resource-modal")).toBeInTheDocument();
        });

        it("passe allResourcesSubmitted=false initialement", () => {
            renderLauncher();
            expect(screen.getByTestId("resource-modal")).toHaveAttribute("data-all-submitted", "false");
        });

        it("appelle endLauncher avec le bon lobbyCode et hostId", async () => {
            renderLauncher();
            await waitFor(() => {
                expect(endLauncher).toHaveBeenCalledWith("ABC123", "host-42");
            });
        });
    });

    // ─── WebSocket ────────────────────────────────────────────────────────────

    describe("WebSocket", () => {
        beforeEach(() => {
            stepValue = "9";
        });

        it("ignore les événements dont le type n'est pas RESOURCE_UPDATED", () => {
            renderLauncher();

            act(() => {
                wsCallback!({ type: "OTHER_EVENT", payload: { teamLabel: "MECA" } });
            });

            expect(screen.getByTestId("resource-modal")).toHaveAttribute("data-all-submitted", "false");
        });

        it("met allResourcesSubmitted à true quand toutes les équipes ont soumis", async () => {
            renderLauncher();

            act(() => {
                for (const team of ["MECA", "AERO", "EXPE", "GECO"]) {
                    wsCallback!({ type: "RESOURCE_UPDATED", payload: { teamLabel: team } });
                }
            });

            await waitFor(() => {
                expect(screen.getByTestId("resource-modal")).toHaveAttribute("data-all-submitted", "true");
            });
        });

        it("ne considère pas les doublons comme des équipes distinctes", () => {
            renderLauncher();

            act(() => {
                wsCallback!({ type: "RESOURCE_UPDATED", payload: { teamLabel: "MECA" } });
                wsCallback!({ type: "RESOURCE_UPDATED", payload: { teamLabel: "MECA" } });
            });

            expect(screen.getByTestId("resource-modal")).toHaveAttribute("data-all-submitted", "false");
        });
    });

    // ─── handleEndResources ───────────────────────────────────────────────────

    describe("handleEndResources", () => {
        beforeEach(() => {
            stepValue = "9";
        });

        it("appelle endResourceEncoding et redirige si toutes les équipes ont soumis", async () => {
            renderLauncher();

            act(() => {
                for (const team of ["MECA", "AERO", "EXPE", "GECO"]) {
                    wsCallback!({ type: "RESOURCE_UPDATED", payload: { teamLabel: team } });
                }
            });

            await waitFor(() => {
                expect(screen.getByTestId("resource-modal")).toHaveAttribute("data-all-submitted", "true");
            });

            await userEvent.click(screen.getByRole("button", { name: /confirmer ressources/i }));

            await waitFor(() => {
                expect(endResourceEncoding).toHaveBeenCalledWith("ABC123", "host-42");
                expect(pushMock).toHaveBeenCalledWith("/teacher/game/ABC123/discover");
            });
        });

        it("n'appelle pas endResourceEncoding si les équipes n'ont pas toutes soumis", async () => {
            renderLauncher();

            await userEvent.click(screen.getByRole("button", { name: /confirmer ressources/i }));

            expect(endResourceEncoding).not.toHaveBeenCalled();
            expect(pushMock).not.toHaveBeenCalled();
        });

        it("n'appelle pas endResourceEncoding si seulement une partie a soumis", async () => {
            renderLauncher();

            act(() => {
                wsCallback!({ type: "RESOURCE_UPDATED", payload: { teamLabel: "MECA" } });
            });

            await userEvent.click(screen.getByRole("button", { name: /confirmer ressources/i }));

            expect(endResourceEncoding).not.toHaveBeenCalled();
        });
    });
});
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import Launcher from "@/app/teacher/game/[gameId]/launcher/page";

// ----------------- Mocks -----------------
const replaceMock = vi.fn();

let stepValue: string | null = null;
let presentationValue: string | null = null;

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: replaceMock }),
    usePathname: () => "/launcher",
    useSearchParams: () => ({
        get: (key: string) => {
            if (key === "step") return stepValue;
            if (key === "presentation") return presentationValue;
            return null;
        },
    }),
}));

// Mock des composants enfants
vi.mock("@/components/launcher/LauncherBackground", () => ({
    default: () => <div data-testid="background" />,
}));

vi.mock("@/components/launcher/LauncherPath", () => ({
    default: ({ step, onStepAnimationComplete }: any) => (
        <div>
            <span data-testid="step">{step}</span>
            <button onClick={onStepAnimationComplete}>
                next-step
            </button>
        </div>
    ),
}));

vi.mock("@/components/PresentationModal", () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div>Presentation ouverte</div> : null,
}));

// ----------------- Tests -----------------
describe("Launcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        stepValue = null;
        presentationValue = null;
    });

    describe("Rendu de base", () => {
        it("affiche le background et le path", () => {
            render(<Launcher />);

            expect(screen.getByTestId("background")).toBeInTheDocument();
            expect(screen.getByTestId("step")).toBeInTheDocument();
        });

        it("utilise step=0 par défaut si absent", () => {
            render(<Launcher />);
            expect(screen.getByTestId("step").textContent).toBe("0");
        });

        it("utilise le step depuis les query params", () => {
            stepValue = "3";
            render(<Launcher />);

            expect(screen.getByTestId("step").textContent).toBe("3");
        });

        it("retombe à 0 si step est invalide", () => {
            stepValue = "abc";
            render(<Launcher />);

            expect(screen.getByTestId("step").textContent).toBe("0");
        });
    });

    describe("Navigation / step", () => {
        it("incrémente le step et met à jour l'URL quand animation terminée", () => {
            stepValue = "2";
            render(<Launcher />);

            fireEvent.click(screen.getByText("next-step"));

            expect(replaceMock).toHaveBeenCalledWith("/launcher?step=3");
        });
    });
});
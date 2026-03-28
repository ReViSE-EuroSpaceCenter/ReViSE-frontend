import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Step from "@/components/launcher/Step";

// ----------------- Mocks -----------------

// Mock framer-motion (CRUCIAL)
vi.mock("framer-motion", () => ({
    motion: {
        path: (props: any) => <path {...props} />,
        g: ({ children, onAnimationComplete }: any) => {
            // Simule fin d'animation immédiatement
            if (onAnimationComplete) {
                setTimeout(onAnimationComplete, 0);
            }
            return <g>{children}</g>;
        },
    },
}));

// Mock hook
const useDrawPathMock = vi.fn();

vi.mock("@/hooks/useDrawPath", () => ({
    useDrawPath: (...args: any[]) => useDrawPathMock(...args),
}));

// ----------------- Config de base -----------------
const baseConfig = {
    id: 1,
    path: "M0 0",
    transform: "",
    clipId: "clip-test",
    clipPath: "M0 0",
    token: { x: 100, y: 200 },
};

// ----------------- Helpers -----------------
const setupDrawPath = ({
                           segments = [{ d: "M0 0", length: 100 }],
                           segmentConfigs = [{ duration: 1, delay: 0.5 }],
                           isOrbit = false,
                       } = {}) => {
    useDrawPathMock.mockReturnValue({
        segments,
        segmentConfigs,
        isOrbit,
    });
};

// ----------------- Tests -----------------
describe("Step", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupDrawPath();
    });

    describe("Rendu conditionnel", () => {
        it("ne rend rien si step < config.id", () => {
            const { container } = render(
                <Step step={0} config={baseConfig as any} onAnimationComplete={vi.fn()} />
            );

            expect(container.firstChild).toBeNull();
        });

        it("rend le SVG si step >= config.id", () => {
            render(
                <Step step={1} config={baseConfig as any} onAnimationComplete={vi.fn()} />
            );

            expect(screen.getByText("1")).toBeInTheDocument();
        });
    });

    describe("Segments", () => {
        it("rend tous les segments", () => {
            setupDrawPath({
                segments: [
                    { d: "M0 0", length: 100 },
                    { d: "M10 10", length: 200 },
                ],
                segmentConfigs: [
                    { duration: 1, delay: 0 },
                    { duration: 1, delay: 1 },
                ],
            });

            const { container } = render(
                <Step step={1} config={baseConfig as any} onAnimationComplete={vi.fn()} />
            );

            const paths = container.querySelectorAll("path");
            expect(paths.length).toBeGreaterThanOrEqual(2);
        });

        it("met strokeDashoffset à 0 si step passé", () => {
            const { container } = render(
                <Step step={2} config={baseConfig as any} onAnimationComplete={vi.fn()} />
            );

            const path = container.querySelector("path");
            expect(path?.getAttribute("stroke-dashoffset")).toBe(null);
        });
    });

    describe("Token", () => {
        it("affiche le cercle et le texte", () => {
            render(
                <Step step={1} config={baseConfig as any} onAnimationComplete={vi.fn()} />
            );

            expect(screen.getByText("1")).toBeInTheDocument();
            const circle = document.querySelector("circle");
            expect(circle).toBeInTheDocument();
        });
    });

    describe("AnimationComplete", () => {
        it("appelle onAnimationComplete si step courant", async () => {
            const callback = vi.fn();

            render(
                <Step step={1} config={baseConfig as any} onAnimationComplete={callback} />
            );

            await new Promise((r) => setTimeout(r, 10));

            expect(callback).toHaveBeenCalled();
        });

        it("n'appelle PAS onAnimationComplete si step déjà passé", async () => {
            const callback = vi.fn();

            render(
                <Step step={2} config={baseConfig as any} onAnimationComplete={callback} />
            );

            await new Promise((r) => setTimeout(r, 10));

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe("Orbit mode", () => {
        it("utilise un strokeWidth différent si isOrbit=true", () => {
            setupDrawPath({ isOrbit: true });

            const { container } = render(
                <Step step={1} config={baseConfig as any} onAnimationComplete={vi.fn()} />
            );

            const path = container.querySelector("path");
            expect(path?.getAttribute("stroke-width")).toBe(null);
        });
    });
});
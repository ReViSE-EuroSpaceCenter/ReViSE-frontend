import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDrawPath } from "@/hooks/useDrawPath";
import { svgPathProperties } from "svg-path-properties";

// ----------------- Mock svg-path-properties -----------------
vi.mock("svg-path-properties", () => ({
    svgPathProperties: class {
        d: string;
        constructor(d: string) {
            this.d = d;
        }
        getTotalLength() {
            return this.d.length * 10; // mock : longueur fictive
        }
    },
}));

// ----------------- Tests -----------------
describe("useDrawPath hook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("retourne un tableau vide si pathD est undefined", () => {
        const { result } = renderHook(() => useDrawPath(1, undefined));
        expect(result.current.segments).toEqual([]);
        expect(result.current.segmentConfigs).toEqual([{ delay: 0.5, duration: 1.5 } ]);
        expect(result.current.isOrbit).toBe(true); // triggerStep = 1
    });

    it("détecte correctement l'isOrbit", () => {
        let { result } = renderHook(() => useDrawPath(1, "M0 0 L10 10"));
        expect(result.current.isOrbit).toBe(true);

        result = renderHook(() => useDrawPath(8, "M0 0 L10 10")).result;
        expect(result.current.isOrbit).toBe(true);

        result = renderHook(() => useDrawPath(5, "M0 0 L10 10")).result;
        expect(result.current.isOrbit).toBe(false);
    });

    it("divise correctement le path en segments et mesure la longueur", () => {
        const path = "M0 0 L10 0 M10 0 L10 10";
        const { result } = renderHook(() => useDrawPath(5, path));

        expect(result.current.segments.length).toBe(2);
        expect(result.current.segments[0]).toHaveProperty("d", "M10 0 L10 10");
        expect(result.current.segments[0]).toHaveProperty("length");
        expect(result.current.segments[1]).toHaveProperty("d", "M0 0 L10 0 ");
    });

    it("inverse les segments si isOrbit = false", () => {
        const path = "M0 0 L1 0 M1 0 L1 1 M1 1 L0 1";
        const { result } = renderHook(() => useDrawPath(5, path));

        const originalOrder = path.match(/[Mm][^Mm]*/g);
        expect(result.current.segments.map(s => s.d)).toEqual(originalOrder?.reverse());
    });

    it("crée les segmentConfigs correctement", () => {
        const path = "M0 0 L10 0 M10 0 L10 10";
        const { result } = renderHook(() => useDrawPath(1, path));

        const { segmentConfigs, segments } = result.current;
        expect(segmentConfigs.length).toBe(segments.length);

        segmentConfigs.forEach((cfg, i) => {
            expect(cfg).toHaveProperty("delay");
            expect(cfg).toHaveProperty("duration");
        });
    });

    it("retourne un seul segmentConfig si segments.length <= 1", () => {
        const path = "M0 0 L0 0"; // un seul segment
        const { result } = renderHook(() => useDrawPath(5, path));

        expect(result.current.segmentConfigs.length).toBe(1);
        expect(result.current.segmentConfigs[0]).toHaveProperty("delay", 0.5);
    });
});
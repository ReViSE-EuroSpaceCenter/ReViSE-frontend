import { render, screen } from "@testing-library/react";
import BonusCard from "@/components/decollage/bonusCard";
import {describe, it, expect, vi} from "vitest";
vi.mock("next/image", () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        return <img {...props} />;
    },
}));

describe("BonusCard", () => {
    const baseBonus = {
        key: "coop1",
        image: "/badges/bonus/coop_bonus1.svg",
        completed: false,
        alt: "Badge mission bonus coop1",
    };

    it("shows energy reward images when bonus is completed and substitute is energy", () => {
        render(
            <BonusCard
                bonus={{
                    ...baseBonus,
                    completed: true,
                    substitute: {
                        type: "energy",
                        image: "/badges/decollage/energy.png",
                        quantity: 3,
                    },
                }}
                label="COOP"
            />
        );

        expect(screen.getByText("→")).toBeInTheDocument();
        expect(screen.getByAltText("Énergie 1")).toBeInTheDocument();
        expect(screen.getByAltText("Énergie 2")).toBeInTheDocument();
        expect(screen.getByAltText("Énergie 3")).toBeInTheDocument();
    });

});
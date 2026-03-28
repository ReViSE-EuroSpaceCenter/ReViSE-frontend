import { render, screen } from "@testing-library/react";
import ResourceCard from "@/components/decollage/resourceCard";
import {describe, it, expect, vi} from "vitest";
vi.mock("next/image", () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        return <img {...props} />;
    },
}));

describe("ResourceCard", () => {
    it("renders image and label", () => {
        render(
            <ResourceCard
                image="/badges/decollage/check.png"
                label="Check"
                alt="Check icon"
            />
        );

        expect(screen.getByText("Check")).toBeInTheDocument();

        const image = screen.getByAltText("Check icon");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", "/badges/decollage/check.png");
    });

});
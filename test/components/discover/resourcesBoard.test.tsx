import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResourcesBoard from "@/components/discover/ResourcesBoard";

const testState = vi.hoisted(() => {
    const showHintMock = vi.fn();
    const missionHeaderMock = vi.fn((props: any) => (
        <div data-testid="mission-header">{JSON.stringify(props)}</div>
    ));

    return {
        showHintMock,
        missionHeaderMock,
    };
});

vi.mock("next/image", () => ({
    default: (props: any) => {
        const { fill: _fill, ...imgProps } = props;
        return <img {...imgProps} />;
    },
}));

vi.mock("@/utils/alerts", () => ({
    showHint: testState.showHintMock,
}));

vi.mock("@/components/mission/MissionHeader", () => ({
    MissionHeader: (props: any) => testState.missionHeaderMock(props),
}));

describe("ResourcesBoard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("ne rend rien si teamsResources est undefined", () => {
        const { container } = render(<ResourcesBoard teamsResources={undefined} />);

        expect(container.firstChild).toBeNull();
    });

    it("affiche la vue globale à l'index 0 et ouvre l'aide au clic sur ?", () => {
        render(
            <ResourcesBoard
                teamsResources={{
                    AERO: { resources: { ENERGY: 9, HUMAN: 4, TIME: 7 } },
                    COOP: { resources: { ENERGY: 6, HUMAN: 8, TIME: 5 } },
                }}
            />
        );

        expect(screen.getByText("ÉQUIPAGE COMPLET")).toBeInTheDocument();
        expect(screen.getAllByText("0")).toHaveLength(3);

        fireEvent.click(screen.getByLabelText("Détail de calcul du score"));

        expect(testState.showHintMock).toHaveBeenCalledWith(
            expect.stringContaining("Le score total correspond à la moyenne"),
            true
        );
    });

    it("passe à la première équipe avec › et affiche MissionHeader avec les bonnes props", () => {
        render(
            <ResourcesBoard
                teamsResources={{
                    AERO: { resources: { ENERGY: 9, HUMAN: 4, TIME: 7 } },
                    COOP: { resources: { ENERGY: 6, HUMAN: 8, TIME: 5 } },
                }}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "›" }));

        expect(testState.missionHeaderMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                teamName: "AERO",
                color: "#84298e",
                badge: "/badges/teams/AERO.svg",
            })
        );

        expect(screen.getByText("9")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("fait un wrap vers la dernière équipe avec ‹ depuis l'index 0", () => {
        render(
            <ResourcesBoard
                teamsResources={{
                    AERO: { resources: { ENERGY: 9, HUMAN: 4, TIME: 7 } },
                    COOP: { resources: { ENERGY: 6, HUMAN: 8, TIME: 5 } },
                }}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "‹" }));

        expect(testState.missionHeaderMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                teamName: "COOP",
                color: "#1783c2",
                badge: "/badges/teams/COOP.svg",
            })
        );

        expect(screen.getByText("6")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
    });
});


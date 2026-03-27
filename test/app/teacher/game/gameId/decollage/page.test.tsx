import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DecollagePage from "@/app/teacher/game/[gameId]/decollage/page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    useParams: () => ({
        gameId: "ABC123",
    }),
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

function setSessionStorageValue(value: unknown) {
    window.sessionStorage.setItem("decollageData", JSON.stringify(value));
}

describe("DecollagePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.sessionStorage.clear();
    });

    it("affiche 'Aucune donnée trouvée.' quand le JSON est invalide", () => {
        window.sessionStorage.setItem("decollageData", "{invalid-json");

        render(<DecollagePage />);

        expect(screen.getByText("Aucune donnée trouvée.")).toBeInTheDocument();
    });

    it("laisse un bonus en not-completed si aucune équipe correspondante n'est trouvée", () => {
        setSessionStorageValue({
            nbTeams: 4,
            step: "1",
            teamsBonuses: [
                {
                    team: "Autre équipe",
                    bonus1_check: true,
                    bonus2_check: true,
                },
            ],
        });

        render(<DecollagePage />);

        expect(
            screen.getByTestId("bonus-card-coop1")
        ).toHaveTextContent("not-completed");
    });

    it("utilise bien getBonusTeamKey pour mapper les bonus (ex: geco)", () => {
        setSessionStorageValue({
            nbTeams: 4,
            step: "6",
            teamsBonuses: [
                {
                    team: "Equipe GECO",
                    bonus1_check: true,
                    bonus2_check: false,
                },
            ],
        });

        render(<DecollagePage />);

        expect(
            screen.getByTestId("bonus-card-geco1")
        ).toHaveTextContent("completed");
    });




    it("ferme la modal quand on clique sur cancel", () => {
        setSessionStorageValue({
            nbTeams: 4,
            step: "1",
            teamsBonuses: [],
        });

        render(<DecollagePage />);

        fireEvent.click(screen.getByRole("button", { name: "Valider l’étape" }));
        expect(screen.getByTestId("validation-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "mock-cancel" }));

        expect(screen.queryByTestId("validation-modal")).not.toBeInTheDocument();
    });

    it("ferme la modal et navigue vers /teacher/game/[gameId] quand on confirme", () => {
        setSessionStorageValue({
            nbTeams: 4,
            step: "1",
            teamsBonuses: [],
        });

        render(<DecollagePage />);

        fireEvent.click(screen.getByRole("button", { name: "Valider l’étape" }));
        fireEvent.click(screen.getByRole("button", { name: "mock-confirm" }));

        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith("/teacher/game/ABC123");
        expect(screen.queryByTestId("validation-modal")).not.toBeInTheDocument();
    });


});
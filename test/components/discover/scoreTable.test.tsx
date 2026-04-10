import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreTable } from "@/components/discover/ScoreTable";

describe("ScoreTable", () => {
    it("affiche les lignes des équipes et les scores globaux calculés", () => {
        render(
            <ScoreTable
                teams={{
                    AERO: { resources: { ENERGY: 9, HUMAN: 4, CLOCK: 7 } },
                    COOP: { resources: { ENERGY: 6, HUMAN: 8, CLOCK: 5 } },
                }}
            />
        );

        expect(screen.getByRole("columnheader", { name: "Équipe" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Humain" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Temps" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Énergie (/3)" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Total" })).toBeInTheDocument();

        const rows = screen.getAllByRole("row");
        expect(rows).toHaveLength(5);

        expect(rows[1]).toHaveTextContent("AERO");
        expect(rows[1]).toHaveTextContent("4");
        expect(rows[1]).toHaveTextContent("7");
        expect(rows[1]).toHaveTextContent("3");
        expect(rows[1]).toHaveTextContent("14");

        expect(rows[2]).toHaveTextContent("COOP");
        expect(rows[2]).toHaveTextContent("8");
        expect(rows[2]).toHaveTextContent("5");
        expect(rows[2]).toHaveTextContent("2");
        expect(rows[2]).toHaveTextContent("15");

        expect(screen.getByText("Score global (moyenne)")).toBeInTheDocument();
        expect(screen.getByText("14.50")).toBeInTheDocument();
        expect(screen.getByText("Score global (arrondi)")).toBeInTheDocument();
        expect(screen.getAllByText("14")).toHaveLength(2);
    });
});


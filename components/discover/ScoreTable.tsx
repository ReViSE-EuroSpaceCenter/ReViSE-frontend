import { TeamResources } from "@/types/TeamsResources";
import { getScoreTable } from "@/hooks/useResourcesBoard";

type Props = { teams: Record<string, TeamResources> };

export function ScoreTable({ teams }: Props) {
    const { rows, average } = getScoreTable(teams);

    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginTop: 15 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                <thead>
                <tr>
                    {["Équipe", "Humain", "Temps", "Énergie (/3)", "Total"].map((h) => (
                        <th key={h} style={{ padding: 8, borderBottom: "1px solid #ccc" }}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => (
                    <tr key={row.name}>
                        <td style={{ padding: 6 }}>{row.name}</td>
                        <td style={{ padding: 6 }}>{row.human}</td>
                        <td style={{ padding: 6 }}>{row.clock}</td>
                        <td style={{ padding: 6 }}>{row.energy}</td>
                        <td style={{ padding: 6, fontWeight: "bold" }}>{row.total}</td>
                    </tr>
                ))}
                {[
                    { label: "Score global (moyenne)", value: average.toFixed(2) },
                    { label: "Score global (arrondi)", value: Math.floor(average) },
                ].map(({ label, value }) => (
                    <tr key={label}>
                        <td colSpan={4} style={{ padding: 8, fontWeight: "bold", borderTop: "1px solid #ccc" }}>{label}</td>
                        <td style={{ padding: 8, fontWeight: "bold", borderTop: "1px solid #ccc" }}>{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
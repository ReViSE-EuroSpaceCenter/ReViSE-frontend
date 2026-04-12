import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import TeacherLayout from "@/app/teacher/game/[gameId]/layout";

vi.mock("@/components/LobbyLayout", () => ({
	default: ({ children }: any) => (
		<div data-testid="lobby-layout">{children}</div>
	),
}));

vi.mock("@/contexts/InterceptorProvider", () => ({
	InterceptorProvider: ({ isStudent }: any) => (
		<div data-testid="interceptor" data-student={isStudent} />
	),
}));

describe("TeacherLayout", () => {
	it("rend LobbyLayout, InterceptorProvider et les children", async () => {
		const paramsPromise = Promise.resolve({ gameId: "ABC123" });

		render(
			<TeacherLayout params={paramsPromise}>
				<div data-testid="child">Hello</div>
			</TeacherLayout>
		);

		expect(screen.getByTestId("lobby-layout")).toBeInTheDocument();

		const interceptor = screen.getByTestId("interceptor");
		expect(interceptor).toBeInTheDocument();
		expect(interceptor.getAttribute("data-student")).toBe("false");

		expect(screen.getByTestId("child")).toBeInTheDocument();
	});
});

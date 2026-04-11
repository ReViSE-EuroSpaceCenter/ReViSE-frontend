import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	fetchWithInterceptor,
	setInterceptorContext,
} from "@/api/apiInterceptor";
import { getRedirectUrlFromConflict } from "@/api/conflictError";

vi.mock("@/api/conflictError", () => ({
	getRedirectUrlFromConflict: vi.fn(),
}));

describe("fetchWithInterceptor", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("redirige quand status = 409 et currentState présent", async () => {
		const redirectHandler = vi.fn();

		setInterceptorContext(
			{ lobby: "ABC123", isStudent: true, team: "EXPE" },
			redirectHandler
		);

		global.fetch = vi.fn().mockResolvedValue({
			status: 409,
			clone: () => ({
				json: () => Promise.resolve({ currentState: "MISSION" }),
			}),
		});

		vi.mocked(getRedirectUrlFromConflict).mockReturnValue("/student/game/ABC123/EXPE");

		const res = await fetchWithInterceptor("/api/test");

		expect(getRedirectUrlFromConflict).toHaveBeenCalledWith({
			lobby: "ABC123",
			isStudent: true,
			team: "EXPE",
			code: "MISSION",
		});

		expect(redirectHandler).toHaveBeenCalledWith("/student/game/ABC123/EXPE");
		expect(res.status).toBe(409);
	});
});

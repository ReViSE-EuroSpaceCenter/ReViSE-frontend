import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InterceptorProvider } from "@/contexts/InterceptorProvider";
import { setInterceptorContext } from "@/api/apiInterceptor";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: replaceMock,
	}),
	useParams: () => ({
		gameId: "ABC123",
		teamName: "EXPE",
	}),
}));

vi.mock("@/api/apiInterceptor", () => ({
	setInterceptorContext: vi.fn(),
}));

describe("InterceptorProvider", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("configure correctement l'interceptor au montage", () => {
		render(<InterceptorProvider isStudent={true} />);

		expect(setInterceptorContext).toHaveBeenCalledWith(
			{ lobby: "ABC123", isStudent: true, team: "EXPE" },
			expect.any(Function)
		);
	});

	it("nettoie le contexte au démontage", () => {
		const { unmount } = render(<InterceptorProvider isStudent={false} />);

		unmount();

		expect(setInterceptorContext).toHaveBeenCalledWith(
			{ lobby: "", isStudent: false },
			expect.any(Function)
		);
	});

	it("appelle router.replace quand le handler est déclenché", () => {
		render(<InterceptorProvider isStudent={true} />);

		const handler = vi.mocked(setInterceptorContext).mock.calls[0][1];

		handler("/student/game/ABC123/EXPE");

		expect(replaceMock).toHaveBeenCalledWith("/student/game/ABC123/EXPE");
	});
});

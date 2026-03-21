import { render, waitFor } from "@testing-library/react";
import SideRow from "@/components/teacher/SideRow";
import { vi, beforeAll, describe, expect, it, afterAll } from "vitest";
import * as alerts from "@/utils/alerts";

vi.mock("@/utils/alerts", () => ({
	showMissionAlert: vi.fn(),
}));

describe("SideRow bonus alert", () => {
	const originalAudio = global.Audio;

	beforeAll(() => {
		global.Audio = class {
			play = vi.fn(() => Promise.resolve());
			pause = vi.fn();
			load = vi.fn();
			muted = false;
			currentTime = 0;
			volume = 1;
		} as any;
	});

	afterAll(() => {
		global.Audio = originalAudio;
	});

	it("déclenche showMissionAlert quand bonus1_check passe de false à true", async () => {
		const showMissionAlertMock = alerts.showMissionAlert;

		const { rerender } = render(
			<SideRow team="MECA" bonus1_check={false} bonus2_check={false} completed={0} />
		);

		rerender(
			<SideRow team="MECA" bonus1_check={true} bonus2_check={false} completed={0} />
		);

		await waitFor(() => {
			expect(showMissionAlertMock).toHaveBeenCalledWith("MECA", 1);
		});
	});

	it("déclenche showMissionAlert quand bonus2_check passe de false à true", async () => {
		const showMissionAlertMock = alerts.showMissionAlert;

		const { rerender } = render(
			<SideRow team="MECA" bonus1_check={false} bonus2_check={false} completed={0} />
		);

		rerender(
			<SideRow team="MECA" bonus1_check={false} bonus2_check={true} completed={0} />
		);

		await waitFor(() => {
			expect(showMissionAlertMock).toHaveBeenCalledWith("MECA", 2);
		});
	});
});
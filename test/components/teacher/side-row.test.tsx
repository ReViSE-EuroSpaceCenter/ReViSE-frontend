import { render, waitFor, screen } from "@testing-library/react";
import SideRow from "@/components/teacher/SideRow";
import { vi, beforeAll, describe, expect, it, afterAll, beforeEach } from "vitest";
import * as alerts from "@/utils/alerts";
import {ProgressionBar} from "@/components/mission/ProgressionBar";

vi.mock("@/utils/alerts", () => ({
	showMissionAlert: vi.fn(),
}));

vi.mock("next/image", () => ({
	default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/mission/ProgressionBar", () => ({
	ProgressionBar: vi.fn(() => <div data-testid="progress-bar" />),
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

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterAll(() => {
		global.Audio = originalAudio;
	});

	it("déclenche showMissionAlert quand bonus1_check passe de false à true", async () => {
		const showMissionAlertMock = alerts.showMissionAlert;

		const { rerender } = render(
			<SideRow team="MECA" id={0} classicMissionsCompleted={0} firstBonusMissionCompleted={false}
                     secondBonusMissionCompleted={false}/>
		);

		rerender(
			<SideRow team="MECA" id={0} classicMissionsCompleted={0} firstBonusMissionCompleted={true}
                     secondBonusMissionCompleted={false}/>
		);

		await waitFor(() => {
			expect(showMissionAlertMock).toHaveBeenCalledWith("MECA", 1);
		});
	});

	it("déclenche showMissionAlert quand bonus2_check passe de false à true", async () => {
		const showMissionAlertMock = alerts.showMissionAlert;

		const { rerender } = render(
			<SideRow team="MECA" id={0} classicMissionsCompleted={0} firstBonusMissionCompleted={false}
                     secondBonusMissionCompleted={false} />
		);

		rerender(
			<SideRow team="MECA" id={0} classicMissionsCompleted={0} firstBonusMissionCompleted={false}
                     secondBonusMissionCompleted={true} />
		);

		await waitFor(() => {
			expect(showMissionAlertMock).toHaveBeenCalledWith("MECA", 2);
		});
	});

	it("ne déclenche pas showMissionAlert si déjà true au mount", async () => {
		const showMissionAlertMock = alerts.showMissionAlert;

		render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={true}
				secondBonusMissionCompleted={false}
			/>
		);

		await waitFor(() => {
			expect(showMissionAlertMock).not.toHaveBeenCalled();
		});
	});

	it("ne déclenche pas si valeur ne change pas", async () => {
		const showMissionAlertMock = alerts.showMissionAlert;

		const { rerender } = render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		rerender(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		await waitFor(() => {
			expect(showMissionAlertMock).not.toHaveBeenCalled();
		});
	});

	it("joue le son quand une mission bonus est complétée", async () => {
		const playMock = vi.fn(() => Promise.resolve());

		global.Audio = vi.fn().mockImplementation(function () {
			return {
				play: playMock,
				pause: vi.fn(),
				load: vi.fn(),
				muted: false,
				currentTime: 0,
				volume: 1,
			};
		}) as any;

		const { rerender } = render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		rerender(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={true}
				secondBonusMissionCompleted={false}
			/>
		);

		await waitFor(() => {
			expect(playMock).toHaveBeenCalled();
		});
	});

	it("affiche les bons badges (gris vs actif)", () => {
		render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={true}
			/>
		);

		const images = screen.getAllByAltText(/Badge bonus équipe MECA/);

		expect(images[0]).toHaveAttribute(
			"src",
			"/badges/bonus/MECA_bonus1_gris.svg"
		);
		expect(images[1]).toHaveAttribute(
			"src",
			"/badges/bonus/MECA_bonus2.svg"
		);
	});

	it("passe les bonnes props à ProgressionBar pour MECA", () => {
		render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={5}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		expect(ProgressionBar).toHaveBeenCalledWith(
			expect.objectContaining({
				completed: 5,
				totalMission: 8,
			}),
			undefined
		);
	});

	it("passe les bonnes props à ProgressionBar pour autre team", () => {
		render(
			<SideRow
				id={0}
				team="AERO"
				classicMissionsCompleted={3}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		expect(ProgressionBar).toHaveBeenCalledWith(
			expect.objectContaining({
				completed: 3,
				totalMission: 7,
			}),
			undefined
		);
	});

	it("initialise Audio au montage", () => {
		const audioMock = vi.fn().mockImplementation(function () {
			return {
				play: vi.fn(),
				pause: vi.fn(),
				load: vi.fn(),
				muted: false,
				currentTime: 0,
				volume: 1,
			};
		});

		global.Audio = audioMock as any;

		render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		expect(audioMock).toHaveBeenCalledWith("/sounds/missionBonus.mp3");
	});

	it("attache les events click pour unlock audio", async () => {
		const addEventListenerSpy = vi.spyOn(document, "addEventListener");

		render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		expect(addEventListenerSpy).toHaveBeenCalledWith(
			"click",
			expect.any(Function)
		);
		expect(addEventListenerSpy).toHaveBeenCalledWith(
			"touchstart",
			expect.any(Function)
		);
	});

	it("cleanup les event listeners au unmount", () => {
		const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

		const { unmount } = render(
			<SideRow
				id={0}
				team="MECA"
				classicMissionsCompleted={0}
				firstBonusMissionCompleted={false}
				secondBonusMissionCompleted={false}
			/>
		);

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"click",
			expect.any(Function)
		);
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"touchstart",
			expect.any(Function)
		);
	});
});
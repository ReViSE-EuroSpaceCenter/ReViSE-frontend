import { describe, it, expect } from "vitest";
import { getRedirectUrlFromConflict, Props } from "@/api/conflictError";

describe("getRedirectUrlFromConflict", () => {
	const base: Omit<Props, "code"> = {
		lobby: "ABC123",
		isStudent: true,
		team: "EXPE",
	};

	it("redirige correctement pour LOBBY (student)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "LOBBY" })
		).toBe("/student/join");
	});

	it("redirige correctement pour LOBBY (teacher)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, isStudent: false, code: "LOBBY" })
		).toBe("/teacher/game/ABC123/setup");
	});

	it("redirige correctement pour MISSION (student)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "MISSION" })
		).toBe("/student/game/ABC123/EXPE");
	});

	it("redirige correctement pour MISSION (teacher)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, isStudent: false, code: "MISSION" })
		).toBe("/teacher/game/ABC123");
	});

	it("redirige correctement pour LAUNCHER (student)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "LAUNCHER" })
		).toBe("/student/game/ABC123/EXPE/launcher");
	});

	it("redirige correctement pour LAUNCHER (teacher)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, isStudent: false, code: "LAUNCHER" })
		).toBe("/teacher/game/ABC123/launcher");
	});

	it("redirige correctement pour RESOURCE (student)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "RESOURCE" })
		).toBe("/student/game/ABC123/EXPE/resources");
	});

	it("redirige correctement pour RESOURCE (teacher)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, isStudent: false, code: "RESOURCE" })
		).toBe("/teacher/game/ABC123/launcher?step=8");
	});

	it("redirige correctement pour DISCOVER (student)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "DISCOVER" })
		).toBe("/student/game/ABC123/EXPE/discover");
	});

	it("redirige correctement pour DISCOVER (teacher)", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, isStudent: false, code: "DISCOVER" })
		).toBe("/teacher/game/ABC123/discover");
	});

	it("redirige correctement pour END", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "END" })
		).toBe("/");
	});

	it("retourne null si le code est inconnu", () => {
		expect(
			getRedirectUrlFromConflict({ ...base, code: "UNKNOWN" })
		).toBeNull();
	});
});

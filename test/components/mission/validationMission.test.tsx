import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { ValidationMissionModal } from "@/components/mission/ValidationMission";

const onConfirmMock = vi.fn();
const onCancelMock = vi.fn();

vi.mock("@headlessui/react", () => ({
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
	DialogPanel: ({ children }: any) => <div>{children}</div>,
	DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

describe("ValidationMissionModal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("affiche le titre et le message", () => {
		render(
			<ValidationMissionModal
				title="Confirmation"
				message="Êtes-vous sûr ?"
				isOpen={true}
				onConfirm={onConfirmMock}
				onCancel={onCancelMock}
			/>
		);

		expect(screen.getByText("Confirmation")).toBeInTheDocument();
		expect(screen.getByText("Êtes-vous sûr ?")).toBeInTheDocument();
	});

	it("n'affiche pas le titre s'il est absent", () => {
		render(
			<ValidationMissionModal
				message="Message seul"
				isOpen={true}
				onConfirm={onConfirmMock}
				onCancel={onCancelMock}
			/>
		);

		expect(screen.queryByText("Confirmation")).not.toBeInTheDocument();
		expect(screen.getByText("Message seul")).toBeInTheDocument();
	});

	it("appelle onCancel quand on clique sur Annuler", () => {
		render(
			<ValidationMissionModal
				title="Test"
				message="Test message"
				isOpen={true}
				onConfirm={onConfirmMock}
				onCancel={onCancelMock}
			/>
		);

		fireEvent.click(screen.getByText("Annuler"));

		expect(onCancelMock).toHaveBeenCalled();
	});

	it("appelle onConfirm quand on clique sur Confirmer", () => {
		render(
			<ValidationMissionModal
				title="Test"
				message="Test message"
				isOpen={true}
				onConfirm={onConfirmMock}
				onCancel={onCancelMock}
			/>
		);

		fireEvent.click(screen.getByText("Confirmer"));

		expect(onConfirmMock).toHaveBeenCalled();
	});

	it("n'affiche rien si isOpen est false", () => {
		render(
			<ValidationMissionModal
				message="Test message"
				isOpen={false}
				onConfirm={onConfirmMock}
				onCancel={onCancelMock}
			/>
		);

		expect(screen.queryByText("Test message")).not.toBeInTheDocument();
	});
});
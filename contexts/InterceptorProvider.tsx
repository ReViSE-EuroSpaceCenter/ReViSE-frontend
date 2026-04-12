"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { setInterceptorContext } from "@/api/apiInterceptor";

type Props = {
	isStudent: boolean;
};

export function InterceptorProvider({ isStudent }: Props) {
	const router = useRouter();
	const params = useParams();
	const team = params.teamName as string;
	const lobby = params.gameId as string;

	useEffect(() => {
		setInterceptorContext(
			{ lobby, isStudent, team },
			(url) => router.replace(url)
		);

		return () => setInterceptorContext({ lobby: "", isStudent: false }, () => {});
	}, [lobby, isStudent, team, router]);

	return null;
}
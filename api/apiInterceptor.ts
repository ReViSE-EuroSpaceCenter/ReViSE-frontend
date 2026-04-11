import {getRedirectUrlFromConflict, Props} from "@/api/conflictError";

type RedirectContext = Omit<Props, "code">;

let redirectContext: RedirectContext | null = null;
let redirectHandler: ((url: string) => void) | null = null;

export function setInterceptorContext(
	ctx: RedirectContext,
	handler: (url: string) => void
) {
	redirectContext = ctx;
	redirectHandler = handler;
}

export const fetchWithInterceptor: typeof fetch = async (input, init) => {
	const response = await fetch(input, init);

	if (response.status === 409 && redirectContext && redirectHandler) {
		try {
			const clone = response.clone();
			const data = await clone.json();
			if (data.currentState) {
				const url = getRedirectUrlFromConflict({
					...redirectContext,
					code: data.currentState,
				});
				if (url) {
					redirectHandler(url);
					return new Response(null, { status: 409 });
				}
			}
		} catch {}
	}

	return response;
};
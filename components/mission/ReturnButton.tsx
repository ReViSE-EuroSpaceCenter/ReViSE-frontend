'use client'

import {useRouter} from "next/navigation";

type Props = {
	url: string;
}

export const ReturnButton = (props: Props) => {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push(props.url)}
			className="mb-2 px-3 sm:px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-purpleReViSE hover:text-white transition text-sm cursor-pointer shrink-0"
		>
			← Retour
		</button>
	)
}
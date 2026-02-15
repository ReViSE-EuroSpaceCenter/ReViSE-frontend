"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import NumberTeamSelector from "@/components/numberTeamSelector";

type Props = {
	action: (formData: FormData) => void
}

export default function HomeButtons(props: Readonly<Props>) {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div id="home-buttons" className="flex flex-col sm:flex-row gap-4 pt-4">
				<button
					className="px-8 py-4 bg-purpleReViSE hover:bg-purpleReViSE/80 rounded-lg font-semibold text-lg transition-colors"
					onClick={() => setIsModalOpen(true)}
				>
					Créer une partie
				</button>
				<button
					className="px-8 py-4 border-2 border-purpleReViSE hover:bg-purpleReViSE/20 rounded-lg
                     font-semibold text-lg transition-colors"
					onClick={() => router.push('/student/join')}
				>
					Rejoindre une partie
				</button>
			</div>

			<NumberTeamSelector
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				action={props.action}
			/>
		</>
	)
}
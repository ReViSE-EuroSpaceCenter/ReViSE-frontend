import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";

type Props = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export default function IATech({ isOpen, setIsOpen }: Readonly<Props>) {
	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			className="relative z-50"
		>
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="relative w-full max-w-[95vw] md:max-w-[min(900px,calc(100vh-80px))]">
					<button
						onClick={() => setIsOpen(false)}
						className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10 flex items-center justify-center w-5 h-5 md:w-9 md:h-9 rounded-full bg-white text-gray-800 shadow-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
						aria-label="Fermer"
					>
						✕
					</button>

					<Image
						src="/IA.png"
						alt="Technologies d'IA"
						width={1100}
						height={800}
						className="rounded-xl shadow-2xl w-full h-auto"
					/>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
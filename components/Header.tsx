'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from "next/navigation";
import NumberTeamSelector from "@/components/numberTeamSelector";

type Props = {
	createLobbyAction: (formData: FormData) => void;
}

export default function Header(props: Readonly<Props>) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const menuRef = useRef<HTMLDivElement>(null);

	const isHomePage = pathname === '/';

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};
		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

	return (
		<>
			<header className="border-b border-slate-700/30" ref={menuRef}>
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Image
								src="/logo.png"
								alt="ReViSE"
								width={160}
								height={48}
								className="h-auto w-32 lg:w-40 cursor-pointer"
								priority
								onClick={() => router.push('/')}/>
							<span className="hidden lg:block text-sm text-slate-300 border-l border-slate-700/50 pl-4">
                            Recherche de Vie Sur Europe
                        </span>
						</div>

						{isHomePage && (
							<>
								<nav className="hidden md:flex items-center gap-3">
									<button
										className="px-4 py-2 border border-purpleReViSE hover:bg-purpleReViSE/20 rounded-lg cursor-pointer font-medium transition-colors"
										onClick={() => setIsModalOpen(true)}
									>
										Créer une partie
									</button>
									<button
										className="px-4 py-2 bg-purpleReViSE hover:bg-purpleReViSE/80 cursor-pointer rounded-lg font-medium transition-colors"
										onClick={() => router.push('/student/join')}
									>
										Rejoindre une partie
									</button>
								</nav>

								<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									className="md:hidden p-2 hover:bg-slate-700/30 rounded-lg cursor-pointer transition-colors"
									aria-label="Menu"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										{isMenuOpen ? (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"/>
										) : (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"/>
										)}
									</svg>
								</button>
							</>
						)}
					</div>

					{isHomePage && isMenuOpen && (
						<nav className="md:hidden mt-4 pt-4 border-t border-slate-700/30 flex flex-col gap-2">
							<button
								className="w-full px-4 py-2 border border-purpleReViSE hover:bg-purpleReViSE/20 rounded-lg font-medium transition-colors text-left"
								onClick={() => {
									setIsMenuOpen(false);
									setIsModalOpen(true);
								}}
							>
								Créer une partie
							</button>
							<button
								className="w-full px-4 py-2 bg-purpleReViSE hover:bg-purpleReViSE/80 rounded-lg font-medium transition-colors text-left"
								onClick={() => {
									setIsMenuOpen(false);
									router.push('/student/join');
								}}
							>
								Rejoindre une partie
							</button>
						</nav>
					)}
				</div>
			</header>

			<NumberTeamSelector
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				action={props.createLobbyAction}
			/>
		</>
	);
}
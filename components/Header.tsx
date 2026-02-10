import Image from 'next/image';

export default function Header() {
	return (
		<header className="border-b border-slate-700/30">
			<div className="max-w-5xl px-6 py-4">
				<Image
					src="/logo.png"
					alt="ReViSE"
					width={160}
					height={48}
					className="h-auto w-40"
					priority
				/>
			</div>
		</header>
	);
}
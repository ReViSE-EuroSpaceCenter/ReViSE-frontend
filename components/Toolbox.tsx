"use client";

import React, { useState } from "react";

type RadialAction = {
	label: string;
	onClick: () => void;
};

type RadialMenuProps = {
	centerContent: string;
	actions: RadialAction[];
};

const COLORS = [
	{ id: "purple", base: "#834291", light: "#b05ec0", glow: "rgba(131,66,145,0.5)" },
	{ id: "blue", base: "#2C7BAC", light: "#3da0e0", glow: "rgba(44,123,172,0.5)" },
	{ id: "green", base: "#519D60", light: "#6abf7a", glow: "rgba(81,157,96,0.5)" },
	{ id: "orange", base: "#CD5741", light: "#e8705a", glow: "rgba(205,87,65,0.5)" },
];

export default function Toolbox({ centerContent, actions }: Readonly<RadialMenuProps>) {
	const [hovered, setHovered] = useState<number | null>(null);

	const S = 600;
	const cx = S / 2;
	const cy = S / 2;
	const innerR = 72;
	const outerR = 200;
	const count = actions.length;
	const gap = count < 4 ? 16 : 8;

	const offsetDeg = count < 4 ? 90 : -135;

	const deg2rad = (d: number) => {
		return (d * Math.PI) / 180;
	}

	const polar = (r: number, angleDeg: number) => {
		const a = deg2rad(angleDeg);
		return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
	}

	const petalPath = (i: number) => {
		const step = 360 / count;
		const startDeg = offsetDeg + i * step + gap / 2;
		const endDeg = offsetDeg + (i + 1) * step - gap / 2;
		const p1 = polar(innerR + 4, startDeg);
		const p2 = polar(outerR, startDeg);
		const p3 = polar(outerR, endDeg);
		const p4 = polar(innerR + 4, endDeg);
		const large = endDeg - startDeg > 180 ? 1 : 0;
		return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 ${large} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR + 4} ${innerR + 4} 0 ${large} 0 ${p1.x} ${p1.y} Z`;
	}

	const textArcPath = (i: number) => {
		const step = 360 / count;
		const startDeg = offsetDeg + i * step + gap / 2;
		const endDeg = offsetDeg + (i + 1) * step - gap / 2;
		const r = (innerR + 4 + outerR) / 2;
		const p1 = polar(r, startDeg);
		const p2 = polar(r, endDeg);
		return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`;
	}

	const petalMidAngle = (i: number) => {
		const step = 360 / count;
		return offsetDeg + i * step + step / 2;
	}

	return (
		<svg
			viewBox={`0 0 ${S} ${S}`}
			style={{ width: "100%", height: "100%", maxWidth: S, maxHeight: S, overflow: "visible" }}
		>
			<defs>
				<radialGradient id="tb-center-grad" cx="40%" cy="35%" r="65%">
					<stop offset="0%" stopColor="#3d2155" />
					<stop offset="100%" stopColor="#1C1830" />
				</radialGradient>
				<filter id="tb-glow-soft">
					<feGaussianBlur stdDeviation="6" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="tb-glow-strong">
					<feGaussianBlur stdDeviation="12" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				{COLORS.map((c, i) => (
					<radialGradient key={`tg-${c.id}`} id={`tb-petal-grad-${i}`} cx="50%" cy="100%" r="100%">
						<stop offset="0%" stopColor={c.light} stopOpacity="0.95" />
						<stop offset="100%" stopColor={c.base} stopOpacity="0.8" />
					</radialGradient>
				))}
				{actions.map((action, i) => (
					<path key={`ta-${action.label}`} id={`tb-arc-${i}`} d={textArcPath(i)} fill="none" />
				))}
			</defs>

			<circle cx={cx} cy={cy} r={outerR + 60} fill="rgba(131,66,145,0.04)" />
			<circle cx={cx} cy={cy} r={outerR + 30} fill="rgba(131,66,145,0.06)" />

			{actions.map((action, i) => {
				const color = COLORS[i % COLORS.length];
				const isHov =  hovered === i;
				const mid = deg2rad(petalMidAngle(i));
				const nudge = isHov ? 8 : 0;
				const tx = Math.cos(mid) * nudge;
				const ty = Math.sin(mid) * nudge;
				let fontSizeValue: string;
				if (count < 4) {
					fontSizeValue = isHov ? "22" : "20";
				} else {
					fontSizeValue = isHov ? "17" : "16";
				}

				return (
					<g
						key={`petal-${action.label}`}
						onClick={action.onClick}
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
						style={{
							cursor: "pointer",
							transition: "transform 0.2s ease",
							transform: `translate(${tx}px,${ty}px)`,
						}}
					>
						{isHov && (
							<path d={petalPath(i)} fill={color.glow} filter="url(#tb-glow-strong)" />
						)}
						<path
							d={petalPath(i)}
							fill={`url(#tb-petal-grad-${i})`}
							stroke={color.light}
							strokeWidth={isHov ? 1.5 : 0.8}
							strokeOpacity={isHov ? 0.9 : 0.5}
						/>
						<path d={petalPath(i)} fill="none" stroke="white" strokeWidth={0.5} strokeOpacity={isHov ? 0.2 : 0.07} />
						<text
							fontSize={fontSizeValue}
							fill="white"
							fontWeight={isHov ? "700" : "600"}
							letterSpacing="0.06em"
							opacity={isHov ? 1 : 0.9}
						>
							<textPath href={`#tb-arc-${i}`} startOffset="50%" textAnchor="middle">
								{action.label}
							</textPath>
						</text>
					</g>
				);
			})}

			<circle cx={cx} cy={cy} r={innerR + 4} fill="none" stroke="#834291" strokeWidth={0.8} strokeOpacity={0.5} />

			<circle cx={cx} cy={cy} r={innerR + 12} fill="#834291" fillOpacity={0.12} filter="url(#tb-glow-soft)" />
			<circle cx={cx} cy={cy} r={innerR} fill="url(#tb-center-grad)" stroke="#834291" strokeWidth={1.5} strokeOpacity={0.8} />
			<circle cx={cx} cy={cy} r={innerR - 10} fill="none" stroke="#834291" strokeWidth={0.5} strokeOpacity={0.35} />

			<text
				x={cx}
				y={cy}
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize="15"
				fontWeight="700"
				fill="white"
				letterSpacing="0.04em"
			>
				{centerContent}
			</text>
		</svg>
	);
}
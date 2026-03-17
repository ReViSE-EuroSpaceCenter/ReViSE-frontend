"use client";

import React, { useState } from "react";

type RadialAction = {
	label: string;
	onClick: () => void;
	disabled?: boolean;
};

type RadialMenuProps = {
	centerAction?: RadialAction;
	actions: RadialAction[];
};

const COLORS = [
	{ id: "purple", base: "#834291", light: "#b05ec0", glow: "rgba(131,66,145,0.5)" },
	{ id: "blue", base: "#2C7BAC", light: "#3da0e0", glow: "rgba(44,123,172,0.5)" },
	{ id: "green", base: "#519D60", light: "#6abf7a", glow: "rgba(81,157,96,0.5)" },
	{ id: "orange", base: "#CD5741", light: "#e8705a", glow: "rgba(205,87,65,0.5)" },
];

export default function Toolbox({ centerAction, actions }: Readonly<RadialMenuProps>) {
	const [hovered, setHovered] = useState<number | null>(null);
	const [centerHover, setCenterHover] = useState(false);

	const S = 520;
	const cx = S / 2;
	const cy = S / 2;
	const innerR = 90;
	const outerR = 200;
	const count = actions.length;
	const offsetDeg = count < 4 ? 90 : 135;
	const gapPx = 25;

	const round = (n: number, precision = 10) =>
		Number(n.toFixed(precision));

	const deg2rad = (d: number) => (d * Math.PI) / 180;
	const rad2deg = (r: number) => (r * 180) / Math.PI;

	const polar = (r: number, angleDeg: number) => {
		const a = deg2rad(angleDeg);
		return {
			x: round(cx + r * Math.cos(a)),
			y: round(cy + r * Math.sin(a)),
		};
	};

	const petalPath = (i: number) => {
		const step = 360 / count;
		const innerOffset = rad2deg(gapPx / (innerR + 4));
		const outerOffset = rad2deg(gapPx / outerR);
		const startBase = offsetDeg + i * step;
		const endBase = offsetDeg + (i + 1) * step;
		const startInner = startBase + innerOffset / 2;
		const endInner = endBase - innerOffset / 2;
		const startOuter = startBase + outerOffset / 2;
		const endOuter = endBase - outerOffset / 2;

		const p1 = polar(innerR + 4, startInner);
		const p2 = polar(outerR, startOuter);
		const p3 = polar(outerR, endOuter);
		const p4 = polar(innerR + 4, endInner);

		return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR + 4} ${innerR + 4} 0 0 0 ${p1.x} ${p1.y} Z`;
	};

	const textArcPath = (i: number, radiusOffset = 0) => {
		const step = 360 / count;
		const r = (innerR + 4 + outerR) / 2 + radiusOffset;
		const offset = rad2deg(gapPx / r);

		const start = offsetDeg + i * step + offset / 2;
		const end = offsetDeg + (i + 1) * step - offset / 2;

		const p1 = polar(r, start);
		const p2 = polar(r, end);

		let dx = 0;
		let dy = 0;

		if ((count === 4 && i !== 1) || (count === 3 && i !== 1)) {
			dy = 8;
			if (count === 4) {
				if (i === 0) {
					dx = -8;
					dy = 0;
				}
				if (i === 2) {
					dx = 8;
					dy = 0;
				}
			}
			return `M ${round(p2.x + dx)} ${round(p2.y + dy)} A ${r} ${r} 0 0 0 ${round(p1.x + dx)} ${round(p1.y + dy)}`;
		}

		return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`;
	}

	const petalMidAngle = (i: number) => {
		const step = 360 / count;
		return offsetDeg + i * step + step / 2;
	}

	return (
		<svg
			viewBox={`0 0 ${S} ${S}`}
			style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: S, height: "100%", maxHeight: S }}
		>
			<defs>
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
				<radialGradient id="tb-center-active-grad" cx="50%" cy="50%" r="50%">
					<stop offset="0%"   stopColor="#5A4A7A" stopOpacity="0.75"/>
					<stop offset="65%"  stopColor="#2E2452" stopOpacity="0.70"/>
					<stop offset="100%" stopColor="#140F2E" stopOpacity="0.65"/>
				</radialGradient>

				{actions.map((action, i) => {
					const lines = action.label.split("\n");

					return lines.map((_, lineIndex) => {
						let radiusOffset = 0;

						if (lines.length !== 1) {
							radiusOffset = lineIndex === 0 ? -10 : 10;
						}

						return (
							<path
								key={`ta-${action.label}-${lineIndex}`}
								id={`tb-arc-${i}-${lineIndex}`}
								d={textArcPath(i, radiusOffset)}
								fill="none"
							/>
						);
					});
				})}
			</defs>

			<circle cx={cx} cy={cy} r={outerR + 60} fill="rgba(131,66,145,0.04)" />
			<circle cx={cx} cy={cy} r={outerR + 30} fill="rgba(131,66,145,0.06)" />

			{actions.map((action, i) => {
				const lines = action.label.split("\n");
				const color = COLORS[i % COLORS.length];
				const isHov = hovered === i;
				const mid = deg2rad(petalMidAngle(i));
				const nudge = isHov ? 8 : 0;

				return (
					<g
						key={`petal-${action.label}`}
						onClick={action.onClick}
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
						style={{
							cursor: "pointer",
							transform: `translate(${round(Math.cos(mid) * nudge)}px, ${round(
								Math.sin(mid) * nudge
							)}px)`,
							transition: "transform 0.2s ease",
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

						{lines.map((line, lineIndex) => (
							<text
								key={`${action.label}-${lineIndex}`}
								fontSize={count === 4 ? 17 : 22}
								fill="white"
								fontWeight="600"
							>
								<textPath
									href={`#tb-arc-${i}-${lineIndex}`}
									startOffset="50%"
									textAnchor="middle"
								>
									{line}
								</textPath>
							</text>
						))}
					</g>
				);
			})}
			<circle visibility={centerAction && !centerAction.disabled ? "visible" : "hidden"} cx={cx} cy={cy} r={innerR * 0.8 + 4} fill="none" stroke="#834291" strokeWidth={0.8} strokeOpacity={0.5}/>
			<circle visibility={centerAction && !centerAction.disabled ? "visible" : "hidden"}cx={cx} cy={cy} r={innerR * 0.8 + 12} fill="#834291" fillOpacity={0.12} filter="url(#tb-glow-soft)"/>

			<g
				visibility={centerAction && !centerAction.disabled ? "visible" : "hidden"}
				cursor="pointer"
				onClick={centerAction && !centerAction?.disabled ? centerAction?.onClick : undefined}
				onMouseEnter={() => setCenterHover(true)}
				onMouseLeave={() => setCenterHover(false)}
			>
				<circle cx={cx} cy={cy} r={innerR * 0.8} fill={centerHover ? "url(#tb-center-active-grad)" : "none"} stroke="#834291" strokeWidth={1.5} strokeOpacity={0.8}/>
				<circle cx={cx} cy={cy} r={innerR * 0.8 - 10} fill="none"  stroke="#834291" strokeWidth={0.5} strokeOpacity={0.35}/>

				<text
					x={cx}
					y={cy}
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="17"
					fontWeight="700"
					fill={"white"}
					letterSpacing="0.04em"
				>
					{centerAction?.label.split("\n").map((line, index) => (
						<tspan key={index} x={cx} dy={index === 0 ? -5 : 30}>
							{line}
						</tspan>
					))}
				</text>
			</g>
		</svg>
	);
}
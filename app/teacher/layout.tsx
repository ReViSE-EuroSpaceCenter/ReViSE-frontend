import React from "react";

export default function TeacherLayout({ children }: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main>{children}</main>
	)
}
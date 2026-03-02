import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/components/Header";
import {handleCreateLobby} from "@/actions/createLobby";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReVISE",
  description: "ReViSE est un jeu de plateau conçu par l’Euro Space Center (ESC), en collaboration avec l’Université de Namur et B12 Consulting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header createLobbyAction={handleCreateLobby} />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/app/app/load-document/components/Header";
import Footer from "@/app/app/load-document/components/Footer";
import clsx from "clsx";
import SessionProvider from "@/app/context/SessionContext";
import ToasterContext from "@/app/context/ToasterContext";

const inter = Inter({ subsets: [ "latin" ] });

export const metadata: Metadata = {
    title: "Informarker",
    description: "Website against foreign agents",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className="h-[100vh]" lang="en" data-theme="light">
        <body className={clsx(inter.className, "h-[100vh] flex flex-col")}>
        <SessionProvider>
            <Header/>
            <div className="flex-1 container mx-auto mb-4">
                {children}
            </div>
            <Footer/>
            <ToasterContext/>
        </SessionProvider>
        </body>
        </html>
    );
}

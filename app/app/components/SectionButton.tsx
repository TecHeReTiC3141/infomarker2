"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export interface SectionButtonProps {
    text: string,
    section: string,
}

export default function SectionButton({ text, section }: SectionButtonProps) {
    const pathname = usePathname();

    const isActive = pathname.includes(section);

    return (
        <Link href={`/app/${section}`}
              className={clsx("btn btn-lg w-56 justify-start", isActive ? "btn-primary" : "btn-neutral")}>
            {text}
        </Link>
    )
}
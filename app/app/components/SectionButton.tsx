"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export interface SectionButtonProps {
    text: string,
    section: string,
    disabled?: boolean,
}

export default function SectionButton({ text, section, disabled = false }: SectionButtonProps) {
    const pathname = usePathname();
    // TODO: add spinner when clicked before redirecting
    // TODO: add text that app can be slow during first redirect to page

    const isActive = pathname.includes(section);

    return (
        <Link href={`/app/${section}`} onClick={event => {
            if (disabled) {
                event.preventDefault();
                return;
            }
        }}
              className={clsx("btn btn-lg w-40 lg:w-48 xl:w-56 justify-start", isActive ? "btn-primary" : "btn-neutral",
                  disabled && "opacity-75 cursor-default")}>
            {text}
        </Link>
    )
}
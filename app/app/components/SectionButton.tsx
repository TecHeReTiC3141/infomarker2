"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { LinkWithToastAndLoading } from "@/app/components/LinkWithToastAndLoading";

export interface SectionButtonProps {
    text: string,
    section: string,
    disabled?: boolean,
}

export default function SectionButton({ text, section, disabled = false }: SectionButtonProps) {
    const pathname = usePathname();
    // TODO: make custom link component which triggers toast message

    const isActive = pathname.includes(section);

    return (
        <>
            {
                disabled ?
                    <button disabled
                            className={"btn btn-primary btn-lg w-40 lg:w-48 xl:w-56 justify-start"}>{text}</button>
                    :
                    <LinkWithToastAndLoading href={`/app/${section}`}
                          className={clsx("btn btn-lg w-40 lg:w-48 xl:w-56 justify-between items-center",
                              isActive ? "btn-primary" : "btn-neutral")}>
                        {text}
                        <span className="hidden group-[.loading-link]:inline loading loading-spinner text-sm" />
                    </LinkWithToastAndLoading>
            }
        </>
    )
}
"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export interface SectionButtonProps {
    text: string,
    section: string,
    disabled?: boolean,
}

export default function SectionButton({ text, section, disabled = false }: SectionButtonProps) {
    const pathname = usePathname();
    // TODO: add text that app can be slow during first redirect to page

    const isActive = pathname.includes(section);

    const [ loadingTimeout, setLoadingTimeout ] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setLoading(false);
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
    }, [ pathname ]);

    const [ loading, setLoading ] = useState<boolean>(false);
    return (
        <>
            {
                disabled ?
                    <button disabled
                            className={"btn btn-primary btn-lg w-40 lg:w-48 xl:w-56 justify-start"}>{text}</button>
                    :
                    <Link href={`/app/${section}`} onClick={() => {
                        setLoading(true);
                        setLoadingTimeout(setTimeout(
                            () => toast.loading("При первой загрузке страницы возможна задержка при переходе, при последующих загрузках ее не будет наблюдаться"), 1000));
                    }}
                          className={clsx("btn btn-lg w-40 lg:w-48 xl:w-56 justify-between items-center",
                              isActive ? "btn-primary" : "btn-neutral")}>
                        {text}
                        {loading && <span className="loading loading-spinner text-sm"></span>}
                    </Link>
            }
        </>
    )
}
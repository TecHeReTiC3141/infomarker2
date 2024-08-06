"use client"

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link, { LinkProps } from "next/link";
import toast from "react-hot-toast";
import clsx from "clsx";

export interface LinkWithToastAndLoadingProps extends LinkProps, PropsWithChildren {
    className: string,
}

export function LinkWithToastAndLoading({ children, href, className }: LinkWithToastAndLoadingProps) {
    const pathname = usePathname();

    const [ loadingTimeout, setLoadingTimeout ] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setLoading(false);
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
    }, [ pathname ]);

    const [ loading, setLoading ] = useState<boolean>(false);

    return (
        <Link href={href} onClick={() => {
            if (pathname === href) return;
            setLoading(true);
            setLoadingTimeout(setTimeout(
                () => toast.loading("Возможна задержка при первом переходе на страницу, но при последующих ее не будет наблюдаться",
                    { duration: 3000 },
                ), 1000));
        }} className={clsx(className, "group",  loading && "loading-link")}>
            {children}
        </Link>
    )
}
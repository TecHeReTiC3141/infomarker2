"use client";

import { useSession } from "next-auth/react";
import { SessionUser } from "@/app/lib/db/user";
import UserAvatar from "@/app/components/user/UserAvatar";
import Link from "next/link";
import LogOutModal from "@/app/components/user/LogOutModal";
import { useRef } from "react";
import { FaInfinity } from "react-icons/fa6";
import clsx from "clsx";


export default function UserDropdown() {

    const { data: session } = useSession();

    const logoutModalRef = useRef<HTMLDialogElement>(null);

    const user = session?.user as SessionUser;
    return (
        <>
            <div className="dropdown dropdown-end">
                <div className="flex items-center gap-x-6">
                    <div className="text-right">
                        <p className="font-bold">{user?.name}</p>
                        {/*<p className={clsx("text-sm", user?.role !== "ADMIN" && user?.checksLeft === 0 && "text-error")}>Отправок*/}
                        {/*    осталось: {user?.role === "ADMIN" ? <FaInfinity/> : user?.checksLeft}</p>*/}
                    </div>

                    <div tabIndex={0} role="button"
                         className="btn btn-ghost btn-circle avatar flex items-center justify-center relative">
                        <UserAvatar user={user} width={75} height={50}/>
                        {user?.role === "ADMIN" &&
                            <p className="text-xs uppercase absolute top-[110%] left-0.5">admin</p>}
                    </div>
                </div>
                <ul tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                        <Link href="/app/profile" className="justify-between">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => logoutModalRef.current?.show()}>Logout</button>
                    </li>
                </ul>
            </div>
            <LogOutModal ref={logoutModalRef}/>
        </>
    )
}
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/app/components/user/UserDropdown";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { SessionUser } from "@/app/lib/db/user";


export default async function Header() {

    const session = await getServerSession(authOptions);

    const user = session?.user as SessionUser;

    return (
        <div className="navbar py-6 px-4 mb-8 bg-base-200 w-full">
            <div className="container flex justify-between items-center mx-auto">
                <div className="flex gap-x-8 items-center">
                    <Link href="/">
                        <Image src="/logo.png" alt="Informarker" priority={true} width={640} height={480} className="w-80"/>
                    </Link>
                    <h4 className="text-gray-500 text-xs md:text-sm select-none">Маркировка упоминаний иностранных
                        агентов <br /> и нежелательных
                        организаций в ваших текстах</h4>
                </div>
                {user ? <UserDropdown /> : <div />}
            </div>
        </div>
    );
}
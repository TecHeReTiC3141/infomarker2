import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="navbar py-6 px-4 mb-8 bg-base-200">
            <div className="container flex justify-between items-center mx-auto">

                <div className="flex gap-x-8 items-center">
                    <Link href="/">
                        <Image src="/logo.png" alt="Informarker" width={640} height={480} className="w-80"/>
                    </Link>
                    <h4 className="text-gray-500 text-xs md:text-sm select-none">Маркировка упоминаний иностранных
                        агентов <br /> и нежелательных
                        организаций в ваших текстах</h4>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Tailwind CSS Navbar component"
                                 src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"/>
                        </div>
                    </div>
                    <ul tabIndex={0}
                        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
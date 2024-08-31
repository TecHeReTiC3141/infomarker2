import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import Image from "next/image";
import Link from "next/link";

export default async function LandingPage() {

    // TODO: create landing page

    return (
        <div className="container flex flex-col w-full gap-y-10 items-center">
            <div
                className="w-full mt-16 flex flex-col justify-center items-center gap-y-10 max-w-lg mx-auto text-center mb-10">
                <h1 className="text-5xl tracking-wide font-bold text-gray-800 mb-4">
                    InfoMarker - Lorem ipsum dolor si amet!
                </h1>
                <p className="text-xl text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid consectetur consequatur
                    doloribus
                    earum eos et ipsum iste maiores nam, nemo neque optio placeat quis quo repudiandae sequi.
                </p>
                <Link rel="stylesheet" href="/app/load-document" className="btn btn-neutral rounded-full">Get started
                    for free</Link>
            </div>
            <Image src="/images/landing-overview.png" alt="Infomarker" width={1024} height={768}
                   className="border border-gray-400 rounded-lg shadow-lg"/>
            <h2 className="text-4xl font-bold">Почему выбрать <span className="underline underline-offset-2 mt-10 mb-6">нас</span>?
            </h2>
            <div className="flex flex-col lg:flex-row justify-start items-center gap-x-10 gap-y-5">
                <Image src="/images/landing-loading.png" alt="Loading" width={800} height={600}
                       className="border border-gray-400 rounded-lg shadow-lg flex-1"/>
                <article className="">
                    <h3 className="text-4xl font-bold mb-5">Поддерживаем pdf, docx и txt до 10мб</h3>
                    <p className="text-lg text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Aliquid consectetur consequatur doloribus earum eos et ipsum iste maiores nam, nemo neque optio
                        placeat quis quo repudiandae sequi.</p>
                    <Link rel="stylesheet" href="/app/load-document" className="font-bold text-lg underline mt-6">
                        Go load your first document</Link>
                </article>
            </div>
            <div className="flex flex-col lg:flex-row-reverse justify-start items-center gap-x-10 gap-y-5">
                <Image src="/images/landing-navigation.png" alt="Loading" width={800} height={600}
                       className="border border-gray-400 rounded-lg shadow-lg flex-1"/>
                <article className="">
                    <h3 className="text-3xl font-bold mb-5">Удобная навигация по вхождениям</h3>
                    <p className="text-lg text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Aliquid consectetur consequatur doloribus earum eos et ipsum iste maiores nam, nemo neque optio
                        placeat quis quo repudiandae sequi.</p>
                    <Link rel="stylesheet" href="/app/reports" className="font-bold text-lg underline mt-6">
                        Go check your reports</Link>
                </article>
            </div>

            <div className="flex flex-col lg:flex-row justify-start items-center gap-x-10 gap-y-5">
                <Image src="/images/landing-navigation.png" alt="Loading" width={800} height={600}
                       className="border border-gray-400 rounded-lg shadow-lg flex-1"/>
                <article className="">
                    <h3 className="text-3xl font-bold mb-5">Возможность конвертировать отчет в PDF</h3>
                    <p className="text-lg text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Aliquid consectetur consequatur doloribus earum eos et ipsum iste maiores nam, nemo neque optio
                        placeat quis quo repudiandae sequi.</p>
                    <Link rel="stylesheet" href="/app/reports" className="font-bold text-lg underline mt-6">
                        Go check your reports</Link>
                </article>
            </div>

            <div className="w-full flex flex-col justify-center items-center gap-y-10 mt-12 py-16 bg-gray-100">
                <h3 className="text-5xl tracking-wide font-bold text-gray-800 mb-4">
                    Get started for free
                </h3>
                <p className="text-xl text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid consectetur consequatur
                    doloribus
                    earum eos et ipsum iste maiores nam, nemo neque optio placeat quis quo repudiandae sequi.
                </p>
                <Link rel="stylesheet" href="/auth" className="btn btn-neutral rounded-full">Try
                    for free</Link>
            </div>
        </div>
    )
}
import Image from "next/image";

export default function Footer() {
    return (
        <div className="w-full py-3 2xl:py-6 px-12 bg-neutral z-10">
            <Image src="/logo_inverse.png" alt="Informarker" width={640} height={480} className="w-48 xl:w-60"/>
            <h4 className="text-xs select-none text-neutral-content ml-56">Маркировка упоминаний иностранных агентов <br/> и нежелательных
                организаций в ваших текстах</h4>
        </div>
    )
}
import Link from "next/link";
import { BsFileEarmarkArrowUp } from "react-icons/bs";

export default function AddNewReport() {
    return (
        <Link href={`/app/load-document`}
              className="rounded-lg border-base-200 hover:border-base-400 border-2 group cursor-pointer shadow relative">
            <div className="w-52 h-64 bg-base-100 flex flex-col gap-y-2 items-center justify-center rounded-lg hover:bg-base-300
             duration-300 opacity-60 hover:opacity-100 transition">
                <BsFileEarmarkArrowUp size={80}/>
                <h5 className="font-bold mt-2 break-all max-w-48">Загрузи новый отчет</h5>
            </div>
        </Link>
    )
}
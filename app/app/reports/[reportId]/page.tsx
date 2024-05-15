import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import { getReportById } from "@/app/lib/db/report";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { getReportOccurrences } from "@/app/app/reports/actions";
import FoundAgentsInfo from "@/app/app/reports/[reportId]/FoundAgentsInfo";


interface DocumentPageProps {
    params: {
        reportId: string,
    }
}

export default async function DocumentPage({ params: { reportId } }: DocumentPageProps) {

    const report = await getReportById(+reportId);

    const occurrences = await getReportOccurrences(+reportId);

    if (!report) {
        return (
            <div className="alert alert-error h-16" role="alert">
                <MdErrorOutline size={36}/>
                <span>Отчет не был найден</span>
            </div>
        )
    }

    return (
        <div className=" max-h-[70vh] flex justify-between gap-x-6">
            <div className="max-w-[55vw] w-full h-full flex flex-col  gap-y-3 flex-[4]">
                <Link href="/app/reports" className="flex gap-x-2 text-sm items-center hover:underline">
                    <FaArrowLeftLong size={16}/> Назад
                </Link>
                <h3 className="text-xl font-bold">Отчет по файлу {report.filename}</h3>
                <TextSection text={report.text} occurrences={occurrences}/>
            </div>
            <div className="flex-[2] min-w-72">
                <div className="w-full rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center w-1/2 p-3 text-sm">
                    <GrCircleInformation size={60}/>
                    <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго
                        рекомендательный
                        характер и не могут использоваться в качестве
                        юридического документа</p>
                </div>
                <div className="mt-10">
                    <h4 className="text-xl font-bold">Обнаруженные упоминания</h4>
                    <FoundAgentsInfo occurrences={occurrences} />
                </div>
            </div>
        </div>
    );
}
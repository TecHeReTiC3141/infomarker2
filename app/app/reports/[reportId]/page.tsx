import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import { getReportById } from "@/app/lib/db/report";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { getReportOccurrences } from "@/app/app/reports/actions";
import FoundAgentInfo from "@/app/app/reports/[reportId]/FoundAgentInfo";
import ReportSection from "@/app/app/reports/[reportId]/ReportSection";


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
            <ReportSection report={report} occurrences={occurrences}/>
        </div>
    );
}
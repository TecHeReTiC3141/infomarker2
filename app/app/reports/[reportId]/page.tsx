import { getReportById } from "@/app/lib/db/report";
import { MdErrorOutline } from "react-icons/md";
import { getReportOccurrences } from "@/app/app/reports/actions";
import ReportSection from "@/app/app/reports/[reportId]/ReportSection";


interface ReportPageProps {
    params: {
        reportId: string,
    }
}

export default async function ReportPage({ params: { reportId } }: ReportPageProps) {

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
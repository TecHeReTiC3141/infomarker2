import { getUserReports } from "@/app/lib/db/report";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import ReportCard from "@/app/app/reports/components/ReportCard";
import Link from "next/link";
import SelectedReportContextProvider from "@/app/app/reports/contexts/SelectedReportContext";
import SelectedReportModal from "@/app/app/reports/components/SelectedReportModal";

interface ReportsPageProps {
    searchParams: {
        selectedReportId: string;
    }
}

export default async function ReportsPage({ searchParams: { selectedReportId } }: ReportsPageProps) {

    // TODO: implement editing (renaming) and deleting of reports in separate modal

    const session = await getServerSession(authOptions) as Session;

    const user = session.user;
    const reports = await getUserReports(user.id);

    const selectedReport = reports.find(report => report.id === Number(selectedReportId));
    return (
        <div className="w-full">
            {
                reports.length ?
                    <>
                        <h2 className="text-xl font-bold mb-4">Ваши отчеты ({reports.length})</h2>
                        <div className="w-full flex gap-x-6 gap-y-4 flex-wrap items-start">
                            {reports.map(report => (
                                <ReportCard key={report.id} report={report}/>
                            ))}
                        </div>
                        <SelectedReportModal selectedReport={selectedReport}/>
                    </> :
                    <h2 className="text-xl font-bold">У вас нет отчетов. <Link href="/app/load-document"
                                                                               className="link">Загрузите
                        первый</Link></h2>
            }

        </div>
    );
}
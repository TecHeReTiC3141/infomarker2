import { getUserReports } from "@/app/lib/db/report";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { SessionUser } from "@/app/lib/db/user";
import ReportCard from "@/app/app/reports/components/ReportCard";

export default async function ReportsPage() {

    const session = await getServerSession(authOptions) as Session;

    const user = session.user;
    const reports = await getUserReports(user.id);
    return (
        <div className="w-full">

            <h2 className="text-xl font-bold mb-4">Ваши отчеты</h2>
            <div className="w-full flex gap-x-6 gap-y-4 flex-wrap items-start">
                {reports.map(report => (
                    <ReportCard key={report.id} report={report}/>
                ))}
            </div>
        </div>
    );
}
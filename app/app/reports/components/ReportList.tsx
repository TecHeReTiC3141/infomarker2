"use client"

import { ReactSortable } from "react-sortablejs";
import ReportCard from "@/app/app/reports/components/ReportCard";
import { useState } from "react";
import { Report } from "@prisma/client";
import AddNewReport from "@/app/app/reports/components/AddNewReport";

interface ReportListProps {
    initialReports: Report[],
}

export default function ReportList({ initialReports }: ReportListProps) {

    const [ reports, setReports ] = useState<Report[]>(initialReports);

    return (
        <ReactSortable className="w-full flex gap-x-6 gap-y-4 flex-wrap items-start" list={reports} setList={setReports}
                       animation={200}
                       delay={2}>
            {reports.map(report => (
                <ReportCard key={report.id} report={report}/>
            ))}
        </ReactSortable>
    )

}
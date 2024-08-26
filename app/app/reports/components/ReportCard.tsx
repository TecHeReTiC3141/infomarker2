"use client"

import FileIcon from "@/app/app/load-document/components/FileIcon";
import Link from "next/link";
import { Report } from "@prisma/client";
import { MdEdit } from "react-icons/md";
import { useSelectedReport } from "@/app/app/reports/contexts/SelectedReportContext";

interface ReportCardProps {
    report: Report,
}

export default function ReportCard({ report }: ReportCardProps) {

    const {setSelectedReportId} = useSelectedReport();

    return (
        <Link href={`/app/reports/${report.id}`}
              className="rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-300 px-4 pb-3 pt-4 group cursor-pointer shadow relative">
            <div className="w-48 h-48 bg-base-100 flex items-center justify-center rounded-lg">
                <FileIcon filename={report.filename}/>
            </div>
            <h5 className="font-bold mt-2 break-all max-w-48">{report.filename}</h5>
            <button
                className="btn btn-xs btn-circle hidden group-hover:flex absolute -top-2 -right-2 items-center justify-center cursor-pointer"
                onClick={event => {
                    event.preventDefault();
                    setSelectedReportId(report.id);
                    const modal = document.getElementById("selected-report-modal") as HTMLDialogElement;
                    modal.showModal();
                }}>
                <MdEdit size={14}/>
            </button>
        </Link>
    )
}
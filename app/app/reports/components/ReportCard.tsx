import { Document } from "@prisma/client";
import FileIcon from "@/app/app/load-document/components/FileIcon";
import Link from "next/link";

interface ReportCardProps {
    report: Document,
}

export default function ReportCard({ report }: ReportCardProps) {
    return (
        <Link href={`/app/reports/${report.id}`} className="rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-300 px-4 py-3 cursor-pointer shadow ">
            <div className="w-48 h-48 bg-base-100 flex items-center justify-center rounded-lg">
                <FileIcon filename={report.filename}/>
            </div>
            <h5 className="font-bold text-lg mt-2">{report.filename}</h5>
        </Link>
    )
}
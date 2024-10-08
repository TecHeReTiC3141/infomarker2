import FileIcon from "@/app/app/load-document/components/FileIcon";
import Link from "next/link";
import { Report } from "@prisma/client";
import { MdDragHandle, MdEdit } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


interface ReportCardProps {
    report: Report,
}

export default function ReportCard({ report }: ReportCardProps) {


    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Link href={`/app/reports/${report.id}`} onClick={() => setIsLoading(true)}
              className="rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-300 px-4 pb-3 pt-4 group cursor-pointer shadow relative select-none">
            <div className="w-48 h-48 bg-base-100 flex items-center justify-center rounded-lg">
                {isLoading ? <span className="loading loading-spinner loading-lg" />
                    : <FileIcon filename={report.filename}/>
                }
            </div>
            <h5 className="font-bold mt-2 break-all max-w-48">{report.name || report.filename}</h5>
            <button
                className="btn btn-xs btn-circle hidden group-hover:flex absolute -top-2 -right-2 items-center justify-center cursor-pointer"
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const newSearchParams = new URLSearchParams(searchParams.toString());
                    newSearchParams.set("selectedReportId", report.id.toString());
                    router.push(pathname + '?' + newSearchParams.toString());
                }}>
                <MdEdit size={14}/>
            </button>
            <button
                className="btn btn-xs btn-circle hidden group-hover:flex absolute -top-2 -left-2 items-center justify-center cursor-pointer handle"
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                }}>
                <MdDragHandle size={14}/>
            </button>
        </Link>
    )
}
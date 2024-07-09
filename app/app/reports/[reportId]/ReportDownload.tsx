import { OccurrenceWithAgent } from "@/app/app/reports/actions";

interface ReportDownloadProps {
    report: any,
    foundOccurrences: OccurrenceWithAgent[] | undefined,
    possibleOccurrences: OccurrenceWithAgent[] | undefined,

}

export default function ReportDownload({}: ReportDownloadProps) {
    return (
        <div>
        </div>
    );
}
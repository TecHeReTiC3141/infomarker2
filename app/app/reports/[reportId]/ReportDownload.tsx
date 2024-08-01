import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import FoundAgentInfo from "@/app/app/reports/[reportId]/components/FoundOccurInfo";
import PossibleOccurInfo from "@/app/app/reports/[reportId]/components/PossibleOccurInfo";
import { Report } from "@prisma/client";
import { ForwardedRef, forwardRef } from "react";
import { createPortal } from "react-dom";

interface ReportDownloadProps {
    report: Report,
    foundOccurrences: OccurrenceWithAgent[] | undefined,
    possibleOccurrences: OccurrenceWithAgent[] | undefined,
    agentCounts: Record<string, number>,
}

export const ReportDownload = forwardRef(function ReportDownload({
                                                                     report,
                                                                     foundOccurrences,
                                                                     possibleOccurrences,
                                                                     agentCounts,
                                                                 }: ReportDownloadProps,
                                                                 ref: ForwardedRef<HTMLParagraphElement>) {
    if (!window) return null;
    return (
        createPortal(
            <div ref={ref} className="flex gap-x-8 fixed top-0 left-[150vw] w-full">
                <div className="max-w-[55vw] w-full h-full flex flex-col  gap-y-3 flex-[6 relative">
                    <h3 className="text-2xl font-bold">Отчет по файлу {report.filename}</h3>
                    <TextSection text={report.text}
                                 occurrences={foundOccurrences}
                                 activeOccurSection={"found"}
                                 activeIndex={-1}/>
                </div>
                <div className="flex-[2] min-w-72 flex flex-col gap-y-3">
                    <div className="w-full rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center p-3">
                        <GrCircleInformation size={60}/>
                        <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго
                            рекомендательный
                            характер и не могут использоваться в качестве
                            юридического документа</p>
                    </div>

                    <h4 className="text-xl font-bold">Обнаруженные упоминания</h4>
                    <div
                        className="w-full flex flex-col gap-y-3 overflow-y-auto mt-2 px-2 max-2xl:text-sm pb-1">
                        <div className="flex w-full justify-between gap-x-3 text-sm text-gray-400">
                            <h4 className="pb-2 border-b-2 border-base-300 flex-1">иноагенты и организации</h4>
                            <h4 className="pb-2 border-b-2 border-base-300">количество</h4>
                        </div>
                        {foundOccurrences?.map((occurrence) => (
                            <FoundAgentInfo key={occurrence.id} occurrence={occurrence}
                                            isActive={false}
                                            activeAgentIndex={-1}
                                            counts={agentCounts} setActiveAgentId={() => {
                            }}
                                            setActiveAgentIndex={() => {
                                            }}/>))
                        }
                    </div>

                    <h4 className="text-xl font-bold">Возможные упоминания</h4>
                    <div
                        className="w-full flex flex-col gap-y-3 overflow-y-auto mt-2 px-2 max-2xl:text-sm pb-1">
                        <div className="flex w-full justify-between gap-x-3 text-sm text-gray-400">
                            <h4 className="pb-2 border-b-2 border-base-300 flex-1">иноагенты и организации</h4>
                            <h4 className="pb-2 border-b-2 border-base-300">количество</h4>
                        </div>
                        {possibleOccurrences?.map((occurrence) => (
                            <PossibleOccurInfo key={occurrence.id} occurrence={occurrence}
                                               isActive={false}
                                               counts={agentCounts} setActiveAgentId={() => {
                            }}
                                               setActiveAgentIndex={() => {
                                               }}/>))
                        }
                    </div>

                </div>
            </div>, document.body
        )
    );
});
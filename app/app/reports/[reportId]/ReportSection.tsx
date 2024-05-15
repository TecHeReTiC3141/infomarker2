"use client"

import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import FoundAgentsInfo from "@/app/app/reports/[reportId]/FoundAgentsInfo";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { useEffect, useRef, useState } from "react";

interface ReportSectionProps {
    report: any,
    occurrences: OccurrenceWithAgent[] | undefined
}

export default function ReportSection({ report, occurrences }: ReportSectionProps) {

    const sectionRef = useRef<HTMLParagraphElement>(null);

    const [ agentOccurCounts, setAgentOccurCounts ] = useState<{ [ key: string ]: number }>({});


    useEffect(() => {
        const marks = sectionRef.current?.querySelectorAll("mark") || [];
        for (let mark of marks) {
            mark.classList.add("rounded");
            occurLoop:
                for (let occurrence of (occurrences || [])) {
                    const { foreignAgent } = occurrence;
                    for (let variant of foreignAgent?.variants) {
                        if (mark.textContent?.toLowerCase() === variant) {
                            mark.style.background = occurrence.color;
                            mark.dataset.agentId = occurrence.foreignAgentId.toString();
                            setAgentOccurCounts(prev =>
                                ({ ...prev, [foreignAgent.id]: (prev[ foreignAgent.id ] || 0) + 1 }));
                            break occurLoop;
                        }
                    }
                }
        }
    }, [ occurrences ]);

    return (
        <>
            <div className="max-w-[55vw] w-full h-full flex flex-col  gap-y-3 flex-[4]">
                <Link href="/app/reports" className="flex gap-x-2 text-sm items-center hover:underline">
                    <FaArrowLeftLong size={16}/> Назад
                </Link>
                <h3 className="text-xl font-bold">Отчет по файлу {report.filename}</h3>
                <TextSection text={report.text} occurrences={occurrences} ref={sectionRef}/>
            </div>
            <div className="flex-[2] min-w-72">
                <div className="w-full rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center w-1/2 p-3 text-sm">
                    <GrCircleInformation size={60}/>
                    <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго
                        рекомендательный
                        характер и не могут использоваться в качестве
                        юридического документа</p>
                </div>
                <div className="mt-10">
                    <h4 className="text-xl font-bold">Обнаруженные упоминания</h4>
                    <FoundAgentsInfo occurrences={occurrences} counts={agentOccurCounts}/>
                </div>
            </div>
        </>
    )

}
"use client"

import Link from "next/link";
import { FaArrowLeftLong, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import FoundAgentInfo from "@/app/app/reports/[reportId]/FoundAgentInfo";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { MutableRefObject, useEffect, useRef, useState } from "react";

interface ReportSectionProps {
    report: any,
    occurrences: OccurrenceWithAgent[] | undefined
}

export default function ReportSection({ report, occurrences }: ReportSectionProps) {

    const sectionRef = useRef<HTMLParagraphElement>(null);

    const [ agentOccurCounts, setAgentOccurCounts ] = useState<{ [ key: string ]: number }>({});

    const agentIndexes = useRef<{ [ key: number ]: number[] }>({});

    const [ activeAgentId, setActiveAgentId ] = useState<number>(-1);

    const [ activeAgentIndex, setActiveAgentIndex ] = useState<number>(-1);

    console.log(activeAgentId, activeAgentIndex, agentIndexes);

    useEffect(() => {
        const marks = sectionRef.current?.querySelectorAll("mark") || [];
        setAgentOccurCounts({});
        agentIndexes.current = {};
        for (let i = 0; i < marks.length; ++i) {
            const mark = marks[ i ];
            occurLoop:
                for (let occurrence of (occurrences || [])) {
                    const { foreignAgent } = occurrence;
                    for (let variant of foreignAgent?.variants) {
                        if (mark.textContent?.toLowerCase() === variant) {
                            mark.style.background = occurrence.color;
                            agentIndexes.current[ foreignAgent.id ] = [ ...(agentIndexes.current[ foreignAgent.id ] || []), i ];
                            let curIndex = agentIndexes.current[ foreignAgent.id ].length - 1;
                            mark.dataset.agentId = occurrence.foreignAgentId.toString();
                            mark.dataset.index = curIndex;
                            mark.addEventListener("click", () => {
                                setActiveAgentId(foreignAgent.id);
                                setActiveAgentIndex(curIndex);
                            })
                            setAgentOccurCounts(prev =>
                                ({ ...prev, [ foreignAgent.id ]: (prev[ foreignAgent.id ] || 0) + 1 }));
                            break occurLoop;
                        }
                    }
                }

        }
        console.log(agentIndexes.current);
    }, [ occurrences ]);


    useEffect(() => {
        const marks = (sectionRef as MutableRefObject<HTMLParagraphElement>).current?.querySelectorAll("mark") || [];
        for (let mark of marks) {
            if (mark.dataset.agentId === activeAgentId.toString()) {
                console.log(mark.textContent);
                mark.classList.add("highlighted");
                if (mark.dataset.index === activeAgentIndex.toString()) {
                    mark.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                mark.classList.remove("highlighted");
            }
        }
    }, [ activeAgentId, activeAgentIndex ]);
    // TODO: add switcher to possible occurrences section
    return (
        <>
            <div className="max-w-[55vw] w-full h-full flex flex-col  gap-y-3 flex-[4]">
                <Link href="/app/reports" className="flex gap-x-2 text-sm items-center hover:underline">
                    <FaArrowLeftLong size={16}/> Назад
                </Link>
                <h3 className="text-xl font-bold">Отчет по файлу {report.filename}</h3>
                <TextSection text={report.text} occurrences={occurrences} ref={sectionRef}
                             activeIndex={agentIndexes.current?.[ activeAgentId ]?.[ activeAgentIndex ] || -1}/>
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
                    <div className="w-full flex flex-col gap-y-3 overflow-y-auto max-h-[29rem] mt-2 px-2">
                        <div className="flex w-full justify-between gap-x-3 text-sm text-gray-400">
                            <h4 className="pb-2 border-b-2 border-base-300 flex-1">иноагенты и организации</h4>
                            <h4 className="pb-2 border-b-2 border-base-300">количество</h4>
                        </div>
                        {occurrences?.map((occurrence) => (
                            <FoundAgentInfo key={occurrence.id} occurrence={occurrence}
                                            isActive={occurrence.foreignAgent.id === activeAgentId}
                                            counts={agentOccurCounts} setActiveAgentId={setActiveAgentId}
                                            setActiveAgentIndex={setActiveAgentIndex} ref={sectionRef}/>
                        ))}
                    </div>

                    <h4 className="text-xl font-bold">Возможные упоминания</h4>
                </div>
            </div>
        </>
    )

}
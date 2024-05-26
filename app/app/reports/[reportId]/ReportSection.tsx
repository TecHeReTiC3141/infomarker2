"use client"

import Link from "next/link";
import { FaArrowLeftLong, FaRegCircleQuestion } from "react-icons/fa6";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import FoundAgentInfo from "@/app/app/reports/[reportId]/FoundAgentInfo";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import SelectOccurVariant from "@/app/app/reports/[reportId]/SelectOccurVariant";
import { IconType } from "react-icons";
import { BsExclamationCircle } from "react-icons/bs";
import PossibleOccurInfo from "@/app/app/reports/[reportId]/components/PossibleOccurInfo";
import { BRIGHTNESS_THRESHOLD, getColorBrightness } from "@/app/utils/occuranceColors";

interface ReportSectionProps {
    report: any,
    occurrences: OccurrenceWithAgent[] | undefined
}

export const occurVariants: { [ k: string ]: IconType } = {
    "possible": FaRegCircleQuestion,
    "found": BsExclamationCircle,
}

export default function ReportSection({ report, occurrences }: ReportSectionProps) {

    const sectionRef = useRef<HTMLParagraphElement>(null);

    const [ agentOccurCounts, setAgentOccurCounts ] = useState<{ [ key: string ]: number }>({});

    const agentIndexes = useRef<{ [ key: number ]: number[] }>({});

    const [ activeAgentId, setActiveAgentId ] = useState<number>(-1);

    const [ activeAgentIndex, setActiveAgentIndex ] = useState<number>(-1);

    const [ activeOccurSection, setActiveOccurSection ] = useState<keyof typeof occurVariants>("found");

    console.log(activeAgentId, activeAgentIndex, agentIndexes);

    // effect for calculating of agent indexes and occurrences
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
                            agentIndexes.current[ foreignAgent.id ] = [ ...(agentIndexes.current[ foreignAgent.id ] || []), i ];
                            let curIndex = (agentIndexes.current[ foreignAgent.id ]?.length || 0) - 1;
                            mark.dataset.index = curIndex.toString();
                            mark.dataset.agentId = occurrence.foreignAgentId.toString();
                            setAgentOccurCounts(prev =>
                                ({ ...prev, [ foreignAgent.id ]: (prev[ foreignAgent.id ] || 0) + 1 }));
                            break occurLoop;
                        }
                    }
                }

        }
    }, [ occurrences ]);

    const filteredOccurrences = useMemo(() => {
            const filtered = activeOccurSection === "found" ?
                occurrences?.filter(occurrence => agentOccurCounts[ occurrence.foreignAgent.id ] > 0)
                : occurrences?.filter(occurrence => !agentOccurCounts[ occurrence.foreignAgent.id ]);
            return filtered?.length ? filtered : occurrences;
        }
        , [ activeOccurSection, agentOccurCounts, occurrences ]);

    // effect for styles and interactivity of marks in text section
    useEffect(() => {
        const marks = sectionRef.current?.querySelectorAll("mark") || [];
        for (let i = 0; i < marks.length; ++i) {
            const mark = marks[ i ];
            occurLoop:
                for (let occurrence of (filteredOccurrences || [])) {
                    const { foreignAgent } = occurrence;
                    for (let variant of foreignAgent?.variants) {
                        if (mark.textContent?.toLowerCase() === variant) {
                            mark.style.background = occurrence.color;
                            mark.style.color = getColorBrightness(occurrence.color) < BRIGHTNESS_THRESHOLD ? "white" : "black";
                            // TODO: implement storing of possible occurrences

                            // Fix error with active when mark is clicked
                            mark.addEventListener("click", () => {
                                setActiveAgentId(Number(mark.dataset.agentId));
                                setActiveAgentIndex(Number(mark.dataset.index) || -1);
                            });
                            break occurLoop;
                        }
                    }
                }

        }
        console.log(agentIndexes.current);
    }, [ filteredOccurrences ]);


    console.log(filteredOccurrences);


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
                <TextSection text={report.text} occurrences={filteredOccurrences}
                             ref={sectionRef}
                             activeIndex={agentIndexes.current?.[ activeAgentId ]?.[ activeAgentIndex ] || -1}/>
            </div>
            <div className="flex-[2] min-w-72">
                <div className="w-full rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center p-3 text-sm">
                    <GrCircleInformation size={60}/>
                    <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго
                        рекомендательный
                        характер и не могут использоваться в качестве
                        юридического документа</p>
                </div>
                <div className="mt-10">
                    <div className="w-full flex justify-between items-center">

                        <h4 className="text-xl font-bold">{activeOccurSection === "found" ? "Обнаруженные" : "Возможные"} упоминания</h4>
                        <SelectOccurVariant active={activeOccurSection} setActive={setActiveOccurSection}/>
                    </div>
                    <div className="w-full flex flex-col gap-y-3 overflow-y-auto max-h-[29rem] mt-2 px-2">
                        <div className="flex w-full justify-between gap-x-3 text-sm text-gray-400">
                            <h4 className="pb-2 border-b-2 border-base-300 flex-1">иноагенты и организации</h4>
                            <h4 className="pb-2 border-b-2 border-base-300">количество</h4>
                        </div>
                        {activeOccurSection === "found" ?
                            filteredOccurrences?.map((occurrence) => (
                                <FoundAgentInfo key={occurrence.id} occurrence={occurrence}
                                                isActive={occurrence.foreignAgent.id === activeAgentId}
                                                counts={agentOccurCounts} setActiveAgentId={setActiveAgentId}
                                                setActiveAgentIndex={setActiveAgentIndex}/>
                            )) :
                            filteredOccurrences?.map((occurrence) => (
                                <PossibleOccurInfo key={occurrence.id} occurrence={occurrence}
                                                   isActive={occurrence.foreignAgent.id === activeAgentId}
                                                   counts={agentOccurCounts} setActiveAgentId={setActiveAgentId}
                                                   setActiveAgentIndex={setActiveAgentIndex}/>
                            ))
                        }
                    </div>

                </div>
            </div>
        </>
    )

}
"use client"

import Link from "next/link";
import { FaArrowLeftLong, FaRegCircleQuestion } from "react-icons/fa6";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import FoundAgentInfo from "@/app/app/reports/[reportId]/components/FoundOccurInfo";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import SelectOccurVariant from "@/app/app/reports/[reportId]/components/SelectOccurVariant";
import { IconType } from "react-icons";
import { BsExclamationCircle } from "react-icons/bs";
import PossibleOccurInfo from "@/app/app/reports/[reportId]/components/PossibleOccurInfo";
import { BRIGHTNESS_THRESHOLD, getColorBrightness } from "@/app/utils/occuranceColors";
import { FaDownload } from "react-icons/fa6";
import html2canvas from 'html2canvas-pro';
import jsPDF from "jspdf";
import { Report } from "@prisma/client";
import { ReportDownload } from "@/app/app/reports/[reportId]/ReportDownload";


interface ReportSectionProps {
    report: Report,
    occurrences: OccurrenceWithAgent[] | undefined
}

export const occurVariants: { [ k: string ]: IconType } = {
    "possible": FaRegCircleQuestion,
    "found": BsExclamationCircle,
}

export default function ReportSection({ report, occurrences }: ReportSectionProps) {

    const downloadRef = useRef<HTMLDivElement>(null);

    const sectionRef = useRef<HTMLParagraphElement>(null);

    const [ agentOccurCounts, setAgentOccurCounts ] = useState<{ [ key: string ]: number }>({});

    const agentIndexes = useRef<{ [ key: number ]: number[] }>({});

    const [ activeAgentId, setActiveAgentId ] = useState<number>(-1);

    const [ activeAgentIndex, setActiveAgentIndex ] = useState<number>(-1);

    const [ activeOccurSection, setActiveOccurSection ] = useState<keyof typeof occurVariants>("found");

    console.log(activeAgentId, activeAgentIndex, agentIndexes);

    async function generatePdf() {
        const reportElement = downloadRef.current;

        const canvas = await html2canvas(reportElement!);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'px', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        console.log("PDF width", pdfWidth);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 15, 15, pdfWidth - 25, pdfHeight);
        pdf.save(`Отчет по файлу ${report.filename}.pdf`);
    }

    // effect for calculating of agent indexes and occurrences
    useEffect(() => {
        const marks = sectionRef.current?.querySelectorAll("mark") || [];
        setAgentOccurCounts({});
        agentIndexes.current = {};
        for (let i = 0; i < marks.length; ++i) {
            const mark = marks[i];
            occurLoop:
                for (let occurrence of (occurrences || [])) {
                    const { foreignAgent ,foundVariants } = occurrence;
                        const lengthSortReversed = (a: string, b: string) => (a > b ? -1 : 1)
                        for (let variant of foundVariants.sort(lengthSortReversed)) {
                            if (mark.textContent?.toLowerCase() === variant) {
                                agentIndexes.current[ foreignAgent.id ] = [ ...(agentIndexes.current[ foreignAgent.id ] || []), i ];
                                let curIndex = agentIndexes.current[ foreignAgent.id ].length - 1;
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
    }, [ activeOccurSection, agentOccurCounts, occurrences ]);

    const foundOccurrences = useMemo(() =>
            occurrences?.filter(occurrence => agentOccurCounts[ occurrence.foreignAgent.id ] > 0),
        [ agentOccurCounts, occurrences ]);

    const possibleOccurrences = useMemo(() =>
            occurrences?.filter(occurrence => !agentOccurCounts[ occurrence.foreignAgent.id ]),
        [ agentOccurCounts, occurrences ]);

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
                                console.log(mark.dataset.agentId, mark.dataset.index, Number(mark.dataset.index) ?? -1);
                                setActiveAgentId(Number(mark.dataset.agentId));
                                setActiveAgentIndex(Number(mark.dataset.index) ?? -1);
                            });
                            break occurLoop;
                        }
                    }
                }

        }
    }, [ filteredOccurrences ]);


    useEffect(() => {
        const marks = (sectionRef as MutableRefObject<HTMLParagraphElement>).current?.querySelectorAll("mark") || [];
        for (let mark of marks) {
            if (mark.dataset.agentId === activeAgentId.toString()) {
                mark.classList.add("highlighted");
                if (mark.dataset.index === activeAgentIndex.toString()) {
                    mark.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                mark.classList.remove("highlighted");
            }
        }
    }, [ activeAgentId, activeAgentIndex ]);

    return (
        <>
            <div className="flex gap-x-8">
                <div className="max-w-[55vw] w-full h-full flex flex-col  gap-y-3 flex-[4] relative">
                    <Link href="/app/reports" className="flex gap-x-2 text-sm items-center hover:underline">
                        <FaArrowLeftLong size={16}/> Назад
                    </Link>
                    <h3 className="text-xl font-bold">Отчет по файлу {report.filename}</h3>
                    <div className="tooltip tooltip-bottom absolute right-1 top-1" data-tip="Скачать PDF">
                        <button className=" btn btn-circle btn-ghost" onClick={generatePdf}><FaDownload size={24}/>
                        </button>
                    </div>
                    <TextSection text={report.text} occurrences={filteredOccurrences}
                                 ref={sectionRef}
                                 activeIndex={agentIndexes.current?.[ activeAgentId ]?.[ activeAgentIndex ] || -1}/>
                </div>
                <div className="flex-[2] min-w-72 flex flex-col gap-y-3">
                    <div className="w-full rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center p-3 text-sm">
                        <GrCircleInformation size={60}/>
                        <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго
                            рекомендательный
                            характер и не могут использоваться в качестве
                            юридического документа</p>
                    </div>
                    <div className="w-full flex justify-between items-center">

                        <h4 className="text-xl font-bold">{activeOccurSection === "found" ? "Обнаруженные" : "Возможные"} упоминания</h4>
                        <SelectOccurVariant active={activeOccurSection} setActive={setActiveOccurSection}/>
                    </div>
                    <div
                        className="w-full flex flex-col gap-y-3 overflow-y-auto mt-2 px-2 max-2xl:text-sm pb-1">
                        <div className="flex w-full justify-between gap-x-3 text-sm text-gray-400">
                            <h4 className="pb-2 border-b-2 border-base-300 flex-1">иноагенты и организации</h4>
                            <h4 className="pb-2 border-b-2 border-base-300">количество</h4>
                        </div>
                        {activeOccurSection === "found" ?
                            filteredOccurrences?.map((occurrence) => (
                                <FoundAgentInfo key={occurrence.id} occurrence={occurrence}
                                                isActive={occurrence.foreignAgent.id === activeAgentId}
                                                activeAgentIndex={activeAgentIndex}
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
            <ReportDownload ref={downloadRef} report={report} foundOccurrences={foundOccurrences}
                            possibleOccurrences={possibleOccurrences}/>
        </>
    )

}

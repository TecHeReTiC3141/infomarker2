"use client"

import Link from "next/link";
import { FaArrowLeftLong, FaDownload, FaRegCircleQuestion } from "react-icons/fa6";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";
import FoundAgentInfo from "@/app/app/reports/[reportId]/components/FoundOccurInfo";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { MutableRefObject, RefObject, useEffect, useMemo, useRef, useState } from "react";
import SelectOccurVariant from "@/app/app/reports/[reportId]/components/SelectOccurVariant";
import { BsExclamationCircle } from "react-icons/bs";
import PossibleOccurInfo from "@/app/app/reports/[reportId]/components/PossibleOccurInfo";
import { BRIGHTNESS_THRESHOLD, getColorBrightness } from "@/app/utils/occuranceColors";
import html2canvas from 'html2canvas-pro';
import jsPDF from "jspdf";
import { Report } from "@prisma/client";
import { ReportDownload } from "@/app/app/reports/[reportId]/ReportDownload";
import toast from "react-hot-toast";


interface ReportSectionProps {
    report: Report,
    occurrences: OccurrenceWithAgent[] | undefined
}

export const occurVariants = {
    "possible": FaRegCircleQuestion,
    "found": BsExclamationCircle,
} as const;

export default function ReportSection({ report, occurrences }: ReportSectionProps) {

    // TODO: add loading spinner for creating PDF report

    const downloadRef = useRef<HTMLDivElement>(null);

    const sectionRef = useRef<HTMLParagraphElement>(null);

    const [ agentOccurCounts, setAgentOccurCounts ] = useState<Record<string, number>>({});

    const agentIndexes = useRef<{ [ key: number ]: number[] }>({});

    const [ activeAgentId, setActiveAgentId ] = useState<number>(-1);

    const [ activeAgentIndex, setActiveAgentIndex ] = useState<number>(-1);

    const [ activeOccurSection, setActiveOccurSection ] = useState<keyof typeof occurVariants>("found");

    const [ pdfReportInProgress, setPdfReportInProgress ] = useState<boolean>(false);
    console.log(activeAgentId, activeAgentIndex, agentIndexes);

    // TODO: run function in a worker
    async function generatePdf() {
        setPdfReportInProgress(true);

        const reportElement = downloadRef.current as HTMLDivElement;
        if (reportElement === null) {
            toast.error("Не удалось сгенерировать PDF-отчет, попробуйте еще раз");
        }
        const reportFilename = `Отчет по файлу ${report.filename}.pdf`; // Replace with actual filename logic

        const canvas =  await html2canvas(reportElement);
        const imgData = canvas.toDataURL('image/png');

        const worker = new Worker(new URL('../workers/pdfWorker.ts', import.meta.url));

        worker.onmessage = (event) => {
            const { pdfBlob } = event.data;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = reportFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setPdfReportInProgress(false);
            worker.terminate();
        };

        worker.postMessage({ imgData });
    };

    // effect for calculating of agent indexes and occurrences
    useEffect(() => {
        const marks = sectionRef.current?.querySelectorAll("mark") || [];
        setAgentOccurCounts({});
        agentIndexes.current = {};
        for (let i = 0; i < marks.length; ++i) {
            const mark = marks[ i ];
            occurLoop:
                for (let occurrence of (occurrences || [])) {
                    const { foreignAgent, foundVariants } = occurrence;
                    const lengthSortReversed = (a: string, b: string) => (a.length > b.length ? -1 : 1)
                    for (let variant of foundVariants.sort(lengthSortReversed)) {
                        if (mark.textContent === variant) {
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

    function setMarkStyles(ref: RefObject<HTMLDivElement>, occurrences: OccurrenceWithAgent[] | undefined) {
        const marks = ref.current?.querySelectorAll("mark") || [];
        for (let i = 0; i < marks.length; ++i) {
            const mark = marks[ i ];
            occurLoop:
                for (let occurrence of (occurrences || [])) {
                    const { foreignAgent, foundVariants } = occurrence;
                    for (let variant of foundVariants) {
                        if (mark.textContent === variant) {
                            mark.style.background = occurrence.color;
                            mark.style.color = getColorBrightness(occurrence.color) < BRIGHTNESS_THRESHOLD ? "white" : "black";
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
    }

    // effect for styles and interactivity of marks in text section
    useEffect(() => {
        setMarkStyles(sectionRef, filteredOccurrences);
        setMarkStyles(downloadRef, foundOccurrences);
    }, [ filteredOccurrences, foundOccurrences ]);


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

    useEffect(() => {
        const activeAgent = document.querySelector(".active-agent");
        if (!activeAgent) return;
        activeAgent.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [ activeAgentId ]);

    return (
        <>
            <div className="flex gap-x-8">
                <div className="max-w-[50vw] w-full h-full flex flex-col gap-y-3 flex-[4] relative">
                    <Link href="/app/reports" className="flex gap-x-2 text-sm items-center hover:underline">
                        <FaArrowLeftLong size={16}/> Назад
                    </Link>
                    <h3 className="text-xl font-bold">Отчет по файлу {report.filename}</h3>
                    <div className="tooltip tooltip-bottom absolute right-1 top-1" data-tip="Скачать PDF">
                        <button className=" btn btn-circle btn-ghost" onClick={generatePdf}>
                            {pdfReportInProgress ? <span className="loading loading-spinner text-xl" /> : <FaDownload size={24}/> }
                        </button>
                    </div>
                    <TextSection text={report.text} occurrences={filteredOccurrences}
                                 ref={sectionRef}
                                 activeOccurSection={activeOccurSection}
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
                            possibleOccurrences={possibleOccurrences} agentCounts={agentOccurCounts}/>
        </>
    )

}

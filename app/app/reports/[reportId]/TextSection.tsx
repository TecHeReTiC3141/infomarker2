"use client"

import Highlighter from "react-highlight-words";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { useEffect, useRef } from "react";

interface TextSectionProps {
    text: string,
    occurrences: OccurrenceWithAgent[] | undefined
}

export default function TextSection({ text, occurrences }: TextSectionProps) {

    const sectionRef = useRef<HTMLParagraphElement>(null);

    const allSearchWords = occurrences?.reduce(
        (prev, occ) => prev.concat(occ.foreignAgent.variants), [] as string[]) || [];

    useEffect(() => {
        const marks = sectionRef.current?.querySelectorAll("mark") || [];
        for (let mark of marks) {
            occurLoop:
            for (let occurrence of (occurrences || [])) {
                const {foreignAgent} = occurrence;
                for (let variant of foreignAgent?.variants) {
                    if (mark.textContent?.toLowerCase() === variant) {
                        mark.style.background = occurrence.color;
                        mark.dataset.agentId = occurrence.foreignAgentId.toString();
                        break occurLoop;
                    }
                }
            }
        }
    }, [occurrences]);

    return (
        <div className="overflow-auto flex-1 border-2 rounded-md p-3 border-base-300 resize-none">
            <p ref={sectionRef} className="w-full mb-3 text-wrap whitespace-pre-line break-words">
                <Highlighter searchWords={allSearchWords} highlightStyle={{ background: "red" }}
                             textToHighlight={text.replace(/\n{2,}/g, '\n').trim()}/>
            </p>
        </div>
    );
}
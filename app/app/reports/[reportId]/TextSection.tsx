"use client"

import Highlighter from "react-highlight-words";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { ForwardedRef, forwardRef, useEffect, useRef } from "react";

interface TextSectionProps {
    text: string,
    occurrences: OccurrenceWithAgent[] | undefined,
    activeIndex: number,
}

const TextSection = forwardRef(function TextSection({ text, occurrences, activeIndex }: TextSectionProps, ref: ForwardedRef<HTMLParagraphElement>) {
    console.log("activeIndex", activeIndex);
    const allSearchWords = occurrences?.reduce(
        (prev, occ) => prev.concat(occ.foreignAgent.variants), [] as string[]) || [];

    return (
        <div className="overflow-auto flex-1 border-2 rounded-md p-3 border-base-300 resize-none">
            <p ref={ref} className="w-full mb-3 text-wrap whitespace-pre-line break-words">
                <Highlighter searchWords={allSearchWords} highlightStyle={{ background: "red" }} activeIndex={activeIndex} activeClassName="active"
                             textToHighlight={text.replace(/\n{2,}/g, '\n').trim()}/>
            </p>
        </div>
    );
});

export default TextSection;
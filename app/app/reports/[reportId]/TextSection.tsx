"use client"

import Highlighter from "react-highlight-words";

interface TextSectionProps {
    text: string,
}

export default function TextSection({ text }: TextSectionProps) {

    // TODO: implement function which gathers searchWords

    return (
        <div className="overflow-auto flex-1 border-2 rounded-md p-3 border-base-300 resize-none">
            <p className="w-full mb-3 text-wrap whitespace-pre-line break-words">
                <Highlighter searchWords={["итмо", "перце"]} highlightStyle={{ background: "red"}} textToHighlight={text.replace(/\n{2,}/g, '\n').trim()}/>
            </p>
        </div>
    );
}
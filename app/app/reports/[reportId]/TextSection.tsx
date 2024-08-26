import Highlighter, { Chunk, FindChunks } from "react-highlight-words";
import { OccurrenceWithAgent } from "@/app/app/reports/actions";
import { ForwardedRef, forwardRef } from "react";
import { occurVariants } from "@/app/app/reports/[reportId]/ReportSection";

interface TextSectionProps {
    text: string,
    occurrences: OccurrenceWithAgent[] | undefined,
    activeIndex: number,
    activeOccurSection: keyof typeof occurVariants,
}

function findMatches(regex: RegExp, textToHighlight: string, chunks: Chunk[]) {
    let match;
    while ((match = regex.exec(textToHighlight))) {
        let start = match.index
        let end = regex.lastIndex
        // We do not return zero-length matches
        if (end > start) {
            chunks.push({ start, end })
        }

        // Prevent browsers like Firefox from getting stuck in an infinite loop
        // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
        if (match.index === regex.lastIndex) {
            regex.lastIndex++
        }
    }
    return chunks;
}

const TextSection = forwardRef(function TextSection({
                                                        text,
                                                        occurrences,
                                                        activeIndex,
                                                        activeOccurSection
                                                    }: TextSectionProps,
                                                    ref: ForwardedRef<HTMLParagraphElement>) {

        const allSearchWords: string[] = occurrences?.flatMap(item => item.foundVariants) || [];

        function findChunksExplicit({ autoEscape, caseSensitive, searchWords, textToHighlight }: FindChunks): Array<Chunk> {

            return allSearchWords
                .filter(searchWord => searchWord) // Remove empty words
                .map(searchWord => autoEscape ? escapeRegExpFn(searchWord) : searchWord)
                .reduce((chunks, searchWord) => {
                        // Any word that starts with search word and ends with whitespace
                        const regex = new RegExp(`(?<=^|\\s|\\t)${searchWord}(?=\\s|\\t|$)`,
                            caseSensitive ? 'g' : 'gi');

                        return findMatches(regex, textToHighlight, chunks);
                    },
                    [] as Chunk[]);
        }

        const findChunks = ({ textToHighlight }: FindChunks) => {
            const chunks = [];
            const regex = new RegExp(`(?<=[\\^\\s!,.-])${allSearchWords.join('|')}(?=[$\\s!?,.-])`, 'gi');
            let match;
            while ((match = regex.exec(textToHighlight)) !== null) {
                console.log("match", match.index);
                chunks.push({
                    start: match.index,
                    end: regex.lastIndex,
                });
            }

            return chunks;
        };

        const findChunksDefault = ({
                                       autoEscape,
                                       caseSensitive,
                                       searchWords,
                                       textToHighlight
                                   }: FindChunks): Array<Chunk> => {


            return allSearchWords
                .filter(searchWord => searchWord) // Remove empty words
                .map(searchWord => autoEscape ? escapeRegExpFn(searchWord) : searchWord)
                .reduce((chunks, searchWord) => {
                        // Any word that starts with search word and ends with whitespace
                        const regex = new RegExp(`${searchWord}`,
                            caseSensitive ? 'g' : 'gi')

                        return findMatches(regex, textToHighlight, chunks);
                    },
                    [] as Chunk[])
        }

        return (

            <div className="overflow-auto flex-1 border-2 rounded-md p-3 border-base-300 resize-none leading-7">
                <p ref={ref} id="report-text" className="w-full mb-3 text-wrap whitespace-pre-line break-words">
                    <Highlighter searchWords={Array.of(...allSearchWords)} highlightStyle={{ background: "red" }}
                                 findChunks={activeOccurSection == "found" ? findChunksExplicit : findChunksDefault}
                                 caseSensitive={activeOccurSection == "found"}
                                 activeIndex={activeIndex} activeClassName="active"
                                 textToHighlight={text.replace(/\n{2,}/g, '\n').trim()}/>
                </p>
            </div>
        );
    }
)

function escapeRegExpFn(string: string): string {
    if (typeof string !== "string")
        return string
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

export default TextSection;
"use client"

import { OccurrenceWithAgent } from "@/app/app/reports/actions";

interface FoundAgentsInfoProps {
    occurrences: OccurrenceWithAgent[] | undefined
}

export default function FoundAgentsInfo({ occurrences }: FoundAgentsInfoProps) {

    function highlightAllAgentsOccurrences(agentId: number) {

    }


    return (
        <div className="w-full flex flex-col gap-y-3 overflow-y-auto max-h-[29rem] mt-2">
            <div className="flex w-full justify-between gap-x-2 text-sm text-gray-400">
                <h4 className="pb-2 border-b-2 border-base-300">иноагенты и организации</h4>
                <h4 className="pb-2 border-b-2 border-base-300">количество</h4>
            </div>
            {occurrences?.map((occurrence) => (
                <button key={occurrence.id} className="flex w-full rounded-md px-2 py-4"
                        style={{ backgroundColor: occurrence.color }}
                        onClick={() => highlightAllAgentsOccurrences(occurrence.foreignAgentId)}>
                    <p className="flex-1 text-left">{occurrence.foreignAgent.name}</p>
                    <p className="w-20 text-center">{3}</p>
                </button>
            ))}
        </div>
    )
}
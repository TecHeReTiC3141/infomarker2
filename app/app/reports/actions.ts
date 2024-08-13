import { AgentOccurance, ForeignAgent } from "@prisma/client";
import prisma from "@/app/lib/db/prisma";

export type OccurrenceWithAgent = AgentOccurance & { foreignAgent: ForeignAgent }

export async function getReportOccurrences(reportId: number): Promise<OccurrenceWithAgent[] | undefined> {
    return prisma?.agentOccurance.findMany({
        where: {
            reportId,
        },
        include: {
            foreignAgent: true,
        },
        orderBy: {
            foreignAgent: {
                type: "asc",
            }
        }
    });
}
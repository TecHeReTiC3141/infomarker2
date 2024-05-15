import { AgentOccurance, ForeignAgent } from "@prisma/client";

export type OccurrenceWithAgent = AgentOccurance & { foreignAgent: ForeignAgent }

export async function getReportOccurrences(reportId: number): Promise<OccurrenceWithAgent[] | undefined> {
    return prisma?.agentOccurance.findMany({
        where: {
            reportId,
        },
        include: {
            foreignAgent: true,
        }
    });
}
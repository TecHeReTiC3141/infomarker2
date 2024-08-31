"use server"

import { AgentOccurance, ForeignAgent, Report } from "@prisma/client";
import prisma from "@/app/lib/db/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateReportsOrder(newReports: Report[]) {
    for (const report of newReports) {
        const index = newReports.indexOf(report);
        await prisma?.report.update({
            where: {
                id: report.id,
            },
            data: {
                order: index,
            }
        })
    }
    revalidatePath("/app/reports");
}
"use server";

import prisma from "@/app/lib/db/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { Report } from "@prisma/client";
import { generateRandomHexColor } from "@/app/utils/occuranceColors";

interface createReportData {
    filename: string;
    text: string;
}

function countOccurrences(fullText: string, variant: string) {
    // Escape special characters in the substring and create a regular expression
    const escapedSubStr = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSubStr, 'gi');

    // Use match() with the regular expression to find all occurrences
    const matches = fullText.match(regex);

    // Return the number of matches found
    return matches?.length || 0;
}

async function fillAgentOccurrences(data: createReportData,
                                    id: number) {
    const foreignAgents = await prisma.foreignAgent.findMany();
    const lowered = data.text;
    for (let agent of foreignAgents) {
        let occurCount = 0;
        let findVariants: Set<string> = new Set();
        for (let variant of agent.variants) {
            let occurCountForVariant = countOccurrences(lowered, variant);
            if (occurCountForVariant > 0){
                occurCount += occurCountForVariant;
                findVariants.add(variant)
            }
        }
        if (occurCount > 0) {
            await prisma.agentOccurance.create({
                data: {
                    reportId: id,
                    foreignAgentId: agent.id,
                    color: generateRandomHexColor(),
                    count: occurCount,
                    foundVariants: Array.from(findVariants),
                }
            });
        }
    }
}


export async function createReport(data: createReportData) {

    const session = await getServerSession(authOptions) as Session;
    const user = session.user;

    // if (checksLeft <= 0 && role === UserRole.USER) throw new Error("Out of checks for this user");
    const [ { id }, ] = await prisma.$transaction([
        prisma.report.create({
            data: {
                ...data,

                userId: user.id,
            },
        }),
        prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                checksLeft: {
                    decrement: 1,
                }
            }
        })
    ]);
    await fillAgentOccurrences(data, id);
    return id;
}

export async function getReportById(id: number) {
    const session = await getServerSession(authOptions) as Session;
    const user = session.user;

    const report = await prisma.report.findUnique({
        where: {
            id,
        }
    });
    if (!report || report.userId !== user.id) {
        return null;
    }
    return report;
}

export async function getUserReports(userId: number): Promise<Report[]> {
    return prisma.report.findMany({
        where: {
            userId,
        }
    });
}

export async function recreateAgentOccurrences(reportId: number) {
    const report = await prisma.report.findUnique({
        where: {
            id: reportId,
        }
    });
    if (!report) {
        console.error("No report find by id");
        return;
    }
    await fillAgentOccurrences(report, reportId);

}
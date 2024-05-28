"use server";

import prisma from "@/app/lib/db/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { Report, User, UserRole } from "@prisma/client";
import { generateRandomHexColor } from "@/app/utils/occuranceColors";

interface createReportData {
    filename: string;
    text: string;
}

function countOccurrences(mainStr: string, subStr: string) {
    // Escape special characters in the substring and create a regular expression
    const escapedSubStr = subStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSubStr, 'g');

    // Use match() with the regular expression to find all occurrences
    const matches = mainStr.match(regex);

    // Return the number of matches found
    return matches?.length || 0;
}


export async function createReport(data: createReportData) {

    const session = await getServerSession(authOptions) as Session;
    const user = session.user;

    const { checksLeft, role } = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            checksLeft: true,
            role: true,
        }
    }) as User;

    if (checksLeft <= 0 && role === UserRole.USER) throw new Error("Out of checks for this user");
    const foreignAgents = await prisma.foreignAgent.findMany();
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
    const lowered = data.text.toLowerCase();
    for (let agent of foreignAgents) {
        let occurCount = 0;
        for (let variant of agent.variants) {
            occurCount += countOccurrences(lowered, variant);
        }
        if (occurCount > 0) {
            await prisma.agentOccurance.create({
                data: {
                    reportId: id,
                    foreignAgentId: agent.id,
                    color: generateRandomHexColor(),
                    count: occurCount,
                }
            });
            console.log(`${agent.name} found`);
        }
    }
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

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

export async function createReport(data: createReportData) {

    const session = await getServerSession(authOptions) as Session;
    const user = session.user;
    const foreignAgents = await prisma.foreignAgent.findMany();
    const { id } = await prisma.report.create({
        data: {
            ...data,

            userId: user.id,
        },
    });
    const lowered = data.text.toLowerCase();
    for (let agent of foreignAgents) {
        for (let variant of agent.variants) {
            if (lowered.includes(variant)) {
                await prisma.agentOccurance.create({
                    data: {
                        reportId: id,
                        foreignAgentId: agent.id,
                        color: generateRandomHexColor(),
                    }
                });
                console.log(`${agent.name} found`);
                break;
            }
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
    return await prisma.report.findMany({
        where: {
            userId,
        }
    });
}

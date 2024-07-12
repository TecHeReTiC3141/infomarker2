"use server";

import prisma from "@/app/lib/db/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { ForeignAgent, Report, User, UserRole } from "@prisma/client";
import { generateRandomHexColor } from "@/app/utils/occuranceColors";
import { util } from "zod";
import find = util.find;
import { id } from "postcss-selector-parser";
import axios from "axios";

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


interface ProperNames{
    organizations: string[],
    names: string[]
}
export async function get_proper_name(data: string) {
    try {

        const response = await axios.post<ProperNames>(`${ process.env.NLP_SERVER_BASE_URL }/get_proper_names_from_text`, data);
        if (response.status === 200) {
            return response.data
        }
        console.error(response.statusText);
        return null;
    } catch (error) {
        console.error((error as Error).message);
    }
}

async function fillAgentOccurrences(data: createReportData,
                                   id: number) {
    const foreignAgents = await prisma.foreignAgent.findMany();
    const lowered = data.text.toLowerCase();
    const foundProperNames = await get_proper_name(lowered)

    for (let agent of foreignAgents) {
        const findVariants = (foundProperNames?.names.concat(foundProperNames?.organizations) || [] )
            .filter(name => agent.variants.includes(name))
        const occurCount = findVariants.length
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
    // TODO: when foreign agents lists are updated then find occurrences in reports again
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
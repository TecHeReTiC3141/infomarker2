"use server";

import prisma from "@/app/lib/db/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";

interface createDocumentData {
    filename: string;
    text: string;
}

export async function createDocument(data: createDocumentData) {

    const session = await getServerSession(authOptions) as Session;
    const user = session.user;
    const { id } = await prisma.document.create({
        data: {
            ...data,
            userId: user.id,
        },
    });
    return id;
}

export async function getDocumentById(id: number) {
    const session = await getServerSession(authOptions) as Session;
    const user = session.user;

    const document = await prisma.document.findUnique({
        where: {
            id,
        }
    });
    if (!document || document.userId !== user.id) {
        throw new Error("Документ не найден");
    }
    return document;
}

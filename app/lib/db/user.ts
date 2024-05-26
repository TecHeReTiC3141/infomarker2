"use server"

import { User, UserRole } from "@prisma/client";
import prisma from "@/app/lib/db/prisma";
import bcrypt from "bcrypt";

export interface UserCredentials {
    name: string,
    email: string,
    password: string,
}

export interface UserSettings {
    name: string,
}

export type SessionUser =
    {
        id: number,
    } & {
    name?: string | null | undefined,
    email?: string | null | undefined,
    image?: string | null | undefined,
    role: UserRole,
    checksLeft: number,
} | undefined;

export async function createUser({name, email, password}: UserCredentials): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    });
}
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/db/prisma";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@mail.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findFirst({
                    where: { email: credentials.email },
                });

                console.log("found user", user, await bcrypt.compare(credentials.password, user?.password || "",));
                if (user && await bcrypt.compare(credentials.password, user.password || "")) {
                    const { password, ...userFields } = user;
                    console.log("logged", user);
                    return userFields as User;
                }
                return null;
            }
        }),
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID as string,
            clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        VkProvider({
            clientId: process.env.VK_CLIENT_ID as string,
            clientSecret: process.env.VK_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: "/auth",
        error: "/auth",
    },
    callbacks: {
        async jwt({ token, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (user) {
                token.accessToken = user.access_token;
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.id = token.id as number;
            const user = await prisma.user.findUnique({
                where: { id: token.id as number },
                select: {
                    name: true,
                    image: true,
                    role: true,
                    checksLeft: true,
                }
            }) as User;

            session.user.name = user.name;
            session.user.image = user.image;
            session.user.role = user.role;
            session.user.checksLeft = user.checksLeft;

            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
}
import {DefaultSession, DefaultUser} from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {

    interface Session {
        user: {
            id: number;
            role: UserRole;
            checksLeft: number,
        } & DefaultSession["user"];
        accessToken: string;
    }

    interface User extends DefaultUser{
        id: number;
        role: UserRole;
        checksLeft: number;
        access_token?: string;
    };

}
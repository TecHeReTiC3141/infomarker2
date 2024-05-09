import {DefaultSession, DefaultUser} from "next-auth";

declare module "next-auth" {

    interface Session {
        user: {
            id: number,
            slug: string,
        } & DefaultSession["user"];
        accessToken: string;
    }

    interface User extends DefaultUser{
        id: number;
        slug: string;
        access_token?: string;
    };

}
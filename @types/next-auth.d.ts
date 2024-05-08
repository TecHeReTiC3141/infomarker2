import { DefaultUser, DefaultSession } from "@/@types/next-auth";

declare module "@/@types/next-auth" {

    interface Session {
        user: User;
        accessToken: string;
    }

    interface User extends DefaultUser{
        id: number;
        access_token?: string;
    }

}
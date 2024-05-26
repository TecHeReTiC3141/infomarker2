import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { SessionUser } from "@/app/lib/db/user";

export default async function ProfilePage() {
    // TODO: add profile with basic information (avatar, name, subscription)
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    const user = session?.user as SessionUser;

    return (
        <div>{user?.name}</div>
    );


}
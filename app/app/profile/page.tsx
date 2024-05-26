import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { SessionUser } from "@/app/lib/db/user";
import UserAvatar from "@/app/components/user/UserAvatar";

export default async function ProfilePage() {
    // TODO: add profile with basic information (avatar, name, subscription)
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    const user = session?.user as SessionUser;

    return (
        <div>
            <UserAvatar user={user} width={240} height={300} />
            <h5 className="text-center font-bold text-lg">{user?.name}</h5>
        </div>
    );


}
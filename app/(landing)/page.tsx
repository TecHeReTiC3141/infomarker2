import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { redirect } from "next/navigation";

export default async function LandingPage() {

    // TODO: create landing page

    const session = await getServerSession(authOptions);

    if (session) {
        throw redirect("/app/load-document");
    }
    return (
        <div>Привет. Это Informarker. Чтобы начать пользоваться сервисом, сначала нужно зарегистрироваться</div>
    )
}
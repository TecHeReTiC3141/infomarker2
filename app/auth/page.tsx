import logo from "@/public/logo.png";
import Image from "next/image";
import AuthForm from "@/app/auth/components/AuthForm";

export default function Home() {
    return (
        <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image src={logo} alt="Logo" width={480} height={360} className="mx-auto"/>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Войдите в ваш аккаунт
                </h2>
            </div>
            <AuthForm />
        </div>
    );
}
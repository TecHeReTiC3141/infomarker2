"use client";

import { FaPlus, FaLock } from "react-icons/fa6";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import FileIcon from "@/app/app/load-document/components/FileIcon";
import { FadeLoader } from "react-spinners";
import { extractTextFromFile } from "@/app/utils/handleUploads";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionUser } from "@/app/lib/db/user";
import Link from "next/link";


export default function DocumentDroparea() {

    const session = useSession();

    const user = session.data?.user as SessionUser;

    const [ file, setFile ] = useState<File | null>(null);

    const [ error, setError ] = useState<string>("");

    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const [ isDragEntered, setIsDragEntered ] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    function validateFile(file: File): void {
        const fileTypes = [ "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf" ];
        const maxSize = 10 * 1024 * 1024;
        if (file === undefined) {
            throw new Error("Пустой файл");
        }
        console.log(file.type);
        if (!fileTypes.includes(file.type)) {
            throw new Error("Не поддерживаемый тип файла. Проверьте, что файл имеет одно из следующих расширений .doc, .docx, .api, .txt");
        }
        if (file.size > maxSize) {
            throw new Error("Слишком большой файл. Размер файла должен быть до 10 МБ");
        }
    }


    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[ 0 ];
        if (!file) return;
        console.log(file?.name, file?.type);
        setError("");
        try {
            validateFile(file);
            setFile(file);
        } catch (err) {
            setError((err as Error).message);
        }
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        console.log("Dropped");
        event.preventDefault();
        setError("");
        setIsDragEntered(false);
        const file = event.dataTransfer?.files[ 0 ];
        try {
            validateFile(file);
            setFile(file);
        } catch (err) {
            setError((err as Error).message);
        }
    }

    async function handleUpload() {
        if (!file) return;
        setIsLoading(true);
        try {
            const newReportId = await extractTextFromFile(file);
            router.push(`/app/reports/${newReportId}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    const hasAccess = useMemo(() => user && (user.checksLeft > 0 || user.role === "ADMIN"), [ user ]);

    return (
        <div className="w-full flex flex-col items-center gap-y-3">
            {hasAccess ?
                <div className="w-full h-96 bg-base-200 hover:bg-base-300 transition-colors duration-200
            border-4 border-dashed border-base-content/60
            flex flex-col gap-y-6 items-center justify-center rounded-xl"
                     onDragEnter={() => setIsDragEntered(true)}
                     onDragLeave={(event) => {
                         event.stopPropagation();
                         if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node)) {
                             setIsDragEntered(false);
                         }
                     }}
                     onDragOver={event => event.preventDefault()}
                     onDrop={handleDrop}>
                    {isLoading ? <FadeLoader color="#777" loading={isLoading} height={31} width={6} margin={30}
                                             aria-label="Loading spinner"/> : file ?
                        <FileIcon filename={file.name} clearFile={() => setFile(null)}/>
                        : <>
                            <FaPlus size={80} onDragEnter={event => event.preventDefault()}/>
                            <p className="text-xs text-center select-none">{isDragEntered ? "Отпустите для загрузки" :
                                <>Перетащите в эту область файл для проверки (doc, docx, pdf, txt до 10 МБ)<br/> или
                                    нажмите на
                                    кпопку</>}</p>
                            {!isDragEntered &&
                                <button className="btn btn-sm bg-base-200"
                                        onClick={() => fileInputRef.current?.click()}>Загрузить
                                    файл</button>}
                        </>
                    }
                </div> : <div className="w-full h-96 bg-base-200/85 hover:bg-base-300/85 transition-colors duration-200
            border-4 border-dashed border-base-content/60
            flex flex-col gap-y-6 items-center justify-center rounded-xl">
                    {isLoading ? <FadeLoader color="#777" loading={isLoading} height={31} width={6} margin={30}
                                             aria-label="Loading spinner"/> : <>
                        <FaLock size={80}/>
                        <p className="text-xs text-center leading-5 ">Бесплатные попытки использования Infomarker
                            закончились. <br/> <Link href="/buy-subscription"
                                                     className="text-accent font-bold hover:underline">Купите
                                подписку</Link>, чтобы продолжать
                            пользоваться сервисом</p>

                    </>}
                </div>
            }
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange}/>
            {error && <p className="text-error text-center">{error}</p>}
            {file && <button className="btn btn-lg btn-primary"
                             onClick={handleUpload} disabled={isLoading}>
                Отправить файл {isLoading && <span className="loading loading-spinner loading-sm text-info"/>}</button>}

        </div>
    )
}
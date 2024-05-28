
import mammoth from "mammoth";
import { createReport } from "@/app/lib/db/report";
import { extractTextFromPDF } from "@/app/app/load-document/actions";


function readTextFromTXT(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Обработчик успешного чтения файла
        reader.onload = () => {
            const text = (reader.result || " ") as string;
            resolve(text);
        };

        // Обработчик ошибок чтения файла
        reader.onerror = (error) => {
            reject(error);
        };

        // Чтение файла как текстового файла
        reader.readAsText(file);
    });
}

async function readTextFromPDF(file: File): Promise<string> {
    const data = new FormData();
    data.set("pdfFile", file);
    return await extractTextFromPDF(data);
}

function readTextFromDocx(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        // Обработчик успешного чтения файла
        reader.onload = async (event) => {
            const arrayBuffer = event.target!.result as ArrayBuffer;
            try {
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value);
            } catch (error) {
                reject(error);
            }
        };

        // Обработчик ошибок чтения файла
        reader.onerror = (error) => {
            reject(error);
        };

        // Чтение файла как массива байт
        reader.readAsArrayBuffer(file);
    });
}


interface FileExtensionHandlers {
    txt: (file: File) => Promise<string>,
    pdf: (file: File) => Promise<string>,
    doc: (file: File) => Promise<string>,
    docx: (file: File) => Promise<string>,
}

export async function extractTextFromFile(file: File) {
    const extension = file.name.split(".").at(-1);

    const fileHandlers: { [key in keyof FileExtensionHandlers]: FileExtensionHandlers[key] } = {
        txt: readTextFromTXT,
        pdf: readTextFromPDF,
        doc: readTextFromDocx,
        docx: readTextFromDocx,
    };

    const handler = fileHandlers[ extension as keyof FileExtensionHandlers ];

    const text = await handler(file);

    return await createReport({ filename: file.name, text });
}
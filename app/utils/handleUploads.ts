import pdfjsLib from "pdfjs-dist";
import { TextContent } from "pdfjs-dist/types/web/text_layer_builder";
import mammoth from "mammoth";
import { createDocument } from "@/app/lib/db/document";

// export function fileToBase64(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result?.toString().split(",")[ 1 ] || "");
//         reader.onerror = reject;
//     });
// }
//
// export function base64ToString(base64: string): string {
//     return Buffer.from(base64, "base64").toString();
// }

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
    // TODO: fix problem with this function
    // const arrayBuffer = await new Promise<string>((resolve, reject) => {
    //     const reader = new FileReader();
    //     resolve("Some string");
    //
    //     // Обработчик успешного чтения файла
    //     reader.onload = (event) => {
    //         console.log(event.target!.result);
    //         resolve(event.target!.result as string);
    //     };
    //
    //     // Обработчик ошибок чтения файла
    //     reader.onerror = (error) => {
    //         reject(error);
    //     };
    //
    //     // Чтение файла как массива байт
    //     reader.readAsArrayBuffer(file);
    // });
    //
    // // Используем pdfjs-dist для обработки PDF файла
    // const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    // const maxPages = pdf.numPages;
    // const pageTexts: string[] = [];
    //
    // for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    //     const page = await pdf.getPage(pageNum);
    //     const textContent = await page.getTextContent();
    //     const pageText = textContent.items.map((item) => item.str || "").join(' ');
    //     pageTexts.push(pageText);
    // }
    //
    // return pageTexts.join('\n') || "";
    return "PDF file text"
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
};


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

    return await createDocument({ filename: file.name, text });
}
"use server";


import pdf from 'pdf-parse/lib/pdf-parse';
export async function extractTextFromPDF(formData: FormData) {
    const file = formData.get("pdfFile") as File;
    console.log(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const parsed = await pdf(Buffer.from(arrayBuffer));
    return parsed.text;
}
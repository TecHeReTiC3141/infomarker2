"use server";

// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse";

export async function extractTextFromPDF(formData: FormData) {
    const file = formData.get("pdfFile") as File;
    const arrayBuffer = await file.arrayBuffer();
    const parsed = await pdf(Buffer.from(arrayBuffer));
    return parsed.text;
}
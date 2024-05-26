import pdfParse from "pdf-parse";

export async function POST(request: Request) {
    const data = await request.formData();
    const file = data.get("pdfFile") as File;
    const arrayBuffer = await file.arrayBuffer();
    const parsed = await pdfParse(Buffer.from(arrayBuffer));
    return parsed.text;
}
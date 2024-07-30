import pdf from "pdf-parse";

export default async function pdf2text(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const response = await pdf(buffer);
  return response.text;
}

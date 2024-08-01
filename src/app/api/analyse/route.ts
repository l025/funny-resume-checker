import axios from "axios";
import pdf2text from "../../../utils/pdf2text";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  // convert
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const response = await pdf(buffer);
  const text = response.text.replaceAll("\n", " ");

  // ai
  let aiModel;
  try {
    aiModel = process.env.AI_MODEL;
    const aiToken = process.env.AI_TOKEN;
    const urlAiAPI = "https://api.openai.com/v1/chat/completions";

    const messages = [
      {
        role: "system",
        content:
          "Read the resume text and highlight its weaknesses in a way that mocks the owner humorously and uniquely. Try to use humor and, if possible, incorporate poetry. Keep the text brief and in a casual tone.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `[${text}] Check this resume and response in Persian`,
          },
        ],
      },
    ];

    const data = { model: aiModel, messages, max_tokens: 2500 };

    const response = await axios.post(urlAiAPI, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiToken}`,
      },
    });

    return NextResponse.json({
      success: true,
      text: response.data.choices[0].message.content,
      resume: text,
      r1: text.replaceAll("\n", " "),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}

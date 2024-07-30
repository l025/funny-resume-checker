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
  const text = response.text;

  // ai
  try {
    const aiModel = process.env.AI_MODEL;
    const aiToken = process.env.AI_TOKEN;
    const urlAiAPI = "https://api.openai.com/v1/chat/completions";

    const messages = [
      {
        role: "system",
        content:
          "تو متن رزومه رو بخون و به نقاط ضعف به صورتی اشاره کن که صاحب این رزومه رو خیلی زیاد مسخره کنی و سعی کن طنزت منحصر به فرد باشه . متن به صورت مختصر و به زبان عامیانه باشه",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `[${text}] این رزومه رو بررسی کن`,
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
    console.log(response);
    return NextResponse.json({
      success: true,
      text: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}

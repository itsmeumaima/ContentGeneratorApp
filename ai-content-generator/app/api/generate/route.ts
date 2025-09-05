import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { writeFileSync } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseModalities: ["TEXT"],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const output: any[] = [];

    for (const candidate of response.candidates || []) {
      if (!candidate?.content?.parts) continue; // ✅ Skip if no content

      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const fileExtension = mime.getExtension(part.inlineData.mimeType || "");
          const buffer = Buffer.from(part.inlineData.data || "", "base64");

          const fileName = `output_${Date.now()}.${fileExtension}`;
          const filePath = path.join(process.cwd(), "public", fileName);

          writeFileSync(filePath, buffer);

          output.push({ type: "image", url: `/${fileName}` });
        } else if (part.text) {
          output.push({ type: "text", content: part.text });
        }
      }
    }

    return Response.json({ output });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-api-key") {
      // Mock response for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ 
        response: `This is a mocked response since no OpenAI key is configured. You asked: "${message}". In a production environment, I would provide personalized sustainability advice!` 
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are EcoTrace AI, a highly intelligent and encouraging sustainability assistant. Provide concise, practical, and science-backed advice on reducing carbon footprints." },
        { role: "user", content: message }
      ],
    });

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

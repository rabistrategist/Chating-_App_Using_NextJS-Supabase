import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await model.generateContent(message);
  const response = await result.response;
  const text = response.text();

  return NextResponse.json({ reply: text });
}
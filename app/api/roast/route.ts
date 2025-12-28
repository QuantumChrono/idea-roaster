import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { idea } = await req.json()

    if (!idea || typeof idea !== "string") {
      return Response.json({ error: "Invalid idea" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a brutally honest startup advisor. Give a harsh, direct critique of this startup idea. Be sarcastic, witty, and point out the flaws. Keep it to 2-3 paragraphs. Don't sugarcoat anything.

Startup idea: ${idea}`,
      temperature: 0.8,
      maxTokens: 500,
    })

    return Response.json({ roast: text })
  } catch (error) {
    console.error("Roast API error:", error)
    return Response.json({ error: "Failed to generate roast" }, { status: 500 })
  }
}

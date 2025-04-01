import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json()

    // Format messages for the API
    const formattedMessages = messages.map((message: any) => {
      // If content is an array (parsed code blocks), join them back together
      if (Array.isArray(message.content)) {
        const parts = message.content
          .map((part: any) => {
            if (part.type === "code") {
              return `\`\`\`${part.language || ""}\n${part.content}\n\`\`\``
            }
            return part.content
          })
          .join("\n\n")
        return {
          ...message,
          content: parts,
        }
      }
      return message
    })

    // Log the request for debugging
    console.log("Sending request to OpenRouter with model:", model)
    console.log(
      "Messages:",
      formattedMessages.map((m: any) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content.substring(0, 50) + "..." : "[Complex content]",
      })),
    )

    // Add special instructions for code formatting
    const systemMessage = formattedMessages.find((m: any) => m.role === "system")
    if (systemMessage) {
      systemMessage.content +=
        "\n\nWhen providing code examples, use markdown code blocks with the appropriate language syntax. For example: ```python\nprint('Hello World')\n```"
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://nit-hamirpur-placement.vercel.app",
        "X-Title": "College Student Assistant",
      },
      body: JSON.stringify({
        model: model || "google/gemini-pro-1.5:beta",
        messages: formattedMessages.filter((m: any) => m.role !== "system" || formattedMessages.indexOf(m) === 0),
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter API error:", response.status, errorText)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Received response from OpenRouter:", {
      model: data.model,
      content: data.choices?.[0]?.message?.content?.substring(0, 50) + "...",
    })

    return NextResponse.json({
      content: data.choices[0].message.content,
      model: data.model,
    })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json(
      { error: "Failed to process chat request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}


import { google } from "@ai-sdk/google"
import { streamText, StreamingTextResponse, tool } from "ai"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Fallback if API key is not configured for the demo
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
      start(controller) {
        const text = "I am Nova, your virtual AI concierge. I notice you haven't configured the Gemini API key yet, but I am still here to help! Based on your symptoms, I recommend resting and drinking plenty of fluids. If symptoms persist, please book an appointment using the calendar on the left."
        const parts = text.split(' ')
        let i = 0
        const interval = setInterval(() => {
          if (i < parts.length) {
            // Vercel AI SDK stream protocol format: 0:"text"\n
            controller.enqueue(encoder.encode(`0:${JSON.stringify(parts[i] + ' ')}\n`))
            i++
          } else {
            clearInterval(interval)
            controller.close()
          }
        }, 50)
      }
    })
    return new StreamingTextResponse(customReadable)
  }

  const result = await streamText({
    model: google("gemini-2.5-flash"),
    system: "You are Nova, an AI medical triage assistant for NovaCare Hospital. Your goal is to accurately assess symptoms, provide safe preliminary advice, and help patients navigate the hospital system. You have tools available to check blood inventory and find available doctors based on specialty. If a patient asks about blood availability or finding a doctor, ALWAYS use the provided tools to query the live database. ALWAYS include a disclaimer that you are an AI and not a replacement for professional medical emergency services. Be empathetic, professional, and concise.",
    messages,
    tools: {
      checkBloodInventory: tool({
        description: 'Check the live hospital inventory for a specific blood group.',
        parameters: z.object({
          bloodGroup: z.string().describe('The blood group to check e.g. "A+", "O-", "B+"')
        }),
        execute: async ({ bloodGroup }) => {
          try {
            const req = await fetch(`http://localhost:3000/api/blood-bank/inventory`);
            const inv = await req.json();
            const group = inv.find((i: any) => i.bloodGroup.toLowerCase() === bloodGroup.toLowerCase());
            
            if (!group) return `We do not have any records for blood group ${bloodGroup}.`;
            return `We currently have ${group.unitsAvailable} units of ${group.bloodGroup} in stock.`;
          } catch (e) {
            return "Sorry, I am unable to access the blood inventory database right now.";
          }
        },
      }),
      findAvailableDoctor: tool({
        description: 'Find a doctor at NovaCare Hospital by their medical specialty.',
        parameters: z.object({
          specialty: z.string().describe('The medical specialty e.g. "Cardiology", "Neurology", "Pediatrics"')
        }),
        execute: async ({ specialty }) => {
          // Mock finding doctors since we don't have a public GET /api/doctors route yet
          // In a real scenario, this would fetch from Prisma database
          const mockDoctors = [
            { name: "Dr. Sarah Jenkins", specialty: "Cardiology", available: true },
            { name: "Dr. Michael Chen", specialty: "Neurology", available: true },
            { name: "Dr. Emily Roberts", specialty: "Pediatrics", available: false }
          ];
          
          const matches = mockDoctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
          if (matches.length === 0) return `I couldn't find any specialist in ${specialty} currently listed in our directory.`;
          
          const available = matches.filter(d => d.available);
          if (available.length === 0) return `We have specialists for ${specialty}, but none are currently available.`;
          
          return `I found the following available ${specialty} specialists: ${available.map(d => d.name).join(", ")}. Would you like to schedule an appointment with one of them?`;
        }
      })
    }
  })

  return result.toDataStreamResponse()
}

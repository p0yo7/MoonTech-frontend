import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { description, requirements, tasks } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates project contracts based on project descriptions, requirements, and tasks." },
        { role: "user", content: `Generate a project contract based on the following information:

Project Description: ${description}

Requirements:
${requirements.map((req: string, index: number) => `${index + 1}. ${req}`).join('\n')}

Tasks:
${tasks.map((task: any, index: number) => `${index + 1}. ${task.name} - Estimated Time: ${task.estimatedTime}h, Estimated Cost: $${task.estimatedCost}`).join('\n')}

Please provide a professional contract that includes sections for project scope, deliverables, timeline, costs, and terms and conditions.` }
      ],
    })

    const contract = completion.choices[0].message.content

    return NextResponse.json({ contract })
  } catch (error) {
    console.error('Error generating contract:', error)
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 })
  }
}


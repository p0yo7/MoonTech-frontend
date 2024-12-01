import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { description, requirements } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates project tasks based on project descriptions and requirements." },
        { role: "user", content: `Generate 3-5 tasks based on the following project description and requirements:

Project Description: ${description}

Requirements:
${requirements.map((req: string, index: number) => `${index + 1}. ${req}`).join('\n')}

For each task, provide the following information:
- Task name
- Task description
- Estimated time to complete (in hours)
- Amount of effort (Low, Medium, or High)
- Priority level (Low, Medium, or High)
- Estimated cost (in USD)

Please provide the tasks in a JSON format.` }
      ],
    })

    const tasksString = completion.choices[0].message.content
    const tasks = JSON.parse(tasksString || '[]')

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error generating tasks:', error)
    return NextResponse.json({ error: 'Failed to generate tasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


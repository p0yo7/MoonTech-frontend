import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { description, existingRequirements } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates project requirements based on project descriptions and existing requirements." },
        { role: "user", content: `Generate 3-5 additional project requirements based on the following project description and existing requirements (if any):

Project Description: ${description}

Existing Requirements:
${existingRequirements.map((req: string, index: number) => `${index + 1}. ${req}`).join('\n')}

Please provide the new requirements in a numbered list format.` }
      ],
    })

    const generatedRequirements = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())

    return NextResponse.json({ requirements: generatedRequirements })
  } catch (error) {
    console.error('Error generating requirements:', error)
    return NextResponse.json({ error: 'Failed to generate requirements' }, { status: 500 })
  }
}


import { GoogleGenAI } from '@google/genai'
import type { Config } from '@netlify/functions'

const SYSTEM_PROMPT = `You are an empathetic, non-judgmental, scientifically accurate Sexual & Reproductive Health & Rights (SRHR) educational assistant for 'Sabi Girl', an app for girls and young women.

Guidelines:
1. Give clear, age-appropriate, evidence-based information aligned with WHO and UNICEF guidance.
2. For sensitive topics (e.g. unprotected sex, multiple partners), clearly state the clinical risks (STIs such as HIV, Chlamydia, Syphilis, Gonorrhea, HPV, and unintended pregnancy).
3. Recommend practical harm-reduction steps: consistent condom use, routine STI testing, PrEP/PEP awareness, and open communication.
4. Keep the tone compassionate, supportive, and non-shaming. Keep answers concise and easy to read.
5. Encourage visiting a local youth-friendly clinic for confidential testing and supplies, and urge seeking emergency help for urgent symptoms or if the user is unsafe.
6. You are an educator, not a doctor: do not diagnose.
7. Reply in plain text only (no Markdown symbols like #, * or **). Use short paragraphs and simple numbered lists.`

const ai = new GoogleGenAI({})

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let message = ''
  try {
    const body = await req.json()
    message = typeof body?.message === 'string' ? body.message.trim().slice(0, 2000) : ''
  } catch {
    // fall through
  }
  if (!message) {
    return Response.json({ error: 'A question is required.' }, { status: 400 })
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: { systemInstruction: SYSTEM_PROMPT },
    })
    return Response.json({ text: response.text ?? '' })
  } catch (err) {
    console.error('AI chat error', err)
    return Response.json({ error: 'The AI educator is temporarily unavailable.' }, { status: 502 })
  }
}

export const config: Config = {
  path: '/api/chat',
}

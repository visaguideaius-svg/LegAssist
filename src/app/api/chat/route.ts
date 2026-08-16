import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';

export async function POST(request: NextRequest) {
  try {
    const { messages, language } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const langContext = language === 'ar'
      ? '\n\nملاحظة: المستخدم يفضّل اللغة العربية. أجب بالعربية الفصحى المبسّطة.'
      : '\n\nNote: The user prefers English. Respond in clear, professional English.';

    const apiMessages = [
      {
        role: 'assistant' as const,
        content: SYSTEM_PROMPT + langContext,
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const completion = await zai.chat.completions.create({
      messages: apiMessages,
      thinking: { type: 'disabled' },
    });

    const assistantMessage = completion.choices?.[0]?.message?.content || '';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}

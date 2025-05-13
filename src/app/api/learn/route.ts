import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const topic = body.topic || 'learning anything';

  const prompt = `I'm trying to learn "${topic}". Please apply the 80/20 rule (Pareto Principle) and tell me the top 20% of concepts, tools, or knowledge areas that will give me 80% of the results. Format the response in a list with clear explanations.`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        context_length_exceeded_behavior: 'error',
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid response from Together.ai:', data);
      return NextResponse.json({ error: 'No valid response from Together.ai' }, { status: 502 });
    }

    const answer = data.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Together API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch from Together.ai' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateProductDescription } from '@/lib/ai';

const BodySchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  keywords: z.string().min(1, 'At least one keyword is required'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const description = await generateProductDescription(
      parsed.data.name,
      parsed.data.keywords,
    );
    return NextResponse.json({ description });
  } catch (err) {
    console.error('AI generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 },
    );
  }
}

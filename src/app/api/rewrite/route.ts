import { NextRequest, NextResponse } from 'next/server';
import { rewriteResume } from '@/lib/llm';

export async function POST(request: NextRequest) {
  const { originalCV, jobDesc } = await request.json();
  if (!originalCV || !jobDesc) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }
  try {
    const data = await rewriteResume(originalCV, jobDesc);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

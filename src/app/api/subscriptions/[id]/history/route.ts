import { NextResponse } from 'next/server';
import { getPriceHistory } from '@/lib/db';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const history = getPriceHistory(params.id);
    return NextResponse.json({ data: history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

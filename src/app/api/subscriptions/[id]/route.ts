import { NextResponse } from 'next/server';
import { getSubscriptionById, updateSubscription, deleteSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sub = getSubscriptionById(id);
    if (!sub) {
      return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sub });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = updateSubscription(id, {
      ...body,
      amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
      isTrial: body.isTrial !== undefined ? Boolean(body.isTrial) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteSubscription(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Előfizetés sikeresen törölve' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

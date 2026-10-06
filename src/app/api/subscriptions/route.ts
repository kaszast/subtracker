import { NextResponse } from 'next/server';
import { getAllSubscriptions, createSubscription } from '@/lib/db';
import { Subscription } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscriptions = getAllSubscriptions();
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error: any) {
    console.error('Hiba az előfizetések lekérésekor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Hiba történt az adatok lekérésekor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Alapvető validáció
    if (!body.name || !body.amount || !body.nextBillingDate) {
      return NextResponse.json(
        { success: false, error: 'A név, az összeg és a következő levonási dátum kitöltése kötelező.' },
        { status: 400 }
      );
    }

    const newSub: Omit<Subscription, 'createdAt' | 'updatedAt'> = {
      id: body.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: body.name.trim(),
      amount: parseFloat(body.amount),
      currency: body.currency || 'HUF',
      billingCycle: body.billingCycle || 'monthly',
      nextBillingDate: body.nextBillingDate,
      category: body.category || 'Egyéb',
      paymentMethod: body.paymentMethod?.trim() || undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      isTrial: Boolean(body.isTrial),
      trialEndDate: body.trialEndDate || undefined,
      notes: body.notes?.trim() || undefined,
      icon: body.icon || undefined,
      color: body.color || undefined,
      url: body.url?.trim() || undefined,
      domain: body.domain?.trim() || undefined,
      status: body.status || 'active'
    };

    const created = createSubscription(newSub);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('Hiba az előfizetés létrehozásakor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Nem sikerült létrehozni az előfizetést' },
      { status: 500 }
    );
  }
}

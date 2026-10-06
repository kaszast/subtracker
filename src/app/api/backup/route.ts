import { NextResponse } from 'next/server';
import { getAllSubscriptions, importSubscriptions } from '@/lib/db';
import { Subscription } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscriptions = getAllSubscriptions();
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      count: subscriptions.length,
      subscriptions
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="subscription_manager_backup_${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let subsToImport: Subscription[] = [];
    const mode = body.mode === 'merge' ? 'merge' : 'replace';

    if (Array.isArray(body)) {
      subsToImport = body;
    } else if (body.subscriptions && Array.isArray(body.subscriptions)) {
      subsToImport = body.subscriptions;
    } else {
      return NextResponse.json(
        { success: false, error: 'Érvénytelen biztonsági mentés fájlformátum. "subscriptions" tömb szükséges.' },
        { status: 400 }
      );
    }

    // Validáció
    for (const sub of subsToImport) {
      if (!sub.id || !sub.name || sub.amount === undefined || !sub.nextBillingDate) {
        return NextResponse.json(
          { success: false, error: `Hiányos előfizetés adat az importálandó fájlban: ${JSON.stringify(sub)}` },
          { status: 400 }
        );
      }
    }

    const result = importSubscriptions(subsToImport, mode);
    return NextResponse.json({
      success: true,
      message: `Sikeresen importálva ${result.count} db előfizetés (${mode === 'replace' ? 'felülírás' : 'összefésülés'} módban).`,
      count: result.count
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription, MonthlyStats } from '@/types';
import { formatMoney, getMonthlyEquivalentHuf } from './calculator';

// A jsPDF szabványos Helvetica betűtípusa WinAnsi kódolású, ami nem tartalmazza az ő/ű karaktereket.
// A cleanText átkonvertálja őket a teljesen támogatott szabványos ö/ü ékezetekre, megelőzve a 'Q' és hibás karaktereket.
function cleanText(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/ő/g, 'ö')
    .replace(/Ő/g, 'Ö')
    .replace(/ű/g, 'ü')
    .replace(/Ű/g, 'Ü');
}

export function generatePdfReport(subscriptions: Subscription[], stats: MonthlyStats): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const todayStr = new Date().toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fejléc sáv
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('ELŐFIZETÉSI KIMUTATÁS ÉS PÉNZÜGYI JELENTÉS'), 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(cleanText(`Készült: ${todayStr} | Valuta: HUF bázis`), 14, 21);

  // Fő mutatószámok dobozok
  const startY = 36;
  const boxWidth = (pageWidth - 28 - 9) / 4;
  const boxHeight = 20;

  const kpis = [
    { label: cleanText('Havi összköltség'), value: cleanText(formatMoney(stats.totalMonthlyHuf, 'HUF')) },
    { label: cleanText('Éves összköltség'), value: cleanText(formatMoney(stats.totalYearlyHuf, 'HUF')) },
    { label: cleanText('Aktív szolgáltatás'), value: `${stats.activeCount} db` },
    { label: cleanText('Közelgő (7 nap)'), value: `${stats.upcomingCount7Days} db` }
  ];

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (boxWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, boxWidth, boxHeight, 2, 2, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(kpi.label, x + 3.5, startY + 6);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.value, x + 3.5, startY + 14);
  });

  // Kategóriák szerinti összesítés táblázat
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('Kiadások kategóriák szerint'), 14, 66);

  const categoryRows = stats.categorySummaries.map(c => [
    cleanText(c.category),
    `${c.count} db`,
    cleanText(formatMoney(c.monthlyTotalHuf, 'HUF')),
    `${c.percentage}%`
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['Kategória', 'Előfizetések', 'Havi összeg', 'Részarány'].map(cleanText)],
    body: categoryRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // Részletes Előfizetések táblázat
  const lastTableEnd = (doc as any).lastAutoTable.finalY || 120;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('Részletes előfizetési lista'), 14, lastTableEnd + 10);

  const subRows = subscriptions.map(sub => [
    cleanText(sub.name + (sub.isTrial ? ' (Próba)' : '')),
    cleanText(sub.category),
    cleanText(formatMoney(sub.amount, sub.currency)),
    cleanText(cycleLabel(sub.billingCycle)),
    cleanText(formatMoney(Math.round(getMonthlyEquivalentHuf(sub)), 'HUF')),
    sub.nextBillingDate,
    cleanText(sub.paymentMethod || '-'),
    sub.isActive ? cleanText('Aktív') : cleanText('Inaktív')
  ]);

  autoTable(doc, {
    startY: lastTableEnd + 14,
    head: [['Szolgáltatás', 'Kategória', 'Összeg', 'Ciklus', 'Havi HUF', 'Következő levonás', 'Fizetési mód', 'Státusz'].map(cleanText)],
    body: subRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Oldalszám lábléc
      const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
      const currentPage = data.pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        cleanText(`Oldal ${currentPage} / ${pageCount} | Subscription Manager`),
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }
  });

  const filename = `elofizetesek_riport_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function cycleLabel(cycle: string): string {
  switch (cycle) {
    case 'monthly': return 'Havi';
    case 'yearly': return 'Éves';
    case 'quarterly': return 'Negyedéves';
    case 'weekly': return 'Heti';
    default: return cycle;
  }
}

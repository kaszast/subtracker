const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Filter active subscriptions
content = content.replace(
  /const stats: MonthlyStats = calculateMonthlyStats\(subscriptions\);/,
  `const activeSubscriptions = subscriptions.filter(s => s.status !== 'archived');
  const stats: MonthlyStats = calculateMonthlyStats(activeSubscriptions);`
);

// Pass activeSubscriptions to views that need it
content = content.replace(
  /<DashboardView\s+subscriptions=\{subscriptions\}/g,
  `<DashboardView\n                subscriptions={activeSubscriptions}`
);
content = content.replace(
  /<CalendarView\s+subscriptions=\{subscriptions\}/g,
  `<CalendarView\n                subscriptions={activeSubscriptions}`
);
content = content.replace(
  /<AnalyticsView\s+subscriptions=\{subscriptions\}/g,
  `<AnalyticsView\n                subscriptions={activeSubscriptions}`
);

// Add handleArchive function
const archiveFunction = `  const handleArchiveSubscription = async (sub: Subscription) => {
    try {
      const res = await fetch(\`/api/subscriptions/\${sub.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: sub.status === 'archived' ? 'active' : 'archived' })
      });
      if (!res.ok) throw new Error('Hiba az archiválás során');
      await fetchSubscriptions();
    } catch (err: any) {
      alert(err.message);
    }
  };`;

content = content.replace(
  /const handleDeleteSubscription =/g,
  archiveFunction + '\n\n  const handleDeleteSubscription ='
);

// Update SubscriptionListView props
content = content.replace(
  /<SubscriptionListView\s+subscriptions=\{subscriptions\}\s+onEdit=\{handleEditSubscription\}\s+onDelete=\{handleDeleteSubscription\}\s+onToggleStatus=\{handleToggleStatus\}\s+onOpenNewModal=\{handleOpenNewModal\}\s+\/>/g,
  `<SubscriptionListView
                subscriptions={subscriptions}
                onEdit={handleEditSubscription}
                onDelete={handleDeleteSubscription}
                onArchive={handleArchiveSubscription}
                onToggleStatus={handleToggleStatus}
                onOpenNewModal={handleOpenNewModal}
              />`
);

fs.writeFileSync('src/app/page.tsx', content);

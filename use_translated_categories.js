const fs = require('fs');

const fixCategories = (file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Inject import if not there
  if (!content.includes('getTranslatedCategory')) {
    content = content.replace(/import \{ useLanguage \} from '@\/lib\/i18n';/, "import { useLanguage, getTranslatedCategory } from '@/lib/i18n';");
    if (!content.includes('getTranslatedCategory') && content.includes("@/lib/i18n")) {
       content = content.replace(/import \{[^}]+\} from '@\/lib\/i18n';/, (match) => {
          return match.replace("}", ", getTranslatedCategory }");
       });
    }
  }

  // AnalyticsView
  if (file.includes('AnalyticsView')) {
    content = content.replace(/entry\.name/g, "getTranslatedCategory(t, entry.name)");
  }

  // DashboardView
  if (file.includes('DashboardView')) {
    content = content.replace(/sub\.category/g, "getTranslatedCategory(t, sub.category)");
  }

  // CalendarView
  if (file.includes('CalendarView')) {
    content = content.replace(/sub\.category/g, "getTranslatedCategory(t, sub.category)");
  }

  // SubscriptionListView
  if (file.includes('SubscriptionListView')) {
    content = content.replace(/sub\.category/g, "getTranslatedCategory(t, sub.category)");
    content = content.replace(/cat\} \/\* /g, "cat} /* "); // just a dummy
    content = content.replace(/\{cat\}/g, "{getTranslatedCategory(t, cat)}");
  }

  // SubscriptionModal
  if (file.includes('SubscriptionModal')) {
    content = content.replace(/\{cat\}/g, "{getTranslatedCategory(t, cat)}");
  }

  fs.writeFileSync(file, content);
};

fixCategories('src/components/AnalyticsView.tsx');
fixCategories('src/components/DashboardView.tsx');
fixCategories('src/components/CalendarView.tsx');
fixCategories('src/components/SubscriptionListView.tsx');
fixCategories('src/components/SubscriptionModal.tsx');

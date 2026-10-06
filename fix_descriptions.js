const fs = require('fs');

let theme = fs.readFileSync('src/components/ThemeSelector.tsx', 'utf8');
if (!theme.includes('getTranslatedThemeDescription')) {
  theme = theme.replace("import { useLanguage } from '@/lib/i18n';", "import { useLanguage, getTranslatedThemeDescription } from '@/lib/i18n';");
  theme = theme.replace("{theme.description}", "{getTranslatedThemeDescription(t, theme.id) || theme.description}");
  fs.writeFileSync('src/components/ThemeSelector.tsx', theme);
}

let modal = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');
if (!modal.includes('getTranslatedPresetDescription')) {
  modal = modal.replace("import { useLanguage, getTranslatedCategory } from '@/lib/i18n';", "import { useLanguage, getTranslatedCategory, getTranslatedPresetDescription } from '@/lib/i18n';");
  modal = modal.replace(/{preset.description}/g, "{getTranslatedPresetDescription(t, preset.id, preset.description)}");
  fs.writeFileSync('src/components/SubscriptionModal.tsx', modal);
}

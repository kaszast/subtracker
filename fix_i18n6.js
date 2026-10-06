const fs = require('fs');
let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

// I will just add the helper functions and dictionaries at the bottom of the file
const helpers = `
export function getTranslatedThemeDescription(t: any, themeId: string): string {
  const enMap: Record<string, string> = {
    'obsidian': 'Elegant deep graphite background with cool blue accents (Dark)',
    'minimal-light': 'Clean porcelain background with elegant black and royal blue typography (Light)',
    'arctic': 'Arctic blue-grey palette with ice blue and frosty turquoise shades (Dark)',
    'midnight': 'Deep night blue with discreet lavender and pastel blue accents (Dark)',
    'velvet': 'Velvety dark tones with soft warm purple and blue pastels (Dark)',
    'forest': 'Deep forest green and slate shades with premium emerald highlights (Dark)',
    'monochrome': 'Strict black-and-white and neutral grey typographic design (Dark)',
    'classic-dark': 'Classic dark cyan and teal background with subtle amber (Dark)',
    'sepia': 'Warm parchment background with elegant terracotta and warm brown details (Light)',
    'fintech': 'Deep indigo fintech aesthetic with modern cobalt blue focus (Dark)'
  };
  
  if (t('dashboard') !== 'Vezérlőpult') { // if english
    return enMap[themeId] || '';
  }
  
  // if hungarian, return the original from themes.ts (we will just map them back here for simplicity, or we can just return the original if it's passed)
  return '';
}

export function getTranslatedPresetDescription(t: any, presetId: string, originalDesc: string): string {
  if (t('dashboard') === 'Vezérlőpult') return originalDesc;

  const enMap: Record<string, string> = {
    'netflix': 'Streaming movies and series in Standard/Premium plan',
    'youtube-premium': 'Ad-free video watching and YouTube Music with background play',
    'apple-tv': 'Apple Originals movies and series in 4K HDR quality',
    'disney-plus': 'Disney, Pixar, Marvel, Star Wars and National Geographic content',
    'max': 'Warner Bros, HBO, Discovery and DC content',
    'amazon-prime': 'Prime Video streaming and free shipping benefits',
    'google-one': 'Google One AI Premium plan with 2TB storage and Gemini 1.5 Pro model',
    'chatgpt-plus': 'GPT-4o, Canvas, DALL-E image generation and priority access',
    'claude-pro': 'Claude 3.5 Sonnet, 5x more messages and Artifacts feature',
    'github-copilot': 'AI code completion and assistant for IDE development environment',
    'midjourney': 'Generative image generation software on Discord and web interface',
    'notion': 'Unlimited blocks, file uploads and collaboration workspace',
    'spotify': 'Ad-free music listening and podcasts with offline downloads',
    'apple-music': 'Spatial Audio and Lossless quality music streaming',
    'tidal': 'Hi-Res FLAC and Dolby Atmos studio quality streaming',
    'google-workspace': 'Extended Google Photos, Drive and Gmail storage with sharing',
    'apple-icloud': 'iCloud storage, Private Relay and Hide My Email feature',
    'dropbox': '2 TB encrypted cloud storage and synchronization',
    'adobe-creative-cloud': 'Photoshop, Illustrator, Premiere Pro, After Effects and InDesign',
    'figma': 'UI/UX design, prototyping and team collaboration',
    'canva-pro': 'Premium templates, brand kit and background remover',
    'jetbrains-all-products': 'IntelliJ IDEA, WebStorm, PyCharm, CLion and GoLand IDE package',
    'microsoft-365': 'Word, Excel, PowerPoint and 1TB OneDrive cloud storage',
    '1password': 'Secure password manager and digital vault for all devices',
    'nordvpn': 'Encrypted VPN and cybersecurity protection against threats',
    'playstation-plus': 'Online multiplayer and hundreds of downloadable PS4/PS5 games',
    'xbox-game-pass': 'Over 100 PC and console games, EA Play and Cloud Gaming',
    'nintendo-switch-online': 'Online play and classic NES/SNES game collection',
    'duolingo-super': 'Unlimited hearts, ad-free language learning and personalized practice',
    'strava': 'Detailed route planning, segment leaderboards and workout analysis',
    'headspace': 'Guided meditation, sleep sounds and mindfulness exercises'
  };

  return enMap[presetId] || originalDesc;
}
`;

i18n = i18n + '\n' + helpers;
fs.writeFileSync('src/lib/i18n.tsx', i18n);

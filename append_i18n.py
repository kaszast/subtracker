import re

with open('src/lib/i18n.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

new_keys = [
    ('changeTheme', "'Téma módosítása'", "'Change Theme'"),
    ('cardView', "'Kártya nézet'", "'Card View'"),
    ('tableView', "'Táblázat nézet'", "'Table View'"),
    ('toggleStatus', "'Státusz váltása'", "'Toggle Status'"),
    ('immediateSwitch', "'Azonnali váltás'", "'Immediate Switch'"),
    ('notEnoughData', "'Nincs elegendő adat a diagramhoz'", "'Not enough data for chart'"),
    ('noResults', "'Nincs találat a megadott feltételekre'", "'No results found for criteria'"),
    ('colService', "'Szolgáltatás'", "'Service'"),
    ('colCategory', "'Kategória'", "'Category'"),
    ('colAmount', "'Összeg'", "'Amount'"),
    ('colCycle', "'Ciklus'", "'Cycle'"),
    ('colPayment', "'Fizetési mód'", "'Payment Method'"),
    ('colStatus', "'Státusz'", "'Status'"),
    ('colActions', "'Műveletek'", "'Actions'"),
    ('errorOccurred', "'Hiba történt:'", "'An error occurred:'"),
    ('errorDelete', "'Hiba a törlés során:'", "'Error during deletion:'"),
    ('error', "'Hiba:'", "'Error:'"),
    ('errorPdf', "'Nem sikerült generálni a PDF riportot.'", "'Failed to generate PDF report.'"),
    ('confirmRestore', "'Biztosan visszaállítod ezt az előfizetést?'", "'Are you sure you want to restore this subscription?'"),
    ('confirmArchive', "'Biztosan archiválod ezt az előfizetést?'", "'Are you sure you want to archive this subscription?'"),
    ('placeholderName', "'pl. Netflix'", "'e.g. Netflix'"),
    ('placeholderAmount', "'pl. 3490'", "'e.g. 3490'"),
    ('placeholderNotes', "'pl. Családi csomag...'", "'e.g. Family plan...'"),
    ('placeholderUrl', "'https://...'", "'https://...'"),
]

def append_to_block(block, is_hu):
    # block is everything from "hu: {" up to "}," or "en: {" up to "}"
    # find all existing keys
    existing = set(re.findall(r'^\s*([a-zA-Z0-9_]+):', block, re.MULTILINE))
    
    # generate what to append
    append_str = ""
    for k, hu_val, en_val in new_keys:
        if k not in existing:
            val = hu_val if is_hu else en_val
            append_str += f"    {k}: {val},\n"
            
    # find the last comma before the closing brace or the closing brace itself
    # wait, the simplest is to find the last `}` or `},` and insert before it
    # the blocks end with `  },` (for hu) or `  }` (for en)
    
    if block.endswith('},\n'):
        return block[:-3] + append_str + "  },\n"
    elif block.endswith('}\n'):
        return block[:-2] + append_str + "  }\n"
    elif block.endswith('}'):
        return block[:-1] + append_str + "  }"
    elif block.endswith('},\n  '):
        # Just safely find the last \n  }
        idx = block.rfind('\n  }')
        return block[:idx+1] + append_str + block[idx+1:]
        
    return block

# Let's split by "en: {"
parts = code.split('  en: {\n')
hu_part = parts[0]
en_part = '  en: {\n' + parts[1]

# Now for hu_part, we want to insert right before `  },\n` which is at the end of hu_part
idx_hu = hu_part.rfind('  },\n')
if idx_hu != -1:
    hu_append = ""
    existing_hu = set(re.findall(r'^\s*([a-zA-Z0-9_]+):', hu_part, re.MULTILINE))
    for k, hu_val, en_val in new_keys:
        if k not in existing_hu:
            hu_append += f"    {k}: {hu_val},\n"
    hu_part = hu_part[:idx_hu] + hu_append + hu_part[idx_hu:]

# Now for en_part, we want to insert right before `  }\n};`
idx_en = en_part.rfind('  }\n};')
if idx_en != -1:
    en_append = ""
    existing_en = set(re.findall(r'^\s*([a-zA-Z0-9_]+):', en_part, re.MULTILINE))
    for k, hu_val, en_val in new_keys:
        if k not in existing_en:
            en_append += f"    {k}: {en_val},\n"
    en_part = en_part[:idx_en] + en_append + en_part[idx_en:]

final_code = hu_part + en_part

# Add helpers
helpers = """
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
  if (t('dashboard') !== 'Vezérlőpult') {
    return enMap[themeId] || '';
  }
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
"""

if "getTranslatedThemeDescription" not in final_code:
    final_code += helpers
    
# Apply the typecast fix
final_code = final_code.replace("return translations[lang][key] || key;", "return (translations[lang] as any)[key] || key;")

with open('src/lib/i18n.tsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

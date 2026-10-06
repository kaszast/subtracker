import re

with open('src/lib/i18n.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

new_keys = [
    ('trialWarning', "'Aktív próbaidőszak figyelmeztetés'", "'Active trial warning'"),
    ('trialWarningDesc', "'Ne felejtsd el időben lemondani, ha nem szeretnéd, hogy automatikusan megújuljon:'", "'Don\\'t forget to cancel in time to avoid auto-renewal:'"),
    ('manage', "'Kezelés'", "'Manage'"),
    ('today', "'Ma'", "'Today'"),
    ('inDays', "'nap múlva'", "'days left'"),
    ('cardPayment', "'Kártyás fizetés'", "'Card payment'"),
]

def append_to_block(block, is_hu):
    existing = set(re.findall(r'^\s*([a-zA-Z0-9_]+):', block, re.MULTILINE))
    append_str = ""
    for k, hu_val, en_val in new_keys:
        if k not in existing:
            val = hu_val if is_hu else en_val
            append_str += f"    {k}: {val},\n"
    if block.endswith('},\n'):
        return block[:-3] + append_str + "  },\n"
    elif block.endswith('}\n'):
        return block[:-2] + append_str + "  }\n"
    elif block.endswith('}'):
        return block[:-1] + append_str + "  }"
    elif block.endswith('},\n  '):
        idx = block.rfind('\n  }')
        return block[:idx+1] + append_str + block[idx+1:]
    return block

parts = code.split('  en: {\n')
hu_part = parts[0]
en_part = '  en: {\n' + parts[1]

idx_hu = hu_part.rfind('  },\n')
if idx_hu != -1:
    hu_append = ""
    existing_hu = set(re.findall(r'^\s*([a-zA-Z0-9_]+):', hu_part, re.MULTILINE))
    for k, hu_val, en_val in new_keys:
        if k not in existing_hu:
            hu_append += f"    {k}: {hu_val},\n"
    hu_part = hu_part[:idx_hu] + hu_append + hu_part[idx_hu:]

idx_en = en_part.rfind('  }\n};')
if idx_en != -1:
    en_append = ""
    existing_en = set(re.findall(r'^\s*([a-zA-Z0-9_]+):', en_part, re.MULTILINE))
    for k, hu_val, en_val in new_keys:
        if k not in existing_en:
            en_append += f"    {k}: {en_val},\n"
    en_part = en_part[:idx_en] + en_append + en_part[idx_en:]

final_code = hu_part + en_part

with open('src/lib/i18n.tsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

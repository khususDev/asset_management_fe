from pathlib import Path
import re

root = Path('src')

for path in root.rglob('*'):
    if not path.is_file() or path.suffix not in {'.js', '.vue', '.ts'}:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        continue

    original = text
    text = re.sub(r"['\"](API_ENDPOINTS\.[A-Za-z0-9_]+)['\"]", r'\1', text)
    text = re.sub(r"['\"](API_BASE_URL)['\"]", r'\1', text)

    if path.name == 'endpoints.js':
        text = text.replace("  optPurchaseRequestMasters: '/opt_purchase_request_masters'", "  optPurchaseRequest_masters: '/opt_purchase_request_masters'")
        text = text.replace("  prcVendorType: '/prc_vendor_type'", "  prcVendor_type: '/prc_vendor_type'")

    if text != original:
        path.write_text(text, encoding='utf-8')
        print(path)

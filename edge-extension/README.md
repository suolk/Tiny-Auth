# 2FA-Auth-Lite - Browser Extension

[English](#english) | [中文](./README.zh.md)

---

Browser extension version for Chrome, Edge, and other Chromium-based browsers.

## Installation

### From Store

- [**Edge Add-ons Store**](https://microsoftedge.microsoft.com/addons/detail/mlgkegmodaokoabknaehdahemdiebejg)

### From GitHub Releases

1. Visit the [Releases page](https://github.com/suolk/2FA-Auth-Lite/releases/tag/v1.0.0)
2. Download `2FA-Auth-Lite.zip`
3. Open your browser's extension page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
4. Enable **Developer mode**
5. Drag the extracted zip folder into the page, or click **Load unpacked** and select the extracted folder

## Usage

### Adding an Account

1. Click the extension icon in your browser toolbar
2. Click the **+** button in the top-right corner
3. Choose one of the following methods:

#### Method A: Upload QR Image
- Click **Upload QR** button
- Select a screenshot or image containing the QR code
- The secret will be extracted automatically

#### Method B: Manual Entry
- Paste the **Secret Key** (Base32 string provided by the service)

### Generating Codes

- Codes refresh automatically every 30 seconds
- Click any code to **copy to clipboard**
- A progress bar shows time remaining before refresh

### Language

Toggle between English and 中文 using the language switcher in the top-right corner.

## Permissions

- `storage` - Save your accounts locally
- `clipboardWrite` - Copy codes to clipboard
- `activeTab` - (Optional) Screenshot on websites

## Data Storage

All data is stored **locally** in your browser using `chrome.storage.local`. No data is sent to external servers.

## Troubleshooting

### Codes Not Working
- Check your system clock is accurate
- Ensure the secret was entered correctly
- Some services use non-standard TOTP parameters (not supported)

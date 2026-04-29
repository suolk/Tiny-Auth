# 2FA-Auth-Lite - Progressive Web App

[English](#english) | [中文](./README.zh.md)

---

Installable web app version for mobile and desktop platforms.

## Live Demo

Visit: **[https://www.netcache24.site/auth-pwa](https://www.netcache24.site/auth-pwa)**

## Installation

### Android (Chrome/Edge)

1. Visit [https://www.netcache24.site/auth-pwa](https://www.netcache24.site/auth-pwa)
2. Click the **Add to phone** button in the address bar or browser menu
3. The app will be added to your applications list

### Mobile (iOS/Android)

#### iOS (Safari)
1. Open the app link in Safari
2. Tap the **Share** button
3. Select **Add to Home Screen**
4. Tap **Add**

## Usage

### Adding an Account

1. Open the app
2. Tap the **+** button in the top-right corner
3. Choose one of the following methods:

#### Method A: Upload QR Image
- Tap **Upload QR** button (mobile) or **Scan QR** (desktop)
- Select a screenshot or image containing the QR code
- The secret will be extracted automatically

#### Method B: Manual Entry
- Paste the **Secret Key** (Base32 string provided by the service)
- Optionally add **Username**, **Site Name** and **Site URL** for organization
- Tap **Save** (or navigate back to auto-save)

### Generating Codes

- Codes refresh automatically every 30 seconds
- Tap any code to **copy to clipboard**
- A progress bar shows time remaining before refresh

## Data Storage

All data is stored **locally** in your browser's `localStorage`. No data is sent to external servers.

### Data Persistence

- **Desktop**: Data persists until you clear browser data
- **Mobile**: Data persists as long as the app is installed

### Backup

The app does not provide a built-in backup feature.

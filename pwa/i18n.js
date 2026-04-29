export const DEFAULT_LANG = "zh";

export const T = {
    zh: {
        // List view
        appTitle: "验证器 Lite",
        subtitle: "点击代码复制",
        hint: "请不要在他人的设备上使用密钥。",
        copied: "已复制",

        // Editor view
        editorTitle: "账户设置",
        labelUsername: "用户名",
        placeholderUsername: "账户名称",
        labelKey: "密钥",
        placeholderKey: "输入密钥",
        labelSiteName: "网站名称",
        placeholderSiteName: "网站名称",
        labelSiteUrl: "网站地址",
        placeholderSiteUrl: "https://example.com",
        btnSave: "保存",
        btnUploadQr: "上传二维码",
        btnScanQr: "扫描二维码",
        btnCancel: "取消",
        btnScanHelp: "扫描失败？查看解决方案",
        btnBack: "<",
        btnDelete: "删除",

        // Confirm bar
        confirmDelete: (label) => `删除 "${label}"？`,
        confirmDeleteFallback: "删除此账户？",
        btnConfirmYes: "删除",
        btnConfirmNo: "取消",

        // Help view
        helpTitle: "扫描故障排除",
        helpIntro: "如果二维码扫描失败，通常是由于图片分辨率不足。请尝试以下方法：",
        helpStep1Title: "直接保存二维码",
        helpStep1Body: "在网站上右键点击二维码图片，选择\"图片另存为…\"，然后使用上传二维码导入。",
        helpStep2Title: "放大页面后截图",
        helpStep2Body: "按 Ctrl + + 将页面放大，对二维码截图保存，再使用上传二维码导入。",
        helpStep3Title: "放大页面后使用扫描",
        helpStep3Body: "将页面放大，确保二维码完整可见且无遮挡，然后点击扫描二维码截取当前标签页。",

        // Toast messages
        toastNoCode: "暂无验证码",
        toastCopyBlocked: "浏览器阻止了复制操作",
        toastCopied: (name) => `已复制 ${name}`,
        toastQrScanned: "二维码扫描成功",
        toastNoQrFound: "图片中未找到二维码",
        toastNoQrOnPage: "页面中未找到二维码",
        toastFileReadFailed: "文件读取失败",
        toastImageLoadFailed: "图片加载失败",
        toastCaptureFailed: "截图失败",
        toastScanFailed: "扫描失败",
        toastNotOtpAuth: "不是有效的 TOTP 二维码",
        toastSecretEmpty: "密钥不能为空",
        toastSecretInvalid: "密钥必须是有效的 Base32 格式",
        toastSaveError: "无法保存账户",
        toastNoAccount: "未选择账户",
        toastImageNoDimensions: "图片尺寸无效",

        // Import / Export
        btnExport: "导出",
        btnImport: "导入",
        exportWarning: "警告：导出文件包含明文密钥，请妥善保管，勿分享给他人。",
        toastExportDone: "已导出",
        toastImportDone: (n) => `已导入 ${n} 个账户`,
        toastImportSkipped: (n) => `跳过 ${n} 个重复密钥`,
        toastImportFailed: "导入失败，文件格式无效",
    },

    en: {
        // List view
        appTitle: "2FA-Auth-Lite",
        subtitle: "Click code to copy",
        hint: "Use your setup key only on your own device.",
        copied: "Copied",

        // Editor view
        editorTitle: "Account settings",
        labelUsername: "Username",
        placeholderUsername: "account name",
        labelKey: "Key",
        placeholderKey: "enter your key",
        labelSiteName: "Site name",
        placeholderSiteName: "SiteName",
        labelSiteUrl: "Site URL",
        placeholderSiteUrl: "https://example.com",
        btnSave: "Save",
        btnUploadQr: "Upload QR",
        btnScanQr: "Scan QR",
        btnCancel: "Cancel",
        btnScanHelp: "Scan failed? See solutions",
        btnBack: "<",
        btnDelete: "Delete",

        // Confirm bar
        confirmDelete: (label) => `Delete "${label}"?`,
        confirmDeleteFallback: "Delete this account?",
        btnConfirmYes: "Delete",
        btnConfirmNo: "Cancel",

        // Help view
        helpTitle: "Scan Troubleshooting",
        helpIntro: "If QR scanning fails, it's usually due to insufficient image resolution. Try one of the following:",
        helpStep1Title: "Save the QR code directly",
        helpStep1Body: "Right-click the QR code image on the website and select \"Save image as…\", then use Upload QR to import it.",
        helpStep2Title: "Zoom in before taking a screenshot",
        helpStep2Body: "Press Ctrl + + to zoom the page, take a screenshot of the QR code, save it, then use Upload QR.",
        helpStep3Title: "Use Scan QR with the page zoomed in",
        helpStep3Body: "Zoom the page, make sure the QR code is fully visible and unobstructed, then click Scan QR to capture the current tab.",

        // Toast messages
        toastNoCode: "No code available",
        toastCopyBlocked: "Copy blocked by browser",
        toastCopied: (name) => `Copied ${name}`,
        toastQrScanned: "QR code scanned",
        toastNoQrFound: "No QR code found in image",
        toastNoQrOnPage: "No QR code found on page",
        toastFileReadFailed: "File read failed",
        toastImageLoadFailed: "Image load failed",
        toastCaptureFailed: "Capture failed",
        toastScanFailed: "Scan failed",
        toastNotOtpAuth: "Not a valid TOTP QR code",
        toastSecretEmpty: "Secret is empty.",
        toastSecretInvalid: "Secret must be valid Base32.",
        toastSaveError: "Cannot save account.",
        toastNoAccount: "No account selected",
        toastImageNoDimensions: "Image has no dimensions",
    },
};

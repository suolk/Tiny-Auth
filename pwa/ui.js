import { formatCode } from "./totp.js";
import { T, DEFAULT_LANG } from "./i18n.js";
import {
    accounts, currentLang, editingAccountId,
    setEditingAccountId, setIsShowingSecret, setPendingDeleteAccountId,
    viewList, viewEditor, viewHelp,
    accountListEl, langSwitch,
    editorTitle, editNameInput, editSiteNameInput, editSiteUrlInput, editSecretInput,
    cancelBtn, saveBtn, scanQrBtn, scanHelpBtn,
    exportBtn, importBtn,
    toggleSecretBtn, confirmBar, confirmText, confirmYesBtn, confirmNoBtn,
    toastEditorEl, toastListEl,
} from "./state.js";

// ── i18n ──

export function t(key, ...args) {
    const val = T[currentLang]?.[key] ?? T[DEFAULT_LANG][key];
    return typeof val === "function" ? val(...args) : val;
}

export function applyLang() {
    document.getElementById("appTitle").textContent = t("appTitle");
    document.getElementById("subtitle").textContent = t("subtitle");
    document.getElementById("hint").textContent = t("hint");
    document.getElementById("labelUsername").textContent = t("labelUsername");
    document.getElementById("labelKey").textContent = t("labelKey");
    document.getElementById("labelSiteName").textContent = t("labelSiteName");
    document.getElementById("labelSiteUrl").textContent = t("labelSiteUrl");
    document.getElementById("saveBtn").textContent = t("btnSave");
    editNameInput.placeholder = t("placeholderUsername");
    editSecretInput.placeholder = t("placeholderKey");
    editSiteNameInput.placeholder = t("placeholderSiteName");
    editSiteUrlInput.placeholder = t("placeholderSiteUrl");
    scanQrBtn.textContent = t("btnUploadQr");
    cancelBtn.textContent = t("btnCancel");
    scanHelpBtn.textContent = t("btnScanHelp");
    exportBtn.textContent = t("btnExport");
    importBtn.textContent = t("btnImport");
    confirmYesBtn.textContent = t("btnConfirmYes");
    confirmNoBtn.textContent = t("btnConfirmNo");

    document.getElementById("helpTitle").textContent = t("helpTitle");
    document.getElementById("helpIntro").textContent = t("helpIntro");
    document.getElementById("helpList").innerHTML = `
        <li><strong>${t("helpStep1Title")}</strong><br>${t("helpStep1Body")}</li>
        <li><strong>${t("helpStep2Title")}</strong><br>${t("helpStep2Body")}</li>
        <li><strong>${t("helpStep3Title")}</strong><br>${t("helpStep3Body")}</li>
    `;

    langSwitch.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("lang-btn--active", btn.dataset.lang === currentLang);
    });

    renderAccounts();
}

// ── View switching ──

export function showView(view) {
    viewList.classList.toggle("hidden", view !== "list");
    viewEditor.classList.toggle("hidden", view !== "editor");
    viewHelp.classList.toggle("hidden", view !== "help");
}

// ── Toast ──

let toastEditorTimerId = null;

export function showToast(el, timerRef, message, isError = false) {
    if (!message) {
        el.classList.add("hidden");
        el.textContent = "";
        el.classList.remove("error");
        return timerRef;
    }
    el.textContent = message;
    el.classList.remove("hidden");
    el.classList.toggle("error", Boolean(isError));
    if (timerRef) clearTimeout(timerRef);
    return setTimeout(() => {
        el.classList.add("hidden");
        el.textContent = "";
        el.classList.remove("error");
    }, 2200);
}

export function setEditorStatus(message, isError = false) {
    toastEditorTimerId = showToast(toastEditorEl, toastEditorTimerId, message, isError);
}

let toastListTimerId = null;

export function setListStatus(message, isError = false) {
    toastListTimerId = showToast(toastListEl, toastListTimerId, message, isError);
}

// ── Copied state ──

const copiedTimers = new Map();

export function markCopied(accountId) {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;
    account.copied = true;
    renderAccounts();
    if (copiedTimers.has(accountId)) clearTimeout(copiedTimers.get(accountId));
    copiedTimers.set(accountId, setTimeout(() => {
        account.copied = false;
        copiedTimers.delete(accountId);
        renderAccounts();
    }, 1500));
}

// ── Delete confirm ──

let confirmTimerId = null;

export function openDeleteConfirm(accountId) {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;
    setPendingDeleteAccountId(accountId);
    const label = account.siteName?.trim() || account.username?.trim();
    confirmText.textContent = label ? t("confirmDelete", label) : t("confirmDeleteFallback");
    confirmBar.classList.remove("hidden");
    if (confirmTimerId) clearTimeout(confirmTimerId);
    confirmTimerId = setTimeout(() => closeDeleteConfirm(), 5000);
}

export function closeDeleteConfirm() {
    setPendingDeleteAccountId("");
    confirmBar.classList.add("hidden");
    if (confirmTimerId) { clearTimeout(confirmTimerId); confirmTimerId = null; }
}

// ── Render ──

export function renderAccounts() {
    if (!accounts.length) {
        accountListEl.innerHTML = `<div class="empty-tip">Click + to add your first account.</div>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    for (const [index, account] of accounts.entries()) {
        const item = document.createElement("article");
        item.className = "account-item";

        const info = document.createElement("div");
        info.className = "account-info";

        const username = account.username?.trim() || "";
        const siteName = account.siteName?.trim() || "";

        const siteNameEl = document.createElement("span");
        siteNameEl.className = "account-site";
        siteNameEl.textContent = username || (!siteName ? `Account ${index + 1}` : "");

        const usernameEl = document.createElement("span");
        usernameEl.className = "account-username";
        usernameEl.textContent = siteName;

        info.append(siteNameEl, usernameEl);

        const right = document.createElement("div");
        right.className = "account-right";

        const codeButton = document.createElement("button");
        codeButton.type = "button";
        codeButton.className = "code-btn";
        codeButton.dataset.action = "copy";
        codeButton.dataset.id = account.id;
        codeButton.textContent = account.copied ? t("copied") : (account.lastCode ? formatCode(account.lastCode) : "------");
        if (account.copied) codeButton.classList.add("code-btn--copied");
        if (account.error) codeButton.title = account.error;

        const settingsButton = document.createElement("button");
        settingsButton.type = "button";
        settingsButton.className = "secondary settings-btn";
        settingsButton.dataset.action = "settings";
        settingsButton.dataset.id = account.id;
        settingsButton.textContent = "⚙";
        settingsButton.setAttribute("aria-label", "Edit account");

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "secondary danger settings-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = account.id;
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
        deleteButton.setAttribute("aria-label", "Delete account");

        const progress = document.createElement("div");
        progress.className = "account-progress";

        right.append(codeButton, settingsButton, deleteButton);
        item.append(info, right, progress);
        fragment.append(item);
    }
    accountListEl.replaceChildren(fragment);
}

// ── Progress / Countdown ──

export function setProgress(pct, urgent) {
    accountListEl.querySelectorAll(".account-progress").forEach((bar) => {
        bar.style.width = `${pct}%`;
        bar.classList.toggle("urgent", urgent);
    });
}

// ── Editor ──

export function showEditor(accountId) {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;
    setEditingAccountId(account.id);
    editorTitle.textContent = account.siteName || account.username || t("editorTitle");
    editSiteNameInput.value = account.siteName;
    editSiteUrlInput.value = account.siteUrl;
    editNameInput.value = account.username;
    editSecretInput.value = account.secret;
    setIsShowingSecret(false);
    editSecretInput.type = "password";
    toggleSecretBtn.classList.remove("eye-btn--open");
    toggleSecretBtn.setAttribute("aria-label", "显示密钥");

    // 重置图标显示状态
    const closedIcon = toggleSecretBtn.querySelector('.eye-icon-closed');
    const openIcon = toggleSecretBtn.querySelector('.eye-icon-open');
    if (closedIcon && openIcon) {
        closedIcon.style.display = 'block';
        openIcon.style.display = 'none';
    }

    closeDeleteConfirm();
    setEditorStatus("");
    showView("editor");
    editNameInput.focus();
}

export function hideEditor() {
    setEditingAccountId("");
    showView("list");
}

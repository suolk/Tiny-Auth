import { formatCode } from "./totp.js";
import { T, DEFAULT_LANG } from "./i18n.js";
import {
    accounts, currentLang, editingAccountId,
    setEditingAccountId, setIsShowingSecret, setPendingDeleteAccountId,
    viewList, viewEditor, viewHelp,
    accountListEl, langSwitch,
    editorTitle, editNameInput, editSiteNameInput, editSiteUrlInput, editSecretInput,
    cancelBtn, uploadQrBtn, scanQrBtn, scanHelpBtn,
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
    editNameInput.placeholder = t("placeholderUsername");
    editSecretInput.placeholder = t("placeholderKey");
    editSiteNameInput.placeholder = t("placeholderSiteName");
    editSiteUrlInput.placeholder = t("placeholderSiteUrl");
    uploadQrBtn.textContent = t("btnUploadQr");
    scanQrBtn.textContent = t("btnScanQr");
    cancelBtn.textContent = t("btnCancel");
    scanHelpBtn.textContent = t("btnScanHelp");
    exportBtn.textContent = t("btnExport");
    importBtn.textContent = t("btnImport");
    confirmYesBtn.textContent = t("btnConfirmYes");
    confirmNoBtn.textContent = t("btnConfirmNo");

    document.getElementById("helpTitle").textContent = t("helpTitle");
    document.getElementById("helpIntro").textContent = t("helpIntro");

    const helpList = document.getElementById("helpList");
    helpList.replaceChildren();

    const step1 = document.createElement("li");
    const step1Title = document.createElement("strong");
    step1Title.textContent = t("helpStep1Title");
    step1.appendChild(step1Title);
    step1.appendChild(document.createElement("br"));
    step1.appendChild(document.createTextNode(t("helpStep1Body")));

    const step2 = document.createElement("li");
    const step2Title = document.createElement("strong");
    step2Title.textContent = t("helpStep2Title");
    step2.appendChild(step2Title);
    step2.appendChild(document.createElement("br"));
    step2.appendChild(document.createTextNode(t("helpStep2Body")));

    const step3 = document.createElement("li");
    const step3Title = document.createElement("strong");
    step3Title.textContent = t("helpStep3Title");
    step3.appendChild(step3Title);
    step3.appendChild(document.createElement("br"));
    step3.appendChild(document.createTextNode(t("helpStep3Body")));

    helpList.append(step1, step2, step3);

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
        accountListEl.replaceChildren();
        const emptyTip = document.createElement("div");
        emptyTip.className = "empty-tip";
        emptyTip.textContent = "Click + to add your first account.";
        accountListEl.appendChild(emptyTip);
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
        deleteButton.setAttribute("aria-label", "Delete account");

        // Create SVG element safely
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("points", "3 6 5 6 21 6");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6");

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M10 11v6");

        const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path3.setAttribute("d", "M14 11v6");

        const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path4.setAttribute("d", "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2");

        svg.append(polyline, path1, path2, path3, path4);
        deleteButton.appendChild(svg);

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
    toggleSecretBtn.setAttribute("aria-label", "Show secret");
    closeDeleteConfirm();
    setEditorStatus("");
    showView("editor");
    editNameInput.focus();
}

export function hideEditor() {
    setEditingAccountId("");
    showView("list");
}

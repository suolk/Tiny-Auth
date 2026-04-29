import { normalizeBase32, decodeBase32, generateTotp } from "./totp.js";
import { createAccount, persistAccounts, loadAccounts } from "./storage.js";
import { DEFAULT_LANG } from "./i18n.js";
import {
    accounts, editingAccountId, pendingDeleteAccountId, isShowingSecret, isNewAccount,
    setAccounts, setCurrentLang, setIsShowingSecret, setIsNewAccount,
    addAccountBtn, langSwitch,
    backBtn, cancelBtn, uploadQrBtn, scanQrBtn, scanHelpBtn, helpBackBtn,
    qrFileInput, toggleSecretBtn, editSecretInput,
    accountListEl, editNameInput, editSiteNameInput, editSiteUrlInput,
    confirmBar, confirmYesBtn, confirmNoBtn,
    viewHelp, viewEditor,
} from "./state.js";
import {
    t, applyLang, showView,
    setEditorStatus, markCopied, openDeleteConfirm, closeDeleteConfirm,
    renderAccounts, setProgress, showEditor, hideEditor,
} from "./ui.js";
import { scanQrFromFile, captureAndScanQr } from "./qr.js";

const PERIOD_SECONDS = 30;
const STORAGE_LANG_KEY = "lang";

// ── Refresh ──

async function refreshCodes() {
    await Promise.all(
        accounts.map(async (account) => {
            if (!account.secret.trim()) { account.lastCode = ""; account.error = ""; return; }
            try {
                account.lastCode = await generateTotp(account.secret);
                account.error = "";
            } catch (error) {
                account.lastCode = "";
                account.error = error instanceof Error ? error.message : t("toastScanFailed");
            }
        })
    );
    renderAccounts();
}

// ── Countdown ──

function updateCountdown() {
    const secondsNow = Math.floor(Date.now() / 1000);
    const remaining = PERIOD_SECONDS - (secondsNow % PERIOD_SECONDS);

    if (remaining === PERIOD_SECONDS) {
        setProgress(100, false);
        refreshCodes();
        return;
    }

    setProgress((remaining / PERIOD_SECONDS) * 100, remaining <= 10);
}

// ── Actions ──

async function addAccount() {
    const account = createAccount();
    accounts.push(account);
    setIsNewAccount(true);
    // Don't persist yet — only save when user confirms with a key
    await refreshCodes();
    showEditor(account.id);
}

async function saveEditorChanges() {
    const account = accounts.find((a) => a.id === editingAccountId);
    if (!account) return false;
    try {
        const username = editNameInput.value.trim();
        const siteName = editSiteNameInput.value.trim();
        const siteUrl = editSiteUrlInput.value.trim();
        const normalized = normalizeBase32(editSecretInput.value);
        decodeBase32(normalized);
        account.username = username;
        account.siteName = siteName;
        account.siteUrl = siteUrl;
        account.secret = normalized;
        setIsNewAccount(false);
        await persistAccounts(accounts);
        await refreshCodes();
        hideEditor();
        return true;
    } catch (error) {
        setEditorStatus(error instanceof Error ? error.message : t("toastSaveError"), true);
        return false;
    }
}

async function discardEditingNewAccount() {
    setAccounts(accounts.filter((a) => a.id !== editingAccountId));
    await persistAccounts(accounts);
    await refreshCodes();
    setIsNewAccount(false);
}

async function cancelEdit() {
    if (isNewAccount) {
        await discardEditingNewAccount();
    }
    hideEditor();
}

async function goBack() {
    const secretVal = editSecretInput.value.trim();
    if (isNewAccount) {
        if (secretVal) {
            await saveEditorChanges();
        } else {
            await discardEditingNewAccount();
            hideEditor();
        }
    } else {
        await saveEditorChanges();
    }
}

async function deleteAccount(accountId) {
    setAccounts(accounts.filter((item) => item.id !== accountId));
    await persistAccounts(accounts);
    await refreshCodes();
}

async function confirmDeleteAccount() {
    if (!pendingDeleteAccountId) return;
    await deleteAccount(pendingDeleteAccountId);
    closeDeleteConfirm();
    hideEditor();
}

async function copyCode(accountId) {
    const account = accounts.find((a) => a.id === accountId);
    if (!account || !account.lastCode) return;
    try {
        await navigator.clipboard.writeText(account.lastCode);
        markCopied(accountId);
    } catch {
        // silently fail
    }
}

// ── Events ──

accountListEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest("[data-action]");
    if (!btn || !(btn instanceof HTMLElement)) return;
    const { action, id: accountId } = btn.dataset;
    if (!action || !accountId) return;
    if (action === "copy") { copyCode(accountId); return; }
    if (action === "settings") { showEditor(accountId); return; }
    if (action === "delete") { openDeleteConfirm(accountId); }
});

langSwitch.addEventListener("click", async (event) => {
    const btn = event.target.closest(".lang-btn");
    if (!btn?.dataset.lang) return;
    setCurrentLang(btn.dataset.lang);
    await chrome.storage.local.set({ [STORAGE_LANG_KEY]: btn.dataset.lang });
    applyLang();
});

addAccountBtn.addEventListener("click", addAccount);
backBtn.addEventListener("click", goBack);
cancelBtn.addEventListener("click", cancelEdit);
uploadQrBtn.addEventListener("click", () => qrFileInput.click());
scanQrBtn.addEventListener("click", captureAndScanQr);
scanHelpBtn.addEventListener("click", () => showView("help"));
helpBackBtn.addEventListener("click", () => showView("editor"));
qrFileInput.addEventListener("change", () => {
    const file = qrFileInput.files?.[0];
    if (file) scanQrFromFile(file);
    qrFileInput.value = "";
});
confirmYesBtn.addEventListener("click", confirmDeleteAccount);
confirmNoBtn.addEventListener("click", closeDeleteConfirm);
toggleSecretBtn.addEventListener("click", () => {
    const showing = !isShowingSecret;
    setIsShowingSecret(showing);
    editSecretInput.type = showing ? "text" : "password";
    toggleSecretBtn.classList.toggle("eye-btn--open", showing);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (!confirmBar.classList.contains("hidden")) { closeDeleteConfirm(); }
        else if (!viewHelp.classList.contains("hidden")) { showView("editor"); }
        else if (!viewEditor.classList.contains("hidden")) { goBack(); }
    }
});

// ── Init ──

loadAccounts().then(async (loaded) => {
    setAccounts(loaded);
    const stored = await chrome.storage.local.get(STORAGE_LANG_KEY);
    setCurrentLang(stored[STORAGE_LANG_KEY] ?? DEFAULT_LANG);
    await persistAccounts(accounts);
    await refreshCodes();
    applyLang();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

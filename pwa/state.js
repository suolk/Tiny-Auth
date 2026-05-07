import { DEFAULT_LANG } from "./i18n.js";

// ── Shared state ──
export let accounts = [];
export let editingAccountId = "";
export let isShowingSecret = false;
export let pendingDeleteAccountId = "";
export let currentLang = DEFAULT_LANG;
export let isNewAccount = false;

export function setAccounts(val) {
    accounts.length = 0;
    accounts.push(...val);
}
export function setEditingAccountId(val) { editingAccountId = val; }
export function setIsShowingSecret(val) { isShowingSecret = val; }
export function setPendingDeleteAccountId(val) { pendingDeleteAccountId = val; }
export function setCurrentLang(val) { currentLang = val; }
export function setIsNewAccount(val) { isNewAccount = val; }

// ── DOM: Views ──
export const viewList = document.getElementById("viewList");
export const viewEditor = document.getElementById("viewEditor");
export const viewHelp = document.getElementById("viewHelp");

// ── DOM: List view ──
export const accountListEl = document.getElementById("accountList");
export const langSwitch = document.getElementById("langSwitch");
export const addAccountBtn = document.getElementById("addAccountBtn");
export const exportBtn = document.getElementById("exportBtn");
export const importBtn = document.getElementById("importBtn");
export const importFileInput = document.getElementById("importFileInput");

// ── DOM: Editor view ──
export const backBtn = document.getElementById("backBtn");
export const editorTitle = document.getElementById("editorTitle");
export const editNameInput = document.getElementById("editName");
export const editSiteNameInput = document.getElementById("editSiteName");
export const editSiteUrlInput = document.getElementById("editSiteUrl");
export const editSecretInput = document.getElementById("editSecret");
export const cancelBtn = document.getElementById("cancelBtn");
export const saveBtn = document.getElementById("saveBtn");
export const scanQrBtn = document.getElementById("scanQrBtn");
export const scanHelpBtn = document.getElementById("scanHelpBtn");
export const helpBackBtn = document.getElementById("helpBackBtn");
export const qrFileInput = document.getElementById("qrFileInput");
export const toggleSecretBtn = document.getElementById("toggleSecretBtn");
export const confirmBar = document.getElementById("confirmBar");
export const confirmText = document.getElementById("confirmText");
export const confirmYesBtn = document.getElementById("confirmYesBtn");
export const confirmNoBtn = document.getElementById("confirmNoBtn");
export const toastEditorEl = document.getElementById("toastEditor");
export const toastListEl = document.getElementById("toastList");

// Debug: Check if elements are found
console.log('DOM Elements loaded:', {
    addAccountBtn: !!addAccountBtn,
    accountListEl: !!accountListEl,
    viewList: !!viewList,
    viewEditor: !!viewEditor
});

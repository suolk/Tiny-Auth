$src = "edge-extension"
$out = "2FA-Auth-Lite.zip"
$tmp = "temp_build"
$files = @(
    "manifest.json",
    "popup.html",
    "popup.css",
    "popup.js",
    "ui.js",
    "qr.js",
    "state.js",
    "totp.js",
    "storage.js",
    "i18n.js",
    "sites.js",
    "zxing.js",
    "LICENSE",
    "icons"
)

Write-Host "===================================="
Write-Host "   2FA-Auth-Lite Extension Builder"
Write-Host "===================================="
Write-Host ""

if (Test-Path $out) {
    Remove-Item $out -Force
    Write-Host "[OK] Deleted old $out"
}

if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Path $tmp | Out-Null

foreach ($f in $files) {
    $fp = Join-Path $src $f
    if (Test-Path $fp) {
        $dp = Join-Path $tmp $f
        $dd = Split-Path -Parent $dp
        if ($dd -and -not (Test-Path $dd)) {
            New-Item -ItemType Directory -Path $dd -Force | Out-Null
        }
        if (Test-Path $fp -PathType Container) {
            Copy-Item -Recurse -Force $fp $dp
        } else {
            Copy-Item -Force $fp $dp
        }
        Write-Host "[+] $f"
    } else {
        Write-Host "[!] Skip: $f"
    }
}

Write-Host ""
Write-Host "[*] Compressing..."

# Use .NET ZipFile to ensure forward slashes in archive
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $out) { Remove-Item $out -Force }

$zipArchive = [System.IO.Compression.ZipFile]::Open((Join-Path $PWD $out), 'Create')
try {
    Get-ChildItem -Path $tmp -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring((Join-Path $PWD $tmp).Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArchive, $_.FullName, $relativePath) | Out-Null
        Write-Host "  + $relativePath"
    }
} finally {
    $zipArchive.Dispose()
}

Remove-Item -Recurse -Force $tmp

$size = [math]::Round((Get-Item $out).Length / 1KB, 2)
Write-Host ""
Write-Host "[OK] Done: $out ($size KB)"

# fix-escaped-quotes.ps1
# Fixes escaped triple quotes and other escaping issues in generated Python files.

Write-Host "Fixing escaped characters in Python files..." -ForegroundColor Cyan

# Folders to scan (relative to current directory)
$folders = @(
    "services\future_ai",
    "routes"
)

$fixedCount = 0

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Get-ChildItem -Path $folder -Filter "*.py" -Recurse | ForEach-Object {
            $file = $_.FullName
            $content = Get-Content -Path $file -Raw -Encoding UTF8

            # Fix escaped triple quotes: \""" -> """
            $newContent = $content -replace '\\"\\"\\"', '"""'

            # Fix escaped single quotes: \' -> ' (but careful not to break everything)
            # We'll only replace if it's not part of a valid escape sequence.
            # For simplicity, we'll replace all \" with " (but careful with JSON strings)
            # However, we only need to fix docstrings and string literals that got escaped.
            # A safer approach: replace escaped double quotes that are not part of a valid escape sequence.
            # But to keep it simple, we'll only fix the triple quote issue because that's the main cause.
            # If there are other escaped quotes, we can add more replacements.

            # Also fix \' -> ' (if any)
            $newContent = $newContent -replace "\\'", "'"

            # Write back only if changed
            if ($content -ne $newContent) {
                Set-Content -Path $file -Value $newContent -Encoding UTF8
                Write-Host "Fixed: $file" -ForegroundColor Green
                $fixedCount++
            }
        }
    } else {
        Write-Warning "Folder not found: $folder"
    }
}

Write-Host "Done. Fixed $fixedCount file(s)." -ForegroundColor Cyan
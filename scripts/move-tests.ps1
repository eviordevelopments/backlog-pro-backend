# Script to move all spec files from src/ to test/unit/
# Maintains directory structure

$specFiles = Get-ChildItem -Path "src" -Filter "*.spec.ts" -Recurse

foreach ($file in $specFiles) {
    # Get relative path from src/
    $relativePath = $file.FullName.Substring($PWD.Path.Length + 5) # +5 for "\src\"
    
    # Create destination path
    $destPath = Join-Path "test\unit" $relativePath
    $destDir = Split-Path $destPath -Parent
    
    # Create directory if it doesn't exist
    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        Write-Host "Created directory: $destDir"
    }
    
    # Move file
    Move-Item -Path $file.FullName -Destination $destPath -Force
    Write-Host "Moved: $($file.Name) -> $destPath"
}

Write-Host "`nAll spec files moved successfully!"

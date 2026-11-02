param(
    [string]$SkillRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path),
    [string]$CodexHome = $env:CODEX_HOME
)

if ([string]::IsNullOrWhiteSpace($CodexHome)) {
    $CodexHome = Join-Path $HOME ".codex"
}

$sourceRoot = Resolve-Path -LiteralPath $SkillRoot
$targetRoot = Join-Path $CodexHome "skills"
New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

Get-ChildItem -LiteralPath $sourceRoot.Path -Directory | ForEach-Object {
    $skillFile = Join-Path $_.FullName "SKILL.md"
    if (-not (Test-Path -LiteralPath $skillFile)) {
        return
    }

    $target = Join-Path $targetRoot $_.Name
    if (Test-Path -LiteralPath $target) {
        $item = Get-Item -LiteralPath $target
        if ($item.LinkType -eq "Junction" -and $item.Target -contains $_.FullName) {
            Write-Host "OK  $($_.Name) -> $($_.FullName)"
            return
        }

        if ($item.LinkType -eq "Junction") {
            Remove-Item -LiteralPath $target -Force
            New-Item -ItemType Junction -Path $target -Target $_.FullName | Out-Null
            Write-Host "FIX $($_.Name) -> $($_.FullName)"
            return
        }

        Write-Warning "SKIP $($_.Name): target already exists at $target. Remove or rename it before creating a junction."
        return
    }

    New-Item -ItemType Junction -Path $target -Target $_.FullName | Out-Null
    Write-Host "ADD $($_.Name) -> $($_.FullName)"
}

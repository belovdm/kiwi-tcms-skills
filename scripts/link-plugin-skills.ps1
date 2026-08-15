# Recreate plugins/<plugin>/skills/<name> as junctions to skills/<name>.
# One canonical copy of each skill. Run from anywhere.
$ErrorActionPreference = 'Stop'

$skillsRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\skills')).Path
$pluginsRoot = Join-Path $PSScriptRoot '..\plugins'

$bundles = @{
  'test-management' = @(
    'kiwi-mcp-usage',
    'kiwi-sync-test-cases',
    'kiwi-write-test-cases',
    'kiwi-improve-test-cases',
    'kiwi-detect-duplicate-test-cases',
    'kiwi-split-testing-levels-pyramid',
    'kiwi-test-code-coverage',
    'kiwi-scan-automation-project',
    'kiwi-requirement-reviewer',
    'kiwi-pr-requirements-analyzer',
    'kiwi-pr-diff-analyzer',
    'kiwi-qa-thinking',
    'kiwi-setup-e2e-reporting',
    'kiwi-sprint-report'
  )
  'qa-process' = @(
    'kiwi-qa-lead-strategy-advisor',
    'kiwi-qa-thinking',
    'kiwi-split-testing-levels-pyramid',
    'kiwi-testing-workflow'
  )
  'test-automation' = @(
    'kiwi-automate-manual-cases',
    'kiwi-debug-failed-flaky-autotests',
    'kiwi-automation-consolidation',
    'kiwi-data-seeder',
    'kiwi-run-tests-with-reporter',
    'kiwi-setup-ci-automation',
    'kiwi-setup-change-aware-testing',
    'kiwi-allure-adapter',
    'kiwi-run-triage'
  )
  'kiwi-explore' = @(
    'kiwi-explore-setup',
    'kiwi-explore-fundamentals',
    'kiwi-explore-plan'
  )
}

function Remove-LinkOrDir([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return }
  $item = Get-Item -LiteralPath $path -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    cmd /c "rmdir `"$path`""
  } elseif ($item.PSIsContainer) {
    Remove-Item -LiteralPath $path -Recurse -Force
  } else {
    Remove-Item -LiteralPath $path -Force
  }
}

$linked = 0
foreach ($plugin in $bundles.Keys) {
  $destDir = Join-Path $pluginsRoot "$plugin\skills"
  New-Item -ItemType Directory -Path $destDir -Force | Out-Null

  Get-ChildItem -LiteralPath $destDir -Force -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-LinkOrDir $_.FullName
  }

  foreach ($name in $bundles[$plugin]) {
    $src = Join-Path $skillsRoot $name
    if (-not (Test-Path -LiteralPath $src)) { throw "Missing skill: $src" }
    $dst = Join-Path $destDir $name
    $null = cmd /c "mklink /J `"$dst`" `"$src`""
    if ($LASTEXITCODE -ne 0) { throw "mklink failed for $plugin/$name" }
    $linked++
  }
}

Write-Host "Linked $linked skill junctions under $pluginsRoot"

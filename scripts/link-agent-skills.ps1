# Junction every canonical skill into agent skill directories.
# Default: project-level dirs next to kiwi-tcms-skills (../.claude, ../.grok, …).
#
#   pwsh ./scripts/link-agent-skills.ps1
#   pwsh ./scripts/link-agent-skills.ps1 -Scope User
#   pwsh ./scripts/link-agent-skills.ps1 -Vendors claude,agents
#
param(
  [ValidateSet('Project', 'User')]
  [string]$Scope = 'Project',
  [string[]]$Vendors = @('claude', 'grok', 'agents', 'cursor')
)

$ErrorActionPreference = 'Stop'
$srcRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\skills')).Path

function Get-VendorDest([string]$vendor) {
  if ($Scope -eq 'User') {
    switch ($vendor) {
      'claude' { Join-Path $env:USERPROFILE '.claude\skills' }
      'grok'   { Join-Path $env:USERPROFILE '.grok\skills' }
      'agents' { Join-Path $env:USERPROFILE '.agents\skills' }
      'cursor' { Join-Path $env:USERPROFILE '.cursor\skills' }
      default  { throw "Unknown vendor: $vendor" }
    }
  } else {
    $repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
    switch ($vendor) {
      'claude' { Join-Path $repo '.claude\skills' }
      'grok'   { Join-Path $repo '.grok\skills' }
      'agents' { Join-Path $repo '.agents\skills' }
      'cursor' { Join-Path $repo '.cursor\skills' }
      default  { throw "Unknown vendor: $vendor" }
    }
  }
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

$skills = Get-ChildItem -LiteralPath $srcRoot -Directory
foreach ($vendor in $Vendors) {
  $dstRoot = Get-VendorDest $vendor
  New-Item -ItemType Directory -Path $dstRoot -Force | Out-Null

  foreach ($skill in $skills) {
    $dst = Join-Path $dstRoot $skill.Name
    Remove-LinkOrDir $dst
    $null = cmd /c "mklink /J `"$dst`" `"$($skill.FullName)`""
    if ($LASTEXITCODE -ne 0) { throw "mklink failed for $vendor/$($skill.Name)" }
  }
  Write-Host "Linked $($skills.Count) skills -> $dstRoot"
}

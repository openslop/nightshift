# Nightshift on Windows runs inside WSL. Install WSL first, then run this in PowerShell.
# Usage: .\install.ps1 <path to nightshift inside WSL, like /home/me/nightshift>
param([Parameter(Mandatory=$true)][string]$Dir)

$nightly = "wsl.exe -e bash -lc `"$Dir/bin/nightly.sh`""
$review  = "wsl.exe -e bash -lc `"$Dir/bin/review.sh`""

schtasks /Create /F /TN "Nightshift Nightly" /SC DAILY /ST 05:12 /TR $nightly
schtasks /Create /F /TN "Nightshift Review"  /SC HOURLY /MO 2 /ST 00:07 /TR $review
Write-Host "Done. See them with: schtasks /Query /TN Nightshift*"

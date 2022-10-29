function Compare-Repo {
    param (
         [Parameter(Mandatory=$true, Position=0)]
         [string] $FileList,
         [Parameter(Mandatory=$true, Position=1)]
         [string] $ReferenceFolder
    )
    Write-Host "FileList = $($FileList), ReferenceFolder = $($ReferenceFolder)"

    if (-Not (Test-Path -LiteralPath $FileList -PathType Leaf )) {
        Write-Host "$($FileList) is not a file" -ForegroundColor "Red"
    }

    if (-Not (Test-Path -LiteralPath $ReferenceFolder -PathType Container )) {
        Write-Host "$($ReferenceFolder) is not a folder" -ForegroundColor "Red"
    }

    foreach($line in Get-Content $FileList) {
        $path = $line.Trim()
        if (($path.length -gt 0) -and ($path.SubString(0,1) -ne "#")) {
            $ReferencePath = Join-Path -Path $ReferenceFolder -ChildPath $path
            Compare-Content $line $ReferencePath
        }
    }
}


Export-ModuleMember -Function Compare-Repo
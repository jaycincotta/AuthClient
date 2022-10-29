<#
 .Synopsis
  Compares two files or two folders and displays differences, if any.

 .Description
  If the files/folders are identical, this function returns silently.
  Otherwise, it invokes BeyondCompare to display file differences.

  To install, you should do the following:
  1. Add a folder where you want to keep customer PowerShell scripts
  2. Edit the PSModulePath environment variable to include that path
  3. Create a Compare-Content subfolder in your PowerShell script folder
  4. Copy this file into that subfolder

 .Parameter 0
  The Left file/folder to compare.

 .Parameter 1
  The Right file/folder to compare.

 .Example
   # Compare two files.
   Compare-Content .\src\test.js ..\other\src\test.js
#>

### FUNCTION DEFINITIONS ###

# SETS WORKING DIRECTORY FOR .NET #
function SetWorkDir($PathName, $TestPath) {
    $AbsPath = NormalizePath $PathName $TestPath
    Set-Location $AbsPath
    [System.IO.Directory]::SetCurrentDirectory($AbsPath)
  }
  
# RESTORES THE EXECUTION WORKING DIRECTORY AND EXITS #
function SafeExit() {
    SetWorkDir /path/to/execution/directory $ExecutionDirectory
    #Exit
}

# PRINTS A MESSAGE
function Print {
    [CmdletBinding()]
    param (
      [parameter(Mandatory=$TRUE,Position=0,HelpMessage="Message to print.")]
      [string]$Message,
  
      [parameter(HelpMessage="Specifies a success.")]
      [alias("s")]
      [switch]$SuccessFlag,
  
      [parameter(HelpMessage="Specifies a warning.")]
      [alias("w")]
      [switch]$WarningFlag,
  
      [parameter(HelpMessage="Specifies an error.")]
      [alias("e")]
      [switch]$ErrorFlag,
  
      [parameter(HelpMessage="Specifies a fatal error.")]
      [alias("f")]
      [switch]$FatalFlag,
  
      [parameter(HelpMessage="Specifies a info message.")]
      [alias("i")]
      [switch]$InfoFlag = !$SuccessFlag -and !$WarningFlag -and !$ErrorFlag -and !$FatalFlag,
  
      [parameter(HelpMessage="Specifies blank lines to print before.")]
      [alias("b")]
      [int]$LinesBefore=0,
  
      [parameter(HelpMessage="Specifies blank lines to print after.")]
      [alias("a")]
      [int]$LinesAfter=0,
  
      [parameter(HelpMessage="Specifies if program should exit.")]
      [alias("x")]
      [switch]$ExitAfter
    )
    PROCESS {
      if($LinesBefore -ne 0) {
        foreach($i in 0..$LinesBefore) { Write-Host "" }
      }
      if($InfoFlag) { Write-Host "$Message" }
      if($SuccessFlag) { Write-Host "$Message" -ForegroundColor "Green" }
      if($WarningFlag) { Write-Host "$Message" -ForegroundColor "Yellow" }
      if($ErrorFlag) { Write-Host "$Message" -ForegroundColor "Red" }
      if($FatalFlag) { Write-Host "$Message" -ForegroundColor "Red" -BackgroundColor "Black" }
      if($LinesAfter -ne 0) {
        foreach($i in 0..$LinesAfter) { Write-Host "" }
      }
      if($ExitAfter) { SafeExit }
    }
}
  
# VALIDATES STRING MIGHT BE A PATH #
function ValidatePath($PathName, $TestPath) {
    If([string]::IsNullOrWhiteSpace($TestPath)) {
      Print -x -f "$PathName is not a path"
    }
}
  
# NORMALIZES RELATIVE OR ABSOLUTE PATH TO ABSOLUTE PATH #
function NormalizePath($PathName, $TestPath) {
    ValidatePath "$PathName" "$TestPath"
    $TestPath = [System.IO.Path]::Combine((pwd).Path, $TestPath)
    $NormalizedPath = [System.IO.Path]::GetFullPath($TestPath)
    return $NormalizedPath
}
  
  
# VALIDATES STRING MIGHT BE A PATH AND RETURNS ABSOLUTE PATH #
function ResolvePath($PathName, $TestPath) {
    ValidatePath "$PathName" "$TestPath"
    $ResolvedPath = NormalizePath $PathName $TestPath
    return $ResolvedPath
}
  
# VALIDATES STRING RESOLVES TO A PATH AND RETURNS ABSOLUTE PATH #
function RequirePath($PathName, $TestPath, $PathType) {
    ValidatePath $PathName $TestPath
    If(!(Test-Path $TestPath -PathType $PathType)) {
      Print -x -f "$PathName ($TestPath) does not exist as a $PathType"
    }
    $ResolvedPath = Resolve-Path $TestPath
    return $ResolvedPath
}
  
# GETS ALL FILES IN A PATH RECURSIVELY #
function GetFiles {
    [CmdletBinding()]
    param (
      [parameter(Mandatory=$TRUE,Position=0,HelpMessage="Path to get files for.")]
      [string]$Path
    )
    PROCESS {
      ls $Path -r | where { !$_.PSIsContainer }
    }
}
  
# GETS ALL FILES WITH CALCULATED HASH PROPERTY RELATIVE TO A ROOT DIRECTORY RECURSIVELY #
# RETURNS LIST OF @{RelativePath, Hash, FullName}
function GetFilesWithHash {
    [CmdletBinding()]
    param (
      [parameter(Mandatory=$TRUE,Position=0,HelpMessage="Path to get directories for.")]
      [string]$Path,
  
      [parameter(HelpMessage="The hash algorithm to use.")]
      [string]$Algorithm="MD5"
    )
    PROCESS {
      $OriginalPath = $PWD
      SetWorkDir path/to/diff $Path
      GetFiles $Path | select @{N="RelativePath";E={$_.FullName | Resolve-Path -Relative}},
                              @{N="Hash";E={(Get-FileHash $_.FullName -Algorithm $Algorithm | select Hash).Hash}},
                              FullName
      SetWorkDir path/to/original $OriginalPath
    }
}
 
# COMPARE TWO DIRECTORIES RECURSIVELY #
# RETURNS LIST OF @{RelativePath, Hash, FullName}
function DiffDirectories {
    [CmdletBinding()]
    param (
      [parameter(Mandatory=$TRUE,Position=0,HelpMessage="Directory to compare left.")]
      [alias("l")]
      [string]$LeftPath,
  
      [parameter(Mandatory=$TRUE,Position=1,HelpMessage="Directory to compare right.")]
      [alias("r")]
      [string]$RightPath
    )
    PROCESS {
      $LeftHash = GetFilesWithHash $LeftPath
      $RightHash = GetFilesWithHash $RightPath
      diff -ReferenceObject $LeftHash -DifferenceObject $RightHash -Property RelativePath,Hash
    }
}
  
### END FUNCTION DEFINITIONS ###
    
function Compare-Content {
    param (
      [parameter(HelpMessage="Stores the execution working directory.")]
      [string]$ExecutionDirectory=$PWD,
    
      [Parameter(Mandatory=$true, Position=0, HelpMessage="Left file/folder for compare")]
      [string] $Left,

      [Parameter(Mandatory=$true, Position=1, HelpMessage="Right file/folder for compare")]
      [string] $Right
    )

    if ((-Not (Test-Path -Path $Left)) -and (-Not (Test-Path -Path $Right))) {
        Print -x "Neither $($Left) nor $($Right) are files or folders." -f
    } elseif (-Not (Test-Path -Path $Left)) {
        Print -x "$($Left) is neither a file or a folder." -f
    } elseif (-Not (Test-Path -Path $Right)) {
        Print -x "$($Right) is neither a file or a folder." -f
    } elseif ((Test-Path -LiteralPath $Left -PathType Leaf ) `
          -xor (Test-Path -LiteralPath $Right -PathType Leaf )) {
        Print -x "$($Left) and $($Right) must both be files or both be folders." -f
    } else {
        if (Test-Path -LiteralPath $Left -PathType Leaf ) {
            if ((Get-FileHash $Left).Hash -ne (Get-FileHash $Right).Hash) {
                Print "File $($Left) different from $($Right)" -w
                & bcomp.exe $Left $Right
            } else {
                Print "File $($Left) matches" -s
            }
        } else {
            $LeftPath   = RequirePath path/to/left $Left container
            $RightPath  = RequirePath path/to/right $Right container
            $Diff       = DiffDirectories $LeftPath $RightPath
            if (($Diff).count -gt 0) {
                Print "Folder $($Left) different from $($Right)" -w
                & bcomp.exe $Left $Right
            } else {
                Print "Folder $($Left) matches" -s
            }
        }
    }
}

Export-ModuleMember -Function Compare-Content
param(
    [string]$AccessToken,
    [string]$ApiBaseUrl
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($AccessToken)) {
    $secureToken = Read-Host "请输入云效个人访问令牌" -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
    try {
        $AccessToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        if ($bstr -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
        }
    }
}

if ([string]::IsNullOrWhiteSpace($AccessToken)) {
    throw "YUNXIAO_ACCESS_TOKEN 不能为空。"
}

[Environment]::SetEnvironmentVariable("YUNXIAO_ACCESS_TOKEN", $AccessToken, "User")

if (-not [string]::IsNullOrWhiteSpace($ApiBaseUrl)) {
    [Environment]::SetEnvironmentVariable("YUNXIAO_API_BASE_URL", $ApiBaseUrl, "User")
}

Write-Host "已写入 Windows 用户级环境变量 YUNXIAO_ACCESS_TOKEN。"
if (-not [string]::IsNullOrWhiteSpace($ApiBaseUrl)) {
    Write-Host "已写入 Windows 用户级环境变量 YUNXIAO_API_BASE_URL。"
}
Write-Host "请重启 Codex/终端，让新环境变量在后续会话中生效。"

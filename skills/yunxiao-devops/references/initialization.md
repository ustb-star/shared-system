# 云效 DevOps 初始化引导

在新客户环境或新会话第一次使用本 skill 时，按本引导接入。目标是先用最少信息完成连通测试，再按需补充创建所需字段。

## 最小输入

安装/初始化 skill 时只向用户索取：

1. 云效个人访问令牌，且已开通下方权限清单。

首次实际连通测试时再索取：

1. 一个项目 URL 或一个工作项 URL。

默认使用云效中心站 `https://openapi-rdc.aliyuncs.com`。不要一开始询问 endpoint 类型。只有用户明确说明使用 region 专属站点，或中心站连通测试失败且错误表现像 endpoint 不匹配时，才询问 `YUNXIAO_API_BASE_URL`。

如果用户提供了 URL，不要一开始询问 `organizationId`、项目 ID、工作项 ID、当前用户 ID、endpoint 类型或项目名。先解析 URL 中已有的 ID，再通过 MCP 自动发现组织、用户和项目元数据。

只有在自动发现失败或写入操作确实需要时，才继续询问：

- `organizationId`：当 `get_current_organization_info` 和 `get_user_organizations` 失败时再问。
- 创建记录所需的负责人、迭代 owner、版本 owner、参与人、验证人、抄送人等用户 ID：优先用成员搜索解析，解析失败再问。
- 工作项类型、自定义字段、字段选项：先读取项目元数据，再让用户选择或确认。

## 令牌权限清单

让用户在测试前一次性给个人访问令牌开通以下权限。云效 UI 中权限名称可能略有差异，选择对应的“组织管理”和“项目协作/项目管理”OpenAPI 读写权限即可。

最小读取/连通权限：

- 组织管理读取：
  - 当前用户 / 当前组织
  - 用户加入的组织列表
  - 组织成员查询，用于负责人和 owner 名称解析
- 项目管理读取：
  - 项目详情和项目搜索
  - 工作项详情和工作项搜索
  - 工作项类型、字段配置、工作流元数据
  - 工作项评论
  - 工作项附件和文件，包括富文本内联图片
  - 工作项动态/历史记录

创建流程额外需要：

- 迭代创建和更新 API。
- 版本创建和更新 API。
- 工作项创建和更新 API。
- 工作项附件上传 API，仅当流程需要上传生成文件时开通。

## 运行时设置

默认在安装/初始化 skill 时写入 Windows 用户级持久环境变量。用户级环境变量存储在本机操作系统账户环境中，不会写入本 skill 目录，也不会进入 git 仓库。不要写入机器级环境变量，除非客户明确需要让同一台机器上的多个系统用户共享。

推荐使用初始化脚本：

```powershell
powershell -ExecutionPolicy Bypass -File D:\1data\shared-system\skills\yunxiao-devops\scripts\init_yunxiao_env.ps1
```

如果客户使用 region 专属站点：

```powershell
powershell -ExecutionPolicy Bypass -File D:\1data\shared-system\skills\yunxiao-devops\scripts\init_yunxiao_env.ps1 -ApiBaseUrl "https://your-org.devops.aliyuncs.com"
```

PowerShell 用户级持久写入：

```powershell
[Environment]::SetEnvironmentVariable("YUNXIAO_ACCESS_TOKEN", "<personal-access-token>", "User")
```

写入后需要重启 Codex/终端，新的进程才能读取到环境变量。

更新 token 时重复执行同一命令即可覆盖。删除持久 token：

```powershell
[Environment]::SetEnvironmentVariable("YUNXIAO_ACCESS_TOKEN", $null, "User")
```

如果客户不希望本机持久化，才使用当前会话临时注入。

PowerShell 当前会话：

```powershell
$env:YUNXIAO_ACCESS_TOKEN = "<personal-access-token>"
```

仅 region 专属站点需要：

```powershell
$env:YUNXIAO_API_BASE_URL = "https://your-org.devops.aliyuncs.com"
```

会话结束后清理 token：

```powershell
Remove-Item Env:\YUNXIAO_ACCESS_TOKEN -ErrorAction SilentlyContinue
```

## 连通测试

1. 调用 `get_current_organization_info`。
2. 如果成功，用返回的 `lastOrganization` 作为 `organizationId`。
3. 如果返回 403，让用户补开组织管理读取权限，或提供 `organizationId`。
4. 用已知项目/工作项 ID 调用 `get_project` 或 `get_work_item`。
5. 如果需求描述里有富文本图片，提取 `fileIdentifier` 并调用 `get_workitem_file`。

## 禁止存储

不要把客户 token、网页 session、临时 OSS URL 或个人凭证写入：

- `config/yunxiao-devops.config.json`
- `references/`
- `scripts/`
- git commit
- 共享日志

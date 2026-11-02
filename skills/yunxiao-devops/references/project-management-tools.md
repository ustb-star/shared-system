# 云效项目管理 MCP 参考

## 服务

官方包：`alibabacloud-devops-mcp-server@0.3.34`

本地依赖配置文件：`config/yunxiao-devops.config.json`。当 MCP 包版本、toolsets、默认 endpoint、权限清单或运行时输入清单变化时，更新该配置。

token 通过 `environment.accessTokenEnv` 指定的环境变量读取。默认安装/初始化时写入 Windows 用户级持久环境变量，后续 Codex/终端进程继承后即可使用。不要发布或提交个人访问令牌、cookie、临时下载 URL。

典型 MCP 客户端配置：

```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "npx",
      "args": ["-y", "alibabacloud-devops-mcp-server", "--toolsets=organization-management,project-management"],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

region 专属站点才需要额外配置：

```json
{
  "YUNXIAO_API_BASE_URL": "https://your-org.devops.aliyuncs.com"
}
```

默认中心站 endpoint：`https://openapi-rdc.aliyuncs.com`。

## 发现工具

- `get_current_organization_info {}`：获取当前用户和最近组织。没有显式 `organizationId` 时优先调用。
- `get_user_organizations {}`：列出当前 token 加入的组织。
- `get_current_user {}`：获取当前用户 ID，可用于默认负责人或 owner。
- `search_organization_members`：需要把人名解析成用户 ID 时使用。
- `search_projects`：按名称或条件搜索项目。
- `get_project`：按 `organizationId` 和项目 ID 获取项目详情。

如果组织发现返回 `403 Current token has no permission to api`，让用户补开组织管理读取权限，或提供 `organizationId`。

## 读取工具

- `get_work_item {"organizationId":"...","workItemId":"..."}`：获取单个工作项。
- `search_workitems`：按类型、项目/项目集空间、标题、状态、日期、负责人、迭代、工作项类型、优先级等条件搜索工作项。批量需要描述时设置 `includeDetails:true`。
- `list_work_item_comments`：获取工作项评论。
- `list_workitem_attachments`：列出工作项附件。
- `get_workitem_file`：获取指定附件或文件的临时下载信息。
- `list_workitem_activities`：获取字段变更、状态流转、关联变更等动态历史。

已知兼容性问题：部分云效返回的附件列表中 `gmtCreate`/`gmtModified` 是数字时间戳，而当前 MCP 包的 schema 可能期望字符串，导致 `list_workitem_attachments` 报 `Invalid input`。这种情况下检查 MCP stderr 中的原始响应；如果已拿到附件 `id`/`fileId`，直接用 `get_workitem_file` 获取临时下载 URL。

富文本描述里的内联图片可能不会出现在 `list_workitem_attachments` 中。需要从 `<img src="https://devops.aliyun.com/projex/api/workitem/file/url?fileIdentifier=...">` 提取 `fileIdentifier`，然后调用 `get_workitem_file`：

```json
{
  "organizationId": "<orgId>",
  "workitemId": "<workItemId>",
  "id": "<fileIdentifier>"
}
```

用返回的临时 OSS URL 下载或识别图片。直接请求 `devops.aliyun.com/projex/api/workitem/file/url` 可能返回 `invalid session`，因为该地址依赖云效网页登录态。

## 元数据工具

- `list_work_item_types {"organizationId":"...","projectId":"...","category":"Req"}`：列出项目里的工作项类型。
- `get_work_item_types {"organizationId":"...","id":"<projectId>","category":"Req"}`：另一种工作项类型列表接口。
- `get_work_item_type {"organizationId":"...","id":"<workitemTypeId>"}`：获取工作项类型详情。
- `get_work_item_type_field_config {"organizationId":"...","projectId":"...","workItemTypeId":"..."}`：获取自定义字段 ID、必填字段和选项值。
- `get_work_item_workflow {"organizationId":"...","projectId":"...","workItemTypeId":"..."}`：获取工作流和状态信息。

## 写入工具

- `create_version`：必填 `organizationId`、`id`（项目 ID）、`name` 和至少一个 `owners` 用户 ID。日期格式为 `YYYY-MM-DD`。
- `create_sprint`：必填 `organizationId`、`projectId`、`name` 和 `owners`。日期格式为 `YYYY-MM-DD`。
- `create_work_item`：必填 `organizationId`、`spaceId`（项目 ID）、`subject`、`workitemTypeId` 和 `assignedTo`。
- `update_work_item`：仅在用户明确要求编辑已有工作项时使用。

`create_work_item` 可选字段：

- `description`
- `formatType`：`MARKDOWN` 或 `RICHTEXT`
- `customFieldValues`：以云效字段 ID 为 key 的对象
- `labels`
- `parentId`
- `participants`
- `sprint`
- `trackers`
- `verifier`
- `versions`

## URL 解析

对于如下 URL：

```text
https://devops.aliyun.com/projex/project/<projectId>/req/<workItemId>
```

提取：

- `projectId`：`/project/` 后的路径片段
- `category`：`req`、`bug` 或 `task`，分别映射为 `Req`、`Bug`、`Task`
- `workItemId`：最后一个路径片段

URL 不包含 `organizationId`；通过组织工具自动发现，失败时再向用户询问。

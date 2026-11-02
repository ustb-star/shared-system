# shared-system

本仓库沉淀 Context 生产、维护、治理和迁移的方法系统，不承载任何单一产品线的业务事实。

新用户先读：[`new-user-guide.md`](new-user-guide.md)

它用于团队共享：

- context 仓库结构、生命周期和治理规则
- 大资料包接收、来源归档、证据完整性检查和写入前置门禁
- 可复用的模板、提示词、schema、脚本和质量检查清单
- 团队共享 skill 及其配套脚本、参考文件和使用日志

## 默认使用方式

默认从 Codex 对话窗口发起任务，而不是人工先自己翻文件。

用户提供任务目标、目标仓库、已知背景和限制条件；Codex 负责读取 `shared-system` 与对应产品 context 仓库，判断应该使用哪个 skill，查找或更新文件，并说明依据、缺口和待确认问题。

第一次使用时，可以直接在 Codex 中输入：

```text
我是第一次使用这套 context 工作流。
请基于 shared-system/new-user-guide.md、shared-system/README.md 和目标产品仓库 AGENTS.md，带我理解如何使用。
```

## 目录导览

| 目录 | 用途 |
|---|---|
| `sop/` | Context 工作方法、路由规则、治理流程和旧 `rules/` 迁移内容 |
| `templates/` | 文档模板、目录模板、材料接收模板和写入前检查清单 |
| `schemas/` | 结构化数据、索引、配置或校验 schema |
| `prompts/` | 可复用提示词 |
| `skills/` | 团队共享 skill 定义、参考文件和辅助脚本 |
| `scripts/` | 跨目录自动化脚本 |
| `quality-checks/` | 质量检查规则和检查清单 |
| `skill-usage/` | skill 使用记录和分析输入 |
| `assets/` | 手册、SOP、模板等方法文档引用的截图和静态素材 |

## 先读什么

1. 新手指引手册：[`new-user-guide.md`](new-user-guide.md)
2. 仓库边界和目录职责：[`AGENTS.md`](AGENTS.md)
3. Context 方法和治理规则：[`sop/AGENTS.md`](sop/AGENTS.md)
4. 团队共享 skill：[`skills/README.md`](skills/README.md)
5. 批量材料接收模板：[`templates/intake/README.md`](templates/intake/README.md)
6. 大资料包写入前检查：[`templates/pre-context-write-checklist.md`](templates/pre-context-write-checklist.md)

## 写入边界

- 产品业务事实写入对应 `context-<product>` 仓库，不写入本仓库。
- 对外发布内容和发布工作流写入 `kb-publish`，不写入本仓库。
- 具体项目、客户、版本或需求材料先进入对应产品 context 仓库的 `raw/`、`drafts/`、`workspace/` 或 `context/`。
- 本仓库只沉淀可跨产品复用的方法、模板、规则、skill、脚本和质量检查能力。

## 维护约定

- 新增或更新 skill 时，优先维护 `skills/<skill-name>/SKILL.md`，并同步更新 `skills/README.md` 和相关索引。
- 新增模板时，放入 `templates/`，并补充对应 `AGENTS.md` 或 `README.md`。
- 规则或流程变更时，优先更新 `sop/`，再检查相关 skill、模板和质量清单是否需要同步。
- 不提交个人凭证、客户 token、cookie、临时下载 URL、内网环境专属地址或未脱敏客户材料。

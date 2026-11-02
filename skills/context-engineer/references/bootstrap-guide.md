# Context 仓库初始化指南

用于初始化新的产品线独立 context 仓库、`shared-system` 仓库，或未来的 `kb-publish` 仓库。

## 初始化前判断

先判断目标仓库类型：

| 仓库类型 | 目的 | 默认结构 |
|---|---|---|
| 产品 context 仓库 | 沉淀单一产品线的上下文 | `raw/`、`drafts/`、`workspace/`、`context/` |
| shared-system | 沉淀 context 生产方法、模板、脚本、skills | `sop/`、`templates/`、`schemas/`、`prompts/`、`skills/`、`scripts/` |
| kb-publish | 统一对外发布工作流 | `sources.yaml`、`workflows/`、`output/` |

默认只初始化当前明确需要的仓库，不提前创建共享业务仓库或发布仓库。

## 产品 context 仓库访谈

创建产品 context 仓库前，最多确认这些问题：

1. 产品线名称是什么，仓库名是否使用 `context-<product>`？
2. 当前有哪些原始材料来源：历史 PRD、会议纪要、项目交付、FAQ、表格、截图、外部资料？
3. 当前是否有正在推进的版本、项目或需求？
4. 研发默认需要读取哪些稳定上下文？
5. 是否已有当前正在推进的对外发布需求？

如果用户已经给出足够信息，直接初始化，不要反复追问。

## 产品 context 最小结构

```text
context-<product>/
|- AGENTS.md
|- raw/
|  `- AGENTS.md
|- drafts/
|  `- AGENTS.md
|- workspace/
|  `- AGENTS.md
`- context/
   `- AGENTS.md
```

初始化时不要创建：

```text
products/
portfolio/
shared/
kb/
```

这些目录不属于当前默认产品仓库。

## 产品仓库根 AGENTS.md 要点

根 `AGENTS.md` 应说明：

- 这是哪个产品线的 context 仓库。
- 研发默认读取 `context/`，再按任务读取相关 `workspace/`。
- `raw/` 只用于来源追溯，不作为默认上下文。
- `drafts/` 中内容未完全确认，不能直接当作稳定事实。
- 所有写入需要同步目标目录索引。
- 不在本仓库维护跨产品业务共享层或对外发布工作流。

## shared-system 初始化

`shared-system` 不是业务 context。它只保存方法系统：

```text
shared-system/
|- AGENTS.md
|- sop/
|- templates/
|- schemas/
|- prompts/
|- skills/
|- scripts/
`- quality-checks/
```

根 `AGENTS.md` 应说明：

- 本仓库沉淀 context 工作方法，不承载产品业务事实。
- `skills/` 是仓库级 skill 源。
- `templates/` 存放可复用文档模板。
- `sop/` 存放流程和治理规范。
- `scripts/` 存放自动化工具。
- 产品业务材料应写入对应 `context-<product>` 仓库。

## kb-publish 初始化

只有出现统一对外发布需求时才初始化：

```text
kb-publish/
|- AGENTS.md
|- sources.yaml
|- workflows/
`- output/
```

`sources.yaml` 用于声明读取哪些产品 context 仓库。`output/` 保存生成结果或发布中间产物。

不要把 `kb-publish` 放入某个产品 context 仓库内部。

## 初始化完成回复

回复用户时说明：

- 创建了哪类仓库结构。
- 每个目录的职责。
- 哪些目录没有创建，以及原因。
- 研发或 AI 默认读取路径。

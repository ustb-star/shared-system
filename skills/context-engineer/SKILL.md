---
name: context-engineer
description: 设计、诊断、维护 Context 仓库结构。用于搭建或调整产品线 context 仓库、设计 raw/drafts/workspace/context 生命周期、维护 AGENTS.md 索引、规划 shared-system 或 kb-publish 等上下文生产与协作体系，并制定外部工作项链接、表格 hyperlink、评论、动态和附件的证据归档规则。
---

# Context Engineer

你是 Context 体系架构师，负责把零散业务材料沉淀成可维护、可协作、可被 AI 和研发稳定读取的上下文资产。

本 skill 的默认语言是中文。后续新增或更新 skill 定义时，除非用户明确要求英文，否则 `SKILL.md` 使用中文编写。

## 当前推荐架构

默认采用“产品线仓库彻底分拆、仓库最小化”的结构：

```text
context-<product>/
|- AGENTS.md
|- raw/
|- drafts/
|- workspace/
`- context/

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

如果未来确实需要统一对外发布，再单独创建发布仓库，不提前塞进产品 context：

```text
kb-publish/
|- AGENTS.md
|- sources.yaml
|- workflows/
`- output/
```

## 仓库边界

### 产品 context 仓库

每个产品线独立一个 context 仓库。仓库内只放该产品自己的材料、草稿、进行中工作和稳定上下文。

产品名由仓库表达，因此产品仓库内部不要再重复嵌套产品名目录，也不要放置跨产品规划层或共享业务层。

默认不要创建 `context-shared-business`。只有出现真实、持续、跨产品复用的业务内容时，再从产品仓库中抽出独立共享业务仓库。

### shared-system 仓库

`shared-system` 是方法系统，不是业务 context。

它沉淀：

- context 生产、维护、治理 SOP
- 文档模板和目录模板
- schema、命名规范、质量检查规则
- prompts、skills、脚本和质量检查
- 跨仓库协作方法

不要把某个产品的业务事实写入 `shared-system`。

### kb-publish 仓库

`kb-publish` 是对外发布工作流，不是产品 context 的一层。

它可以通过 `sources.yaml` 读取多个产品 context 仓库，抽取、清洗、合并后生成对外知识库。没有真实统一发布需求时，不创建该仓库。

## 生命周期层

每个产品 context 仓库只保留四层：

```text
raw/        原始材料和证据
drafts/     中间整理、提炼草稿、待确认判断
workspace/  当前正在推进的版本、需求、项目和讨论
context/    已确认、稳定、可复用的产品知识
```

知识流动方向：

```text
raw/ -> drafts/ -> workspace/ -> context/
```

也可能存在直接流动：

- 原始材料只归档，不一定马上提炼：`raw/`
- 历史 PRD 已经能确认当前事实：`raw/ -> context/`
- 草稿变成当前需求：`drafts/ -> workspace/`
- 已上线需求沉淀为稳定知识：`workspace/ -> context/`

## 目录职责

### raw/

保存原始输入和证据，包括会议纪要原文、聊天摘录、历史 PRD、PPT、表格、截图说明、交付材料、外部资料等。

`raw/` 不作为研发默认读取上下文，只用于追溯证据。

表格、历史 PRD 包或外部系统导出中包含云效、飞书、Jira、Linear、GitHub Issue 等工作项链接时，应把链接当作来源入口处理：归档工作项正文、评论、动态/变更历史、附件元数据和可下载附件；表格 hyperlink 中隐藏的 URL 也属于来源证据。

### drafts/

保存已经被产品或 AI 初步整理过、但尚未确认的内容，包括摘录、分析、草稿、待确认解释、备选方案。

### workspace/

保存当前进行中的工作，包括版本 PRD、需求拆解、评审记录、bug、demo、当前项目材料、待确认问题。

如果按版本组织，推荐：

```text
workspace/<version>/
|- AGENTS.md
|- prd/
|- requirement-breakdown/
|- discussions/
|- bugs/
|- demo/
`- release/
```

### context/

保存已经确认、稳定、可长期复用的产品知识，包括产品结构、术语、模块能力、功能特性、业务规则、数据结构、版本历史、项目案例沉淀和产品物料。

研发默认优先读取 `context/`，再按任务读取相关 `workspace/`。只有需要追溯来源时才读取 `raw/`。

## AGENTS.md 职责

每个重要目录都应有 `AGENTS.md`，至少说明：

- 这个目录放什么，不放什么
- 当前目录的读取优先级
- 新材料应该如何路由
- 关键文件和子目录
- 维护规则和索引更新规则

`AGENTS.md` 不是单纯文件列表，而是让 AI 和研发知道“该读哪里、怎么读、怎么维护”的导航层。

## 工作模式

### 1. 结构设计

用于用户讨论 context 体系、产品线边界、shared-system、kb-publish、目录边界、研发读取方式。

输出时优先给出：

- 推荐结构
- 为什么这样拆
- 当前不建议提前建设的目录
- 未来触发扩展的条件

### 2. 初始化

用于创建新的产品 context 仓库或 shared-system 仓库。

产品 context 仓库只创建最小结构：

```text
AGENTS.md
raw/AGENTS.md
drafts/AGENTS.md
workspace/AGENTS.md
context/AGENTS.md
```

不要预创建 `portfolio/`、`shared/`、`products/`、`kb/`。

### 3. 维护

用于刷新索引、检查目录漂移、发现空壳目录、修正链接、检查文件是否放错层级。

重点检查：

- 是否出现了不符合当前仓库边界的跨产品目录
- `raw/` 是否混入了整理后的草稿
- 外部工作项来源是否只归档了正文而漏掉评论、动态、附件或 hyperlink 隐藏 URL
- `context/` 是否混入了未确认内容
- `workspace/` 中已上线内容是否需要沉淀到 `context/`
- `AGENTS.md` 是否准确反映目录职责和关键文件

### 4. 演进

用于判断内容是否该晋升、归并或抽象为更稳定的知识。

默认不要主动创建共享业务仓库。只有满足以下信号之一时，才建议新建共享业务 context：

- 同一业务概念被两个以上产品长期复用
- 一个共享定义变更会同时影响多个产品的 PRD、研发实现或对外说明
- 任一产品研发都需要稳定读取一批跨产品业务背景
- 对外发布流程反复从多个产品抽取同一类统一口径

### 5. 质量复盘

用于用户要求复盘 context 总结质量、检查已写入 context 是否偏离定位，或一次大资料包写入后做验收。

质量复盘不直接追加业务事实，先检查结构、边界和写法是否正确。重点检查：

- 来源完整性：大资料包是否有来源覆盖表；表格 hyperlink、外部工作项正文、评论、动态、附件是否完整归档；失败项是否有缺口说明。
- 当前事实定位：功能正文是否只写当前有效状态；历史演进、版本过程、已废弃能力是否只进入版本记录或废弃说明。
- 产品边界：是否把产品自有能力误判为共享依赖；是否混淆内部运营平台、SaaS 用户配置、外部依赖、特殊链路和后续规划。
- 颗粒度：列表是否有筛选项、列表字段、操作、权限和异常入口；表单是否有分组、字段来源、校验、默认值、引用和操作交互；状态机是否按当前模式和角色整合。
- 写法健康度：是否存在补丁式追加、重复章节、旧口径未删除、新旧描述并存、来源只挂在概览不挂在专题文档。
- 导航一致性：`AGENTS.md` 是否能指导研发和 AI 找到最新主文档；新建专题是否有必要，是否应回并到原文档。

复盘结论应输出：

1. 发现的问题，按严重程度排序。
2. 建议的修复方式：改写、合并、删除旧口径、补来源、补颗粒度或迁移到版本记录。
3. 是否需要更新 skill、模板或仓库索引。
4. 如果用户要求执行修复，再使用 `context-write` 进行具体写入。

## 与 context-write 的分工

- `context-engineer` 负责结构、边界、生命周期和治理策略。
- `context-write` 负责把具体输入写入正确文件，并同步索引。

当任务是“写入、归档、整理某段材料”时，优先使用 `context-write`。

## 参考文件

按需读取以下中文参考文件，不要一次性全部加载：

- `references/bootstrap-guide.md`：初始化产品线独立 context 仓库或 shared-system 仓库时读取。
- `references/templates.md`：需要生成 `AGENTS.md`、产品 context 文档、workspace 工作包或 raw 材料包模板时读取。
- `../../templates/pre-context-write-checklist.md`：大资料包写入前或质量复盘时，用于来源、边界、当前状态和颗粒度门禁检查。

## 原则

1. 仓库最小化，先按产品彻底隔离。
2. 不为尚未发生的交集提前建结构。
3. `raw/` 必须保留，作为证据层。
4. `shared-system` 独立于业务 context，沉淀方法而不是产品事实。
5. `kb-publish` 在真实对外发布需求出现后再建。
6. 研发默认读取范围应尽可能干净：`context/` 优先，相关 `workspace/` 次之，`raw/` 只追溯。
7. 目录结构服务协作边界，不服务形式完整。
8. 所有重要目录都通过 `AGENTS.md` 说明读写规则。

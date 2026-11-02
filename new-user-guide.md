# 新手指引手册

这份手册给刚拿到 `shared-system` 和产品线 `context-<product>` 仓库的人使用。目标是让你知道：这套工作流为什么存在、环境怎么初始化、日常任务怎么从 Codex 发起。

## 核心认识

顶尖大模型已经很强，真正决定输出质量的是输入。

```text
输入 = 指令 + context
```

指令告诉 AI 要做什么，context 告诉 AI 在什么业务背景下做。没有 context，AI 只能靠通用知识回答；有高质量 context，AI 才能稳定写 PRD、回答产品问题、整理资料和沉淀知识。

这套工作流要解决三件事：

- 让团队有一份持续更新的产品全局 context。
- 让 AI 不依赖产品经理临时复述背景，也能产出可用内容。
- 让需求、PRD、技术方案、代码之间减少误差累积。

## 仓库分工

| 仓库                  | 放什么                                               | 不放什么                   |
| --------------------- | ---------------------------------------------------- | -------------------------- |
| `shared-system`     | 方法、SOP、模板、skill、脚本、质量规则、手册截图     | 具体产品业务事实           |
| `context-<product>` | 某个产品线的原始资料、草稿、进行中工作、稳定产品知识 | 跨产品方法论、统一发布内容 |
| `kb-publish`        | 面向交付、售前、客户或非产研人员的发布内容           | 产品过程资料、未确认事实   |

产品 context 仓库默认四层：

```text
context-<product>/
|- raw/        原始材料和证据
|- drafts/     整理稿、分析稿、待确认判断
|- workspace/  当前版本、需求、项目和讨论
`- context/    已确认、稳定、可复用的产品知识
```

默认读取顺序：

```text
AGENTS.md -> context/ -> workspace/ -> raw/
```

`AGENTS.md` 是导航层，告诉 Codex 这个目录放什么、读什么、怎么维护。

## 默认使用方式

不要默认人工自己翻文件。日常任务从 Codex 对话窗口发起：

1. 用户说明目标仓库、任务、背景、限制。
2. Codex 读取 `AGENTS.md` 和相关 context。
3. Codex 判断使用哪个 skill。
4. Codex 查找、写入、更新文件，并汇报依据和待确认问题。

## 需要安装的软件

- Git
- VS Code
- VS Code Codex 插件
- Mermaid Preview 插件
- Office Viewer 插件
- HTML Preview Pro 插件
- Obsidian

其中 VS Code 是维护入口，Codex 是任务入口，Obsidian 更适合查阅 Markdown context。

## 环境初始化

### 1. 安装并登录 Codex

先完成：

1. 安装 Git、VS Code 和上述插件。
2. 在 VS Code 中登录 Codex。
3. 在 Codex 中发送一条测试消息。
4. 在终端执行 `git --version`，确认 Git 可用。

### 2. 开通权限并准备令牌

初始化前先准备两类令牌。

**GitLab Access Token**

1. 让管理员开通 `shared-system` 和目标产品 `context-<product>` 仓库权限。
2. GitLab 右上角头像菜单进入 `Preferences`。
3. 进入 `Access Tokens`，创建个人访问令牌。
4. 权限范围勾选 `api`。Git 拉取不需要配置 SSH 公钥。
5. 复制 token，稍后在初始化对话中提供给 Codex。

参考截图：GitLab Access Token API 权限（公开版省略内部操作截图）

**云效个人令牌**

1. 确认账号能打开目标云效工作项。
2. 云效右上角头像菜单进入 `个人设置`。
3. 进入 `个人访问令牌`，新建个人令牌。
4. 勾选 `组织管理` 和 `项目协作`。
5. 将这两个模块批量设置为 `读写`。
6. 复制令牌，稍后在初始化对话中提供给 Codex。

参考截图：

- 云效个人访问令牌入口（公开版省略内部操作截图）
- 云效令牌组织管理和项目协作读写权限（公开版省略内部操作截图）

安全要求：

- token 只在本机 VS Code 的 Codex 初始化对话中提供一次。
- token 不写入仓库、文档、日志、issue、群聊或最终回复。
- Codex 负责把 token 写入本机持久凭证。

### 3. 打开工作区

准备一个本机目录，例如：

```text
D:\1data
```

用 VS Code 打开这个上层目录。目录可以先是空的，初始化时 Codex 会克隆仓库。

参考截图：

- 正常 VS Code 工作区示例（公开版省略内部操作截图）
- 正常仓库目录示例（公开版省略内部操作截图）

### 4. 发起初始化

在 Codex 对话窗口复制下面模板：

```text
我是第一次使用这套 context 工作流，请帮我完成环境初始化检查。

初始化信息：
- 产品 context 仓库地址：
- 是否需要对外知识库（kb-publish）：
- GitLab Access Token：
- 云效个人令牌：
- 测试云效工作项链接：
- 本机仓库目录：

shared-system 固定仓库地址：https://github.com/ustb-star/shared-system.git

要求：
1. 检查当前工作区和必要权限状态
2. 将 GitLab Access Token 持久化到本机 Git 凭证配置
3. 将云效个人令牌持久化到本机用户级环境变量 YUNXIAO_ACCESS_TOKEN
4. 自动克隆 shared-system 和产品 context 仓库
5. 自动检查并安装或链接 shared-system 中的共享 skill
6. 验证 Git、Codex、共享 skill 和云效 API 是否可用
7. 不要把 token 写入仓库、文档、日志或最终回复
8. 输出仍未完成的问题和下一步操作
```

初始化完成后应满足：

- 能看到 `shared-system` 和产品 context 仓库。
- Git 能正常 pull / commit / push。
- Codex 能识别 `shared-system/skills/` 下的共享 skill。
- 云效测试工作项的正文、评论、动态历史、附件元数据可读取。

## 第一次使用

初始化完成后，在 Codex 中发起一次带读：

```text
我是第一次使用这套 context 工作流。
请基于 shared-system/new-user-guide.md、shared-system/README.md 和目标产品仓库 AGENTS.md，带我理解：
1. 这套仓库怎么分工
2. 我日常应该怎么发起任务
3. 当前产品 context 应该优先读哪些目录
4. 我需要注意哪些写入边界
```

## 常用指令

所有任务都从 Codex 发起。下面模板里的 `context-<product>` 换成目标仓库。

### 查产品现状

```text
请基于 context-<product> 回答这个问题：<问题>
要求：先读 AGENTS.md，再优先读 context/；不足时再查 workspace/；不要根据常识猜测；回答时标明依据文件。
```

参考截图：查产品现状对话示例（公开版省略内部操作截图）

### 讨论需求方案

```text
请使用 product-thinking，基于 context-<product> 和下面的想法，帮我拆解用户价值、范围边界、风险和待确认问题。
想法：<一句话描述>
先不要写 PRD。
```

参考截图：讨论需求方案对话示例（公开版省略内部操作截图）

### 写 PRD

```text
请使用 prd-write，基于 context-<product> 写 <版本/需求名称> 的 PRD。
背景：<目标用户、问题、范围、不做什么、约束>
要求：先读 AGENTS.md 和 context/；不确定内容列入待确认问题；不写技术实现方案。
```

参考截图：写 PRD 对话示例（公开版省略内部操作截图）

### 处理资料包

```text
请使用 context-write 处理这个资料目录并更新产品 context。
目录：<资料目录>
目标产品仓库：<context 仓库路径>
要求：先做来源盘点和路由判断；判断进入 raw、drafts、workspace 还是 context；云效证据要完整归档；最后汇报新增和更新文件。
```

参考截图：处理资料包对话示例（公开版省略内部操作截图）

### 沉淀已上线能力

```text
请使用 context-write，把 <workspace 目录/版本> 中已上线并确认有效的内容沉淀到 context。
要求：只写当前有效事实；不写评审过程、排期、任务拆解；优先改写已有模块文档；同步更新 AGENTS.md。
```

### 修正错误 context

```text
请使用 context-write 修正 <模块/文件>。
要求：直接改写原章节、原表格或原状态机；删除旧口径；不要新增“补充说明”；保留来源追溯。
```

参考截图：修正错误context对话示例（公开版省略内部操作截图）

### 生成对外知识

```text
请使用 publish-kb-from-context，从 context-<product> 提炼 <目标读者> 需要的 <FAQ/说明/操作指引>。
要求：来源优先使用 context/；能回溯来源；不包含客户敏感信息、报价、token 或临时链接。
```

### 做界面、PPT 或 skill 治理

```text
请使用 frontend-design，基于 context-<product> 设计 <页面/组件/看板>，输出可预览结果。
```

```text
请使用 ppt-master，基于 <Markdown/PDF/DOCX/URL/主题> 生成一份原生可编辑 PPTX。
项目名：<项目名>
页数：<页数范围>
画幅：<16:9/4:3/海报等>
受众：<受众>
风格：<风格要求>
输出语言：<语言>
输出目录：<目录>
```

```text
请使用 guizang-ppt-skill，基于 context-<product> 做一份 <主题> 的网页 PPT。
受众：<受众>
时长：<时长>
风格：<电子杂志风/瑞士国际主义>
```

```text
请使用 skill-logger 记录这次使用：skill=<名称>，场景=<场景>，满意度=<1-5>，备注=<可选>。
```

```text
请使用 skill-analyzer 分析最近 <天数> 天的 Skill 使用情况，并给出需要优化的 skill 建议。
```

## Skill 分工

| Skill                       | 用途                                             | 典型输入                               |
| --------------------------- | ------------------------------------------------ | -------------------------------------- |
| `context-engineer`        | 设计、诊断、复盘 context 结构和质量              | 仓库路径、结构问题、质量复盘目标       |
| `context-write`           | 归档资料、更新 context、同步索引                 | 资料目录、目标仓库、写入目标、敏感限制 |
| `product-thinking`        | 讨论产品方向、方案、边界和优先级                 | 想法、目标用户、业务目标、约束         |
| `prd-write`               | 写 PRD、补验收标准                               | 版本/需求名、范围、不做什么、context   |
| `publish-kb-from-context` | 从 context 生成 FAQ、说明、操作指引              | 来源仓库、目标读者、输出场景           |
| `yunxiao-devops`          | 抓取云效正文、评论、动态、附件；必要时创建工作项 | 云效链接、测试工作项、目标仓库         |
| `frontend-design`         | 生成页面、组件、看板、可视化原型                 | 页面目标、受众、context、技术栈        |
| `ppt-master`              | 生成原生可编辑 PPTX                              | 来源材料、项目名、页数、画幅、受众、风格 |
| `guizang-ppt-skill`       | 生成横向翻页 HTML 网页 PPT                       | 主题、受众、时长、风格、来源材料       |
| `skill-logger`            | 记录一次 skill 使用效果                          | skill 名、场景、满意度、备注           |
| `skill-analyzer`          | 分析 skill 使用频率和满意度                      | 时间范围、关注 skill                   |

## 维护原则

- 先归档来源，再提炼结论。
- `context/` 只写当前有效事实，历史演进放版本记录。
- 修错时改原章节、原表格、原状态机，不写补丁式“补充说明”。
- 不确定内容放 `drafts/` 或 `workspace/`，不要污染 `context/`。
- 新增或移动重要文件后，同步更新 `AGENTS.md` 或 README。
- 更新完成后用 Git 提交，保留变更记录。

## 新手常见错误

- 把原始资料直接丢进 `context/`。
- 把历史 PRD 当成当前事实。
- 只让 AI 看一份材料，不让它读仓库 context。
- 不写来源，导致结论无法审查。
- 口头确认后不更新仓库，导致下次仍然缺 context。

## 最小可行用法

刚开始只要做到三件事：

1. 查问题时，在 Codex 中说明目标产品和问题。
2. 有新资料时，把目录交给 `context-write` 判断路由。
3. 已确认、会反复使用的结论，让 Codex 沉淀到 `context/` 并更新导航。

这套工作流的核心不是把文档整理得好看，而是把团队知识变成 AI 能稳定读取的高质量输入。

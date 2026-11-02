# shared-system/skills

## 用途

这里是本 context 仓库工作流的共享 skill 根目录。所有用于维护本仓库的定制 skill 都放在这里，并随仓库进入 Git 共享给团队。

## 优先读取

- [context-engineer/SKILL.md](context-engineer/SKILL.md)：仓库分层、生命周期流转、目录维护、诊断和演进。
- [context-write/SKILL.md](context-write/SKILL.md)：写入、归档、索引同步、标题、链接、查表型内容、Mermaid 图表和 context/kb 发布规范。
- [product-thinking/SKILL.md](product-thinking/SKILL.md)：产品方向、功能规划、需求构思、方案探讨、功能取舍和产品方案漏洞检查。
- [prd-write/SKILL.md](prd-write/SKILL.md)：版本 PRD 撰写、PRD 第一阶段主体内容、第二阶段验收用例、验收标准和上下游依赖补充。
- [publish-kb-from-context/SKILL.md](publish-kb-from-context/SKILL.md)：从产品 context 提炼、脱敏、归并并更新 `kb-publish`，维护面向非产研读者的场景阅读目录。
- [ppt-master/SKILL.md](ppt-master/SKILL.md)：基于文档、链接、Markdown 或主题生成原生可编辑 PPTX 的完整工作流。
- [yunxiao-devops/SKILL.md](yunxiao-devops/SKILL.md)：获取云效工作项正文、评论、动态、附件，或创建云效版本、迭代和工作项。

## 调用规则

- 只要任务涉及 context 仓库维护、知识归档、目录整理、context/kb/workspace/raw/drafts 更新、索引同步、规则调整、产品方案探讨、PRD 撰写、云效需求处理、PPT/PPTX 生成或提到 ppt-master，就先扫描本目录下带 `SKILL.md` 的子目录。
- 根据任务读取匹配的 `SKILL.md`；如果无法判断，先读 [context-engineer/SKILL.md](context-engineer/SKILL.md)，再按写入需求读取 [context-write/SKILL.md](context-write/SKILL.md)，按发布需求读取 [publish-kb-from-context/SKILL.md](publish-kb-from-context/SKILL.md)。
- 本目录是共享版本的唯一来源。不要把相同 skill 复制到 Codex 默认 skill 目录或个人 skill 目录里两头维护。
- 如果全局默认 skill 与本目录 skill 冲突，优先执行本目录中的规则。
- 新增 context 工作流 skill 时，统一放入 `shared-system/skills/<skill-name>/SKILL.md`，并更新本文件和 [README.md](README.md)。
- 如果需要让新会话通过默认 skill 发现机制自动识别这些 skill，可运行 [install-local-skill-links.ps1](install-local-skill-links.ps1) 创建 Junction；该脚本不复制 skill 内容。

## 维护规则

- skill 目录必须保留完整结构，至少包含 `SKILL.md`。
- skill 名称使用小写英文、数字和连字符。
- 每次新增、删除或重命名 skill 后，同步更新 [README.md](README.md) 的当前包含列表。
- 不在这里存放业务知识正文；业务知识仍按仓库分层放入 `raw/`、`drafts/`、`workspace/`、`context/` 或 `kb/`。

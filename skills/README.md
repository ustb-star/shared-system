# Skills

这里存放可共享的完整 skill 文件。

这是本 context 仓库工作流的唯一共享 skill 根目录。后续维护 context 仓库时，应优先从这里读取匹配的 `SKILL.md`，不要复制同名 skill 到 Codex 默认 skill 目录或个人 skill 目录里两头维护。

## 当前包含

- `context-engineer/`
- `context-write/`
- `frontend-design/`
- `guizang-ppt-skill/`
- `product-thinking/`
- `prd-write/`
- `publish-kb-from-context/`
- `ppt-master/`
- `skill-analyzer/`
- `skill-logger/`
- `yunxiao-devops/`

## 调用规则

1. 处理 context 仓库维护任务前，先扫描本目录下带 `SKILL.md` 的子目录。
2. 根据任务选择匹配 skill；目录结构、生命周期、健康检查优先读 `context-engineer/`，写入、归档、索引同步、链接、标题、查表型内容和 Mermaid 图表优先读 `context-write/`，产品方向、功能规划和方案探讨优先读 `product-thinking/`，版本 PRD 撰写和验收细节补充优先读 `prd-write/`，从产品 context 提炼并发布到 `kb-publish`、维护场景阅读目录时优先读 `publish-kb-from-context/`，云效需求证据抓取或工作项创建优先读 `yunxiao-devops/`，Web 页面、组件、仪表盘、海报式网页和 UI 美化优先读 `frontend-design/`，分享、汇报、发布会风格的单文件 HTML 网页 PPT 优先读 `guizang-ppt-skill/`，生成原生可编辑 PPTX 或提到 ppt-master 时优先读 `ppt-master/`，记录一次 skill 使用效果优先读 `skill-logger/`，分析 skill 使用频率、满意度和优化建议优先读 `skill-analyzer/`。
3. 如果本目录 skill 与全局默认 skill 冲突，以本目录版本为准。
4. 新增工作流 skill 时，放入 `shared-system/skills/<skill-name>/SKILL.md`，并更新本 README 和 `AGENTS.md`。

## 新会话自动发现

如果需要让 Codex 默认 skill 发现机制也能看到这些仓库内 skill，可运行 [install-local-skill-links.ps1](install-local-skill-links.ps1)。该脚本只在个人默认 skill 目录下创建 Junction 指向本目录，不复制 skill 内容。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\shared-system\skills\install-local-skill-links.ps1
```

## 使用建议

- skill 文件保持完整目录结构同步。
- 如果团队后续继续定制 skill，应直接在这里维护共享版本。
- 个人环境中的 skill 可以继续演化，但适合共享的版本应回收到这里。

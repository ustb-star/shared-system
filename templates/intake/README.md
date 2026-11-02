# Intake Template

这个模板用于发起一次“处理一批材料并更新 context”的动作。它特别适合历史 PRD、截图、发布记录、开发文档、表格和外部工作项混在一起的资料包。

## Recommended Folder Shape

```text
<incoming-folder>/
|- intake.md
|- file-1.ext
|- file-2.ext
`- subfolders/
```

## How To Use

1. 先参考 [intake-sample.md](intake-sample.md) 理解填写粒度，再复制 [intake.md](intake.md) 到你的待处理目录。
2. 填写基本信息、当前口径、产品边界提示、文件说明和重点输出模块。
3. 把待处理文件一起放到同一个目录。
4. 复制 [request-template.md](request-template.md) 里的指令发给 Codex。

## Default Expectation

如果没有额外说明，Codex 默认会：

1. 先读取 `intake.md`
2. 先做来源盘点和外部工作项完整性检查
3. 判断每个文件属于 `raw`、`drafts`、`workspace` 还是 `context`
4. 先完成来源归档，再提炼当前有效的稳定知识
5. 对历史 PRD 做当前状态归并，不把版本过程堆进功能正文
6. 同步更新相关 `AGENTS.md`

## Notes

- 这个模板适合历史资料整理，也适合当前版本材料的批量导入。
- 如果某批材料有敏感限制，直接写在 `intake.md` 的 `敏感级别` 和 `补充说明` 字段里。
- `文件说明` 不必穷举所有小文件，但至少覆盖关键文件或关键子目录。
- 文件名或目录名只要包含“云效”关键词，应在 `intake.md` 中提醒需要按云效工作项完整证据处理。
- 如果你知道哪些概念已经废弃、改名或容易混淆，写在“当前口径”和“产品边界提示”里。

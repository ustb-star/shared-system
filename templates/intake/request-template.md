# Request Template

把下面这段复制后，按实际目录修改：

```text
请处理这个待整理目录并更新 context：

目录：D:\path\to\incoming-folder
目标：归档来源材料，并提炼当前有效、可进入 context 的内容
要求：
1. 你自己判断 raw、drafts、workspace、context 的去向
2. 不要漏掉来源归档
3. 如果文件名或目录名包含“云效”关键词，或表格中存在云效链接，必须按云效 skill 完整抓取主体、评论、动态和附件
4. context 正文只写当前有效状态，历史演进写入版本记录
5. 用户指出遗漏或错误时，优先改写整合原章节，不优先追加补丁式说明
6. 更新对应 AGENTS.md
7. 最后汇报新增和更新了哪些文件
```

如果这批材料有明显偏向，可以再补一句：

```text
这批材料主要是历史存量资料，优先走 raw -> drafts -> context
```

或：

```text
这批材料主要是当前版本材料，优先判断 workspace 和 context
```

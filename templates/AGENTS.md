# Templates

## Purpose

这个目录存放可复用的行为模板。

这里的模板不是业务知识内容，而是团队在发起某类动作时可直接复用的输入包、说明文件和指令模板。

## What To Read First

- [intake/README.md](intake/README.md) - 如何用 intake 模板发起一次知识库更新
- [pre-context-write-checklist.md](pre-context-write-checklist.md) - 大资料包写入前和写入后复盘的检查清单

## Files

- `intake/` - 发起“处理一批材料并更新 context”的标准模板
- `pre-context-write-checklist.md` - 来源完整性、产品边界、当前状态归并和颗粒度验收清单

## Routing Rules

- 只有通用、可重复使用的行为模板放在这里
- 具体某次更新的真实材料不要放在这里
- 模板应尽量保持稳定、抽象，不绑定某个具体产品或项目

## Maintenance Notes

- 新增模板时，为每个模板子目录补一份 `AGENTS.md` 或 `README.md`
- 模板字段变更时，同步检查相关规则文档是否需要更新

# shared-system

本仓库沉淀 Context 生产、维护、治理和迁移的方法系统，不承载任何单一产品线的业务事实。

## 目录职责

| 目录 | 用途 |
|---|---|
| `sop/` | context 工作方法、路由规则、治理流程和旧 `rules/` 迁移内容 |
| `templates/` | 文档模板、目录模板、材料接收模板 |
| `schemas/` | 结构化数据、索引、配置或校验 schema |
| `prompts/` | 可复用提示词 |
| `skills/` | 团队共享 skill 定义 |
| `scripts/` | 自动化脚本 |
| `quality-checks/` | 质量检查规则和检查清单 |
| `assets/` | 方法文档引用的截图和静态素材 |

## 写入规则

- 产品业务事实写入对应 `context-<product>` 仓库，不写入本仓库。
- 对外发布流程写入 `kb-publish`，不写入本仓库。
- 新增或更新 skill 时，`SKILL.md` 默认使用中文。

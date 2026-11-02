---
name: skill-analyzer
description: |
  分析 shared-system 中的 Skill 使用日志，输出频率排行、满意度趋势、低频 Skill 清单。
  触发词："分析 Skill 使用情况"、"Skill 周报"、"哪些 Skill 用得多"、"看看 Skill 数据"。
  依赖 skill-logger 写入的 skill_usage_log.jsonl 日志文件。
---

# Skill 使用分析

读取 shared-system 仓库下的 `skill-usage/skill_usage_log.jsonl`，分析 Skill 使用情况，输出总结报告。

```text
D:\1data\shared-system\skill-usage\skill_usage_log.jsonl
```

脚本会从自身所在位置自动定位 shared-system 根目录；如需覆盖路径，可设置 `SHARED_SYSTEM_ROOT` 环境变量。

## 使用方式

```text
分析 Skill 使用情况
```

默认分析最近 7 天。指定时间范围：

```text
分析过去两周的 Skill 数据
```

## 工作流程

### Step 1：运行分析脚本

```bash
python scripts/analyze_skill_usage.py --days 7
```

指定时间范围：

```bash
python scripts/analyze_skill_usage.py --days 14
```

### Step 2：输出分析报告

脚本输出原始数据后，AI 整理成以下格式的报告：

**Skill 使用周报（最近 7 天）**

**总览**
- 共使用 Skill N 次，覆盖 X 个不同 Skill
- 平均满意度：X.X / 5

**使用频率排行**

| 排名 | Skill | 使用次数 | 平均满意度 |
|------|-------|---------|-----------|
| 1 | x-post | 8 | 4.2 |
| 2 | podcast-workflow | 5 | 4.6 |
| 3 | content-digest | 4 | 4.0 |

**满意度偏低的 Skill（< 3.5 分）**

| Skill | 平均满意度 | 常见问题 |
|-------|-----------|---------|
| xxx | 3.0 | 备注中反复出现"改了结尾" |

**建议**

- `xxx` 满意度持续下降，建议检查 SKILL.md 是否需要更新规则
- `yyy` 两周未使用，考虑是否仍有需求
- `zzz` 本周高频使用，可以考虑做自动化

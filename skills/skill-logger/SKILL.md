---
name: skill-logger
description: |
  记录一次 Skill 使用情况到 shared-system 的日志文件。每次用完某个 Skill 后调用，追加一条使用记录。
  触发词："记录这次使用"、"记录用了 xxx"、"log skill"、"记录一下"（在使用完某个 Skill 之后）。
  用于追踪 Skill 使用频率和满意度，为 skill-analyzer 提供数据。
---

# Skill 使用日志记录

每次使用完某个 Skill 后，调用本 Skill 记录一条使用日志。日志追加到 shared-system 仓库下：

```text
D:\1data\shared-system\skill-usage\skill_usage_log.jsonl
```

脚本会从自身所在位置自动定位 shared-system 根目录；如需覆盖路径，可设置 `SHARED_SYSTEM_ROOT` 环境变量。

## 使用方式

**方式一：用完 Skill 后手动触发**

```text
记录这次使用：x-post，场景是把播客笔记改成即刻动态，满意度 4 分，结尾不够有力手动改了
```

**方式二：让 AI 引导填写**

直接说"记录一下"，AI 会依次询问：

1. 用了哪个 Skill？
2. 使用场景是什么？
3. 满意度（1-5 分）？
4. 备注（可选）？

## 工作流程

### Step 1：收集信息

如果用户没有提供完整信息，逐项询问：

- **skill**：Skill 名称，如 `x-post`
- **scene**：这次用它做了什么，一句话描述
- **satisfaction**：满意度 1-5 分，1=很差，3=一般，5=完美
- **note**：备注，比如哪里不满意、手动改了什么，可为空

### Step 2：运行追加脚本

```bash
python scripts/log_skill_usage.py \
  --skill "x-post" \
  --scene "把播客笔记改成即刻动态" \
  --satisfaction 4 \
  --note "结尾不够有力，手动改了"
```

### Step 3：确认写入

脚本输出追加成功后，向用户确认写入的 Skill、满意度、场景、备注和日志文件路径。

## 日志格式

每条记录是一行 JSON：

```json
{"date": "2026-03-24", "weekday": "周二", "week": "W13", "skill": "x-post", "scene": "把播客笔记改成即刻动态", "satisfaction": 4, "note": "结尾不够有力，手动改了"}
```

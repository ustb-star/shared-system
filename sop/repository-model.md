# Repository Model

## 目的

定义产品线独立 context 仓库的分层模型，避免把原始资料、进行中材料、稳定知识和发布内容混在一起。

## 产品仓库四层结构

每个产品线独立一个 context 仓库：

```text
context-<product>/
|- raw/        原始来源材料与证据层
|- drafts/     整理稿、提炼稿与探索层
|- workspace/  进行中事项与工作包层
`- context/    稳定知识层
```

统一对外发布不放在产品仓库内部。需要时单独维护：

```text
kb-publish/
|- sources.yaml
|- workflows/
`- output/
```

## 核心流转线

### 历史与来源材料提炼线

```text
raw/ -> drafts/ -> context/
```

适用于历史存量资料、静态资料、FAQ 原稿、历史项目材料的知识化整理。

### 版本与项目沉淀线

```text
drafts/ -> workspace/ -> context/
```

适用于后续版本、项目、需求和交付过程中的知识沉淀。

### 对外发布线

```text
context-<product>/context/ -> kb-publish/output/
```

适用于已经稳定、需要统一对外发布的产品说明、FAQ、流程说明和案例摘要。

## 使用边界

- `raw/` 不承担“知识页面”职责，它保存的是原件与来源材料。
- `drafts/` 不保存原始附件本体，它承接的是整理稿和提炼稿。
- `workspace/` 不承担“长期事实源”职责。
- `context/` 是研发默认读取的稳定事实源。
- `kb-publish` 不承担产品过程记录归档职责。

## 简单判断标准

- `raw` 放原件。
- `drafts` 放整理稿。
- `workspace` 放正式推进中的工作包。
- `context` 放稳定知识。
- `kb-publish` 放统一对外发布产物。

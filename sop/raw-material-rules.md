# Raw Material Rules

## 目的

定义产品线独立 context 仓库中的原始资料归档规范，保证后续可追溯、可提炼、可迁移。

## 结构原则

每个产品线有独立的 `context-<product>` 仓库，因此 `raw/` 位于对应产品仓库内部。默认结构：

```text
context-<product>/raw/product-materials/
context-<product>/raw/projects/
context-<product>/raw/faq/
```

不要在产品仓库内再创建 `raw/products/<product>/`。

跨产品原始材料不提前创建共享业务仓库。遇到无法归属单一产品的材料时，先记录到迁移或待确认清单，确认真实复用后再决定是否建立独立共享业务 context。

## 资料包规范

每批资料建议单独建一个资料包目录：

```text
YYYY-MM-<topic>/
```

例如：

```text
2026-04-product-intro/
2026-04-private-deploy-case/
2026-04-common-questions-batch-1/
```

## 必需元数据

每个资料包至少包含一个 `README.md` 或 `notes.md`，建议写明：

- 来源
- 时间
- 归属
- 适用范围
- 内容概览
- 后续用途
- 敏感级别

## 归档纪律

- 原始资料不在 `raw/` 中改写。
- 一批资料一个目录，不要散放。
- 如果归属判断错了，迁移到正确产品仓库，不复制多份来源。

# 电商 Skill 验收清单

更新时间：2026-07-27

## 当前盘点

- `/Users/liutao/Projects/ecom` 共发现 22 份 `SKILL.md` 物理文件。
- 当前共享主线包 `ecom-codex-skills-nine-image` 含 13 个条目：12 个默认安装 Skill，加 1 个不默认安装的 `ecom-image-director` 迁移兼容条目。
- `马来电商` 项目另有 1 个主线 Skill：`malaysia-ecommerce-ops`。
- 其余 8 份属于旧仓库重复副本、根目录旧版或 `社媒运营/docs/archive` 归档版本，不应按当前生产主线重复计算。

## 验收结果

| 层级 | 范围 | 结果 | 证据 |
|---|---:|---|---|
| 静态结构 | 22/22 物理文件 | 通过 | frontmatter、名称、描述长度、正文、相对链接、JSON/YAML、Python 语法 |
| 当前共享包结构 | 13/13 条目 | 通过 | `npm run validate-skills`：13 Skills、40 assets、61 文本文件、0 secret |
| 逐 Skill 最低合同 | 13/13 条目 | 通过 | `npm run test-skill-contracts`，逐项检查职责边界、事实源、审批门和禁止行为 |
| 九图业务门控 | `ecom-nine-images` | 通过 | AJV 正反例覆盖方向审批、真实参考图、样片审批、Admin 整包审批、发布证据 |
| 安装行为 | 12 个默认 Skill | 通过 | Codex、Hermes、generic 沙箱安装；幂等、冲突保护、九图 bundle 隔离 |
| 视频维护脚本 | `video-director-core` | 通过 | 合法/非法候选校验，dry-run promotion；未执行 `--apply` |
| Base 模板导出 | `malaysia-ecommerce-ops` | 通过 | 生成 33 份 CSV，manifest 33 行，逐表表头与 schema 一致 |
| 旧共享包 | 5/5 条目 | 通过 | 旧仓库 `npm test` 全通过，仅作回归兼容证据 |

## 尚未完成的真实 E2E

以下动作涉及真实内部数据、外部写入、生成费用或人工审批，本轮未自动执行，不能标记为生产 E2E 通过：

- `ecom-business-context`：按真实 SKU 读取飞书商品主数据。
- `global-ai-router`：真实文本、图片和视频调用。
- `ecom-nine-images`：真实 SKU + 真实 Logo/参考图的样片、整包、人工审核与飞书写回。
- `ecom-product-title`、`ecom-product-detail-page`、`ecom-product-video`、`ecom-product-deepresearch`：真实 SKU 产物、人工审批与写回。
- `ecom-run-contract`、`ecom-review-approval`：真实任务/run/审批记录写回。
- `shopee-my-detail-tags`、`malay-ad-copy-skill`：真实 SKU 和平台约束下的人工语言/Claim 验收。
- `malaysia-ecommerce-ops`：真实 Base 读写与工作台流程闭环。

## 下一步

1. 选择一个飞书中资料完整、含真实参考图且允许测试的 SKU。
2. 先跑只读上下文、标题、详情页、标签、广告文案和深研输出，集中人工验收。
3. 再单独确认 Router 真实调用和飞书写回范围，跑九图与视频付费 E2E。
4. 将每个真实 run 的证据、审批和写回链接登记到本清单或对应任务事实源。

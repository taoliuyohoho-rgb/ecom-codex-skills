# 电商故事视频 Skill 操作手册

更新时间：2026-08-13  
适用对象：电商运营、内容负责人、审核人  
当前 Skill：`ecom-product-video v2.3.0`

## 1. 现在能做什么

电商视频默认走故事结构：

```text
Hook -> 具体剧情 -> 产品时刻 -> CTA
```

适合 TikTok Shop / Shopee / Lazada Malaysia 的短视频。产品要自然进入剧情，不做纯图片轮播或脱离情境的产品展示。

默认 AI 视频模型：`doubao-seedance-2-0-260128`（调用别名：`seedance-2.0`）。  
快速草样别名：`seedance-2.0-fast`，对应 `doubao-seedance-2-0-fast-260128`。

## 2. Codex 更新 Skill

### 首次安装

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm ci
npm test
node install.mjs --client codex --bundle video
```

安装完成后，重启 Codex 或重新打开工作区，让 Skill 元数据刷新。

### 已安装过的运营

```bash
cd ecom-codex-skills
git pull origin main
npm ci
npm test
node install.mjs --client codex --bundle video
```

如果安装器提示本地 Skill 有冲突，不要强行覆盖；先保留个人版本并把冲突报告给 Admin。

## 3. MCP 怎么用

团队 Router：

- MCP：`https://ai-router.metooloo.com/mcp`
- Health：`https://ai-router.metooloo.com/health`
- 视频工具：`ecom_router_video_start`、`ecom_router_video_poll`

在 Codex 的 MCP 设置中添加上述 MCP 地址，按 Feishu OAuth 完成授权，然后重启/刷新 Codex。不要索要、复制或粘贴任何 provider API key、bearer token 或 App Secret。

当前线上 health 应看到：

```text
provider=doubao
video model=doubao-seedance-2-0-260128
aliases=seedance-2.0, seedance-2.0-fast
```

运营不需要直接手写 MCP JSON。把下面的任务说明交给 Codex 即可：

```text
请使用已发布的 ecom-product-video Skill，读取马来电商共享协议和商品主数据。
商品/SKU：<填写 SKU>
平台/市场：<例如 TikTok Shop / Malaysia>
目标：制作故事类短视频
已确认 CTA：<例如 限时 40% Off，新用户 RM5 off>
参考图：使用商品主数据中的一张干净 SKU 锚图
先返回事实、缺口、方向、脚本和写回位置；未经我确认不要调用真实视频生成。
```

Codex 应先停在方向和脚本确认，之后执行 `no_spend_dry_run`，得到明确授权后才调用 `ecom_router_video_start`。

## 4. 视频生产协作流程

1. 读取商品主数据，确认 SKU、规格、包装、已批准卖点、禁用表达和真实参考图。
2. 提出 2-3 个故事方向，运营确认一个方向。
3. 输出一版脚本：`Hook -> 具体剧情 -> 产品时刻 -> CTA`，运营确认脚本。
4. 运行 `no_spend_dry_run`，确认模型、预算、参考图、输出路径和写回位置。
5. 授权后生成一条最小样片；默认使用一张干净 SKU 锚图。
6. 人工审核样片，通过后再扩展 production master 或分段成片。
7. 最终审核通过后交付；`generated`、`reviewed`、`approved`、`delivered`、`published` 必须分开记录。

`director_brief_exploration` 只锁故事、产品身份、必需产品动作、市场语境和确认过的促销事实；镜头、运镜、表演、节奏、转场和促销呈现交给模型发挥。不要默认写成逐秒分镜或长负面提示词。

## 5. Base / SOP 怎么写

### 运营工作台 / 流程模板

使用流程：

```text
读取商品事实 -> 方向 -> 脚本 -> no-spend dry-run -> 样片 -> 样片审核 -> 成片 -> 最终交付
```

发布不是成片流程的自动下一步，必须另建外部发布任务并保留平台证据。

### SOP 与知识库 / 电商故事视频生产 SOP

每条视频任务至少写回：

- SKU、平台、市场、账号/店铺
- `task_id`、`run_id`
- Skill 版本、provider、model、Router job id
- 参考图路径/版本和 prompt/spec hash
- 脚本版本、样片链接、审核结果、审批人
- CTA/促销事实来源
- 当前状态和下一步负责人

### 共享 Skill 注册表

运营只调用 `发布状态=已发布` 的 Skill。当前：

- `ecom-product-video`：`v2.3.0`
- `global-ai-router`：`v1.1.0`

## 6. 常见错误

- Codex 找不到视频 Skill：先执行 `node install.mjs --client codex --bundle video`，然后重启 Codex。
- Router 未连接：检查 MCP 地址和 OAuth，不要向运营索要 key。
- health 仍显示 Seedance 1.x：不要发起真实调用，联系 Admin 检查 Router 共享环境覆盖。
- SKU 或参考图不明确：状态标记为 `blocked`，不要从 prompt 或竞品图猜商品事实。
- 生成了产品互动画面：只能作为故事演绎，不能当真实性能、安全、认证或测试证明。

## 7. 一句话调用模板

```text
用 ecom-product-video 做一个马来西亚故事类电商视频：先读 SKU 商品主数据，提出 2-3 个方向，按 Hook -> 具体剧情 -> 产品时刻 -> CTA 出一版脚本；CTA 只使用已确认的促销事实；先 dry-run，等我批准样片后再调用 Seedance 2.0 并写回 Base。
```

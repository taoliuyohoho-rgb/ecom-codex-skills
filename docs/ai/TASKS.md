# 电商 Skill 验收清单

更新时间：2026-08-07

## 2026-08-13 电商视频 Skill Director Brief 更新

- 已将电商视频流程扩展为 `director_brief_exploration` 与 `production_master` 两种执行粒度；兼容包 `ecom-product-video` 更新至 v2.2.0。
- 故事脚本统一使用 `Hook -> 具体剧情 -> 产品时刻 -> CTA`。实际生成默认使用一张干净 SKU 锚图；多参考图只在 storyboard/规划阶段使用并必须声明角色。
- Director Brief 只锁故事、市场语境、产品必需动作和已确认优惠，镜头、运镜、表演、节奏、转场、促销卡片视觉交给模型发挥；禁止把探索样片直接当最终交付。
- 本轮验证：兼容 Skill quick validation 通过；工作区仍有既有未提交改动，未执行整仓库 `npm test` 或付费生成。后续真实成片仍需 no-spend dry-run、样片审批和终审写回。

## 一图一卖点与敏感品类隐喻视觉合同

- 2026-08-07：根据用户对竞品图组的复盘，将九图次图策略扩展为“一张图只承担一个已批准卖点或买家疑问”。每个 claim-bearing slot 必须绑定卖点 ID、准确 SKU/市场事实源、简短文字、视觉机制、证据锚点和排除项；文字负责说清主张，视觉负责解释或增强理解，不能用隐喻代替功效证据。
- 适用于私密护理等敏感品类的隐喻：水、柔软材质、光、抽象膜层、花瓣和质地可表达滋润、柔和、平衡、保护、清新、安心或舒适；禁止显性解剖、体液、性暗示姿势、身体前后对比、恐惧画面和易被误解为医学示意图的视觉。Amazon MAIN 仍只做真实 SKU 身份图，图文隐喻主要放次图。
- Skill 已同步至 Codex `ecom-nine-images`、共享包兼容目录和 `ecom-visual-benchmark`；飞书 `SOP 与知识库 / 知识条目` 已新增可用于机器人的 SOP 记录 `recvrzZLunaiRu`，共享 Skill 注册表中的 `ecom-nine-images` 已更新至 1.2.0。
- 验证：Codex/共享 Skill quick_validate、`npm test`、Skill 合同、安装隔离、架构校验、触发回归和 Codex Skill policy 校验均通过；本次没有图片生成或付费调用。
- 规则补充：决策支持可借鉴用户评论的疑问结构，但不得制作虚拟星级、用户名、日期、引号式好评、代言或个人效果；有真实评论才做来源绑定聚合，没有真实评论时使用 `Common question` / `Before you buy` / `What shoppers want to know` 并只给已核验答案。该边界已更新到 Skill、共享包和飞书知识条目 `recvrzZLunaiRu`。

## 电商图知识库研究

- 2026-07-31：已在 Obsidian 建立“双层电商图知识库”：电商图域现有总入口、图任务/图组方法、产品摄影与布光、AI 工具链、Prompt 执行、质量验收、来源证据台账共 7 篇；另新增跨项目的“图像生成 Prompt 通用方法与模型适配”，合计 8 篇。
- 外部证据已核验 Baymard、Google Merchant、3 个有完整字幕的高热 YouTube 教学、1 个仅有发布者描述/章节的中文视频，以及 PaddleOCR、Segment Anything、Real-ESRGAN、rembg 的 GitHub API 元数据和 README。
- 证据纪律：播放/点赞/Stars 只作为发现与热度信号；小红书本轮未取得可复查原帖与点赞/收藏量，Amazon/Shopify 候选页抓取失败，均未写入正式方法结论。
- 2026-08-01：用户审核修订生产原则：正式商品图默认由 `gpt-image-2` 带真实 SKU 参考图整图生成/编辑；禁止程序化拼图、叠 Logo、叠字和后期版式合成。Prompt 仅先锁使用场景、图片任务、SKU 商品事实和必要禁区，场景/构图/光线/道具/文字呈现默认由模型发挥；仅在品牌方向、平台硬规则或可复现失败时增加控制。文字审核按商业事实分级：SKU/规格/数量/价格/Claim/认证/促销错误为 `fail`，非事实微瑕可人工 `warn` 接受。
- 2026-08-01：按上述审核口径完成 `ecom-nine-images` v1.1.0 源包与当前 ecom Profile 安装副本升级。九个正式槽位均改为 `gpt-image-2` 携真实 SKU 参考图的一次整图生成/编辑；移除 `source_asset`、确定性拼版/叠字、无产品 contextual 和逐字 `text-safe` 作为默认生产或扩图门。Prompt Contract 改为低密度 Brief；Review Rubric 新增 `buyer_fact_error`，把非事实微小文字/排版问题降为可人工接受的 `warn`。完整 `npm test` 通过（build、13 Skill 校验、Skill 合同、九图正反例、Router 参考图完整性、OAuth、安装隔离/冲突保护）；安装器结果 `0 new / 1 upgraded / 4 unchanged`，源/安装 `ecom-nine-images` tree hash 一致：`2e65b314...d116`。

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

## 本 Profile 接入记录

- 2026-07-28：`test-ecom` Hermes profile 已按飞书接入协议安装 `nine-images` bundle：`global-ai-router`、`ecom-business-context`、`ecom-run-contract`、`ecom-review-approval`、`ecom-nine-images`。
- 验证：在 `ecom-codex-skills-nine-image` 运行 `npm ci && npm test` 全部通过；安装器报告 5 个新 Skill、无覆盖；Router `https://ai-router.metooloo.com/health` 返回健康、OAuth 已启用和图片能力已配置。
- Router OAuth：已使用电商租户完成 PKCE 授权；`hermes mcp test ecom-ai-router` 连接成功并发现 4 个工具，含 `ecom_router_image_generate`。尚未执行真实 SKU 读取、图像调用或飞书写回；首次生产任务仍须通过方向、真实调用和样片审批门。

## JD8001 样片事故记录

- 2026-07-28：`TASK-20260629-001` 的 `run-0927f8898797` 只生成了 Slot 1 样片；资产为 `assets/SOLRION-JD8001/nine-images/tiktok-shop/my/run-0927f8898797/slot-01-hero.jpg`。该样片是无效产物，不得审核、扩图、交付或写回为 SKU-safe。
- 证据：实际输出为 1254×1254，而非请求的 4:5；产品身份发生漂移。会话审计确认请求携带 `referenceImage.dataUrl`，但远端 Router 对 Grsai `gpt-image-2` 走 `/images/generations` 时未传参考图，也未把 `ratio` 映射到输出尺寸。
- 2026-07-28 已部署远端 Router 修复：Grsai `gpt-image-2` 带参考图时走 `/v1/api/generate`，请求体使用 `images`、`aspectRatio` 和 `replyType=json`，结果读取 `data.results`；`ratio` 优先于旧 `size`，MCP 图片工具支持最多 4 张 `referenceImages`。
- 验证：本地完整 `npm test` 通过；本地及远端请求级 mock 测试均确认 URL、双参考图传输、`4:5` 比例优先、`results` 返回映射和不进入 `/images/generations`。本地/远端 4 个部署文件 SHA-256 一致，运行中的 `dist` 含专用分支，服务重启后内外网 `/health` 均返回 HTTP 200。
- 限制：服务器旧发布包缺少 `scripts/test-skill-contracts.mjs`，故远端完整 `npm test` 在非 Router 的历史资产检查处停止；本次新增 Router 行为测试、TypeScript build 和本地完整套件均通过。尚未执行真实 Grsai 付费请求，也未重新生成 JD8001。
- 下一步：经单独授权后，用无敏感小图执行一次真实 Router 请求并在服务端确认 `/v1/api/generate`、`images[0]`、`aspectRatio=4:5`、无 `/images/generations`；通过后再重新授权 JD8001 单张样片。

## JD8001 真实参考图重试

- 2026-07-28：`run-20260728T074756Z-97c4a2a8` 使用原始 800×800 JPEG 锚图执行一次真实参考图请求，上游返回 `image upload failed, please check the image`，未生成资产。
- 2026-07-28：用户授权单张重试。使用 `jpegtran -copy none -optimize` 将同一锚图去除 EXIF/非必要元数据，保持 800×800 商品像素和视觉身份不变；清洗后文件 73,706 bytes，SHA-256 `75d9c2853d1015a35e6867e9fcebb19731805cbc71f915a3b99f2345238102fd`。
- `run-20260728T164002Z-retry01` 通过 Router / `openai` / `gpt-image-2` 生成 1 张 1122×1402 PNG，但请求审计证明该 run **未传入真实 JD8001 参考图**：执行 Agent 在调用前算出完整 98,299 字符 data URL，实际 MCP tool call 却传入 239 字符、解码后仅 161 bytes / 1×3 像素的占位 JPEG。
- 因此该 run 不能证明 Router 真实参考图链路已打通，生成图也不得进行 SKU 身份审核。先前把 `SOLRION` 判为错误品牌同样属于审核错误：飞书商品主数据和方向稿已确认品牌为 SOLRION；真正失败代码应为 `reference_substituted` / `reference_not_real_sku`。
- 拒绝资产已隔离到 `assets/SOLRION-JD8001/nine-images/tiktok-shop/my/run-20260728T164002Z-retry01/rejected/slot-01-hero.png`，不得扩图、交付或写回为 SKU-safe。
- 下一步：禁止再让二级 Agent 把大 data URL 内联重写进 tool call。必须由调用程序直接从文件构造参数并在 Router 请求侧记录 `images[0]` 解码字节数、尺寸和 SHA-256；确认与 73,706-byte / 800×800 清洗锚图一致后，才允许新的单张 Slot 1 真实调用。样片通过人工审核前不得扩展 Slot 2-9。

## 参考图完整性防线

- 2026-07-28 本地 Router 已增加付费调用前参考图预检：图片生成的 `referenceImage` / `referenceImages` 必须提供源文件 SHA-256；Router 对 data URL 直接解码，对 HTTPS URL 先下载，再校验 SHA-256、字节数、JPEG/PNG 可读性、像素尺寸和 MIME。
- 硬阻断：哈希缺失/不匹配、低于 1 KB、低于 64×64、超过 10 MB、非 JPEG/PNG、非 HTTPS URL 或 URL 域名不在 `AI_REFERENCE_IMAGE_ALLOWED_HOSTS` 时，不调用上游生成供应商。
- Router 返回 `referenceEvidence`，包含 `source`、`sha256`、`bytes`、`width`、`height`、`mimeType`；只有它与真实 SKU 源文件一致，才能进入视觉审核。
- 调用约定：生产优先使用短 HTTPS URL + SHA-256；Base64 仅允许由确定性程序从文件直接构造，禁止 LLM/二级 Agent 在 tool 参数中复制或重写大 Base64。
- 自动验证：`npm test` 全通过；新增覆盖完整 data URL、可信 URL 下载与转发、哈希不匹配零供应商调用、历史 161-byte / 1×3 占位 JPEG 零供应商调用，以及 4:5/Grsai `results` 映射。
- 2026-07-29：参考图完整性门控已部署到远端 Router。`sha256` 在图片 MCP Schema 中必填；Data URL 使用严格 Base64 解码；URL 逐跳验证 HTTPS、域名白名单和公网 DNS/IP，并限制 3 次重定向、15 秒下载和 10 MB；JPEG/PNG 通过 `sharp 0.35.3` 实际解码并限制 40 MP。Router 校验后把同一批已验证字节重建为 Data URL 发送 Grsai，避免二次下载内容变化，响应返回 `referenceEvidence`。
- 生产安全配置：`MCP_MAX_BODY_BYTES=16777216`；`AI_REFERENCE_IMAGE_ALLOWED_HOSTS` 当前为空，URL 入口默认全部拒绝，待正式素材域名可用后再配置；完整 Data URL 仅允许确定性程序从文件直接构造。
- 部署验收：本地完整 `npm test` 通过；远端 TypeScript build 和 mock 测试通过，覆盖完整 Data URL、URL 同字节转发、无 Content-Type MIME 推断、哈希缺失/不匹配、非法 Base64、161-byte / 1×3 占位图、非 HTTPS、非白名单、重定向越权和 MIME 不符的付费前阻断。远端源码、测试及两份 `dist` 与本地 SHA-256 一致；服务于 2026-07-29 09:50:49 CST 重启，回环和公网 `/health` 均为 HTTP 200，启动后无错误日志。
- 当前状态：完整性门控已在生产生效，**尚未执行任何新的 Grsai 付费生成**。下一步必须由确定性调用程序提交 73,706-byte / 800×800 / SHA-256 `75d9c2853d1015a35e6867e9fcebb19731805cbc71f915a3b99f2345238102fd` 的真实锚图，并先核对返回 `referenceEvidence` 完全一致；证据确认后才单独授权 Slot 1 付费样片。

## 妇炎洁 Amazon 参考图 E2E

- 2026-07-29：商品策略 / 商品主数据定位到 `妇炎洁抑菌凝胶`，SKU 组 `MZ6035 / MZ6033 / MZ6047 / MZ6048`，执行锚点为 `MZ6033 / 3g×3支`；从 Base 下载真实 SKU 附件 `KrUxbAi8NoGO5oxy2TecOGOMn5d`，文件为 174,909 bytes、800×800 JPEG、SHA-256 `a2161f0b1cc84c0e737a8e4bc3b65693c18a3068aef4ecccc14cf3d81d7cbebc`。
- 使用当前 ecom profile 的飞书 OAuth 连接生产 Router；由确定性脚本直接从文件构造完整 Data URL 和 SHA-256，调用 `openai / gpt-image-2 / 1:1 / count=1`。Router 返回 `referenceEvidence` 与源文件的哈希、字节数、尺寸和 MIME 完全一致，证明真实参考图传输 E2E 已打通，不再是 161-byte / 1×3 占位图。
- 生成文件为 1254×1254 PNG，但商品图审核失败：规格文字从 `3g×3支` 漂移为 `3gx3支`，包装文字/排版不能证明逐项忠实复现，四角像素也不是严格纯白。样片已移至 `assets/FUYANJIE-MZ6033/amazon/sample-20260729/rejected/amazon-hero-1.png`，不得交付或发布；请求证据和审核见同目录 `request-evidence.json`、`review.md`。
- 结论：Router 参考图传输链路真实通过；本张 Amazon 商品图失败，不能把传输成功等同于 SKU-safe 样片成功。停止自动付费重试；下一版优先取得干净、高清、无促销画面干扰的真实包装照片，再做纯白背景参考编辑并逐字人工核对。

## 妇炎洁益生元凝胶 Amazon 方向 A

- 2026-07-29：按 `ecom-image-director` 重新执行，先查询商品主数据并确认 `妇炎洁益生元玻尿酸滋润凝胶 / MZ6032 / 5g×10支`；真实 Base 附件为 87,570 bytes、800×800 JPEG、SHA-256 `1871822dbe29affb36756a4904b2f60fef56eb81af2a4c9c99e3a56e0681396b`。方向门提出 A 柔粉日常润护、B 10支体验装、C 水润质感首图，用户批准 A 后才生成一张 Amazon 1:1 电商首图。
- Router 返回的 `referenceEvidence` 与 MZ6032 源文件完全一致。生成构图不再是白底 SKU packshot：外盒、独立袋、带导管凝胶管三件完整，柔粉 self-care 场景成立，产品占比约 70-78%。
- 样片审核仍为 `fail`：模型重写包装文字，新增 Base 未批准的 `形成保护膜`、`滋润水润`、`日常清洁` 等表达，侧面存在乱码；原包装清晰可见的英文产品名和 `5g×10支` 则被正确保留。失败代码为 `identity_drift` / `fake_claim_risk`，不能交付或扩图。
- 样片已隔离至 `assets/FUYANJIE-MZ6032/amazon/sample-20260729-direction-a/rejected/amazon-hero-1.png`；审核见同目录 `review.md`。停止自动付费重试。审核口径同时纠偏：Amazon 1:1 电商首图不自动等同标准白底 MAIN 图，场景/道具只有在明确 MAIN 图任务时才按白底规则判错。

## 妇炎洁 Amazon Slot 2-3 与 OAuth 续期

- 用户人工接受方向 A 的 Slot 1 观感后继续扩展。Slot 2 使用暖色晚间梳妆台、圆镜、折叠毛巾和前中后三件层次，产品约 35-40%；用户判断可用，但指出与 Slot 1 差异不足。样片位于 `assets/FUYANJIE-MZ6032/amazon/run-20260729-direction-a/slot-02/amazon-hero-1.png`。
- Slot 3 因此改为明显不同的俯拍近景：独立袋和带导管凝胶管为视觉中心，外盒退到左上辅助，使用透明水膜/气泡与粉色留白，明确禁用镜子、毛巾、花朵和正面三件排排站。生成图与 Slot 1/2 的角度、道具和视觉重心已拉开；参考图证据仍与 MZ6032 的 87,570-byte 源图完全一致。当前为 `warn` 候选，风险是外盒仍略大、微缩文字失真及 `平衡私处pH值/补水保湿` 表达待人工核对；资产与审核在同一 run 的 `slot-03/`。
- 同期修复 Router OAuth 每小时重新授权问题。根因是生产仅支持 `authorization_code`、只签发 `expires_in=3600` access token，没有 refresh token。现已部署持久化、客户端绑定、30天有效且每次使用轮换的 opaque refresh token；原始 token 不落盘，仅保存 SHA-256，文件权限为 `ecomrouter:ecomrouter 0600`。
- OAuth 验收：元数据与动态客户端声明均包含 `refresh_token`；本地完整 `npm test`、远端 build/聚焦测试和哈希核对通过；生产服务于 2026-07-29 19:36:14 CST 重启并保持 HTTP 200。最后一次电商账号登录后，人工将本地 access token 标记过期，`hermes mcp test ecom-router` 在无浏览器情况下自动刷新成功，access token 和 refresh token 均完成轮换，再次测试仍发现 4 个工具。以后不应每小时授权。

## 妇炎洁 Amazon Slot 4-9 扩展

- 用户确认继续完成剩余图组。Slot 4-9 已全部生成并保存于 `assets/FUYANJIE-MZ6032/amazon/run-20260729-direction-a/slot-04/` 至 `slot-09/`，每张为 `1254×1254 PNG`，每个请求的 `referenceEvidence` 均与 MZ6032 真实源图 `87,570 bytes / 800×800 JPEG / 1871...396b` 完全一致。
- Slot 4：尺寸/规格/组成示意；Slot 5：居家护理准备场景；Slot 6：包装和产品细节特写；Slot 7：整盒与单品组合陈列；Slot 8：收纳/出行 self-care 场景；Slot 9：装量/购买规格说明。六张均已完成文件格式和 SHA-256 核验。
- 总览：`assets/FUYANJIE-MZ6032/amazon/run-20260729-direction-a/slots-04-09-contact-sheet.png`；汇总：同目录 `pack-summary.md`。批量视觉检查未发现产品完全缺失或严重变形，但 Slot 4/7/9 存在产品组合展示相似，Slot 5/8 存在生活方式场景相似；Slot 4-9 当前均为 `generated_unreviewed`，未发布、未写回 Base，等待用户逐张确认。

## MZ6032 正式九图 Skill 安装与生产 E2E 验收

- 2026-07-30：当前 ecom Hermes profile 已安装正式 isolated `nine-images` bundle：`global-ai-router`、`ecom-business-context`、`ecom-run-contract`、`ecom-review-approval`、`ecom-nine-images`（全部 v1.0.0）。安装器报告 `5 new / 0 upgraded / 0 unchanged`；5 个安装 tree hash 均与 `ecom-codex-skills-nine-image` 源包完全一致。
- 仓库 `npm test` 已实跑通过：TypeScript build、13 个共享 Skill 校验、Skill contract、九图门控正反例、Router 参考图完整性、OAuth refresh token、Codex/Hermes/generic 安装隔离、幂等与冲突保护。正式九图 Skill 已可在当前 profile 被加载。
- 再查飞书 `商品策略 / 商品主数据`：MZ6032 唯一匹配记录为 `recvqr2EdqwuXY`；商品为妇炎洁益生元玻尿酸滋润凝胶，盒装锚点 `MZ6032=1盒10支（5g×10支）`；真实附件为 `recvqr2EdqwuXY-MZ6032.jpg`，`87,570 bytes / 800×800 JPEG / SHA-256 1871822d...1396b`。禁用治疗炎症、修复菌群治病、HPV、感染治疗、紧致/缩阴、即时/永久效果和未经核验促销承诺。
- 历史 Slot 2-9 均返回同一份完整 `referenceEvidence`，证明真实参考图传输通过；但 Slot 1 样片已经因重写包装/新增未批准 Claim 的 `identity_drift`、`fake_claim_risk` 被拒绝隔离。正式 Skill 要求新样片先获命名审批人通过后才能扩整包，因此历史 Slot 2-9 不能提升为交付资产。
- 复核结论：Slot 4 含未经 Base 核验的尺寸标注；Slot 5/8 缺外盒和清晰 `5g×10支`，只能为 contextual/候选；细小包装与英文文案无法默认正确。运营工作台 `统一任务` 未找到 MZ6032 对应任务，历史 evidence 也未完整记录正式所需的 `task_id`、`run_id`、审批链与写回位置。
- **最终状态：Skill 安装与生产链路验证通过；MZ6032 历史九图整包 E2E 验收不通过，状态保持候选/未交付/未写回/未发布。** 详见 `docs/ai/MZ6032_PRODUCTION_E2E_ACCEPTANCE_2026-07-30.md`。
- 下一步：建立正式统一任务并锁定审批与写回位置；以清晰原包装图只重做 Slot 1，逐字审核包装/Claim；样片获明确授权后再生成完整编号 1-9，并由 Admin 对固定版本作整包审批。

## MZ6032 Base 资产复核与九图 Skill 修订

- 2026-07-30：已通过 `record-download-attachment` 从商品主数据记录 `recvqr2EdqwuXY` 直接重新下载 `真实SKU图片`，落盘为 `assets/FUYANJIE-MZ6032/source-base-20260730/MZ6032-base-source.jpg`。该文件与 Base 返回完全一致：`87,570 bytes / 800×800 JPEG / SHA-256 1871822d...1396b`。它是完整、成熟的粉色电商产品 KV（外盒、单支袋、带导管软管、品牌与盒装信息），**不是缺失或不可用的 SKU 图**。
- 复盘确认历史 Skill 的核心问题不是参考图未传入，而是把“参考图已传到模型”误当成“模型可以重绘真实包装”。它缺少对商业 KV 的分类、文本承载包装的 `source_asset` 默认执行方式、文本安全证明，以及商业视觉质量对扩图的硬门控；结果导致 Slot 4 生成伪尺寸信息，Slot 5/8 使用模板化场景并重绘不可信包装。
- 已修订正式 `ecom-nine-images`：先下载和目视分类 Base 附件；将 `commercial_key_visual` 定义为可直接使用的生产资产；Slot 1/4/6/7 对可读文字包装默认 `source_asset`（原图/确定性裁剪缩放，不调用图片模型）；只有放大逐字比对通过的 `text-safe` 编辑样片才可走 `anchored_edit`；Slot 2/3/5/8/9 默认无产品的 `contextual` 画面；规格、尺寸、数量、包装文字和徽章禁止交给图片模型生成；样片必须同时通过身份、文本安全、构图/平台/技术质量及人工确认，才可扩整包。
- 复核 Slot 4/5/8：均为 `warn` 偏 `fail` 的商业质量候选；共性为生成包装文字、套装关系/导管结构不够可信、信息或场景模板化、产品层级被道具稀释。上述修订针对这些根因，而不是再要求“补一张 SKU 图”。
- 修订后运行 `npm run test-image-skill`、`npm run test-skill-contracts`、`npm run validate-skills`、`npm run build` 均通过；安装器升级当前 profile 的 `ecom-nine-images`（`0 new / 1 upgraded / 4 unchanged`），源与已安装目录 tree hash 一致：`1f648b...aadc2`。
- 下一步：不自动触发付费调用。用已确认的 Base KV 做 Slot 1/4/6/7 的 `source_asset` 方案，另为 Slot 2/3/5/8/9 设计无产品 contextual 图；如需产品出现在新场景，先单图证明 text-safe 后再授权扩展。

## MZ6032 淘宝 SKU 图搜视觉基准与反推方向

- 2026-07-30：按用户明确要求，外部研究只看淘宝、且直接用 MZ6032 的真实 Base SKU 商业 KV做「搜同款」，不再以关键词搜索、Shopee/TikTok 或 EasyBoss 目录代替外部证据。输入图为 `assets/FUYANJIE-MZ6032/source-base-20260730/MZ6032-base-source.jpg`（`87,570 bytes / 800×800 JPEG / SHA-256 1871822d...1396b`）。
- 淘宝图片搜索真实返回 6 个公开外部商品卡，原始截图、CDN 主图缓存与 URL 映射已保存至 `assets/FUYANJIE-MZ6032/benchmark-20260730/taobao-external/`。当次列表可见付款文本为 `100+`、`2000+`、`2000+`、`10万+`、`9000+`、`1万+人付款`；其中一张可见“榜·第1名”。这些仅是单页单源观察，不推导 MZ6032 销量、转化或全站排名。
- 外部视觉机制已重写进 `docs/ai/MZ6032_VISUAL_BENCHMARK_2026-07-30.md`：低复杂度同情绪棚拍靠明度差托出包装；一主两辅的真实实体层次；把产品区和行动信息区分开；抽象柔性材质只做氛围；情境图只做时刻、不重绘 SKU。明确拒绝红黄促销条、榜单/认证章、花海/身体/医疗暗示、虚构套装和 AI 生成包装文字。
- 方向板已依淘宝证据重写为 `docs/ai/MZ6032_BENCHMARK_REVERSE_PROMPT_DIRECTIONS_2026-07-30.md`：推荐 A「安静可信棚拍」作为 `source_asset` 的身份/说明系统；B「留白材质感」和 C「晚间整理时刻」均为无产品 contextual 备选。Slot 5 保持 `blocked`，因为 Base 中仍没有可核验使用资料。
- 当前状态：淘宝图搜外部视觉基准完成，**未触发任何图片生成、未扩整包、未写回/发布**。下一步：先确定目标平台画幅，做 A 的 source-asset 确定性版式；若选择 B/C，取得单张无产品 contextual 样片的方向与付费调用授权后再执行。

## MZ6032 Amazon US Dynamic Benchmark Listing Run v2

- 2026-08-05：按新版动态竞品 Skill 建立正式 run `run-20260805T070049Z-f63abd5e` / task `TASK-20260805-MZ6032-AMZ-US-LISTING-V2`，平台 Amazon.com / US，页面语言 English，目标用户假设为美国中文用户。
- 以 Amazon 公开搜索 `vaginal moisturizer` 和 close product-form benchmark Replens ASIN `B000P9WSMY` 做当期结构参考；可见 4.4/5、6,688 ratings，页面类目路径观察为 Health, Household and Personal Care → Sex and Sensuality → Care & Aid Products。当前环境 Amazon.com 自动跳转 Amazon.sg，已作为来源限制记录；评分和类目是当次公开观察，不推导销量、转化或 MZ6032 事实。
- 已按竞品信息架构重写 MZ6032 Amazon Listing v2：标题按 brand → product type → positioning → quantity/package；图片方案改为一张真正 MAIN 身份图 + 回答不同买家问题的次图，不再默认九张重复 hero。文案和动态图片方案保存在 `assets/FUYANJIE-MZ6032/amazon/listing-pack-v1-20260805/copy-v2.md`、`image-strategy-v2.md`、`research/benchmark-and-category.md`。
- 使用真实 MZ6032 Base 参考图 `87,570 bytes / 800×800 JPEG / SHA-256 1871...1396b` 通过 Router / openai / gpt-image-2 生成 Amazon MAIN 样片；Router `referenceEvidence` 与源图完全一致，证明本次真实参考图传输通过。
- MAIN 样片输出 `assets/FUYANJIE-MZ6032/amazon/run-20260805T070049Z-f63abd5e/slot-01-main-sample/slot-01-main-sample.png`，技术为 1254×1254 PNG、SHA-256 `c93c22f0...1c241`；人工视觉审核失败：`PID-01`、`QTY-01`、`COMP-02`、`PKG-01`、`MAIN-01`。原因不是白底或美观，而是外盒、长导管软管和独立袋的卖售关系/数量关系不清；不能扩展九图或发布。
- 当前状态：`generated -> reviewed -> blocked_for_revision`。下一步先用库存/包装事实确认 MZ6032 的实际组件配置，重做 MAIN 样片；通过后再按竞品信息架构生成必要的英文次图，并把同一 benchmark brief 同步到标题、Bullets、Description 和图片图位。


- 2026-08-05：按用户反馈继续重做 Amazon MAIN 样片，第二版 Prompt 明确锁定单支产品几何、导管/管体比例、末端形状、连接点和组件关系，不要求把 10 支全部摆出。新图 `run-20260805T070049Z-f63abd5e/slot-01-main-regeneration-02/slot-01-main-regeneration-02.png` 的参考图证据再次匹配；视觉复核为 `WARN`：白底和大体身份通过，但导管比例、包装小字和单支/10支表达仍需人工对照，不扩整包。


- 2026-08-05：MAIN 样片确认先按候选保留后，继续生成 Amazon US 次图 Slot 2-9；8 张均为 1254×1254 PNG、真实参考图传输证据链已保留。接触表 `assets/FUYANJIE-MZ6032/amazon/run-20260805T070049Z-f63abd5e/slots-02-09-contact-sheet.jpg`。视觉初筛：Slot 2/3/5 强候选，Slot 9 可小修；Slot 4/6 重复，Slot 7 包装内容表达需修，Slot 8 的 “A Familiar Chinese Personal-Care Brand” 依据不足且与 Slot 5 重复。当前仍为 `generated_unreviewed`，先确认单支实际形态（独立袋、导管管体或两者）后再定稿。

## 2026-08-07 MZ6032 Slot 1 样片审批门

- 以真实 SKU 参考图 `source-base-20260730/MZ6032-base-source.jpg` 通过 `openai / gpt-image-2` 生成 Amazon Slot 1 样片，run 为 `run-20260807T000000Z-slot01-sample`。
- 参考图证据与源文件一致；样片为 1254×1254 PNG，白底、SKU 身份、`5g×10支` 数量关系和无新增促销/医疗叠字通过。
- 审核结果为 `warn`：细小包装文字被模型重绘，不能作为官方包装逐字核验依据；不得直接发布或把文字当作事实证据。当前状态为 `awaiting_human_sample_approval`，等待人工决定是否接受该视觉方向；未扩展整包、未写回 Base、未发布。

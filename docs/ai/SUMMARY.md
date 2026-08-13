# 电商共享 Skill 当前摘要

2026-08-13：电商视频 Skill 已升级为故事导向的 director-brief / production-master 双模式。导演 Brief 只锁单一 SKU 参考图身份、`Hook -> 具体剧情 -> 产品时刻 -> CTA`、市场语境、必需产品动作和已确认促销事实；Seedance/视频模型自行决定镜头、运镜、表演、节奏、转场与促销呈现。完整故事样片仍需脚本确认、付费调用授权、产品/Claim/CTA/平台审核，不能自动视为最终成片。兼容包 `ecom-product-video` 更新至 v2.2.0，执行主 Skill 为本机 `~/.codex/skills/ecom-product-video`；本轮未触发新的付费生成。

2026-08-07：九图流程新增“一图一卖点”合同：次图按一个已批准卖点或买家疑问拆分，使用短标题 + 核心视觉 + 证据锚点；私密护理允许非解剖隐喻表达已批准的滋润、柔和、平衡、保护、清新、安心或舒适，但隐喻不构成功效证据，也不能放大 Claim。Amazon MAIN 保持真实 SKU 身份图规则，文字和隐喻主要用于次图。规则已同步到 Codex、共享包和全局视觉基准 Skill；飞书 SOP 与知识库已写回。完整 npm test 和架构回归通过，未触发图片生成或付费调用。

决策支持补充：可以借鉴真实评论里的“买家疑问”结构，但不能虚构用户评论、星级、用户名、日期、引号式好评、代言或个人效果；无真实评论时用明确标记的 `Common question`、`Before you buy` 或 `What shoppers want to know`，只回答已核验事实。

2026-08-01：知识库审核口径已实装到生产主入口 `ecom-nine-images` v1.1.0，并通过安装器升级当前 ecom Profile。九个正式槽位默认 `gpt-image-2` 携真实 SKU 参考图的一次整图生成/编辑，取消 `source_asset`、确定性拼版/叠字、无产品 contextual 和逐字 `text-safe` 作为默认门控；Prompt 仅锁使用场景、图片任务、SKU 事实与必要禁区，创意变量默认交给模型。Review Rubric 使用 `buyer_fact_error` 阻断购买事实错误，非事实微小文字/排版可人工接受为 `warn`。完整 `npm test`（build、13 Skill 校验/合同、九图正反例、Router 参考完整性、OAuth、安装隔离与冲突保护）通过；安装器只升级九图 Skill，源与安装 tree hash 一致 `2e65b314...d116`。

截至 2026-07-27，电商项目目录共发现 22 份 `SKILL.md` 物理文件。去除旧仓库重复副本、根目录旧版和归档版本后，当前生产主线为共享包 13 个条目（其中 1 个迁移兼容条目不默认安装）以及 `malaysia-ecommerce-ops` 1 个项目 Skill。

本轮已完成全部物理文件静态验证、两个共享包完整测试、13 个包内 Skill 的逐项最低合同测试、九图状态机正反例、安装沙箱、视频维护脚本和 33 张 Base CSV 模板导出校验。所有已执行检查通过。

当前不能称为“全部生产 E2E 通过”：真实飞书读取/写回、Router 付费调用、真实 SKU 图片/视频生成和人工审批尚未执行。2026-07-28，`test-ecom` Hermes profile 已完成 `nine-images` bundle 接入，仓库 `npm test`、电商租户 Router OAuth、4 个 MCP 工具发现和连接测试通过。下一阶段应选一个资料完整的真实 SKU，再单独授权九图样片、整包和写回 E2E。

同日 JD8001 的首张真实样片暴露远端 Router 缺陷：Grsai `gpt-image-2` 的 `/images/generations` 路径静默丢弃 SKU 参考图并忽略比例映射，生成的 1:1 图发生身份漂移。Router 已完成本地修复和远端部署：参考图走 `/v1/api/generate` 的 `images` 字段，`ratio` 优先映射为 `aspectRatio`，响应读取 `results`，MCP 支持多参考图。请求级 mock 测试在本地和远端通过，部署文件哈希一致，服务健康检查为 HTTP 200；尚未执行真实 Grsai 付费请求或重新生成 JD8001。

2026-07-28 JD8001 重试审计发现调用层仍未传入真实参考图：完整清洗锚图应为 73,706 bytes、800×800、data URL 98,299 字符，但实际 MCP tool call 使用了 161 bytes、1×3 像素、239 字符的占位 JPEG。此前“真实参考图链路已打通”和把 `SOLRION` 判为错误品牌的结论均已撤销；生成图已隔离。下一步必须在调用程序与 Router 请求侧校验 `images[0]` 的字节数、尺寸和 SHA-256 与真实锚图一致，再执行新的单张 Slot 1 调用。

2026-07-29，参考图完整性修复已部署到生产 Router：图片生成参考必须携带 SHA-256，Router 在付费调用前严格解码/下载并校验哈希、字节数、实际 JPEG/PNG 可读性、像素尺寸和 MIME，拒绝 1×3 占位图、非法 Base64、不可信 URL、重定向越权和内网地址，并返回 `referenceEvidence`。URL 下载后以同一批已验证字节重建 Data URL 发送 Grsai，证据与供应商输入保持一致。生产当前保持 URL 白名单为空（默认拒绝），完整 Data URL 只能由确定性程序从文件构造。完整本地测试、远端 build/mock、源码与 dist 哈希、systemd 状态和内外网健康检查均通过；尚未执行新的 Grsai 付费生成。下一步仅验证 JD8001 真实锚图 `73,706 bytes / 800×800 / 75d9...02fd` 的 `referenceEvidence`，一致后再单独授权 Slot 1。

同日使用妇炎洁抑菌凝胶 `MZ6033 / 3g×3支` 完成首个真实参考图生产 E2E：确定性脚本从 Base 附件直接构造参数，Router 返回的 `referenceEvidence` 与源文件 `174,909 bytes / 800×800 JPEG / a216...bebc` 完全一致，确认参考图传输链路已真实打通。生成的 Amazon 1:1 样片因包装规格漂移为 `3gx3支`、版式无法证明忠实复现且背景非严格纯白而判定失败，已隔离到 `assets/FUYANJIE-MZ6033/amazon/sample-20260729/rejected/`，未交付、未发布、未自动重试。下一版需要更干净的真实包装照片，并继续保持逐字身份审核。

随后按 `ecom-image-director` 的方向门为妇炎洁益生元玻尿酸滋润凝胶 `MZ6032 / 5g×10支` 执行 Amazon 1:1 方向 A“柔粉日常润护”。真实参考图证据 `87,570 bytes / 800×800 / 1871...396b` 完全匹配，生成图已呈现三件产品和柔粉 self-care 电商场景，不再是白底 SKU 图；但模型新增 `形成保护膜`、`滋润水润`、`日常清洁` 等未批准包装文字并产生侧面乱码，故仍以 `identity_drift` / `fake_claim_risk` 拒绝隔离，未扩图。审核口径已明确：Amazon 1:1 电商首图不自动等于标准白底 MAIN 图。

用户人工接受方向 A 观感后继续 Slot 2-3：Slot 2 为暖色梳妆台日常场景，但与 Slot 1 都采用三件前中后陈列，差异偏弱；Slot 3 改为俯拍近景，以独立袋和导管为主、外盒辅助，并使用透明水膜和粉色留白，已与前两张明显区分，保留为 `warn` 候选。与此同时，Router OAuth 已补齐标准 refresh-token 生命周期并部署：30天持久化 token、客户端绑定和使用即轮换；强制令 access token 过期后，Hermes 无浏览器自动刷新、轮换双 token 并重新发现4个工具，确认以后不需要每小时重新授权。

随后用户确认继续完成剩余图组，Slot 4-9 已全部生成：规格组成、居家准备、包装细节、组合陈列、收纳出行、购买规格六个任务分别落盘，六张参考图证据和 MZ6032 源图完全一致，文件均为 1254×1254 PNG。Slot 4/7/9 的产品组合展示与 Slot 5/8 的生活方式场景各有一定相似度，但功能任务已区分；当前全部标记 `generated_unreviewed`，等待人工确认，未发布、未写回 Base。

验收详情：`docs/ai/TASKS.md`

2026-07-30：正式 `ecom-nine-images` v1.0.0 已安装到当前 ecom Hermes profile，isolated `nine-images` bundle 的 5 个 Skill tree hash 与源包一致，仓库 `npm test`（build、共享 Skill 合同、九图门控、Router 参考图完整性/OAuth、安装隔离）实跑全通过。MZ6032 飞书商品主数据与 87,570-byte/800×800/JPEG/`1871822d...1396b` 真实附件已重验，历史 Slot 2-9 的 `referenceEvidence` 也全部匹配，故生产参考图传输链路通过。

但 MZ6032 整包不通过正式生产 E2E：Slot 1 样片已因包装重写和未批准 Claim（`identity_drift`/`fake_claim_risk`）拒绝隔离，未有样片审批；Slot 4 使用了未核验尺寸信息，Slot 5/8 缺少能证明 `5g×10支` 盒装的外盒；统一任务未发现对应 task，历史 run 的 task/run/审批/写回合同不完整。整套维持候选、未交付、未写回、未发布。详见 `docs/ai/MZ6032_PRODUCTION_E2E_ACCEPTANCE_2026-07-30.md`。下一步是先创建正式任务并用清晰真实包装图重做/逐字核验 Slot 1，获命名审批后才重新生成 1-9 整包并交由 Admin 审批。

更正：MZ6032 的 SKU 图并不缺失。2026-07-30 已从飞书 Base 商品主数据直接重新下载并核验原始附件：`87,570 bytes / 800×800 JPEG / SHA-256 1871822d...1396b`，是完整且成熟的产品商业 KV（外盒、单支袋、带导管软管、品牌与盒装信息）。此前把“需要清晰包装图”写成下一步不准确。

根因是正式九图 Skill 的执行合同有缺口：它把参考图传输成功误当作模型可以可靠重绘包装，导致生成包装文字、伪尺寸信息和模板化产品场景。已升级当前 profile 的 `ecom-nine-images`：商业 KV 归类为有效生产资产；对含可读包装文字的 Slot 1/4/6/7 默认直接使用 Base 源资产/确定性裁剪，不再交给模型重绘；只允许经放大逐字比对通过的 `text-safe` 样片使用产品场景编辑；Slot 2/3/5/8/9 默认无产品 contextual 图；且商业视觉质量 `warn` 不能再自动扩图。`test-image-skill`、`test-skill-contracts`、`validate-skills`、`build` 均实跑通过，源与已安装 Skill tree hash 一致。详见 `TASKS.md` 的“Base 资产复核与九图 Skill 修订”。

2026-07-30：按用户确定的“只看淘宝、直接用 SKU 图搜”路径，已将 MZ6032 的真实 Base 商业 KV（`87,570 bytes / 800×800 JPEG / SHA-256 1871822d...1396b`）上传淘宝「搜同款」，真实取得 6 个外部结果卡、列表截图、主图缓存和来源 URL 映射；证据位于 `assets/FUYANJIE-MZ6032/benchmark-20260730/taobao-external/`。当次可见付款文本仅作为单源页面观察保留，不能推导 MZ6032 销量、转化或全站排名。已据此重写淘宝视觉基准和反推方向：推荐 A「安静可信棚拍」用于不重绘包装的 `source_asset` 身份/说明图；B/C 均为无产品 contextual 备选。严格拒绝淘宝样本的品牌、包装、Claim、价格、销量/榜单、促销、人物与具体版式；Slot 5 仍因无可核验使用资料而 `blocked`。本阶段未触发图片生成、整包扩图、写回或发布。详情：`docs/ai/MZ6032_VISUAL_BENCHMARK_2026-07-30.md`、`docs/ai/MZ6032_BENCHMARK_REVERSE_PROMPT_DIRECTIONS_2026-07-30.md`。

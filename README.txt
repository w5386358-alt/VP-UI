VP UI 新版ui / 白紙UI重做

目前穩定基底
- 目前正式穩定基底：第二十六版
- 檔名：VP_UI_手機UI第二十六版_掃碼定位與手機上傳修正版.zip
- 後續續接原則：一律從第二十六版往下做，不回頭混用已判定失敗的版本。

本包用途
- 作為「新板UI最後串聯版」第一階段基底整理包
- 第一階段目標：穩定目前新版 UI 基底，不新增 PWA 外殼，不先擴充 Firebase 新模組，不回頭救舊版 GAS UI。

目前工作順序
1. 新版 UI 穩定版
2. Firebase 主線
3. GAS 同步中心（改用新試算表）
4. PWA 外殼
5. 手機實測
6. 新模組資料庫
7. LINE 通知

Firebase 既有主集合
- customers
- inventory
- inventory_logs
- order_items
- orders
- payments
- products
- refunds
- sales_report
- shipping
- staff
- sync_meta

重要策略
- GAS 舊版不再當主前台 UI
- 新版 UI + Firebase 為主線
- GAS + 新試算表作為同步中心 / 修復工具 / 報表工具
- LINE 後續只做通知與導流，不當主操作容器

環境變數
- 請依 .env.example 設定 VITE_FIREBASE_* 變數

部署
1. 上傳到 GitHub
2. Vercel 匯入專案
3. Framework Preset 選 Vite
4. 補齊 Firebase 環境變數
5. 部署後以手機與桌機實測


第二階段已落地內容
- 新增 src/firebase/collections.ts：統一主線集合名稱
- 新增 src/firebase/env.ts：統一 Firebase 環境變數讀取
- 新增 src/firebase/mainline.ts：主線集合、主鍵規則、同步優先順序
- 本階段先整理主線規則，不主動改動既有 UI 與操作流程

第二階段目標
- 先固定 Firebase 主線資料規則
- 後續方便接「新試算表同步中心」
- 暫不新增評鑑 / 出納 / 請款等新集合，避免與主線混線

VP UI 部署步驟

1. 把此資料夾上傳到 GitHub repo
2. 到 Vercel -> Add New -> Project -> Import Git Repository
3. Framework 選 Vite
4. 在 Project Settings -> Environment Variables 貼上 6 個 VITE_FIREBASE_* 變數
5. Redeploy
6. 成功後左側資料來源會由 Mock 變成 Firebase

Firestore collections 預設讀取：
- products
- customers
- staff


2026-03-31 v5 修正：左側加入『會計中心』主選單與快捷入口，後續版本以此版為基底。


V6 更新：
- 新增個人資料主選單
- 新增個人資料 / 我的歷史訂單 / 累積業績骨架
- 預留掃碼與刷新整理按鈕位置


v9：倉儲中心細化版
- 出貨區：待出貨列表、掃碼出貨、出貨資訊面板、最近異動紀錄
- 庫存區：入庫/查詢/異動流程卡、庫存摘要卡、QR 顯示位
- 查詢區：條碼/QR/訂單查詢面板、掃碼帶入、查詢結果展示位


2026-03-31 v9.1 修正：
- 補齊倉儲中心缺少的版面 CSS
- 修正出貨區 / 庫存區 / 查詢區卡片對齊
- 修正右側資訊卡與最近異動紀錄的間距
- 修正 sidebar 底部區塊擠壓感


本次修正：倉儲中心最終對齊版（高度 / 間距 / 右側紀錄捲動 / Sidebar底部留白）
主要改動檔案：
- src/styles.css


2026-03-31 v9.3 修正：
- 倉儲中心「出貨資訊面板」改為格子化資訊卡
- 補上 label / value 視覺分層
- 不動功能邏輯，只修 UI 閱讀性

2026-04-01 第三區修正：訂購功能啟動版
- 商品加入購物車按鈕啟動
- 購物車數量增減 / 移除啟動
- 客戶快捷帶入啟動
- 配送方式切換啟動
- 搜尋輸入按鈕啟動
- 送出訂單按鈕啟動並加入極簡提示

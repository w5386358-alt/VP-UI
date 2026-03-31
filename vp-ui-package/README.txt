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

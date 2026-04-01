VP UI 部署步驟

1. 把此資料夾整包上傳到 GitHub repo 根目錄
2. 到 Vercel -> Add New -> Project -> Import Git Repository
3. Framework 選 Vite
4. Root Directory 設為 vp-ui-package
5. 在 Project Settings -> Environment Variables 貼上 6 個 VITE_FIREBASE_* 變數
6. Redeploy

本包定位：
- 以你目前八大模組版為基底
- 倉儲切到 GAS SOP 第二包測試版
- 主測項：防超賣 + QR 邏輯 + inventory_logs 留痕
- 暫時不把它當穩定版，等你實測後再決定要不要進會計 ↔ 倉儲串接

本包已整理成 Vite 正確結構：
- index.html
- src/App.tsx
- src/main.tsx
- src/styles.css
- src/modules/*.tsx

這次重點：
- 修正成可直接部署的 src 結構
- 倉儲頁標題與提示改成 SOP 第二包
- 保留目前 Orders / Accounting / Inventory / Profile 八大模組架構
- 不用補丁，直接整包覆蓋

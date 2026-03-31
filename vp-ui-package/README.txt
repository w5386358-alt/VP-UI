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
deploy test

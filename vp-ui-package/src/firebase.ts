import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let db: any = null;

try {
  const firebaseConfig = {
    apiKey: "x", // 隨便填也可以先跑UI
    authDomain: "x",
    projectId: "x",
    appId: "x"
  };

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);

} catch (e) {
  console.log("Firebase 初始化失敗，但UI繼續跑");
}

export { db };

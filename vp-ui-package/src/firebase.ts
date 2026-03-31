import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let db:any=null;
try{
 const config={
  apiKey:"x",
  authDomain:"x",
  projectId:"x",
  appId:"x"
 };
 const app=initializeApp(config);
 db=getFirestore(app);
}catch(e){console.log("firebase fail")}
export {db};

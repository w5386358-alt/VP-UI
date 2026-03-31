import { getDB } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

useEffect(() => {
  async function init() {
    try {
      const db = getDB();
      const snap = await getDocs(collection(db, "products"));

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (list.length) {
        setProducts(list as any);
        setDataMode("firebase");
        setFirebaseReady(true);
      }
    } catch (e) {
      console.error("Firebase error", e);
    } finally {
      setBooting(false);
    }
  }

  init();
}, []);

import { useState } from "react";

export default function App(){
  const [page,setPage]=useState("accounting")
  const [tab,setTab]=useState("pay")

  const [orders,setOrders]=useState([
    {id:"VP001",status:"未收款",amount:3000}
  ])

  const handlePay=(id:string)=>{
    setOrders(o=>o.map(x=>x.id===id?{...x,status:"已收款"}:x))
  }

  const handleRefund=(id:string)=>{
    setOrders(o=>o.map(x=>x.id===id?{...x,status:"已退款"}:x))
  }

  return (
    <div className="app-shell">

      <div className="sidebar">
        <button onClick={()=>setPage("dashboard")}>總覽</button>
        <button onClick={()=>setPage("accounting")}>會計</button>
      </div>

      <div className="main-content">

        {page==="dashboard" && <h1>總覽</h1>}

        {page==="accounting" && (
          <>
            <h1>會計中心</h1>

            <div className="accounting-tab-row">
              <button onClick={()=>setTab("pay")}>收款</button>
              <button onClick={()=>setTab("stat")}>統計</button>
              <button onClick={()=>setTab("rank")}>排行</button>
            </div>

            {tab==="pay" && (
              <div>
                {orders.map(o=>(
                  <div key={o.id}>
                    {o.id} / {o.status} / {o.amount}
                    <button onClick={()=>handlePay(o.id)}>收款</button>
                    <button onClick={()=>handleRefund(o.id)}>退款</button>
                  </div>
                ))}
              </div>
            )}

            {tab==="stat" && <div>統計（待接Firebase）</div>}
            {tab==="rank" && <div>排行（待接Firebase）</div>}
          </>
        )}

      </div>
    </div>
  )
}

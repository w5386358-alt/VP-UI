
// 只修改會計邏輯（模擬接資料版）
import { useState } from 'react'

export default function App(){
  const [tab,setTab]=useState('pay')
  const [orders,setOrders]=useState([
    {id:'VP001',status:'未收款',amount:4259}
  ])

  const handlePay = (id:string)=>{
    setOrders(prev=>prev.map(o=>o.id===id?{...o,status:'已收款'}:o))
  }

  const handleRefund = (id:string)=>{
    setOrders(prev=>prev.map(o=>o.id===id?{...o,status:'已退款'}:o))
  }

  return (
    <div style={{padding:20}}>
      <h1>會計中心（資料版）</h1>

      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>setTab('pay')}>收款</button>
        <button onClick={()=>setTab('stat')}>統計</button>
        <button onClick={()=>setTab('rank')}>排行</button>
      </div>

      {tab==='pay' && (
        <div>
          {orders.map(o=>(
            <div key={o.id} style={{marginTop:10}}>
              {o.id} / {o.status} / ${o.amount}
              <button onClick={()=>handlePay(o.id)}>收款</button>
              <button onClick={()=>handleRefund(o.id)}>退款</button>
            </div>
          ))}
        </div>
      )}

      {tab==='stat' && <div>統計（待接 Firebase）</div>}
      {tab==='rank' && <div>排行（待接 Firebase）</div>}
    </div>
  )
}

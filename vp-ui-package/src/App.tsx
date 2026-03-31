import { useState } from 'react'

export default function App(){
  const [page,setPage]=useState('accounting')
  const [tab,setTab]=useState('pay')
  const [orders,setOrders]=useState([
    {id:'VP20260331-001',status:'未收款',amount:4259}
  ])

  const pay=(id:string)=>{
    setOrders(o=>o.map(x=>x.id===id?{...x,status:'已收款'}:x))
  }

  const refund=(id:string)=>{
    setOrders(o=>o.map(x=>x.id===id?{...x,status:'已退款'}:x))
  }

  return (
    <div style={{display:'flex'}}>

      <div style={{width:200}}>
        <button onClick={()=>setPage('dashboard')}>總覽</button>
        <button onClick={()=>setPage('accounting')}>會計中心</button>
      </div>

      <div style={{padding:20,flex:1}}>
        {page==='dashboard' && <div>總覽（摘要卡只在這裡）</div>}

        {page==='accounting' && (
          <>
            <h1>會計中心</h1>

            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setTab('pay')}>收款/退款</button>
              <button onClick={()=>setTab('stat')}>統計</button>
              <button onClick={()=>setTab('rank')}>排行</button>
            </div>

            {tab==='pay' && (
              <div>
                {orders.map(o=>(
                  <div key={o.id}>
                    {o.id} / {o.status} / ${o.amount}
                    <button onClick={()=>pay(o.id)}>收款</button>
                    <button onClick={()=>refund(o.id)}>退款</button>
                  </div>
                ))}
              </div>
            )}

            {tab==='stat' && <div>統計（下一步接Firebase）</div>}
            {tab==='rank' && <div>排行（下一步接Firebase）</div>}
          </>
        )}
      </div>
    </div>
  )
}

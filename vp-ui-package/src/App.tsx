import { useState } from 'react'

export default function App(){
  const [tab,setTab]=useState('pay')

  return (
    <div style={{padding:20}}>
      <h1>會計中心</h1>

      <div style={{display:'flex',gap:10,marginBottom:20}}>
        <button onClick={()=>setTab('pay')}>收款/退款</button>
        <button onClick={()=>setTab('stat')}>銷售統計</button>
        <button onClick={()=>setTab('rank')}>排行榜</button>
      </div>

      {tab==='pay' && <div>收款 / 退款 UI（正式版）</div>}
      {tab==='stat' && <div>銷售統計 UI（正式版）</div>}
      {tab==='rank' && <div>排行榜 UI（正式版）</div>}
    </div>
  )
}

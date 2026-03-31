import React,{useState} from 'react';

export default function App(){

const [page,setPage]=useState('order');

return(
<div>

<div className="sidebar">
<div className="card">VP系統</div>
<button onClick={()=>setPage('order')}>訂購</button>
<button onClick={()=>setPage('warehouse')}>倉儲</button>
<button onClick={()=>setPage('account')}>會計</button>
</div>

<div className="main">

{page==='order' && <div>
<h2>訂購系統</h2>
<div className="grid">
<div className="product">商品1</div>
<div className="product">商品2</div>
<div className="product">商品3</div>
</div>

<div className="card">
<h3>客戶資料</h3>
<input placeholder="姓名"/>
<input placeholder="電話"/>
</div>

<div className="mobile-cart">
購物車
<button>送出</button>
</div>
</div>}

{page==='warehouse' && <div>
<h2>倉儲系統</h2>
<div className="card">掃碼 / 出貨 / 庫存</div>
</div>}

{page==='account' && <div>
<h2>會計系統</h2>
<div className="card">收款 / 退款 / 報表</div>
</div>}

</div>

</div>
);
}

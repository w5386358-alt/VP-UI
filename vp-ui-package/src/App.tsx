import React,{useState} from "react";

export default function App(){

const [cart,setCart]=useState([]);
const [name,setName]=useState("");
const [phone,setPhone]=useState("");
const [address,setAddress]=useState("");

function addProduct(){
  setCart([...cart,{name:"商品",price:100,qty:1}]);
}

function createOrder(){
  if(!name) return alert("請填姓名");
  if(!phone) return alert("請填電話");
  if(cart.length===0) return alert("請加商品");

  console.log("ORDER:",{
    customer:name,
    phone,
    address,
    items:cart
  });

  alert("訂單建立成功（流程已通）");
}

return(
<div style={{padding:20}}>
<h2>訂購系統（可用版）</h2>

<button onClick={addProduct}>加入商品</button>

<div>
<h3>購物車</h3>
{cart.map((i,idx)=><div key={idx}>{i.name}</div>)}
</div>

<div>
<h3>客戶資料</h3>
<input placeholder="姓名" value={name} onChange={e=>setName(e.target.value)}/>
<input placeholder="電話" value={phone} onChange={e=>setPhone(e.target.value)}/>
<input placeholder="地址" value={address} onChange={e=>setAddress(e.target.value)}/>
</div>

<button onClick={createOrder}>建立訂單</button>

</div>
);
}

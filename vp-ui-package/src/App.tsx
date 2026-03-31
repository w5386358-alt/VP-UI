import React,{useState} from 'react';
import {addDoc,collection,serverTimestamp} from "firebase/firestore";
import {db} from "./firebase.ts";

export default function App(){

const [cart,setCart]=useState([]);
const [name,setName]=useState("");
const [phone,setPhone]=useState("");
const [address,setAddress]=useState("");
const [shipping,setShipping]=useState("自取");

function addItem(){
  setCart([...cart,{name:"測試商品",price:100,qty:1}]);
}

async function createOrder(){
  if(!name) return alert("請填姓名");
  if(!phone) return alert("請填電話");
  if(cart.length===0) return alert("請加商品");

  const now=new Date();
  const orderNo=`VP${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Date.now().toString().slice(-4)}`;

  const orderRef=await addDoc(collection(db,"orders"),{
    orderNo,
    customerName:name,
    customerPhone:phone,
    address,
    shipping,
    paymentStatus:"未收款",
    orderStatus:"待處理",
    createdAt:now.toISOString(),
    createdAtServer:serverTimestamp()
  });

  for(const item of cart){
    await addDoc(collection(db,"order_items"),{
      orderId:orderRef.id,
      orderNo,
      ...item,
      createdAtServer:serverTimestamp()
    });
  }

  await addDoc(collection(db,"sales_report"),{
    orderNo,
    total:cart.reduce((a,b)=>a+b.price*b.qty,0),
    createdAtServer:serverTimestamp()
  });

  alert("訂單完成");
}

return (
  <div style={{padding:20}}>
    <h2>VP訂購系統</h2>

    <button onClick={addItem}>加入商品</button>

    <div>
      <h3>購物車</h3>
      {cart.map((i,idx)=><div key={idx}>{i.name}</div>)}
    </div>

    <div>
      <h3>客戶資料</h3>
      <input
        placeholder="姓名"
        value={name}
        onChange={e=>setName(e.target.value)}
      />
      <input
        placeholder="電話"
        value={phone}
        onChange={e=>setPhone(e.target.value)}
      />
      <select value={shipping} onChange={e=>setShipping(e.target.value)}>
        <option>自取</option>
        <option>宅配</option>
      </select>

      {shipping==="宅配" && (
        <input
          placeholder="地址"
          value={address}
          onChange={e=>setAddress(e.target.value)}
        />
      )}
    </div>

    <button onClick={createOrder}>建立訂單</button>
  </div>
);

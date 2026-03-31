let products = [];
let cart = [];

// 載入商品
async function loadProducts(){
  const res = await fetch(API_URL + "?action=getProducts");
  products = await res.json();

  renderProducts();
}

// 渲染商品
function renderProducts(){
  const el = document.getElementById("productList");
  el.innerHTML = "";

  products.forEach(p=>{
    el.innerHTML += `
      <div class="product">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
        <button onclick="addToCart('${p.id}')">加入</button>
      </div>
    `;
  });
}

// 加入購物車
function addToCart(id){
  const item = products.find(p=>p.id==id);
  cart.push(item);
  renderCart();
}

// 購物車
function renderCart(){
  const el = document.getElementById("cartItems");
  el.innerHTML = "";

  cart.forEach(i=>{
    el.innerHTML += `<div>${i.name}</div>`;
  });
}

// 送出訂單
async function submitOrder(){
  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    shipping: document.getElementById("shipping").value,
    items: cart
  };

  await fetch(API_URL,{
    method:"POST",
    body: JSON.stringify(data)
  });

  alert("訂單送出成功");
}

loadProducts();

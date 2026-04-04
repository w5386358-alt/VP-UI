import { useState } from 'react';
import CartDrawer from '../components/CartDrawer';

export default function OrdersModule() {
  const [cartOpen, setCartOpen] = useState(false);

  const cart = [
    { id: '1', name: '測試商品', qty: 1 }
  ];

  const updateQty = (id, qty) => console.log(id, qty);
  const removeFromCart = (id) => console.log('remove', id);

  const customerName = '';
  const setCustomerName = (v) => console.log(v);

  const itemCount = cart.length;

  return (
    <>
      <div style={{ padding: 20 }}>
        <h2>商品列表（測試畫面）</h2>
        <p>這裡放你的商品 UI</p>
      </div>

      <button
        className="cart-float"
        onClick={() => setCartOpen(true)}
      >
        🛒 {itemCount}
      </button>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        customerName={customerName}
        setCustomerName={setCustomerName}
      />
    </>
  );
}

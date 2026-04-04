import { X } from 'lucide-react';

export default function CartDrawer({
  open,
  onClose,
  cart,
  updateQty,
  removeFromCart,
  customerName,
  setCustomerName,
}) {
  if (!open) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>購物車</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">目前沒有商品</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="drawer-item">
                <div>{item.name}</div>

                <div className="drawer-qty">
                  <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>

                <button onClick={() => removeFromCart(item.id)}>刪除</button>
              </div>
            ))
          )}

          <input
            placeholder="客戶姓名"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
      </aside>
    </div>
  );
}

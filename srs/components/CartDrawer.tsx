import { User, Phone, MapPin, BadgePercent, Wallet, FileText, Store, Truck, Receipt, X } from 'lucide-react';

export default function CartDrawer(props: any) {
  const {
    open,
    onClose,
    cart,
    updateQty,
    removeFromCart,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    shippingMethod,
    setShippingMethod,
    getShippingFee,
    discountMode,
    setDiscountMode,
    discountValue,
    setDiscountValue,
    remark,
    setRemark,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    quickCustomerCards,
    applyQuickCustomer,
    createOrderRecord,
    itemCount,
  } = props;

  if (!open) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div>
            <div className="cart-drawer-title">購物車</div>
            <div className="cart-drawer-subtitle">{itemCount} 件商品，客資與配送整合在這裡</div>
          </div>
          <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="關閉購物車">
            <X size={18} />
          </button>
        </div>

        <div className="cart-drawer-body">
          <section className="drawer-section">
            <div className="drawer-section-title">商品明細</div>
            {cart.length === 0 ? (
              <div className="drawer-empty">目前沒有商品</div>
            ) : (
              <div className="drawer-list">
                {cart.map((item: any) => (
                  <div key={item.id} className="drawer-item-card">
                    <div className="drawer-item-top">
                      <div>
                        <div className="drawer-name">{item.name}</div>
                        <div className="drawer-meta">{item.code} / 單價 ${item.price}</div>
                      </div>
                      <button type="button" className="drawer-remove" onClick={() => removeFromCart(item.id)}>移除</button>
                    </div>
                    <div className="drawer-item-bottom">
                      <div className="drawer-qty">
                        <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <strong>${item.price * item.qty}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="drawer-section">
            <div className="drawer-section-head">
              <div className="drawer-section-title">客戶與配送資料</div>
              <span className="badge badge-neutral">UI 分離版</span>
            </div>

            <div className="quick-customer-grid drawer-quick-grid">
              {quickCustomerCards.map((item: any) => (
                <button
                  key={item.name}
                  type="button"
                  className="quick-customer-card"
                  onClick={() => applyQuickCustomer(item.name, item.phone, item.address, item.method)}
                >
                  <div className="quick-customer-name">{item.name}</div>
                  <div className="quick-customer-meta">{item.phone} / {item.method}</div>
                </button>
              ))}
            </div>

            <div className="form-grid two-col drawer-form-grid">
              <label className="field-card"><span className="field-label"><User className="small-icon" />客戶姓名</span><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="請輸入客戶姓名" /></label>
              <label className="field-card"><span className="field-label"><Phone className="small-icon" />客戶電話</span><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="請輸入電話" /></label>
              <label className="field-card field-span-2"><span className="field-label"><MapPin className="small-icon" />收件地址 / 店名</span><input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="宅配填地址，店到店填店名，自取可留空" /></label>
            </div>

            <div className="shipping-method-row drawer-shipping-row">
              {(['宅配', '店到店', '自取'] as const).map((method) => (
                <button key={method} type="button" className={`shipping-chip ${shippingMethod === method ? 'active' : ''}`} onClick={() => setShippingMethod(method)}>
                  {method === '自取' ? <Store className="small-icon" /> : <Truck className="small-icon" />}
                  <span>{method}</span>
                  <strong>${getShippingFee(method)}</strong>
                </button>
              ))}
            </div>

            <div className="form-grid two-col form-gap-top drawer-form-grid">
              <label className="field-card"><span className="field-label"><BadgePercent className="small-icon" />折扣模式</span><select value={discountMode} onChange={(e) => setDiscountMode(e.target.value)}><option value="無">無</option><option value="固定金額">固定金額</option></select></label>
              <label className="field-card"><span className="field-label"><Wallet className="small-icon" />折扣金額</span><input type="number" min={0} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value || 0))} placeholder="0" disabled={discountMode === '無'} /></label>
              <label className="field-card field-span-2"><span className="field-label"><FileText className="small-icon" />訂單備註</span><textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={4} placeholder="例：收款提醒、配送備註、時間要求" /></label>
            </div>
          </section>
        </div>

        <div className="cart-drawer-footer">
          <div className="summary-lines drawer-summary-lines">
            <div><span>商品小計</span><strong>${subtotal}</strong></div>
            <div><span>運費</span><strong>${shippingFee}</strong></div>
            <div><span>折扣</span><strong>-${discountAmount}</strong></div>
            <div className="grand"><span>訂單總額</span><strong>${grandTotal}</strong></div>
          </div>
          <button type="button" className="primary-button full-width order-submit-btn" onClick={createOrderRecord}>
            <Receipt className="small-icon" />建立訂單
          </button>
        </div>
      </aside>
    </div>
  );
}

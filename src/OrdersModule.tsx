import { User, Phone, MapPin, BadgePercent, Wallet, FileText, Store, Truck, Receipt, ImageIcon } from 'lucide-react';

export default function OrdersModule(props: any) {
  const {
    itemCount, shippingMethod, grandTotal,
    user, orderCategoryChips, orderCategory, setOrderCategory,
    filteredOrderProducts, addToCart,
    quickCustomerCards, applyQuickCustomer,
    customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress,
    setShippingMethod, getShippingFee,
    discountMode, setDiscountMode, discountValue, setDiscountValue,
    remark, setRemark,
    cart, removeFromCart, updateQty,
    subtotal, shippingFee, discountAmount,
    createOrderRecord, orderNotice,
    SectionIntro,
  } = props;

  return (
    <>
      <SectionIntro
        title="訂購模組"
        desc="訂購頁只保留商品、購物車與客戶配送資料，回到純下單介面。"
        stats={[`購物車 ${itemCount} 件`, `配送 ${shippingMethod}`, `總額 $${grandTotal}`]}
      />

      {orderNotice && (
        <div className={`card product-notice-banner ${orderNotice.tone} order-notice-banner`}>
          <strong>{orderNotice.text}</strong>
        </div>
      )}

      <section className="order-layout">
        <div className="order-main">
          <div className="card order-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">商品選購</div>
                <div className="panel-desc">訂購頁只保留商品瀏覽、加入購物車與下單流程。</div>
              </div>
              <span className="badge badge-soft">價格層級 / {user.rank === '核心人員' ? '總代理價格' : 'VIP價格'}</span>
            </div>

            <div className="order-toolbar-row">
              <div className="chip-filter-row">
                {orderCategoryChips.map((chip: string) => (
                  <button key={chip} type="button" className={`filter-chip ${orderCategory === chip ? 'active' : ''}`} onClick={() => setOrderCategory(chip)}>{chip}</button>
                ))}
              </div>
              <button type="button" className="ghost-button compact-btn">輸入</button>
            </div>

            <div className="catalog-grid">
              {filteredOrderProducts.map((item: any) => (
                <div key={item.id} className="catalog-card">
                  <div className="catalog-image-slot">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="catalog-image" />
                      : <div className="catalog-image-placeholder"><ImageIcon className="small-icon" /><span>商品圖片預留區</span></div>}
                  </div>
                  <div className="catalog-meta-row">
                    <span className="data-code">{item.code}</span>
                    <span className={`badge ${item.stock <= 10 ? 'badge-danger' : 'badge-success'}`}>{item.stock <= 10 ? `低庫存 ${item.stock}` : `庫存 ${item.stock}`}</span>
                  </div>
                  <div className="catalog-name">{item.name}</div>
                  <div className="catalog-desc">{item.category} / 依身分與階級可切換價格顯示</div>
                  <div className="catalog-footer">
                    <div>
                      <div className="mini-label">目前價格</div>
                      <div className="catalog-price">${item.price}</div>
                    </div>
                    <button type="button" className="mini-add-btn" onClick={() => addToCart(item)} disabled={!item.enabled || item.stock <= 0}>加入</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card order-panel order-form-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">客戶與配送資料</div>
                <div className="panel-desc">購物車固定在右側，客戶資料改放左邊，往下滑時不會被擋住。</div>
              </div>
              <span className="badge badge-neutral">訂單主檔欄位</span>
            </div>

            <div className="quick-customer-grid">
              {quickCustomerCards.map((item: any) => (
                <button key={item.name} type="button" className="quick-customer-card" onClick={() => applyQuickCustomer(item.name, item.phone, item.address, item.method)}>
                  <div className="quick-customer-name">{item.name}</div>
                  <div className="quick-customer-meta">{item.phone} / {item.method}</div>
                </button>
              ))}
            </div>

            <div className="form-grid two-col">
              <label className="field-card"><span className="field-label"><User className="small-icon" />客戶姓名</span><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="請輸入客戶姓名" /></label>
              <label className="field-card"><span className="field-label"><Phone className="small-icon" />客戶電話</span><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="請輸入電話" /></label>
              <label className="field-card field-span-2"><span className="field-label"><MapPin className="small-icon" />收件地址 / 店名</span><input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="宅配填地址，店到店填店名，自取可留空" /></label>
            </div>

            <div className="shipping-method-row">
              {(['宅配', '店到店', '自取'] as const).map((method) => (
                <button key={method} type="button" className={`shipping-chip ${shippingMethod === method ? 'active' : ''}`} onClick={() => setShippingMethod(method)}>
                  {method === '自取' ? <Store className="small-icon" /> : <Truck className="small-icon" />}<span>{method}</span><strong>${getShippingFee(method)}</strong>
                </button>
              ))}
            </div>

            <div className="form-grid two-col form-gap-top">
              <label className="field-card"><span className="field-label"><BadgePercent className="small-icon" />折扣模式</span><select value={discountMode} onChange={(e) => setDiscountMode(e.target.value)}><option value="無">無</option><option value="固定金額">固定金額</option></select></label>
              <label className="field-card"><span className="field-label"><Wallet className="small-icon" />折扣金額</span><input type="number" min={0} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value || 0))} placeholder="0" disabled={discountMode === '無'} /></label>
              <label className="field-card field-span-2"><span className="field-label"><FileText className="small-icon" />訂單備註</span><textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={4} placeholder="例：收款提醒、配送備註、時間要求" /></label>
            </div>

            <button type="button" className="primary-button full-width order-submit-btn" onClick={createOrderRecord}><Receipt className="small-icon" />建立訂單</button>
          </div>
        </div>

        <div className="order-side">
          <div className="card order-panel sticky-panel order-cart-panel">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">購物車</div>
                <div className="panel-desc">確認商品後，往下填寫客戶與配送資料即可建立訂單。</div>
              </div>
              <span className="badge badge-role">{itemCount} 件</span>
            </div>

            <div className="cart-list">
              {cart.map((item: any) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-top">
                    <div>
                      <div className="cart-name">{item.name}</div>
                      <div className="cart-meta">{item.code} / 單價 ${item.price}</div>
                    </div>
                    <button type="button" className="text-button" onClick={() => removeFromCart(item.id)}>移除</button>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-box">
                      <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <strong>${item.price * item.qty}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-lines">
              <div><span>商品小計</span><strong>${subtotal}</strong></div>
              <div><span>運費</span><strong>${shippingFee}</strong></div>
              <div><span>折扣</span><strong>-${discountAmount}</strong></div>
              <div className="grand"><span>訂單總額</span><strong>${grandTotal}</strong></div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

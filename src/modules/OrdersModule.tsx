import { useRef, useState } from 'react';
import { User, Phone, MapPin, BadgePercent, Wallet, FileText, Store, Truck, Receipt, CreditCard, ClipboardList, ShoppingCart, X } from 'lucide-react';

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
    orderRecords, selectedOrderRecord, selectedOrderNo, selectOrderRecord,
    createOrderRecord, markOrderPaid, markOrderShippingReady, orderNotice,
    SectionIntro,
  } = props;

  const [cartOpen, setCartOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);

  function runAddToCartFx(sourceEl: HTMLElement, item: any) {
    const cartButton = cartButtonRef.current;
    if (!cartButton) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = cartButton.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'cart-flyer';
    flyer.textContent = item.name;
    flyer.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
    flyer.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      flyer.style.transform = `translate(${targetRect.left - sourceRect.left}px, ${targetRect.top - sourceRect.top}px) scale(0.22)`;
      flyer.style.opacity = '0';
    });

    window.setTimeout(() => {
      flyer.remove();
      if (cartButtonRef.current) {
        cartButtonRef.current.classList.remove('cart-bump');
        void cartButtonRef.current.offsetWidth;
        cartButtonRef.current.classList.add('cart-bump');
      }
    }, 620);
  }

  function handleAddToCart(item: any, event: React.MouseEvent<HTMLButtonElement>) {
    addToCart(item);
    runAddToCartFx(event.currentTarget, item);
  }

  return (
    <>
      <SectionIntro
        title="訂單模組"
        desc="把購物車改成 Drawer，客戶資料、配送、折扣、備註都收進購物車視窗，訂購頁只留下乾淨商品列。"
        stats={[`購物車 ${itemCount} 件`, `配送 ${shippingMethod}`, `訂單紀錄 ${orderRecords.length} 筆`]}
      />

      {orderNotice && (
        <div className={`card product-notice-banner ${orderNotice.tone} order-notice-banner`}>
          <strong>{orderNotice.text}</strong>
        </div>
      )}

      <button
        ref={cartButtonRef}
        type="button"
        className={`floating-cart-button ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(true)}
        aria-label="開啟購物車"
      >
        <ShoppingCart className="small-icon" />
        <span className="floating-cart-text">購物車</span>
        <span className="floating-cart-count">{itemCount}</span>
      </button>

      <section className="order-layout order-layout-drawer">
        <div className="order-main">
          <div className="card order-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">商品列表</div>
                <div className="panel-desc">訂購頁只保留商品分類 / 搜尋 / 加入購物車節奏，客資與購物車統一收進彈射視窗。</div>
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
                    <button
                      type="button"
                      className="mini-add-btn"
                      onClick={(event) => handleAddToCart(item, event)}
                      disabled={!item.enabled || item.stock <= 0}
                    >
                      加入
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={`cart-drawer-overlay ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)}>
        <aside className={`cart-drawer-panel ${cartOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-head">
            <div>
              <div className="panel-title">購物車</div>
              <div className="panel-desc">商品明細、客戶資料、配送設定都整合在這裡。</div>
            </div>
            <button type="button" className="drawer-close-button" onClick={() => setCartOpen(false)} aria-label="關閉購物車">
              <X className="small-icon" />
            </button>
          </div>

          <div className="cart-drawer-scroll">
            <div className="cart-list">
              {cart.length ? (
                cart.map((item: any) => (
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
                ))
              ) : (
                <div className="empty-order-state drawer-empty-state">目前購物車沒有商品</div>
              )}
            </div>

            <div className="summary-lines drawer-summary-lines">
              <div><span>商品小計</span><strong>${subtotal}</strong></div>
              <div><span>運費</span><strong>${shippingFee}</strong></div>
              <div><span>折扣</span><strong>-${discountAmount}</strong></div>
              <div className="grand"><span>訂單總額</span><strong>${grandTotal}</strong></div>
            </div>

            <div className="drawer-section-block">
              <div className="panel-head compact-head">
                <div>
                  <div className="panel-title drawer-inner-title">客戶與配送資料</div>
                  <div className="panel-desc">點選快速客資或直接填寫。</div>
                </div>
              </div>

              <div className="quick-customer-grid">
                {quickCustomerCards.map((item: any) => (
                  <button key={item.name} type="button" className="quick-customer-card" onClick={() => applyQuickCustomer(item.name, item.phone, item.address, item.method)}>
                    <div className="quick-customer-name">{item.name}</div>
                    <div className="quick-customer-meta">{item.phone} / {item.method}</div>
                  </button>
                ))}
              </div>

              <div className="form-grid two-col form-gap-top">
                <label className="field-card"><span className="field-label"><User className="small-icon" />客戶姓名</span><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="請輸入客戶姓名" /></label>
                <label className="field-card"><span className="field-label"><Phone className="small-icon" />客戶電話</span><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="請輸入電話" /></label>
                <label className="field-card field-span-2"><span className="field-label"><MapPin className="small-icon" />收件地址 / 店名</span><input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="宅配填地址，店到店填店名，自取可留空" /></label>
              </div>

              <div className="shipping-method-row">
                {(['宅配', '店到店', '自取'] as const).map((method) => (
                  <button key={method} type="button" className={`shipping-chip ${shippingMethod === method ? 'active' : ''}`} onClick={() => setShippingMethod(method)}>
                    {method === '自取' ? <Store className="small-icon" /> : <Truck className="small-icon" />}
                    <span>{method}</span>
                    <strong>${getShippingFee(method)}</strong>
                  </button>
                ))}
              </div>

              <div className="form-grid two-col form-gap-top">
                <label className="field-card"><span className="field-label"><BadgePercent className="small-icon" />折扣模式</span><select value={discountMode} onChange={(e) => setDiscountMode(e.target.value)}><option value="無">無</option><option value="固定金額">固定金額</option></select></label>
                <label className="field-card"><span className="field-label"><Wallet className="small-icon" />折扣金額</span><input type="number" min={0} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value || 0))} placeholder="0" disabled={discountMode === '無'} /></label>
                <label className="field-card field-span-2"><span className="field-label"><FileText className="small-icon" />訂單備註</span><textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={4} placeholder="例：收款提醒、配送備註、時間要求" /></label>
              </div>
            </div>
          </div>

          <div className="cart-drawer-footer">
            <button type="button" className="primary-button full-width drawer-submit-button" onClick={createOrderRecord}>
              <Receipt className="small-icon" />建立訂單
            </button>
          </div>
        </aside>
      </div>

      <section className="order-record-layout">
        <div className="card order-panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">訂單列表</div>
              <div className="panel-desc">已建立的訂單可點選切換，先把主幹流程做起來。</div>
            </div>
            <span className="badge badge-soft">共 {orderRecords.length} 筆</span>
          </div>

          <div className="order-record-list">
            {orderRecords.map((item: any) => (
              <button key={item.orderNo} type="button" className={`order-record-card ${selectedOrderNo === item.orderNo ? 'selected' : ''}`} onClick={() => selectOrderRecord(item.orderNo)}>
                <div className="order-record-top">
                  <div>
                    <div className="order-record-no">{item.orderNo}</div>
                    <div className="order-record-meta">{item.customer} / {item.date}</div>
                  </div>
                  <div className="order-record-amount">${item.amount}</div>
                </div>
                <div className="order-record-tags">
                  <span className={`badge ${item.paymentStatus === '已收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                  <span className={`badge ${item.shippingStatus === '待出貨' ? 'badge-danger' : item.shippingStatus.includes('理貨') || item.shippingStatus.includes('已出貨') ? 'badge-success' : 'badge-soft'}`}>{item.shippingStatus}</span>
                  <span className="badge badge-soft">{item.mainStatus}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card order-panel">
          <div className="panel-head compact-head">
            <div>
              <div className="panel-title">訂單詳情</div>
              <div className="panel-desc">先做訂單狀態切換，之後再讓會計與倉儲直接承接。</div>
            </div>
            <span className="badge badge-role">Orders</span>
          </div>

          {selectedOrderRecord ? (
            <>
              <div className="order-detail-grid">
                <div className="fake-field"><span>訂單編號</span><strong>{selectedOrderRecord.orderNo}</strong></div>
                <div className="fake-field"><span>客戶姓名</span><strong>{selectedOrderRecord.customer}</strong></div>
                <div className="fake-field"><span>配送方式</span><strong>{selectedOrderRecord.shippingMethod}</strong></div>
                <div className="fake-field"><span>訂單總額</span><strong>${selectedOrderRecord.amount}</strong></div>
                <div className="fake-field"><span>收款狀態</span><strong>{selectedOrderRecord.paymentStatus}</strong></div>
                <div className="fake-field"><span>出貨狀態</span><strong>{selectedOrderRecord.shippingStatus}</strong></div>
                <div className="fake-field wide"><span>地址 / 備註</span><strong>{selectedOrderRecord.address} / {selectedOrderRecord.remark}</strong></div>
              </div>

              <div className="order-detail-items">
                <div className="order-detail-title"><ClipboardList className="small-icon" />商品明細</div>
                <div className="order-detail-item-list">
                  {selectedOrderRecord.items.map((item: any) => (
                    <div key={`${selectedOrderRecord.orderNo}-${item.code}`} className="order-detail-item-row">
                      <div>
                        <strong>{item.name}</strong>
                        <div className="order-record-meta">{item.code} / 數量 {item.qty}</div>
                      </div>
                      <div className="order-record-amount">${item.price * item.qty}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="accounting-action-row">
                <button type="button" className="primary-button" onClick={() => markOrderPaid(selectedOrderRecord.orderNo)}><CreditCard className="small-icon" />確認收款</button>
                <button type="button" className="ghost-button" onClick={() => markOrderShippingReady(selectedOrderRecord.orderNo)}><Truck className="small-icon" />標記待出貨</button>
              </div>
            </>
          ) : (
            <div className="empty-order-state">目前尚未建立訂單</div>
          )}
        </div>
      </section>
    </>
  );
}

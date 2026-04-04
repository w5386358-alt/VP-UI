import { User, Phone, MapPin, BadgePercent, Wallet, FileText, Store, Truck, Receipt, CreditCard, ClipboardList } from 'lucide-react';

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

  return (
    <>
      <SectionIntro
        title="訂單模組"
        desc="先把建單、訂單狀態、訂單列表與訂單詳情做成可操作版，後面再去串會計與倉儲。"
        stats={[`購物車 ${itemCount} 件`, `配送 ${shippingMethod}`, `訂單紀錄 ${orderRecords.length} 筆`]}
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
                <div className="panel-title">商品列表</div>
                <div className="panel-desc">保留商品分類 / 搜尋 / 加入購物車節奏，後續可直接接前台正式下單流程。</div>
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
                    <button type="button" className="mini-add-btn" onClick={() => addToCart(item)} disabled={!item.enabled || item.stock <= 0}>加入</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card order-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">客戶與配送資料</div>
                <div className="panel-desc">欄位命名依你後續 GAS 邏輯保留：客戶姓名、電話、地址、配送方式、備註。</div>
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
          </div>
        </div>

        <div className="order-side">
          <div className="card order-panel sticky-panel">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">購物車摘要</div>
                <div className="panel-desc">現在可直接建立訂單，先做 UI 流程連動。</div>
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

            <button type="button" className="primary-button full-width" onClick={createOrderRecord}><Receipt className="small-icon" />建立訂單</button>
          </div>
        </div>
      </section>

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

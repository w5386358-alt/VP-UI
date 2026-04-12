import { useEffect, useMemo, useRef, useState } from 'react';
import { User, Phone, MapPin, BadgePercent, Wallet, FileText, Store, Truck, Receipt, ShoppingCart, X, Sparkles, PackageCheck, Layers3 } from 'lucide-react';

export default function OrdersModule(props: any) {
  const {
    itemCount, shippingMethod, grandTotal,
    orderCategoryChips, orderCategory, setOrderCategory,
    filteredOrderProducts, addToCart,
    quickCustomerCards, applyQuickCustomer,
    customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress,
    setShippingMethod, getShippingFee,
    discountMode, setDiscountMode, discountValue, setDiscountValue,
    remark, setRemark,
    cart, removeFromCart, updateQty,
    subtotal, shippingFee, discountAmount,
    createOrderRecord, orderNotice,
    priceTierLabel,
  } = props;

  const [cartOpen, setCartOpen] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [quickCustomerPage, setQuickCustomerPage] = useState(1);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const dragStateRef = useRef({ dragging: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const touchStateRef = useRef({ dragging: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const [cartFabPosition, setCartFabPosition] = useState({ x: 0, y: 0, ready: false });
  const [draggingFab, setDraggingFab] = useState(false);
  const pageSize = 10;
  const totalProductPages = Math.max(1, Math.ceil(filteredOrderProducts.length / pageSize));
  const safeProductPage = Math.min(productPage, totalProductPages);
  const pagedOrderProducts = useMemo(() => filteredOrderProducts.slice((safeProductPage - 1) * pageSize, safeProductPage * pageSize), [filteredOrderProducts, safeProductPage]);
  const productPageNumbers = Array.from({ length: totalProductPages }, (_, index) => index + 1);
  const totalQuickCustomerPages = Math.max(1, Math.ceil(quickCustomerCards.length / pageSize));
  const safeQuickCustomerPage = Math.min(quickCustomerPage, totalQuickCustomerPages);
  const pagedQuickCustomers = useMemo(() => quickCustomerCards.slice((safeQuickCustomerPage - 1) * pageSize, safeQuickCustomerPage * pageSize), [quickCustomerCards, safeQuickCustomerPage]);
  const quickCustomerPageNumbers = Array.from({ length: totalQuickCustomerPages }, (_, index) => index + 1);

  useEffect(() => {
    if (typeof window === 'undefined' || cartFabPosition.ready) return;
    const isMobile = window.innerWidth <= 900;
    if (!isMobile) return;
    const size = 56;
    setCartFabPosition({
      x: window.innerWidth - size - 16,
      y: window.innerHeight - size - 112,
      ready: true,
    });
  }, [cartFabPosition.ready]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleTouchMove(event: TouchEvent) {
      const state = touchStateRef.current;
      if (!state.dragging) return;
      const touch = event.touches[0];
      if (!touch) return;
      const dx = touch.clientX - state.startX;
      const dy = touch.clientY - state.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.moved = true;
      const next = clampFabPosition(state.originX + dx, state.originY + dy);
      setCartFabPosition({ x: next.x, y: next.y, ready: true });
      event.preventDefault();
    }

    function handleTouchEnd() {
      const state = touchStateRef.current;
      if (!state.dragging) return;
      touchStateRef.current.dragging = false;
      setDraggingFab(false);
      if (!state.moved) setCartOpen(true);
    }

    function handlePointerMove(event: PointerEvent) {
      const state = dragStateRef.current;
      if (!state.dragging) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.moved = true;
      const next = clampFabPosition(state.originX + dx, state.originY + dy);
      setCartFabPosition({ x: next.x, y: next.y, ready: true });
    }

    function handlePointerUp() {
      const state = dragStateRef.current;
      if (!state.dragging) return;
      dragStateRef.current.dragging = false;
      setDraggingFab(false);
      if (!state.moved) setCartOpen(true);
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [cartFabPosition.ready]);

  function clampFabPosition(nextX: number, nextY: number) {
    if (typeof window === 'undefined') return { x: nextX, y: nextY };
    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = 56;
    const minX = 8;
    const maxX = Math.max(8, width - size - 8);
    const minY = 72;
    const maxY = Math.max(72, height - size - 88);
    return {
      x: Math.min(maxX, Math.max(minX, nextX)),
      y: Math.min(maxY, Math.max(minY, nextY)),
    };
  }

  function handleCartFabPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (typeof window !== 'undefined' && window.innerWidth > 900) return;
    const currentX = cartFabPosition.ready ? cartFabPosition.x : event.clientX;
    const currentY = cartFabPosition.ready ? cartFabPosition.y : event.clientY;
    dragStateRef.current = {
      dragging: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      originX: currentX,
      originY: currentY,
    };
    setDraggingFab(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleCartFabPointerMove(_event: React.PointerEvent<HTMLButtonElement>) {
    return;
  }

  function handleCartFabPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }



  function handleCartFabTouchStart(event: any) {
    if (typeof window !== 'undefined' && window.innerWidth > 900) return;
    const touch = event.touches[0];
    if (!touch) return;
    const currentX = cartFabPosition.ready ? cartFabPosition.x : touch.clientX;
    const currentY = cartFabPosition.ready ? cartFabPosition.y : touch.clientY;
    touchStateRef.current = { dragging: true, moved: false, startX: touch.clientX, startY: touch.clientY, originX: currentX, originY: currentY };
    setDraggingFab(true);
  }

  function handleCartFabTouchMove(_event: any) {
    return;
  }

  function handleCartFabTouchEnd() {
    return;
  }

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

  function handleCreateOrder() {
    createOrderRecord();
  }

  const previewCustomers = quickCustomerCards.slice(0, 3);
  const previewProducts = filteredOrderProducts.slice(0, 3);

  return (
    <>
      <button
        ref={cartButtonRef}
        type="button"
        className={`floating-cart-button ${cartOpen ? 'open' : ''} ${cartFabPosition.ready ? 'is-draggable' : ''} ${draggingFab ? 'dragging' : ''}`}
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth <= 900) return;
          setCartOpen(true);
        }}
        onPointerDown={handleCartFabPointerDown}
        onPointerMove={handleCartFabPointerMove}
        onPointerUp={handleCartFabPointerUp}
        onPointerCancel={() => { dragStateRef.current.dragging = false; }}
        onTouchStart={handleCartFabTouchStart}
        onTouchMove={handleCartFabTouchMove}
        onTouchEnd={handleCartFabTouchEnd}
        style={cartFabPosition.ready ? { left: `${cartFabPosition.x}px`, top: `${cartFabPosition.y}px`, right: 'auto', bottom: 'auto' } : undefined}
        aria-label="開啟購物車"
      >
        <ShoppingCart className="small-icon" />
        <span className="floating-cart-text">購物車</span>
        <span className="floating-cart-count">{itemCount}</span>
      </button>

      <section className="orders-workspace-grid">
        <div className="order-main">
          <div className="card order-panel orders-catalog-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">商品清單</div>
              </div>
              <span className="badge badge-soft">價格層級 / {priceTierLabel}</span>
            </div>

            <div className="order-toolbar-row">
              <div className="chip-filter-row">
                {orderCategoryChips.map((chip: string) => (
                  <button key={chip} type="button" className={`filter-chip ${orderCategory === chip ? 'active' : ''}`} onClick={() => setOrderCategory(chip)}>{chip}</button>
                ))}
              </div>
            </div>

            <div className="catalog-grid orders-catalog-grid">
              {pagedOrderProducts.map((item: any) => (
                <div key={item.id} className="catalog-card orders-product-card full-bleed-card">
                  <div className="catalog-image-slot catalog-image-slot-full">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="catalog-image" />
                    ) : (
                      <div className="catalog-image-placeholder">
                        <Receipt className="small-icon" />
                        <span>商品圖片</span>
                      </div>
                    )}
                  </div>
                  <div className="orders-product-body">
                    <div className="catalog-meta-row">
                      <span className="data-code">{item.code}</span>
                      <span className={`badge ${item.stock <= 10 ? 'badge-danger' : 'badge-success'}`}>{item.stock <= 10 ? `低庫存 ${item.stock}` : `庫存 ${item.stock}`}</span>
                    </div>
                    <div className="catalog-name">{item.name}</div>
                    <div className="catalog-desc">{item.category} / {priceTierLabel}</div>
                    <div className="catalog-footer">
                      <div className="orders-price-stack">
                        <div className="mini-label orders-tier-price">{priceTierLabel} ${item.price}</div>
                        <div className="catalog-price">${item.originalPrice ?? item.price}</div>
                        <div className="mini-label orders-price-caption">主顯示原價 / 次顯示 {priceTierLabel}</div>
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
                </div>
              ))}
            </div>
            <div className="pagination-row pagination-row-compact-arrows">
              <button type="button" className="ghost-button pagination-btn pagination-arrow-btn" onClick={() => setProductPage((page) => Math.max(1, page - 1))} disabled={safeProductPage === 1}>‹</button>
              <div className="pagination-pages pagination-pages-single">
                <button type="button" className="pagination-page active">{safeProductPage} / {totalProductPages}</button>
              </div>
              <button type="button" className="ghost-button pagination-btn pagination-arrow-btn" onClick={() => setProductPage((page) => Math.min(totalProductPages, page + 1))} disabled={safeProductPage === totalProductPages}>›</button>
            </div>
          </div>
        </div>

        <aside className="orders-side-column">
          <div className="card orders-quick-panel">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">常用客戶</div>
              </div>
              <User className="small-icon" />
            </div>
            <div className="quick-customer-grid orders-quick-grid">
              {pagedQuickCustomers.map((item: any) => (
                <button key={item.name} type="button" className="quick-customer-card" onClick={() => applyQuickCustomer(item.name, item.phone, item.address, item.method)}>
                  <div className="quick-customer-name">{item.name}</div>
                  <div className="quick-customer-meta">{item.phone} / {item.method}</div>
                </button>
              ))}
            </div>
            <div className="pagination-row pagination-row-compact-arrows">
              <button type="button" className="ghost-button pagination-btn pagination-arrow-btn" onClick={() => setQuickCustomerPage((page) => Math.max(1, page - 1))} disabled={safeQuickCustomerPage === 1}>‹</button>
              <div className="pagination-pages pagination-pages-single">
                <button type="button" className="pagination-page active">{safeQuickCustomerPage} / {totalQuickCustomerPages}</button>
              </div>
              <button type="button" className="ghost-button pagination-btn pagination-arrow-btn" onClick={() => setQuickCustomerPage((page) => Math.min(totalQuickCustomerPages, page + 1))} disabled={safeQuickCustomerPage === totalQuickCustomerPages}>›</button>
            </div>
          </div>

        </aside>
      </section>

      <div className={`cart-drawer-overlay ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)}>
        <aside className={`cart-drawer-panel ${cartOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-head">
            <div>
              <div className="panel-title">購物車</div>
              <div className="panel-desc">商品、客戶與配送資料。</div>
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
                        <div className="cart-meta">{item.code} / 原價 ${item.originalPrice ?? item.price} / {priceTierLabel} ${item.price}</div>
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
                <div className="empty-order-state drawer-empty-state">購物車目前沒有商品</div>
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
                  <div className="panel-desc">可直接帶入或手動填寫</div>
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
                <label className="field-card">
                  <span className="field-label"><BadgePercent className="small-icon" />折扣模式</span>
                  <select value={discountMode} onChange={(e) => setDiscountMode(e.target.value)}>
                    <option value="無折扣">無折扣</option>
                    <option value="百分比">百分比</option>
                    <option value="固定金額">固定金額</option>
                  </select>
                </label>
                <label className="field-card">
                  <span className="field-label"><Wallet className="small-icon" />折扣數值</span>
                  <input type="number" min={0} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="0" />
                </label>
                <label className="field-card field-span-2">
                  <span className="field-label"><FileText className="small-icon" />備註</span>
                  <textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={3} placeholder="可填寫配送、收款或出貨備註" />
                </label>
              </div>
            </div>
          </div>

          <div className="cart-drawer-footer">
            <button type="button" className="primary-button full-width drawer-submit-button" onClick={handleCreateOrder}>
              <PackageCheck className="small-icon" />建立訂單
            </button>
            {orderNotice && <div className={`inline-action-notice ${orderNotice.tone}`}><strong>{orderNotice.text}</strong></div>}
          </div>
        </aside>
      </div>
    </>
  );
}

import { useMemo, useState } from 'react';
import { ImageIcon, ShoppingCart } from 'lucide-react';
import CartDrawer from './CartDrawer';

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

  const [cartOpen, setCartOpen] = useState(false);
  const [flyItemId, setFlyItemId] = useState<string | null>(null);

  const cartBadgeText = useMemo(() => (itemCount > 99 ? '99+' : String(itemCount)), [itemCount]);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    setFlyItemId(item.id);
    window.clearTimeout((handleAddToCart as any)._timer);
    (handleAddToCart as any)._timer = window.setTimeout(() => setFlyItemId(null), 520);
  };

  return (
    <>
      <SectionIntro
        title="訂購模組｜UI 分離版"
        desc="主畫面只保留商品瀏覽；購物車、客資、配送、折扣與送單全部收進 Drawer，桌機與手機版面分離。"
        stats={[`購物車 ${itemCount} 件`, `配送 ${shippingMethod}`, `總額 $${grandTotal}`]}
      />

      {orderNotice && (
        <div className={`card product-notice-banner ${orderNotice.tone} order-notice-banner`}>
          <strong>{orderNotice.text}</strong>
        </div>
      )}

      <section className="order-layout order-layout-clean split-order-layout">
        <div className="order-main order-main-full">
          <div className="card order-panel order-panel-clean">
            <div className="panel-head order-page-head">
              <div>
                <div className="panel-title">商品選購</div>
                <div className="panel-desc">訂購頁只顯示產品列，購物車與客戶資料改由右側 Drawer 承接。</div>
              </div>
              <div className="order-head-actions">
                <span className="badge badge-soft">價格層級 / {user.rank === '核心人員' ? '總代理價格' : 'VIP價格'}</span>
                <button type="button" className="cart-float desktop-cart-float" onClick={() => setCartOpen(true)} aria-label="開啟購物車">
                  <ShoppingCart className="small-icon" />
                  <span>購物車</span>
                  <strong>{cartBadgeText}</strong>
                </button>
              </div>
            </div>

            <div className="order-toolbar-row">
              <div className="chip-filter-row">
                {orderCategoryChips.map((chip: string) => (
                  <button
                    key={chip}
                    type="button"
                    className={`filter-chip ${orderCategory === chip ? 'active' : ''}`}
                    onClick={() => setOrderCategory(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="catalog-grid catalog-grid-clean">
              {filteredOrderProducts.map((item: any) => (
                <div key={item.id} className={`catalog-card catalog-card-clean ${flyItemId === item.id ? 'fly-to-cart' : ''}`}>
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
                    <button type="button" className="mini-add-btn" onClick={() => handleAddToCart(item)} disabled={!item.enabled || item.stock <= 0}>加入</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <button type="button" className="cart-float mobile-cart-float" onClick={() => setCartOpen(true)} aria-label="開啟購物車">
        <ShoppingCart className="small-icon" />
        <span>購物車</span>
        <strong>{cartBadgeText}</strong>
      </button>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        customerAddress={customerAddress}
        setCustomerAddress={setCustomerAddress}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
        getShippingFee={getShippingFee}
        discountMode={discountMode}
        setDiscountMode={setDiscountMode}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        remark={remark}
        setRemark={setRemark}
        subtotal={subtotal}
        shippingFee={shippingFee}
        discountAmount={discountAmount}
        grandTotal={grandTotal}
        quickCustomerCards={quickCustomerCards}
        applyQuickCustomer={applyQuickCustomer}
        createOrderRecord={createOrderRecord}
        itemCount={itemCount}
      />
    </>
  );
}

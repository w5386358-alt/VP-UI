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

import { Truck, Boxes, Search, QrCode, FileText, Receipt, History } from 'lucide-react';

export default function InventoryModule(props: any) {
  const {
    lowStockCount,
    shippingQueue,
    warehouseSummary,
    warehouseTab,
    setWarehouseTab,
    selectedWarehouseOrder,
    selectedWarehouseOrderNo,
    setSelectedWarehouseOrderNo,
    warehouseNotice,
    shippingChecklist,
    handleWarehouseShip,
    handleWarehousePrint,
    inventoryFlow,
    stockSnapshot,
    selectedStockCode,
    setSelectedStockCode,
    selectedStockItem,
    queryExamples,
    warehouseQueryMode,
    setWarehouseQueryMode,
    warehouseQueryInput,
    setWarehouseQueryInput,
    runWarehouseQuery,
    handleWarehouseScanFill,
    warehouseQueryResult,
    warehouseRecentLogs,
    SectionIntro,
    SummaryCard,
  } = props;

  return (
    <>
      <SectionIntro
        title="倉儲中心細化版"
        desc="這版開始把出貨、庫存、查詢三區做得更接近實際操作畫面，仍然只動 UI，不去破壞你原本 GAS 倉儲邏輯。"
        stats={[`待出貨 ${shippingQueue.length}`, `低庫存 ${lowStockCount}`, 'QR / 條碼 / 出貨單 / 異動紀錄']}
      />

      <section className="summary-grid">
        {warehouseSummary.map((item: any) => <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />)}
      </section>

      <div className="warehouse-tab-row">
        <button type="button" className={`warehouse-tab ${warehouseTab === 'shipping' ? 'active' : ''}`} onClick={() => setWarehouseTab('shipping')}><Truck className="small-icon" />出貨區</button>
        <button type="button" className={`warehouse-tab ${warehouseTab === 'stock' ? 'active' : ''}`} onClick={() => setWarehouseTab('stock')}><Boxes className="small-icon" />庫存區</button>
        <button type="button" className={`warehouse-tab ${warehouseTab === 'query' ? 'active' : ''}`} onClick={() => setWarehouseTab('query')}><Search className="small-icon" />查詢區</button>
      </div>

      {warehouseNotice && <div className={`card product-notice-banner ${warehouseNotice.tone} accounting-notice-banner`}><strong>{warehouseNotice.text}</strong></div>}

      {warehouseTab === 'shipping' && (
        <section className="warehouse-layout">
          <div className="warehouse-main warehouse-stack">
            <div className="card order-panel">
              <div className="panel-head">
                <div>
                  <div className="panel-title">待出貨訂單</div>
                  <div className="panel-desc">先把待出貨、已收款、換貨待出庫集中在同一個作業面板。</div>
                </div>
                <span className="badge badge-danger">今日重點 {shippingQueue.length} 筆</span>
              </div>

              <div className="shipping-queue">
                {shippingQueue.map((item: any) => (
                  <button key={item.orderNo} type="button" className={`shipping-row accounting-select-row ${selectedWarehouseOrderNo === item.orderNo ? 'selected' : ''}`} onClick={() => setSelectedWarehouseOrderNo(item.orderNo)}>
                    <div>
                      <div className="shipping-order">{item.orderNo}</div>
                      <div className="shipping-meta">{item.customer} / {item.itemCount} 件 / {item.paymentStatus}</div>
                    </div>
                    <div className="shipping-actions">
                      <span className={`badge ${item.urgency === 'high' ? 'badge-danger' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                      <span className="badge badge-soft">切換</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="warehouse-detail-grid">
              <div className="card warehouse-detail-card">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨作業流程</div>
                    <div className="flow-desc">用 UI 先把你原本掃碼與出貨節奏排出來。</div>
                  </div>
                  <QrCode className="small-icon" />
                </div>
                <div className="warehouse-checklist">
                  {shippingChecklist.map((item: any) => (
                    <div key={item.title} className="warehouse-check-item">
                      <div className="warehouse-check-title">{item.title}</div>
                      <div className="warehouse-check-desc">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card warehouse-detail-card">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨資訊面板</div>
                    <div className="flow-desc">保留你後面要接的欄位位置，不改作業邏輯。</div>
                  </div>
                  <FileText className="small-icon" />
                </div>
                <div className="warehouse-form-grid">
                  <div className="fake-field"><span>訂單編號</span><strong>{selectedWarehouseOrder?.orderNo || '未選擇'}</strong></div>
                  <div className="fake-field"><span>出貨狀態</span><strong>{selectedWarehouseOrder?.shippingStatus || '-'}</strong></div>
                  <div className="fake-field"><span>收款狀態</span><strong>{selectedWarehouseOrder?.paymentStatus || '-'}</strong></div>
                  <div className="fake-field"><span>客戶</span><strong>{selectedWarehouseOrder?.customer || '-'}</strong></div>
                  <div className="fake-field wide"><span>掃碼結果</span><strong>{selectedWarehouseOrder ? `待驗證 ${selectedWarehouseOrder.itemCount} 件商品` : '請先切換訂單'}</strong></div>
                </div>
                <div className="accounting-action-row">
                  <button type="button" className="primary-button" onClick={handleWarehouseShip}><Truck className="small-icon" />完成出貨</button>
                  <button type="button" className="ghost-button" onClick={handleWarehousePrint}><Receipt className="small-icon" />列印出貨單</button>
                </div>
              </div>
            </div>
          </div>

          <div className="warehouse-side warehouse-stack">
            <div className="card order-panel sticky-panel">
              <div className="panel-head compact-head">
                <div>
                  <div className="panel-title">出貨區提醒</div>
                  <div className="panel-desc">這裡先放你最在意的防呆規則。</div>
                </div>
              </div>
              <div className="stack-list compact">
                <div>未收款不可出貨</div>
                <div>同 QR 多數量要看剩餘可出貨數量</div>
                <div>換貨 B 要自動產生金額 0 出貨單</div>
                <div>舊資料也要留下 shipping 痕跡</div>
              </div>
            </div>

            <div className="card order-panel">
              <div className="panel-head compact-head"><div><div className="panel-title">最近異動紀錄</div><div className="panel-desc">把 inventory_logs 的閱讀感先做出來。</div></div></div>
              <div className="warehouse-log-list">
                {warehouseRecentLogs.map((item: any) => (
                  <div key={`${item.time}-${item.type}`} className="warehouse-log-item">
                    <div className="warehouse-log-time">{item.time}</div>
                    <div><div className="warehouse-log-type">{item.type}</div><div className="warehouse-log-note">{item.note}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {warehouseTab === 'stock' && (
        <section className="warehouse-stack-section">
          <div className="warehouse-flow-grid">
            {inventoryFlow.map((item: any) => (
              <div key={item.title} className="card flow-card">
                <div className="flow-title">{item.title}</div>
                <div className="flow-desc">{item.desc}</div>
                <div className="data-chip-row">{item.tags.map((tag: string) => <span key={tag} className="badge badge-neutral">{tag}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="warehouse-stock-grid">
            {stockSnapshot.map((item: any) => (
              <button key={item.code} type="button" className={`card stock-snapshot-card accounting-select-row ${selectedStockCode === item.code ? 'selected' : ''}`} onClick={() => setSelectedStockCode(item.code)}>
                <div className="stock-card-top">
                  <div><div className="shipping-order">{item.name}</div><div className="shipping-meta">{item.code} / 安全庫存 {item.safe}</div></div>
                  <span className={`badge ${item.status === '低庫存' ? 'badge-danger' : 'badge-success'}`}>{item.status}</span>
                </div>
                <div className="stock-big-number">{item.stock}</div>
                <div className="stock-sub">目前庫存</div>
                <div className="fake-field wide"><span>QR 身分識別</span><strong>{item.qr}</strong></div>
              </button>
            ))}
          </div>

          <div className="card warehouse-tool-card">
            <div className="warehouse-card-head"><div><div className="flow-title">目前選取商品</div><div className="flow-desc">點選上方庫存卡，就只更新這一區。</div></div><Boxes className="small-icon" /></div>
            <div className="warehouse-form-grid">
              <div className="fake-field"><span>商品條碼</span><strong>{selectedStockItem?.code || '-'}</strong></div>
              <div className="fake-field"><span>商品名稱</span><strong>{selectedStockItem?.name || '-'}</strong></div>
              <div className="fake-field"><span>目前庫存</span><strong>{selectedStockItem?.stock || '-'}</strong></div>
              <div className="fake-field"><span>安全庫存</span><strong>{selectedStockItem?.safe || '-'}</strong></div>
              <div className="fake-field wide"><span>QR 摘要</span><strong>{selectedStockItem?.qr || '-'}</strong></div>
            </div>
          </div>
        </section>
      )}

      {warehouseTab === 'query' && (
        <section className="warehouse-stack-section">
          <div className="warehouse-query-grid">
            {queryExamples.map((item: any) => <div key={item.label} className="card query-card"><div className="query-label">{item.label}</div><div className="query-value">{item.value}</div></div>)}
          </div>

          <div className="warehouse-tool-grid">
            <div className="card warehouse-tool-card">
              <div className="warehouse-card-head"><div><div className="flow-title">條碼 / QR 快速查詢</div><div className="flow-desc">後面接掃碼器時，就直接沿用這個位置。</div></div><Search className="small-icon" /></div>
              <div className="warehouse-tab-row warehouse-query-mode-row">
                <button type="button" className={`warehouse-tab ${warehouseQueryMode === 'barcode' ? 'active' : ''}`} onClick={() => setWarehouseQueryMode('barcode')}>商品條碼</button>
                <button type="button" className={`warehouse-tab ${warehouseQueryMode === 'qr' ? 'active' : ''}`} onClick={() => setWarehouseQueryMode('qr')}>QR 身分識別</button>
                <button type="button" className={`warehouse-tab ${warehouseQueryMode === 'order' ? 'active' : ''}`} onClick={() => setWarehouseQueryMode('order')}>訂單編號</button>
              </div>
              <div className="warehouse-form-grid">
                <div className="fake-field wide"><span>查詢條件</span><strong><input value={warehouseQueryInput} onChange={(e) => setWarehouseQueryInput(e.target.value)} placeholder="輸入商品條碼 / QR / 訂單編號" /></strong></div>
              </div>
              <div className="accounting-action-row">
                <button type="button" className="primary-button" onClick={() => runWarehouseQuery()}><Search className="small-icon" />立即查詢</button>
                <button type="button" className="ghost-button" onClick={handleWarehouseScanFill}><QrCode className="small-icon" />掃碼帶入</button>
              </div>
            </div>

            <div className="card warehouse-tool-card">
              <div className="warehouse-card-head"><div><div className="flow-title">查詢結果展示位</div><div className="flow-desc">依你之前定義的顯示規則先排版。</div></div><History className="small-icon" /></div>
              <div className="warehouse-result-list">
                {warehouseQueryResult.map((item: any) => (
                  <div key={item.title} className="warehouse-result-item">
                    <div className="warehouse-result-title">{item.title}</div>
                    <div className="warehouse-result-desc">{item.desc}</div>
                    <div className="data-chip-row">{item.meta.map((meta: string) => <span key={meta} className="badge badge-neutral">{meta}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

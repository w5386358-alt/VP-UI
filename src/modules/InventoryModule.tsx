import { Truck, Boxes, Search, QrCode, FileText, Receipt, History, Bell } from 'lucide-react';

export default function InventoryModule(props: any) {
  const {
    lowStockCount,
    shippingQueue,
    warehouseTab,
    setWarehouseTab,
    selectedWarehouseOrder,
    selectedWarehouseOrderNo,
    setSelectedWarehouseOrderNo,
    warehouseNotice,
    shippingChecklist,
    handleWarehouseShip,
    handleWarehouseInbound,
    warehouseInboundQty,
    setWarehouseInboundQty,
    warehouseInboundQr,
    setWarehouseInboundQr,
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
    warehouseShipValidation,
  } = props;

  return (
    <>
      <div className="warehouse-tab-row">
        <button type="button" className={`warehouse-tab ${warehouseTab === 'shipping' ? 'active' : ''}`} onClick={() => setWarehouseTab('shipping')}><Truck className="small-icon" />出貨區</button>
        <button type="button" className={`warehouse-tab ${warehouseTab === 'stock' ? 'active' : ''}`} onClick={() => setWarehouseTab('stock')}><Boxes className="small-icon" />庫存區</button>
        <button type="button" className={`warehouse-tab ${warehouseTab === 'query' ? 'active' : ''}`} onClick={() => setWarehouseTab('query')}><Search className="small-icon" />查詢區</button>
      </div>

      {warehouseNotice && <div className={`card product-notice-banner ${warehouseNotice.tone} accounting-notice-banner`}><strong>{warehouseNotice.text}</strong></div>}

      {warehouseTab === 'shipping' && (
        <section className="warehouse-layout warehouse-shipping-layout">
          <div className="warehouse-main warehouse-stack">
            <div className="card order-panel">
              <div className="panel-head">
                <div>
                  <div className="panel-title">待出貨訂單</div>
                  <div className="panel-desc">出貨前先檢查收款狀態，再依 inventory_logs 可用數量扣減。</div>
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
                      <span className={`badge ${item.paymentStatus === '已收款' || item.paymentStatus === '免收款' ? 'badge-success' : 'badge-danger'}`}>{item.paymentStatus === '已收款' || item.paymentStatus === '免收款' ? '可出貨' : '待收款'}</span>
                      <span className={`badge ${item.urgency === 'high' ? 'badge-danger' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                      <span className="badge badge-soft">切換</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="warehouse-side warehouse-stack">
            <div className="card warehouse-reminder-card">
              <div className="warehouse-card-head compact-head">
                <div>
                  <div className="flow-title">出貨區提醒</div>
                  <div className="flow-desc">先預留未來手機提醒的位置，之後可接推播、LINE 或行動通知。</div>
                </div>
                <Bell className="small-icon" />
              </div>
              <div className="warehouse-reminder-grid">
                <div className="warehouse-reminder-item highlight">待收款訂單不可出貨</div>
                <div className="warehouse-reminder-item">出貨前先核對 QR 與條碼</div>
                <div className="warehouse-reminder-item">異常訂單後續可接手機提醒</div>
              </div>
            </div>

            <div className="card warehouse-detail-card warehouse-right-merged-card">
              <div className="warehouse-compact-sop">
                <div className="warehouse-card-head compact-head">
                  <div>
                    <div className="flow-title">出貨 SOP 檢查</div>
                    <div className="flow-desc">縮小整合到面板上方，保留出貨前的關鍵防呆。</div>
                  </div>
                  <QrCode className="small-icon" />
                </div>
                <div className="warehouse-compact-sop-grid">
                  {shippingChecklist.map((item: any) => (
                    <div key={item.title} className="warehouse-compact-sop-item">
                      <div className="warehouse-check-title">{item.title}</div>
                      <div className="warehouse-check-desc">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="warehouse-info-block">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨資訊面板</div>
                    <div className="flow-desc">依訂單狀態與庫存驗證結果判讀，通過後才進行出貨與列印。</div>
                  </div>
                  <FileText className="small-icon" />
                </div>

                <div className="warehouse-check-summary-grid">
                  <div className={`warehouse-check-summary-card ${warehouseShipValidation?.paymentOk ? 'ok' : 'bad'}`}>
                    <span>收款驗證</span>
                    <strong>{warehouseShipValidation?.paymentOk ? '已通過' : '未通過'}</strong>
                  </div>
                  <div className={`warehouse-check-summary-card ${warehouseShipValidation?.canShip ? 'ok' : 'bad'}`}>
                    <span>庫存驗證</span>
                    <strong>{warehouseShipValidation?.canShip ? '可出貨' : '不可出貨'}</strong>
                  </div>
                </div>

                <div className="warehouse-form-grid">
                  <div className="fake-field"><span>訂單編號</span><strong>{selectedWarehouseOrder?.orderNo || '未選擇'}</strong></div>
                  <div className="fake-field"><span>出貨狀態</span><strong>{selectedWarehouseOrder?.shippingStatus || '-'}</strong></div>
                  <div className="fake-field"><span>收款狀態</span><strong>{selectedWarehouseOrder?.paymentStatus || '-'}</strong></div>
                  <div className="fake-field"><span>客戶</span><strong>{selectedWarehouseOrder?.customer || '-'}</strong></div>
                  <div className="fake-field wide"><span>預計扣減</span><strong>{selectedWarehouseOrder ? selectedWarehouseOrder.qrSummary : '請先切換訂單'}</strong></div>
                </div>

                {!!warehouseShipValidation?.issues?.length && (
                  <div className="warehouse-issue-list">
                    {warehouseShipValidation.issues.map((issue: string) => (
                      <div key={issue} className="warehouse-issue-item">❌ {issue}</div>
                    ))}
                  </div>
                )}

                <div className="accounting-action-row">
                  <button type="button" className="primary-button" onClick={handleWarehouseShip} disabled={!warehouseShipValidation?.canShip}>
                    <Truck className="small-icon" />依 SOP 完成出貨
                  </button>
                  <button type="button" className="ghost-button" onClick={handleWarehousePrint}><Receipt className="small-icon" />列印出貨單</button>
                </div>
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
                <div className="stock-sub">目前庫存（由 logs 計算）</div>
                <div className="fake-field wide"><span>QR 身分識別</span><strong>{item.qr}</strong></div>
              </button>
            ))}
          </div>

          <div className="card warehouse-tool-card">
            <div className="warehouse-card-head"><div><div className="flow-title">入庫作業</div><div className="flow-desc">入庫會新增 inventory_logs，不再直接改庫存數字。</div></div><Boxes className="small-icon" /></div>
            <div className="warehouse-form-grid">
              <div className="fake-field"><span>商品條碼</span><strong>{selectedStockItem?.code || '-'}</strong></div>
              <div className="fake-field"><span>商品名稱</span><strong>{selectedStockItem?.name || '-'}</strong></div>
              <div className="fake-field"><span>目前庫存</span><strong>{selectedStockItem?.stock || '-'}</strong></div>
              <div className="fake-field"><span>安全庫存</span><strong>{selectedStockItem?.safe || '-'}</strong></div>
              <div className="fake-field wide"><span>QR 摘要</span><strong>{selectedStockItem?.qr || '-'}</strong></div>
              <div className="fake-field"><span>入庫 QR</span><strong><input value={warehouseInboundQr} onChange={(e) => setWarehouseInboundQr(e.target.value)} placeholder="例如 QR(A-NEW)" /></strong></div>
              <div className="fake-field"><span>入庫數量</span><strong><input type="number" min={1} value={warehouseInboundQty} onChange={(e) => setWarehouseInboundQty(Math.max(1, Number(e.target.value) || 1))} /></strong></div>
              <div className="fake-field wide"><span>最近異動</span><strong>{selectedStockItem?.updated || '-'}</strong></div>
            </div>
            <div className="accounting-action-row">
              <button type="button" className="primary-button" onClick={handleWarehouseInbound}><Boxes className="small-icon" />寫入入庫紀錄</button>
              <button type="button" className="ghost-button" onClick={() => setWarehouseTab('query')}><Search className="small-icon" />去查詢區核對</button>
            </div>
          </div>

          <div className="card order-panel">
            <div className="panel-head compact-head"><div><div className="panel-title">最近異動紀錄</div><div className="panel-desc">這裡直接反映 inventory_logs 最新 12 筆，方便測第二包 SOP 是否正常留痕。</div></div></div>
            <div className="warehouse-log-list">
              {warehouseRecentLogs.map((item: any) => (
                <div key={`${item.time}-${item.type}-${item.note}`} className="warehouse-log-item">
                  <div className="warehouse-log-time">{item.time}</div>
                  <div><div className="warehouse-log-type">{item.type}</div><div className="warehouse-log-note">{item.note}</div></div>
                </div>
              ))}
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
              <div className="warehouse-card-head"><div><div className="flow-title">條碼 / QR 快速查詢</div><div className="flow-desc">查詢結果直接讀目前 logs 與訂單狀態。</div></div><Search className="small-icon" /></div>
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
              <div className="warehouse-card-head"><div><div className="flow-title">查詢結果展示位</div><div className="flow-desc">商品條碼看總庫存，QR 看個別數量，訂單看出貨狀態。</div></div><History className="small-icon" /></div>
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

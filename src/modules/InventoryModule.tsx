import { Truck, Boxes, Search, QrCode, FileText, Receipt, History, CalendarRange, CreditCard, RefreshCw, RotateCcw, BellRing, ClipboardCheck } from 'lucide-react';

export default function InventoryModule(props: any) {
  const {
    lowStockCount,
    shippingQueue,
    filteredWarehouseQueue,
    warehouseTab,
    setWarehouseTab,
    selectedWarehouseOrder,
    selectedWarehouseOrderNo,
    setSelectedWarehouseOrderNo,
    warehouseNotice,
    warehouseKeyword,
    setWarehouseKeyword,
    warehousePaymentFilter,
    setWarehousePaymentFilter,
    warehouseShippingFilter,
    setWarehouseShippingFilter,
    warehouseDateStart,
    setWarehouseDateStart,
    warehouseDateEnd,
    setWarehouseDateEnd,
    shippingChecklist,
    warehouseSopPoints,
    warehouseReminderItems,
    handleWarehouseShip,
    handleWarehouseReturn,
    handleWarehouseExchange,
    handleWarehouseInbound,
    warehouseInboundQty,
    setWarehouseInboundQty,
    warehouseInboundQr,
    setWarehouseInboundQr,
    warehouseScanBarcode,
    setWarehouseScanBarcode,
    warehouseScanQr,
    setWarehouseScanQr,
    warehouseExpectedScan,
    warehouseScanValidation,
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
    SectionIntro,
  } = props;

  return (
    <>
      <SectionIntro
        title="倉儲中心"
        desc="出貨、庫存與查詢集中在同一區。"
        stats={[`待出貨 ${shippingQueue.length}`, `低庫存 ${lowStockCount}`, '防超賣 + QR 邏輯']}
      />

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
                  <div className="panel-desc">出貨前先檢查收款狀態，再依 inventory_logs 可用數量扣減。</div>
                </div>
                <span className="badge badge-danger">今日重點 {shippingQueue.length} 筆</span>
              </div>

              <div className="accounting-filter-grid warehouse-filter-grid">
                <label className="field-card field-span-2"><span className="field-label"><Search className="small-icon" />搜尋訂單 / 客戶</span><input value={warehouseKeyword} onChange={(e) => setWarehouseKeyword(e.target.value)} placeholder="輸入訂單編號、客戶姓名、收款狀態、出貨狀態" /></label>
                <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />開始日期</span><input type="date" value={warehouseDateStart} onChange={(e) => setWarehouseDateStart(e.target.value)} /></label>
                <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />結束日期</span><input type="date" value={warehouseDateEnd} onChange={(e) => setWarehouseDateEnd(e.target.value)} /></label>
                <label className="field-card"><span className="field-label"><CreditCard className="small-icon" />收款狀態</span><select value={warehousePaymentFilter} onChange={(e) => setWarehousePaymentFilter(e.target.value)}><option value="全部">全部</option><option value="待收款">待收款</option><option value="已收款">已收款</option><option value="退款處理中">退款處理中</option></select></label>
                <label className="field-card"><span className="field-label"><Truck className="small-icon" />出貨狀態</span><select value={warehouseShippingFilter} onChange={(e) => setWarehouseShippingFilter(e.target.value)}><option value="全部">全部</option><option value="待出貨">待出貨</option><option value="理貨中">理貨中</option><option value="已出貨">已出貨</option><option value="換貨待出庫">換貨待出庫</option><option value="已退貨">已退貨</option></select></label>
              </div>

              <div className="shipping-queue">
                {filteredWarehouseQueue.map((item: any) => (
                  <button key={item.orderNo} type="button" className={`shipping-row accounting-select-row ${selectedWarehouseOrderNo === item.orderNo ? 'selected' : ''}`} onClick={() => setSelectedWarehouseOrderNo(item.orderNo)}>
                    <div>
                      <div className="shipping-order">{item.orderNo}</div>
                      <div className="shipping-meta">{item.customer} / {item.date} / {item.itemCount} 件 / {item.paymentStatus}</div>
                    </div>
                    <div className="shipping-actions warehouse-order-statuses">
                      <span className={`badge ${item.paymentStatus === '已收款' || item.paymentStatus === '免收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                      <span className={`badge ${item.shippingStatus === '已出貨' ? 'badge-success' : item.shippingStatus === '已退貨' ? 'badge-neutral' : item.shippingStatus.includes('換貨') ? 'badge-soft' : 'badge-danger'}`}>{item.shippingStatus}</span>
                      <span className="badge badge-soft">{item.mainStatus}</span>
                    </div>
                  </button>
                ))}
                {!filteredWarehouseQueue.length && <div className="warehouse-empty-state">查無符合條件的訂單</div>}
              </div>
            </div>

          </div>

          <div className="warehouse-side warehouse-stack">
            <div className="card order-panel sticky-panel warehouse-side-panel">
              <div className="warehouse-side-section">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨資訊</div>
                    <div className="flow-desc">查看驗證、出貨資料與狀態。</div>
                  </div>
                  <ClipboardCheck className="small-icon" />
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
                  <div className="fake-field"><span>商品條碼</span><strong><input value={warehouseScanBarcode} onChange={(e) => setWarehouseScanBarcode(e.target.value.toUpperCase())} placeholder={warehouseExpectedScan?.barcodeOptions?.length ? `例如 ${warehouseExpectedScan.barcodeOptions[0]}` : '請先選單'} /></strong></div>
                  <div className="fake-field"><span>QR 身分識別</span><strong><input value={warehouseScanQr} onChange={(e) => setWarehouseScanQr(e.target.value.toUpperCase())} placeholder={warehouseExpectedScan?.qrOptions?.length ? `例如 ${warehouseExpectedScan.qrOptions[0]}` : '請先掃商品條碼'} /></strong></div>
                  <div className="fake-field wide"><span>預計扣減</span><strong>{selectedWarehouseOrder ? selectedWarehouseOrder.qrSummary : '請先切換訂單'}</strong></div>
                </div>

                <div className="warehouse-scan-hint-grid">
                  <div className={`warehouse-scan-hint ${warehouseScanValidation?.barcodeOk ? 'ok' : warehouseScanBarcode ? 'bad' : 'idle'}`}>{warehouseScanValidation?.barcodeMessage}</div>
                  <div className={`warehouse-scan-hint ${warehouseScanValidation?.qrOk ? 'ok' : warehouseScanQr ? 'bad' : 'idle'}`}>{warehouseScanValidation?.qrMessage}</div>
                </div>

                {!!warehouseShipValidation?.issues?.length && (
                  <div className="warehouse-issue-list">
                    {warehouseShipValidation.issues.map((issue: string) => (
                      <div key={issue} className="warehouse-issue-item">❌ {issue}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="warehouse-side-section">
                <div className="accounting-action-row warehouse-action-row">
                  <button type="button" className="primary-button" onClick={handleWarehouseShip} disabled={!warehouseShipValidation?.canShip}>
                    <Truck className="small-icon" />完成出貨
                  </button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseReturn}><RotateCcw className="small-icon" />確認退貨</button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseExchange}><RefreshCw className="small-icon" />轉入換貨</button>
                  <button type="button" className="ghost-button" onClick={handleWarehousePrint}><Receipt className="small-icon" />列印出貨單 PDF</button>
                </div>
              </div>

              <div className="warehouse-side-section warehouse-reminder-panel">
                <div className="panel-head compact-head">
                  <div>
                    <div className="panel-title">出貨狀態</div>
                    <div className="panel-desc">查看本次出貨狀態。</div>
                  </div>
                  <BellRing className="small-icon" />
                </div>
                <div className="stack-list compact warehouse-reminder-stack">
                  {warehouseReminderItems.map((item: any, index: number) => (
                    <div key={`${item.text}-${index}`} className={`warehouse-reminder-item tone-${item.tone}`}>
                      <BellRing className="small-icon" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="warehouse-reminder-footer">請依狀態完成作業。</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {warehouseTab === 'stock' && (
        <section className="warehouse-stack-section">
          <div className="card order-panel warehouse-stock-overview-card">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">庫存商品清單</div>
              </div>
              <span className="badge badge-soft">共 {stockSnapshot.length} 項</span>
            </div>

            <div className="warehouse-stock-grid compact">
              {stockSnapshot.map((item: any) => (
                <button key={item.code} type="button" className={`card stock-snapshot-card compact accounting-select-row ${selectedStockCode === item.code ? 'selected' : ''}`} onClick={() => setSelectedStockCode(item.code)}>
                  <div className="stock-card-top compact">
                    <div className="stock-card-main">
                      <div className="shipping-order">{item.name}</div>
                      <div className="shipping-meta">{item.code}</div>
                    </div>
                    <span className={`badge ${item.status === '低庫存' ? 'badge-danger' : 'badge-success'}`}>{item.status}</span>
                  </div>
                  <div className="stock-inline-row">
                    <div className="stock-inline-block">
                      <span>目前庫存</span>
                      <strong>{item.stock}</strong>
                    </div>
                    <div className="stock-inline-block">
                      <span>安全庫存</span>
                      <strong>{item.safe}</strong>
                    </div>
                  </div>
                  <div className="stock-qr-line">QR：{item.qr}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card warehouse-tool-card">
            <div className="warehouse-card-head"><div><div className="flow-title">入庫作業</div></div><Boxes className="small-icon" /></div>
            <div className="warehouse-form-grid">
              <div className="fake-field"><span>商品條碼</span><strong>{selectedStockItem?.code || '-'}</strong></div>
              <div className="fake-field"><span>商品名稱</span><strong>{selectedStockItem?.name || '-'}</strong></div>
              <div className="fake-field"><span>目前庫存</span><strong>{selectedStockItem?.stock || '-'}</strong></div>
              <div className="fake-field"><span>安全庫存</span><strong>{selectedStockItem?.safe || '-'}</strong></div>
              <div className="fake-field wide"><span>QR 摘要</span><strong>{selectedStockItem?.qr || '-'}</strong></div>
              <div className="fake-field"><span>入庫 QR</span><strong><input value={warehouseInboundQr} onChange={(e) => setWarehouseInboundQr(e.target.value)} placeholder="輸入入庫 QR" /></strong></div>
              <div className="fake-field"><span>入庫數量</span><strong><input type="number" min={1} value={warehouseInboundQty} onChange={(e) => setWarehouseInboundQty(Math.max(1, Number(e.target.value) || 1))} /></strong></div>
              <div className="fake-field wide"><span>最近異動</span><strong>{selectedStockItem?.updated || '-'}</strong></div>
            </div>
            <div className="accounting-action-row">
              <button type="button" className="primary-button" onClick={handleWarehouseInbound}><Boxes className="small-icon" />寫入入庫紀錄</button>
              <button type="button" className="ghost-button" onClick={() => setWarehouseTab('query')}><Search className="small-icon" />去查詢區核對</button>
            </div>
          </div>

          <div className="card order-panel">
            <div className="panel-head compact-head"><div><div className="panel-title">最近異動紀錄</div></div></div>
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
              <div className="warehouse-card-head"><div><div className="flow-title">庫存查詢</div></div><Search className="small-icon" /></div>
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
              <div className="warehouse-card-head"><div><div className="flow-title">查詢結果</div></div><History className="small-icon" /></div>
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

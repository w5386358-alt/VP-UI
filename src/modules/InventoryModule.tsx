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
        title="倉儲中心｜GAS SOP 第二包"
        desc="這版接續倉儲 GAS SOP 第二包，主軸是防超賣 + QR 邏輯測試。入庫、出貨、查詢都改由 inventory_logs 與 QR 餘量判讀。"
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
                {!filteredWarehouseQueue.length && <div className="warehouse-empty-state">目前查無符合條件的訂單</div>}
              </div>
            </div>

          </div>

          <div className="warehouse-side warehouse-stack">
            <div className="card order-panel sticky-panel warehouse-side-panel">
              <div className="warehouse-side-section warehouse-reminder-panel warehouse-reminder-top-panel">
                <div className="panel-head compact-head warehouse-reminder-top-head">
                  <div>
                    <div className="panel-title">出貨區提醒</div>
                    <div className="panel-desc">先預留手機提醒串接區，現在先顯示倉儲提醒與作業重點。</div>
                  </div>
                  <BellRing className="small-icon" />
                </div>
                <div className="stack-list compact warehouse-reminder-stack warehouse-reminder-top-stack">
                  {warehouseReminderItems.map((item: any, index: number) => (
                    <div key={`${item.text}-${index}`} className={`warehouse-reminder-item tone-${item.tone}`}>
                      <BellRing className="small-icon" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="warehouse-reminder-footer warehouse-mobile-reminder-note">已預留未來手機提醒串接區塊，後續可接推播或 LINE 提醒。</div>
              </div>

              <div className="warehouse-side-section warehouse-side-checklist warehouse-side-checklist-compact">
                <div className="warehouse-card-head compact-head warehouse-sop-compact-head">
                  <div>
                    <div className="flow-title">出貨 SOP 檢查</div>
                    <div className="flow-desc">縮小置頂，先確認收款、商品與 QR，再往下核對出貨資訊。</div>
                  </div>
                  <ClipboardCheck className="small-icon" />
                </div>

                <div className="warehouse-checklist warehouse-checklist-compact-grid">
                  {warehouseSopPoints.map((item: any) => (
                    <div key={item.title} className={`warehouse-check-item warehouse-check-item-compact sop-status-${item.status}`}>
                      <div className="warehouse-check-title-row">
                        <div className="warehouse-check-title">{item.title}</div>
                        <span className={`badge ${item.status === 'done' ? 'badge-success' : item.status === 'warning' ? 'badge-danger' : 'badge-neutral'}`}>{item.status === 'done' ? '已帶入' : item.status === 'warning' ? '待覆核' : '待選單'}</span>
                      </div>
                      <div className="warehouse-check-desc">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="warehouse-side-section">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨資訊面板</div>
                    <div className="flow-desc">整合訂單資訊、驗證欄位與出貨單預覽，依照 SOP 往下核對。</div>
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

                <div className="warehouse-mini-sop-list warehouse-mini-sop-inline">
                  {shippingChecklist.map((item: any) => (
                    <div key={item.title} className="warehouse-mini-sop-item">
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="warehouse-side-section">
                <div className="warehouse-card-head compact-head">
                  <div>
                    <div className="flow-title">出貨單預覽 / PDF</div>
                    <div className="flow-desc">顯示邏輯比照 GAS 出貨單方向，可直接列印或另存 PDF。</div>
                  </div>
                  <Receipt className="small-icon" />
                </div>

                <div className="warehouse-print-box">
                  <div className="warehouse-print-sheet">
                    <div className="warehouse-print-header">
                      <div>
                        <div className="warehouse-print-brand">VP 出貨單</div>
                        <div className="warehouse-print-order">{selectedWarehouseOrder?.orderNo || '未選擇訂單'}</div>
                      </div>
                      <QrCode className="warehouse-print-qr" />
                    </div>
                    <div className="warehouse-print-grid">
                      <div><span>客戶</span><strong>{selectedWarehouseOrder?.customer || '-'}</strong></div>
                      <div><span>收款狀態</span><strong>{selectedWarehouseOrder?.paymentStatus || '-'}</strong></div>
                      <div><span>出貨狀態</span><strong>{selectedWarehouseOrder?.shippingStatus || '-'}</strong></div>
                      <div><span>件數</span><strong>{selectedWarehouseOrder?.itemCount || '-'}</strong></div>
                    </div>
                    <div className="warehouse-print-note">列印前預覽：可直接開啟列印視窗或另存為 PDF。</div>
                  </div>
                </div>

                <div className="accounting-action-row warehouse-action-row">
                  <button type="button" className="primary-button" onClick={handleWarehouseShip} disabled={!warehouseShipValidation?.canShip}>
                    <Truck className="small-icon" />依 SOP 完成出貨
                  </button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseReturn}><RotateCcw className="small-icon" />確認退貨</button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseExchange}><RefreshCw className="small-icon" />轉入換貨</button>
                  <button type="button" className="ghost-button" onClick={handleWarehousePrint}><Receipt className="small-icon" />列印出貨單 PDF</button>
                </div>
                <div className="warehouse-mini-note">列印會開啟可列印頁面，可直接使用瀏覽器另存為 PDF。</div>
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

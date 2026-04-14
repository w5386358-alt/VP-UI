import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { scanWithCamera } from '../utils/nativeScanner';
import { Truck, Boxes, Search, Receipt, History, CalendarRange, CreditCard, RefreshCw, RotateCcw, BellRing, Layers3, ChevronRight, X } from 'lucide-react';

export default function InventoryModule(props: any) {
  const {
    lowStockCount,
    shippingQueue,
    filteredWarehouseQueue,
    warehouseTab,
    setWarehouseTab,
    visibleWarehouseTabs = ['shipping', 'stock', 'query'],
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

  const [shippingPage, setShippingPage] = useState(1);
  const [warehouseActionMenuOrderNo, setWarehouseActionMenuOrderNo] = useState<string | null>(null);
  const [mobileWarehousePanelOpen, setMobileWarehousePanelOpen] = useState(false);
  const [mobileInboundPanelOpen, setMobileInboundPanelOpen] = useState(false);
  const printerSymbol = '/icons/printer-symbol.png';
  const shippingPageSize = 10;
  const [warehouseLogPage, setWarehouseLogPage] = useState(1);
  const warehouseLogPageSize = 6;
  const shippingTotalPages = Math.max(1, Math.ceil(filteredWarehouseQueue.length / shippingPageSize));
  const shippingSafePage = Math.min(shippingPage, shippingTotalPages);
  const pagedWarehouseQueue = useMemo(() => filteredWarehouseQueue.slice((shippingSafePage - 1) * shippingPageSize, shippingSafePage * shippingPageSize), [filteredWarehouseQueue, shippingSafePage]);
  const shippingPageNumbers = Array.from({ length: shippingTotalPages }, (_, index) => index + 1);
  const warehouseLogTotalPages = Math.max(1, Math.ceil(warehouseRecentLogs.length / warehouseLogPageSize));
  const warehouseLogSafePage = Math.min(warehouseLogPage, warehouseLogTotalPages);
  const pagedWarehouseRecentLogs = useMemo(() => warehouseRecentLogs.slice((warehouseLogSafePage - 1) * warehouseLogPageSize, warehouseLogSafePage * warehouseLogPageSize), [warehouseRecentLogs, warehouseLogSafePage]);
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  async function handleScanBarcodeLaunch() {
    const value = await scanWithCamera({ title: '倉儲條碼掃描', fallbackLabel: '商品條碼' });
    if (value) setWarehouseScanBarcode(value.toUpperCase());
  }

  async function handleScanQrLaunch() {
    const value = await scanWithCamera({ title: '倉儲 QR 掃描', fallbackLabel: 'QR 身分識別' });
    if (value) setWarehouseScanQr(value.toUpperCase());
  }

  async function handleInboundQrLaunch() {
    const value = await scanWithCamera({ title: '入庫 QR 掃描', fallbackLabel: '入庫 QR' });
    if (value) setWarehouseInboundQr(value.toUpperCase());
  }

  async function handleQueryScanLaunch() {
    const value = await scanWithCamera({ title: '查詢掃碼', fallbackLabel: '查詢條件' });
    if (value) setWarehouseQueryInput(value.toUpperCase());
  }

  function openWarehouseActionPanel(orderNo: string) {
    setSelectedWarehouseOrderNo(orderNo);
    setWarehouseActionMenuOrderNo(null);
    setMobileWarehousePanelOpen(true);
  }

  function openStockActionPanel(code: string) {
    setSelectedStockCode(code);
    setMobileInboundPanelOpen(true);
  }


  const warehouseTabMeta = [
    { key: 'shipping', label: '出貨區', icon: Truck },
    { key: 'stock', label: '庫存區', icon: Boxes },
    { key: 'query', label: '查詢區', icon: Search },
  ];
  const filteredWarehouseTabs = warehouseTabMeta.filter((item) => visibleWarehouseTabs.includes(item.key));
  const isMobileViewport = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

  return (
    <>
      <div className="warehouse-tab-row warehouse-primary-tabs">
        {filteredWarehouseTabs.map((item: any) => {
          const Icon = item.icon;
          return <button key={item.key} type="button" className={`warehouse-tab ${warehouseTab === item.key ? 'active' : ''}`} onClick={() => setWarehouseTab(item.key)}><Icon className="small-icon" /><span>{item.label}</span><ChevronRight className="small-icon accounting-tab-arrow" /></button>;
        })}
      </div>

      {warehouseTab === 'shipping' && (
        <section className="warehouse-layout warehouse-command-layout">
          <div className="warehouse-main warehouse-stack">
            <div className="card order-panel warehouse-filter-shell">
              <div className="panel-head">
                <div>
                  <div className="panel-title">訂單清單篩選</div>
                  <div className="panel-desc">收款與庫存後進行出貨。</div>
                </div>
                <span className="badge badge-danger">今日重點 {shippingQueue.length} 筆</span>
              </div>

              <div className="accounting-filter-grid warehouse-filter-grid warehouse-filter-shell-grid">
                <label className="field-card field-span-2 scanner-inline-card filter-search-card"><span className="field-label"><Search className="small-icon" />搜尋訂單 / 客戶</span><div className="scanner-input-wrap"><input value={warehouseKeyword} onChange={(e) => setWarehouseKeyword(e.target.value)} placeholder="輸入訂單編號、客戶姓名、收款狀態、出貨狀態" /><button type="button" className="scan-inline-icon-btn" onClick={handleQueryScanLaunch} aria-label="掃描搜尋訂單"><QrCode className="small-icon" /></button></div></label>
                <label className="field-card filter-date-card"><span className="field-label"><CalendarRange className="small-icon" />開始日期</span><input type="date" value={warehouseDateStart} onChange={(e) => setWarehouseDateStart(e.target.value)} /></label>
                <label className="field-card filter-date-card"><span className="field-label"><CalendarRange className="small-icon" />結束日期</span><input type="date" value={warehouseDateEnd} onChange={(e) => setWarehouseDateEnd(e.target.value)} /></label>
                <label className="field-card filter-status-card"><span className="field-label"><CreditCard className="small-icon" />收款狀態</span><select value={warehousePaymentFilter} onChange={(e) => setWarehousePaymentFilter(e.target.value)}><option value="全部">全部</option><option value="待收款">待收款</option><option value="已收款">已收款</option><option value="退款處理中">退款處理中</option></select></label>
                <label className="field-card filter-status-card"><span className="field-label"><Truck className="small-icon" />出貨狀態</span><select value={warehouseShippingFilter} onChange={(e) => setWarehouseShippingFilter(e.target.value)}><option value="全部">全部</option><option value="待出貨">待出貨</option><option value="理貨中">理貨中</option><option value="已出貨">已出貨</option><option value="換貨待出庫">換貨待出庫</option><option value="已退貨">已退貨</option></select></label>
              </div>
            </div>

            <div className="card order-panel warehouse-queue-card">
              <div className="panel-head compact-head">
                <div>
                  <div className="panel-title">訂單清單</div>
                  <div className="panel-desc">查看訂單後完成驗證與出貨。</div>
                </div>
                <Layers3 className="small-icon" />
              </div>
              <div className="shipping-queue">
                {pagedWarehouseQueue.map((item: any) => (
                  <div key={item.orderNo} className={`shipping-row-shell ${selectedWarehouseOrderNo === item.orderNo ? 'selected' : ''}`}>
                    <button type="button" className={`shipping-row accounting-select-row ${selectedWarehouseOrderNo === item.orderNo ? 'selected' : ''}`} onClick={() => setSelectedWarehouseOrderNo(item.orderNo)}>
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
                    <div className="mobile-row-action-group" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="mobile-row-action-trigger"
                        aria-label={`開啟 ${item.orderNo} 出貨資訊`}
                        onClick={() => openWarehouseActionPanel(item.orderNo)}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
                {!pagedWarehouseQueue.length && <div className="warehouse-empty-state">查無符合條件的訂單</div>}
              </div>
              <div className="pagination-row pagination-row-minimal pagination-row-angle">
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setShippingPage((page) => Math.max(1, page - 1))} disabled={shippingSafePage === 1} aria-label="上一頁">&lt;</button>
                <div className="pagination-pages">
                  {shippingPageNumbers.map((page) => (
                    <button key={page} type="button" className={`pagination-page ${shippingSafePage === page ? 'active' : ''}`} onClick={() => setShippingPage(page)}>{page}</button>
                  ))}
                </div>
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setShippingPage((page) => Math.min(shippingTotalPages, page + 1))} disabled={shippingSafePage === shippingTotalPages} aria-label="下一頁">&gt;</button>
              </div>
            </div>
          </div>

          <div className="warehouse-side warehouse-stack">
            {isMobileViewport && portalRoot
              ? mobileWarehousePanelOpen && createPortal((
            <>
            <div className={`cart-drawer-overlay mobile-modal-overlay ${mobileWarehousePanelOpen ? 'show' : ''}`} onClick={() => setMobileWarehousePanelOpen(false)} />
            <div className={`card order-panel sticky-panel warehouse-side-panel warehouse-command-panel mobile-modal-shell mobile-shared-layer-panel mobile-warehouse-editor ${mobileWarehousePanelOpen ? 'is-mobile-open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="warehouse-side-section mobile-modal-body">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨資訊</div>
                    <div className="flow-desc">查看驗證、出貨資料與狀態。</div>
                  </div>
                  <div className="warehouse-card-head-actions">
                    <button type="button" className="mobile-panel-close" onClick={() => setMobileWarehousePanelOpen(false)} aria-label="關閉出貨資訊"><X className="small-icon" /></button>
                  </div>
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

                <div className="warehouse-form-grid warehouse-command-fields">
                  <div className="fake-field"><span>訂單編號</span><strong>{selectedWarehouseOrder?.orderNo || '未選擇'}</strong></div>
                  <div className="fake-field"><span>出貨狀態</span><strong>{selectedWarehouseOrder?.shippingStatus || '-'}</strong></div>
                  <div className="fake-field"><span>收款狀態</span><strong>{selectedWarehouseOrder?.paymentStatus || '-'}</strong></div>
                  <div className="fake-field"><span>客戶</span><strong>{selectedWarehouseOrder?.customer || '-'}</strong></div>
                  <div className="fake-field scanner-inline-field"><span>商品條碼</span><strong><input value={warehouseScanBarcode} onChange={(e) => setWarehouseScanBarcode(e.target.value.toUpperCase())} placeholder={warehouseExpectedScan?.barcodeOptions?.length ? `例如 ${warehouseExpectedScan.barcodeOptions[0]}` : '請先選單'} /><button type="button" className="scan-inline-icon-btn" onClick={handleScanBarcodeLaunch} aria-label="掃描商品條碼"><QrCode className="small-icon" /></button></strong></div>
                  <div className="fake-field scanner-inline-field"><span>QR 身分識別</span><strong><input value={warehouseScanQr} onChange={(e) => setWarehouseScanQr(e.target.value.toUpperCase())} placeholder={warehouseExpectedScan?.qrOptions?.length ? `例如 ${warehouseExpectedScan.qrOptions[0]}` : '請先掃商品條碼'} /><button type="button" className="scan-inline-icon-btn" onClick={handleScanQrLaunch} aria-label="掃描 QR 身分識別"><QrCode className="small-icon" /></button></strong></div>
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
                    <Truck className="small-icon" />出貨
                  </button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseReturn}><RotateCcw className="small-icon" />退貨</button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseExchange}><RefreshCw className="small-icon" />換貨</button>
                  <button type="button" className="ghost-button print-icon-button" onClick={handleWarehousePrint}><img src={printerSymbol} alt="列印" className="print-symbol-icon" />列印</button>
                </div>
                {warehouseNotice && <div className={`inline-action-notice ${warehouseNotice.tone}`}><strong>{warehouseNotice.text}</strong></div>}
              </div>
            </div>
            </>

              ), portalRoot)
              : (
            <div className={`card order-panel sticky-panel warehouse-side-panel warehouse-command-panel mobile-modal-shell mobile-shared-layer-panel mobile-warehouse-editor ${mobileWarehousePanelOpen ? 'is-mobile-open' : ''}`}>
              <div className="warehouse-side-section mobile-modal-body">
                <div className="warehouse-card-head">
                  <div>
                    <div className="flow-title">出貨資訊</div>
                    <div className="flow-desc">查看驗證、出貨資料與狀態。</div>
                  </div>
                  <div className="warehouse-card-head-actions">
                    <button type="button" className="mobile-panel-close" onClick={() => setMobileWarehousePanelOpen(false)} aria-label="關閉出貨資訊"><X className="small-icon" /></button>
                  </div>
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

                <div className="warehouse-form-grid warehouse-command-fields">
                  <div className="fake-field"><span>訂單編號</span><strong>{selectedWarehouseOrder?.orderNo || '未選擇'}</strong></div>
                  <div className="fake-field"><span>出貨狀態</span><strong>{selectedWarehouseOrder?.shippingStatus || '-'}</strong></div>
                  <div className="fake-field"><span>收款狀態</span><strong>{selectedWarehouseOrder?.paymentStatus || '-'}</strong></div>
                  <div className="fake-field"><span>客戶</span><strong>{selectedWarehouseOrder?.customer || '-'}</strong></div>
                  <div className="fake-field scanner-inline-field"><span>商品條碼</span><strong><input value={warehouseScanBarcode} onChange={(e) => setWarehouseScanBarcode(e.target.value.toUpperCase())} placeholder={warehouseExpectedScan?.barcodeOptions?.length ? `例如 ${warehouseExpectedScan.barcodeOptions[0]}` : '請先選單'} /><button type="button" className="scan-inline-icon-btn" onClick={handleScanBarcodeLaunch} aria-label="掃描商品條碼"><QrCode className="small-icon" /></button></strong></div>
                  <div className="fake-field scanner-inline-field"><span>QR 身分識別</span><strong><input value={warehouseScanQr} onChange={(e) => setWarehouseScanQr(e.target.value.toUpperCase())} placeholder={warehouseExpectedScan?.qrOptions?.length ? `例如 ${warehouseExpectedScan.qrOptions[0]}` : '請先掃商品條碼'} /><button type="button" className="scan-inline-icon-btn" onClick={handleScanQrLaunch} aria-label="掃描 QR 身分識別"><QrCode className="small-icon" /></button></strong></div>
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
                    <Truck className="small-icon" />出貨
                  </button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseReturn}><RotateCcw className="small-icon" />退貨</button>
                  <button type="button" className="ghost-button compact-btn" onClick={handleWarehouseExchange}><RefreshCw className="small-icon" />換貨</button>
                  <button type="button" className="ghost-button print-icon-button" onClick={handleWarehousePrint}><img src={printerSymbol} alt="列印" className="print-symbol-icon" />列印</button>
                </div>
                {warehouseNotice && <div className={`inline-action-notice ${warehouseNotice.tone}`}><strong>{warehouseNotice.text}</strong></div>}
              </div>
            </div>

              )}
          </div>
        </section>
      )}

      {warehouseTab === 'stock' && (
        <section className="warehouse-stack-section warehouse-stock-shell">
          <div className="card order-panel warehouse-stock-overview-card">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">庫存商品清單</div>
              </div>
              <span className="badge badge-soft">共 {stockSnapshot.length} 項</span>
            </div>

            <div className="warehouse-stock-grid compact warehouse-stock-card-grid">
              {stockSnapshot.map((item: any) => (
                <div key={item.code} className={`stock-snapshot-shell ${selectedStockCode === item.code ? 'selected' : ''}`}>
                <button type="button" className={`card stock-snapshot-card compact accounting-select-row ${selectedStockCode === item.code ? 'selected' : ''}`} onClick={() => setSelectedStockCode(item.code)}>
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
                <div className="mobile-row-action-group stock-action-group" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="mobile-row-action-trigger"
                    aria-label={`開啟 ${item.name} 操作`}
                    onClick={() => openStockActionPanel(item.code)}
                  >›</button>
                </div>
                </div>
              ))}
            </div>
          </div>

          {isMobileViewport && portalRoot
            ? mobileInboundPanelOpen && createPortal((
          <div className={`card warehouse-tool-card warehouse-inbound-card mobile-modal-shell mobile-shared-layer-panel mobile-inbound-editor ${mobileInboundPanelOpen ? 'is-mobile-open' : ''}`}>
            <div className="warehouse-side-section mobile-modal-body">
              <div className="warehouse-card-head"><div><div className="flow-title">入庫作業</div></div><div className="warehouse-card-head-actions"><Boxes className="small-icon" /><button type="button" className="mobile-panel-close" onClick={() => setMobileInboundPanelOpen(false)} aria-label="關閉入庫作業"><X className="small-icon" /></button></div></div>
              <div className="warehouse-form-grid warehouse-command-fields">
                <div className="fake-field"><span>商品條碼</span><strong>{selectedStockItem?.code || '-'}</strong></div>
                <div className="fake-field"><span>商品名稱</span><strong>{selectedStockItem?.name || '-'}</strong></div>
                <div className="fake-field"><span>目前庫存</span><strong>{selectedStockItem?.stock || '-'}</strong></div>
                <div className="fake-field"><span>安全庫存</span><strong>{selectedStockItem?.safe || '-'}</strong></div>
                <div className="fake-field wide"><span>QR 摘要</span><strong>{selectedStockItem?.qr || '-'}</strong></div>
                <div className="fake-field scanner-inline-field"><span>入庫 QR</span><strong><input value={warehouseInboundQr} onChange={(e) => setWarehouseInboundQr(e.target.value)} placeholder="輸入入庫 QR" /><button type="button" className="scan-inline-icon-btn" onClick={handleInboundQrLaunch} aria-label="掃描入庫 QR"><QrCode className="small-icon" /></button></strong></div>
                <div className="fake-field"><span>入庫數量</span><strong><input type="number" min={1} value={warehouseInboundQty} onChange={(e) => setWarehouseInboundQty(Math.max(1, Number(e.target.value) || 1))} /></strong></div>
                <div className="fake-field wide"><span>最近異動</span><strong>{selectedStockItem?.updated || '-'}</strong></div>
              </div>
            </div>
            <div className="warehouse-side-section">
              <div className="accounting-action-row warehouse-action-row">
                <button type="button" className="primary-button" onClick={handleWarehouseInbound}><Boxes className="small-icon" />寫入入庫紀錄</button>
                <button type="button" className="ghost-button" onClick={() => setWarehouseTab('query')}><Search className="small-icon" />去查詢區核對</button>
              </div>
              {warehouseNotice && <div className={`inline-action-notice ${warehouseNotice.tone}`}><strong>{warehouseNotice.text}</strong></div>}
            </div>
          </div>


            ), portalRoot)
            : (
          <div className={`card warehouse-tool-card warehouse-inbound-card mobile-modal-shell mobile-shared-layer-panel mobile-inbound-editor ${mobileInboundPanelOpen ? 'is-mobile-open' : ''}`}>
            <div className="warehouse-side-section mobile-modal-body">
              <div className="warehouse-card-head"><div><div className="flow-title">入庫作業</div></div><div className="warehouse-card-head-actions"><Boxes className="small-icon" /><button type="button" className="mobile-panel-close" onClick={() => setMobileInboundPanelOpen(false)} aria-label="關閉入庫作業"><X className="small-icon" /></button></div></div>
              <div className="warehouse-form-grid warehouse-command-fields">
                <div className="fake-field"><span>商品條碼</span><strong>{selectedStockItem?.code || '-'}</strong></div>
                <div className="fake-field"><span>商品名稱</span><strong>{selectedStockItem?.name || '-'}</strong></div>
                <div className="fake-field"><span>目前庫存</span><strong>{selectedStockItem?.stock || '-'}</strong></div>
                <div className="fake-field"><span>安全庫存</span><strong>{selectedStockItem?.safe || '-'}</strong></div>
                <div className="fake-field wide"><span>QR 摘要</span><strong>{selectedStockItem?.qr || '-'}</strong></div>
                <div className="fake-field scanner-inline-field"><span>入庫 QR</span><strong><input value={warehouseInboundQr} onChange={(e) => setWarehouseInboundQr(e.target.value)} placeholder="輸入入庫 QR" /><button type="button" className="scan-inline-icon-btn" onClick={handleInboundQrLaunch} aria-label="掃描入庫 QR"><QrCode className="small-icon" /></button></strong></div>
                <div className="fake-field"><span>入庫數量</span><strong><input type="number" min={1} value={warehouseInboundQty} onChange={(e) => setWarehouseInboundQty(Math.max(1, Number(e.target.value) || 1))} /></strong></div>
                <div className="fake-field wide"><span>最近異動</span><strong>{selectedStockItem?.updated || '-'}</strong></div>
              </div>
            </div>
            <div className="warehouse-side-section">
              <div className="accounting-action-row warehouse-action-row">
                <button type="button" className="primary-button" onClick={handleWarehouseInbound}><Boxes className="small-icon" />寫入入庫紀錄</button>
                <button type="button" className="ghost-button" onClick={() => setWarehouseTab('query')}><Search className="small-icon" />去查詢區核對</button>
              </div>
              {warehouseNotice && <div className={`inline-action-notice ${warehouseNotice.tone}`}><strong>{warehouseNotice.text}</strong></div>}
            </div>
          </div>


            )}

          <div className="card order-panel warehouse-log-shell">
            <div className="panel-head compact-head"><div><div className="panel-title">最近異動紀錄</div></div></div>
            <div className="warehouse-log-list">
              {pagedWarehouseRecentLogs.map((item: any) => (
                <div key={`${item.time}-${item.type}-${item.note}`} className="warehouse-log-item">
                  <div className="warehouse-log-time">{item.time}</div>
                  <div><div className="warehouse-log-type">{item.type}</div><div className="warehouse-log-note">{item.note}</div></div>
                </div>
              ))}
            </div>
            <div className="pagination-row pagination-row-minimal pagination-row-angle">
              <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setWarehouseLogPage((page) => Math.max(1, page - 1))} disabled={warehouseLogSafePage === 1} aria-label="上一頁">&lt;</button>
              <div className="pagination-pages">
                <button type="button" className="pagination-page active">{warehouseLogSafePage}</button>
              </div>
              <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setWarehouseLogPage((page) => Math.min(warehouseLogTotalPages, page + 1))} disabled={warehouseLogSafePage === warehouseLogTotalPages} aria-label="下一頁">&gt;</button>
            </div>
          </div>
        </section>
      )}

      {warehouseTab === 'query' && (
        <section className="warehouse-stack-section warehouse-query-shell">
          <div className="warehouse-query-grid warehouse-query-examples-grid">
            {queryExamples.map((item: any) => <div key={item.label} className="card query-card"><div className="query-label">{item.label}</div><div className="query-value">{item.value}</div></div>)}
          </div>

          <div className="warehouse-tool-grid warehouse-query-panels">
            <div className="card warehouse-tool-card">
              <div className="warehouse-card-head"><div><div className="flow-title">庫存查詢</div></div><Search className="small-icon" /></div>

              <div className="warehouse-form-grid">
                <div className="fake-field wide scanner-inline-field"><span>查詢條件</span><strong><input value={warehouseQueryInput} onChange={(e) => setWarehouseQueryInput(e.target.value)} placeholder="輸入商品條碼 / QR 身分識別 / 訂單編號" /><button type="button" className="scan-inline-icon-btn" onClick={handleQueryScanLaunch} aria-label="掃描查詢條件"><QrCode className="small-icon" /></button></strong></div>
              </div>
              <div className="accounting-action-row">
                <button type="button" className="primary-button" onClick={() => runWarehouseQuery()}><Search className="small-icon" />立即查詢</button>
                              </div>
              {warehouseNotice && <div className={`inline-action-notice ${warehouseNotice.tone}`}><strong>{warehouseNotice.text}</strong></div>}
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

import { CreditCard, BarChart3, Trophy, Search, CalendarRange, Truck, Receipt, User, Wallet, BadgePercent, FileText, RefreshCw } from 'lucide-react';

export default function AccountingModule(props: any) {
  const {
    paymentQueue, accountingSummary, accountingTab, setAccountingTab,
    filteredAccountingQueue, accountingOpsTotal,
    accountingKeyword, setAccountingKeyword,
    accountingPaymentFilter, setAccountingPaymentFilter,
    accountingShippingFilter, setAccountingShippingFilter,
    accountingDateStart, setAccountingDateStart,
    accountingDateEnd, setAccountingDateEnd,
    accountingNotice, selectedAccountingRecord, accountingDraft, updateAccountingDraftField, saveAccountingDraft,
    triggerAccountingAction, selectAccountingOrder,
    accountingBoards, accountingTrendBars, salesRanking, hotProductsBoard,
    SectionIntro, SummaryCard,
  } = props;

  return (
    <>
      <SectionIntro
        title="會計中心骨架"
        desc="這一步改成更接近實際後台的三分頁：收款 / 退款作業、銷售統計、排行榜 / 熱銷。版位命名直接對齊你後面要接的 GAS 會計邏輯。"
        stats={[`待收款 ${paymentQueue.filter((item: any) => item.paymentStatus === '待收款').length} 筆`, '已收款 / 已退款 防呆位', '報表 / 排行榜骨架']}
      />

      <div className="accounting-tab-row">
        <button type="button" className={`accounting-tab ${accountingTab === 'ops' ? 'active' : ''}`} onClick={() => setAccountingTab('ops')}><CreditCard className="small-icon" />收款 / 退款作業</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'stats' ? 'active' : ''}`} onClick={() => setAccountingTab('stats')}><BarChart3 className="small-icon" />銷售統計</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'ranking' ? 'active' : ''}`} onClick={() => setAccountingTab('ranking')}><Trophy className="small-icon" />排行榜 / 熱銷</button>
      </div>

      {accountingTab === 'ops' && (
        <>
          <section className="two-column-grid accounting-top-grid">
            <div className="card order-panel">
              <div className="panel-head"><div><div className="panel-title">收款 / 退款作業</div><div className="panel-desc">先把會計最常用的查詢、狀態篩選、收款證明入口整理好。</div></div><span className="badge badge-role">作業入口</span></div>
              <div className="accounting-filter-grid">
                <label className="field-card field-span-2"><span className="field-label"><Search className="small-icon" />搜尋訂單 / 客戶 / 發票</span><input value={accountingKeyword} onChange={(e) => setAccountingKeyword(e.target.value)} placeholder="輸入訂單編號、客戶、收款方式、發票號碼" /></label>
                <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />起算日</span><input type="date" value={accountingDateStart} onChange={(e) => setAccountingDateStart(e.target.value)} /></label>
                <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />結算日</span><input type="date" value={accountingDateEnd} onChange={(e) => setAccountingDateEnd(e.target.value)} /></label>
                <label className="field-card"><span className="field-label"><CreditCard className="small-icon" />款項狀態</span><select value={accountingPaymentFilter} onChange={(e) => setAccountingPaymentFilter(e.target.value)}><option value="全部">全部</option><option value="待收款">待收款</option><option value="已收款">已收款</option><option value="退款處理中">退款處理中</option></select></label>
                <label className="field-card"><span className="field-label"><Truck className="small-icon" />商品狀態</span><select value={accountingShippingFilter} onChange={(e) => setAccountingShippingFilter(e.target.value)}><option value="全部">全部</option><option value="待出貨">待出貨</option><option value="理貨中">理貨中</option><option value="換貨待出庫">換貨待出庫</option></select></label>
              </div>
              <div className="accounting-proof-grid">
                <div className="accounting-proof-card"><div className="accounting-proof-title">收據上傳</div><div className="accounting-proof-desc">保留收據、轉帳證明與對帳附件位置</div></div>
                <div className="accounting-proof-card"><div className="accounting-proof-title">匯款截圖</div><div className="accounting-proof-desc">之後直接接照片上傳或檔案上傳</div></div>
                <div className="accounting-proof-card"><div className="accounting-proof-title">AI 辨識位</div><div className="accounting-proof-desc">預留辨識結果與人工覆核顯示區</div></div>
              </div>
              {accountingNotice && <div className={`card product-notice-banner ${accountingNotice.tone} accounting-notice-banner`}><strong>{accountingNotice.text}</strong></div>}
            </div>

            <div className="card order-panel">
              <div className="panel-head compact-head"><div><div className="panel-title">本次選取單</div><div className="panel-desc">先固定你要的結算欄位，不碰原本邏輯。</div></div></div>
              <div className="form-grid two-col accounting-form-grid">
                <label className="field-card"><span className="field-label"><Receipt className="small-icon" />訂單編號</span><input value={accountingDraft?.orderNo || ''} readOnly /></label>
                <label className="field-card"><span className="field-label"><User className="small-icon" />客戶姓名</span><input value={accountingDraft?.customer || ''} onChange={(e) => updateAccountingDraftField('customer', e.target.value)} placeholder="可直接修正客戶姓名" /></label>
                <label className="field-card"><span className="field-label"><Wallet className="small-icon" />未稅價</span><input value={accountingDraft?.untaxedAmount || ''} onChange={(e) => updateAccountingDraftField('untaxedAmount', e.target.value)} inputMode="decimal" /></label>
                <label className="field-card"><span className="field-label"><BadgePercent className="small-icon" />應稅價 %</span><input value={accountingDraft?.taxRate || ''} onChange={(e) => updateAccountingDraftField('taxRate', e.target.value)} inputMode="decimal" /></label>
                <label className="field-card"><span className="field-label"><Truck className="small-icon" />運費</span><input value={accountingDraft?.shippingFee || ''} onChange={(e) => updateAccountingDraftField('shippingFee', e.target.value)} inputMode="decimal" /></label>
                <label className="field-card"><span className="field-label"><CreditCard className="small-icon" />實收總額</span><input value={accountingDraft?.actualReceived || ''} onChange={(e) => updateAccountingDraftField('actualReceived', e.target.value)} inputMode="decimal" /></label>
                <label className="field-card"><span className="field-label"><Wallet className="small-icon" />付款方式</span><input value={accountingDraft?.paymentMethod || ''} onChange={(e) => updateAccountingDraftField('paymentMethod', e.target.value)} placeholder="例如：銀行轉帳" /></label>
                <label className="field-card"><span className="field-label"><FileText className="small-icon" />發票 / 單號</span><input value={accountingDraft?.invoiceNo || ''} onChange={(e) => updateAccountingDraftField('invoiceNo', e.target.value)} placeholder="可填發票或退款單號" /></label>
                <label className="field-card field-span-2"><span className="field-label"><FileText className="small-icon" />收款證明 / 備註</span><textarea rows={4} value={accountingDraft?.proof || ''} onChange={(e) => updateAccountingDraftField('proof', e.target.value)} placeholder="可填收款證明、備註、人工確認資訊" /></label>
              </div>
              <div className="accounting-sync-card">
                <div className="accounting-sync-title">流程狀態提醒</div>
                <div className="accounting-sync-desc">
                  {selectedAccountingRecord?.paymentStatus === '已收款'
                    ? '此單已收款，倉儲端會依訂單狀態顯示可出貨。'
                    : selectedAccountingRecord?.paymentStatus?.includes('退款')
                      ? '此單處於退款流程，倉儲端不可出貨。'
                      : '這筆訂單尚未收款，確認收款後只更新訂單狀態，不自動跳頁。'}
                </div>
              </div>
              <div className="accounting-action-row">
                <button type="button" className="ghost-button compact-btn" onClick={saveAccountingDraft}><FileText className="small-icon" />儲存本次訂單</button>
                <button type="button" className="primary-button" onClick={() => triggerAccountingAction('pay')}><CreditCard className="small-icon" />確認收款</button>
                <button type="button" className="ghost-button compact-btn" onClick={() => triggerAccountingAction('refund')}><RefreshCw className="small-icon" />確認退款</button>
              </div>
            </div>
          </section>

          <section className="card order-panel">
            <div className="panel-head"><div><div className="panel-title">訂單紀錄 / 收款狀態</div><div className="panel-desc">這裡開始承接會計操作邏輯，已可用關鍵字與狀態做前端篩選。</div></div><span className="badge badge-soft">共 {filteredAccountingQueue.length} 筆 / 金額 ${accountingOpsTotal}</span></div>
            <div className="shipping-queue accounting-queue">
              {filteredAccountingQueue.map((item: any) => (
                <button key={item.orderNo} type="button" className={`shipping-row accounting-row accounting-select-row ${selectedAccountingRecord?.orderNo === item.orderNo ? 'selected' : ''}`} onClick={() => selectAccountingOrder(item.orderNo)}>
                  <div>
                    <div className="shipping-order">{item.orderNo}</div>
                    <div className="shipping-meta">{item.customer} / {item.date} / {item.paymentMethod} / 發票 {item.invoiceNo}</div>
                    <div className="shipping-meta">運費 ${item.shippingFee} / 稅率 {item.taxRate}% / 證明：{item.proof}</div>
                  </div>
                  <div className="shipping-actions accounting-statuses">
                    <span className={`badge ${item.paymentStatus === '已收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                    <span className={`badge ${item.shippingStatus.includes('待') ? 'badge-danger' : item.shippingStatus.includes('理貨') ? 'badge-soft' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                    <strong className="accounting-amount">${item.amount}</strong>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {accountingTab === 'stats' && (
        <section className="accounting-stats-grid">
          <div className="card order-panel">
            <div className="panel-head"><div><div className="panel-title">銷售統計</div><div className="panel-desc">把會議會看到的摘要放在同一區，後面直接承接 sales_report。</div></div><span className="badge badge-role">報表摘要</span></div>
            <div className="accounting-stat-cards">
              {accountingBoards[1].bullets.map((item: string) => <div key={item} className="accounting-mini-card"><div className="accounting-mini-title">{item}</div><div className="accounting-mini-value">{item === '區間營收' ? '$128,600' : item === '稅金總額' ? '$6,430' : '$3,120'}</div></div>)}
              <div className="accounting-mini-card accent"><div className="accounting-mini-title">毛利</div><div className="accounting-mini-value">$18,420</div></div>
            </div>
            <div className="accounting-breakdown-list">
              <div className="accounting-breakdown-item"><span>已收款占比</span><strong>74%</strong></div>
              <div className="accounting-breakdown-item"><span>待收款占比</span><strong>22%</strong></div>
              <div className="accounting-breakdown-item"><span>退款占比</span><strong>4%</strong></div>
            </div>
          </div>

          <div className="accounting-stats-side">
            <div className="card order-panel">
              <div className="panel-head compact-head"><div><div className="panel-title">營收趨勢</div><div className="panel-desc">先把圖表區的閱讀節奏定好，後面直接接真資料。</div></div></div>
              <div className="trend-chart">
                {accountingTrendBars.map((item: any) => <div key={item.label} className="trend-bar-col"><div className="trend-bar-wrap"><div className="trend-bar" style={{ height: `${item.value}%` }} /></div><span>{item.label}</span></div>)}
              </div>
            </div>
            <div className="card order-panel"><div className="panel-head compact-head"><div><div className="panel-title">報表提醒</div><div className="panel-desc">延續你現在的 GAS 規則。</div></div></div><div className="stack-list compact"><div>退款與退貨都要同步反扣毛利</div><div>運費要獨立統計，不與商品銷售額混算</div><div>已收款才納入正式營收統計</div></div></div>
          </div>
        </section>
      )}

      {accountingTab === 'ranking' && (
        <section className="three-column-grid accounting-ranking-grid">
          <div className="card order-panel"><div className="panel-head compact-head"><div><div className="panel-title">銷售排行</div><div className="panel-desc">後面可直接接你的人員業績與退款扣回邏輯。</div></div></div><div className="ranking-list">{salesRanking.map((item: any, idx: number) => <div key={item.name} className="ranking-item"><div className="ranking-badge">#{idx + 1}</div><div className="ranking-main"><div className="ranking-name">{item.name}</div><div className="ranking-meta">{item.meta}</div></div><div className="ranking-value">{item.value}</div></div>)}</div></div>
          <div className="card order-panel"><div className="panel-head compact-head"><div><div className="panel-title">熱銷商品</div><div className="panel-desc">之後直接接商品統計與銷售件數。</div></div></div><div className="ranking-list">{hotProductsBoard.map((item: any, idx: number) => <div key={item.name} className="ranking-item"><div className="ranking-badge">#{idx + 1}</div><div className="ranking-main"><div className="ranking-name">{item.name}</div><div className="ranking-meta">{item.meta}</div></div><div className="ranking-value">{item.value}</div></div>)}</div></div>
          <div className="card order-panel"><div className="panel-head compact-head"><div><div className="panel-title">排行規則提醒</div><div className="panel-desc">保留後續接真資料時的判讀規則。</div></div></div><div className="stack-list compact"><div>排行榜要扣除退款 / 退貨影響</div><div>熱銷商品可延伸到會計與倉儲共用</div><div>報表區之後直接承接 sales_report</div><div>會計中心維持獨立子頁結構</div></div></div>
        </section>
      )}
    </>
  );
}

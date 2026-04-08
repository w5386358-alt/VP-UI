import { CreditCard, BarChart3, Trophy, Search, CalendarRange, Truck, Receipt, User, Wallet, BadgePercent, FileText, RefreshCw, ArrowUpRight, Sparkles, ShieldCheck, Clock3 } from 'lucide-react';

export default function AccountingModule(props: any) {
  const {
    paymentQueue, accountingSummary, accountingTab, setAccountingTab,
    filteredAccountingQueue, accountingOpsTotal,
    accountingKeyword, setAccountingKeyword,
    accountingPaymentFilter, setAccountingPaymentFilter,
    accountingShippingFilter, setAccountingShippingFilter,
    accountingDateStart, setAccountingDateStart,
    accountingDateEnd, setAccountingDateEnd,
    accountingNotice, selectedAccountingRecord, selectedAccountingSourceRecord, accountingDraft, accountingTaxAmount, accountingActualReceived, updateAccountingDraftField, saveAccountingDraft,
    triggerAccountingAction, selectAccountingOrder,
    handleAccountingProofUpload, accountingProofInputRef,
    accountingBoards, accounting趨勢Bars, sales排行, hotProductsBoard,
    SectionIntro,
  } = props;

  const pendingCount = paymentQueue.filter((item: any) => item.paymentStatus === '待收款').length;
  const receivedCount = paymentQueue.filter((item: any) => item.paymentStatus === '已收款').length;

  return (
    <>
      <SectionIntro
        title="會計"
        desc="集中處理收款、退款、報表與排行。"
        stats={[`待收款 ${pendingCount} 筆`, `已收款 ${receivedCount} 筆`, '報表 / 排名 / 熱銷']}
      />

      <section className="accounting-shell-v2">
        <div className="accounting-command-card card">
          <div>
            <div className="accounting-command-kicker">會計主控</div>
            <h3 className="accounting-command-title">收款、退款與統計集中在同一區。</h3>
            <p className="accounting-command-desc"></p>
          </div>
          <div className="accounting-command-metrics">
            <div className="accounting-command-pill"><span>待處理</span><strong>{pendingCount}</strong></div>
            <div className="accounting-command-pill"><span>本區金額</span><strong>${accountingOpsTotal}</strong></div>
            <div className="accounting-command-pill accent"><span>已選訂單</span><strong>{selectedAccountingRecord?.orderNo || '未選擇'}</strong></div>
          </div>
        </div>

        <div className="accounting-tab-row accounting-tab-row-v2">
          <button type="button" className={`accounting-tab ${accountingTab === 'ops' ? 'active' : ''}`} onClick={() => setAccountingTab('ops')}><CreditCard className="small-icon" />收款 / 退款作業</button>
          <button type="button" className={`accounting-tab ${accountingTab === 'stats' ? 'active' : ''}`} onClick={() => setAccountingTab('stats')}><BarChart3 className="small-icon" />銷售統計</button>
          <button type="button" className={`accounting-tab ${accountingTab === 'ranking' ? 'active' : ''}`} onClick={() => setAccountingTab('ranking')}><Trophy className="small-icon" />排名 / 熱銷</button>
        </div>

        {accountingTab === 'ops' && (
          <section className="accounting-ops-layout-v2">
            <div className="accounting-ops-top">
              <div className="card order-panel accounting-filter-card-v2">
                <div className="panel-head">
                  <div><div className="panel-title">收款篩選台</div></div>
                  <span className="badge badge-role">篩選</span>
                </div>
                <div className="accounting-filter-grid accounting-filter-grid-v2">
                  <label className="field-card field-span-2"><span className="field-label"><Search className="small-icon" />搜尋訂單 / 客戶 / 發票</span><input value={accountingKeyword} onChange={(e) => setAccountingKeyword(e.target.value)} placeholder="輸入訂單編號、客戶、收款方式、發票號碼" /></label>
                  <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />開始日期</span><input type="date" value={accountingDateStart} onChange={(e) => setAccountingDateStart(e.target.value)} /></label>
                  <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />結束日期</span><input type="date" value={accountingDateEnd} onChange={(e) => setAccountingDateEnd(e.target.value)} /></label>
                  <label className="field-card"><span className="field-label"><CreditCard className="small-icon" />收款狀態</span><select value={accountingPaymentFilter} onChange={(e) => setAccountingPaymentFilter(e.target.value)}><option value="全部">全部</option><option value="待收款">待收款</option><option value="已收款">已收款</option><option value="退款處理中">退款處理中</option></select></label>
                  <label className="field-card"><span className="field-label"><Truck className="small-icon" />出貨狀態</span><select value={accountingShippingFilter} onChange={(e) => setAccountingShippingFilter(e.target.value)}><option value="全部">全部</option><option value="待出貨">待出貨</option><option value="理貨中">理貨中</option><option value="換貨待出庫">換貨待出庫</option></select></label>
                </div>
              </div>

              <aside className="accounting-ops-side">
                <div className="card order-panel accounting-console-card-v2 sticky-panel">
                  <div className="panel-head compact-head"><div><div className="panel-title">本次選取單</div></div><span className="badge badge-role">明細</span></div>
                  <div className="accounting-console-overview">
                    <div className="accounting-console-mini"><span>訂單</span><strong>{accountingDraft?.orderNo || '未選擇'}</strong></div>
                    <div className="accounting-console-mini"><span>客戶</span><strong>{accountingDraft?.customer || '-'}</strong></div>
                    <div className="accounting-console-mini accent"><span>實收總額</span><strong>${accountingActualReceived || 0}</strong></div>
                  </div>
                  <div className="form-grid two-col accounting-form-grid">
                    <label className="field-card"><span className="field-label"><Wallet className="small-icon" />未稅價</span><input value={accountingDraft?.untaxedAmount || ''} readOnly /></label>
                    <label className="field-card"><span className="field-label"><BadgePercent className="small-icon" />稅率 %</span><input value={accountingDraft?.taxRate || ''} onChange={(e) => updateAccountingDraftField('taxRate', e.target.value)} inputMode="decimal" /></label>
                    <label className="field-card"><span className="field-label"><BadgePercent className="small-icon" />應稅金額</span><input value={String(accountingTaxAmount || 0)} readOnly /></label>
                    <label className="field-card"><span className="field-label"><Truck className="small-icon" />運費</span><input value={accountingDraft?.shippingFee || ''} onChange={(e) => updateAccountingDraftField('shippingFee', e.target.value)} inputMode="decimal" /></label>
                    <label className="field-card"><span className="field-label"><Wallet className="small-icon" />付款方式</span><select value={accountingDraft?.paymentMethod || ''} onChange={(e) => updateAccountingDraftField('paymentMethod', e.target.value)}><option value="待確認">待確認</option><option value="銀行轉帳">銀行轉帳</option><option value="LINE Pay">LINE Pay</option><option value="現金">現金</option><option value="信用卡">信用卡</option><option value="其他">其他</option></select></label>
                    <label className="field-card"><span className="field-label"><FileText className="small-icon" />發票 / 單號</span><input value={accountingDraft?.invoiceNo || ''} onChange={(e) => updateAccountingDraftField('invoiceNo', e.target.value)} placeholder="輸入發票或退款單號" /></label>
                    <label className="field-card field-span-2"><span className="field-label"><FileText className="small-icon" />收款證明 / 備註</span><textarea rows={4} value={accountingDraft?.proof || ''} onChange={(e) => updateAccountingDraftField('proof', e.target.value)} placeholder="輸入收款備註" /></label>
                  </div>
                  <div className="accounting-proof-grid accounting-proof-grid-v2">
                    <button type="button" className="accounting-proof-card interactive" onClick={() => accountingProofInputRef?.current?.click()}><Receipt className="small-icon" /><div><div className="accounting-proof-title">收款證明</div></div></button>
                    <div className="accounting-proof-card"><ShieldCheck className="small-icon" /><div><div className="accounting-proof-title">AI 辨識</div></div></div>
                    <div className="accounting-proof-card"><Clock3 className="small-icon" /><div><div className="accounting-proof-title">最新狀態</div><div className="accounting-proof-desc">{selectedAccountingSourceRecord?.paymentStatus || '未選擇'}</div></div></div>
                  </div>
                  <input ref={accountingProofInputRef} type="file" accept="image/*,.pdf" className="hidden-file-input" onChange={(e) => handleAccountingProofUpload(e.target.files?.[0] || null)} />
                  <div className="accounting-action-row accounting-action-row-v2">
                    <button type="button" className="primary-button" onClick={saveAccountingDraft}><RefreshCw className="small-icon" />保存資料</button>
                    <button type="button" className="ghost-button compact-btn" onClick={() => triggerAccountingAction('receive')}><CreditCard className="small-icon" />確認收款</button>
                    <button type="button" className="ghost-button compact-btn" onClick={() => triggerAccountingAction('refund')}><Receipt className="small-icon" />確認退款</button>
                  </div>
                  {accountingNotice && <div className={`inline-action-notice ${accountingNotice.tone}`}><strong>{accountingNotice.text}</strong></div>}
                </div>
              </aside>
            </div>

            <div className="card order-panel accounting-queue-card-v2">
              <div className="panel-head accounting-inline-records-head"><div><div className="panel-title">訂單紀錄 / 收款狀態</div></div><span className="badge badge-soft">共 {filteredAccountingQueue.length} 筆 / 金額 ${accountingOpsTotal}</span></div>
              <div className="shipping-queue accounting-queue accounting-queue-v2">
                {filteredAccountingQueue.map((item: any) => (
                  <button key={item.orderNo} type="button" className={`shipping-row accounting-row accounting-select-row ${selectedAccountingRecord?.orderNo === item.orderNo ? 'selected' : ''}`} onClick={() => selectAccountingOrder(item.orderNo)}>
                    <div>
                      <div className="shipping-order">{item.orderNo}</div>
                      <div className="shipping-meta">{item.customer} / {item.date} / {item.paymentMethod} / 發票 {item.invoiceNo}</div>
                      <div className="shipping-meta">運費 ${item.shippingFee} / 稅率 {item.taxRate}% / 證明：{item.proof}</div>
                    </div>
                    <div className="shipping-actions accounting-statuses">
                      <span className={`badge ${item.paymentStatus === '已收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                      <span className={`badge ${item.shippingStatus === '待出貨' || item.shippingStatus === '已退款' ? 'badge-danger' : item.shippingStatus.includes('理貨') ? 'badge-soft' : item.shippingStatus === '已出貨' ? 'badge-success' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                      <strong className="accounting-amount">${item.amount}</strong>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {accountingTab === 'stats' && (
          <section className="accounting-stats-layout-v2">
            <div className="accounting-stats-main">
              <div className="accounting-board-grid-v2">
                {accountingBoards.map((item: any) => (
                  <div key={item.title} className="card accounting-board-card-v2">
                    <div className="accounting-board-kicker">{item.title}</div>
                    <div className="accounting-board-value">{item.value}</div>
                    <div className="accounting-board-sub">{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="card order-panel accounting-trend-card-v2">
                <div className="panel-head"><div><div className="panel-title">區間營收趨勢</div><div className="panel-desc">先保留圖表區塊與節奏，再接真報表。</div></div><span className="badge badge-soft">趨勢</span></div>
                <div className="accounting-trend-list-v2">
                  {accounting趨勢Bars.map((item: any) => (
                    <div key={item.label} className="accounting-trend-item-v2">
                      <div className="accounting-trend-top"><span>{item.label}</span><strong>${item.value}</strong></div>
                      <div className="accounting-trend-track"><div className="accounting-trend-fill" style={{ width: `${item.width}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="accounting-stats-side">
              <div className="card accounting-insight-card-v2">
                <Sparkles className="small-icon" />
                <div className="accounting-insight-title">營運摘要</div>
                <div className="stack-list compact"><div>收款區與出納區未來可再拆更細</div><div>報表先保留高階區塊</div><div>這版先把資訊層級做出來</div></div>
              </div>
            </div>
          </section>
        )}

        {accountingTab === 'ranking' && (
          <section className="accounting-ranking-layout-v2">
            <div className="card order-panel">
              <div className="panel-head"><div><div className="panel-title">人員排名</div><div className="panel-desc">先做排行榜主區塊。</div></div><span className="badge badge-role">排行</span></div>
              <div className="ranking-list-v2">
                {sales排行.map((item: any, index: number) => (
                  <div key={item.name} className="ranking-row-v2">
                    <div className="ranking-left"><div className="ranking-index">#{index + 1}</div><div><div className="ranking-name">{item.name}</div><div className="ranking-meta">{item.role}</div></div></div>
                    <div className="ranking-right"><strong>${item.amount}</strong><span>{item.orders} 筆</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card order-panel">
              <div className="panel-head"><div><div className="panel-title">熱銷商品</div><div className="panel-desc">與排行分開，避免視覺混在一起。</div></div><span className="badge badge-soft">熱銷</span></div>
              <div className="ranking-list-v2 hot-product-list-v2">
                {hotProductsBoard.map((item: any) => (
                  <div key={item.name} className="ranking-row-v2">
                    <div className="ranking-left"><ArrowUpRight className="small-icon" /><div><div className="ranking-name">{item.name}</div><div className="ranking-meta">{item.code}</div></div></div>
                    <div className="ranking-right"><strong>{item.qty}</strong><span>件</span></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>
    </>
  );
}

import { useMemo, useState } from 'react';
import { CreditCard, BarChart3, Trophy, Search, CalendarRange, Truck, Receipt, Wallet, FileText, RefreshCw, ArrowUpRight, Sparkles, ShieldCheck, Clock3, ChevronLeft, ChevronRight, ClipboardCheck, Layers3, Coins, Medal, UserRound } from 'lucide-react';

export default function AccountingModule(props: any) {
  const {
    accountingTab, setAccountingTab,
    filteredAccountingQueue,
    accountingKeyword, setAccountingKeyword,
    accountingPaymentFilter, setAccountingPaymentFilter,
    accountingShippingFilter, setAccountingShippingFilter,
    accountingDateStart, setAccountingDateStart,
    accountingDateEnd, setAccountingDateEnd,
    accountingNotice, selectedAccountingRecord, selectedAccountingSourceRecord, accountingDraft, accountingTaxAmount, accountingActualReceived, updateAccountingDraftField, saveAccountingDraft,
    triggerAccountingAction, selectAccountingOrder,
    handleAccountingProofUpload, accountingProofInputRef,

    treasuryQueue, treasurySummary, treasuryReminders, selectedTreasuryRecord, treasuryDraft, treasuryNotice,
    selectTreasuryOrder, updateTreasuryDraftField, confirmTreasuryRefund, handleTreasuryProofUpload, treasuryProofInputRef,
    treasuryExpenseDraft, updateTreasuryExpenseField, saveTreasuryExpense, treasuryExpenseLogs, treasuryExpenseCategories, handleTreasuryExpenseProofUpload, treasuryExpenseProofInputRef,
    bonusDraft, updateBonusDraftField, saveBonusEntry, bonusLogs, bonusTotal, user,
    evaluationQuarter, setEvaluationQuarter, evaluationQuarterResults, evaluationSubmissions,

    accountingBoards, accountingTrendBars, salesRanking, hotProductsBoard,
  } = props;

  const [accountingPage, setAccountingPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAccountingQueue.length / pageSize));
  const safePage = Math.min(accountingPage, totalPages);
  const pagedAccountingQueue = useMemo(
    () => filteredAccountingQueue.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredAccountingQueue, safePage]
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="accounting-shell-v2">
      <div className="accounting-tab-row accounting-tab-row-v2">
        <button type="button" className={`accounting-tab ${accountingTab === 'ops' ? 'active' : ''}`} onClick={() => setAccountingTab('ops')}><CreditCard className="small-icon" />收款作業</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'bonus' ? 'active' : ''}`} onClick={() => setAccountingTab('bonus')}><Coins className="small-icon" />獎金入帳</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'treasury' ? 'active' : ''}`} onClick={() => setAccountingTab('treasury')}><Wallet className="small-icon" />出納</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'stats' ? 'active' : ''}`} onClick={() => setAccountingTab('stats')}><BarChart3 className="small-icon" />營運報表</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'ranking' ? 'active' : ''}`} onClick={() => setAccountingTab('ranking')}><Trophy className="small-icon" />排名 / 熱銷</button>
        <button type="button" className={`accounting-tab ${accountingTab === 'evaluation' ? 'active' : ''}`} onClick={() => setAccountingTab('evaluation')}><Medal className="small-icon" />評鑑分數</button>
      </div>

      {accountingTab === 'ops' && (
        <section className="warehouse-layout warehouse-command-layout accounting-warehouse-layout">
          <div className="warehouse-main warehouse-stack">
            <div className="card order-panel warehouse-filter-shell accounting-filter-shell">
              <div className="panel-head">
                <div><div className="panel-title">訂單清單篩選</div></div>
              </div>

              <div className="accounting-filter-grid warehouse-filter-grid warehouse-filter-shell-grid">
                <label className="field-card field-span-2"><span className="field-label"><Search className="small-icon" />搜尋訂單 / 客戶 / 發票</span><input value={accountingKeyword} onChange={(e) => setAccountingKeyword(e.target.value)} placeholder="輸入訂單編號、客戶、收款方式、發票號碼" /></label>
                <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />開始日期</span><input type="date" value={accountingDateStart} onChange={(e) => setAccountingDateStart(e.target.value)} /></label>
                <label className="field-card"><span className="field-label"><CalendarRange className="small-icon" />結束日期</span><input type="date" value={accountingDateEnd} onChange={(e) => setAccountingDateEnd(e.target.value)} /></label>
                <label className="field-card"><span className="field-label"><CreditCard className="small-icon" />收款狀態</span><select value={accountingPaymentFilter} onChange={(e) => setAccountingPaymentFilter(e.target.value)}><option value="全部">全部</option><option value="待收款">待收款</option><option value="已收款">已收款</option><option value="退款處理中">退款處理中</option><option value="已退款">已退款</option></select></label>
                <label className="field-card"><span className="field-label"><Truck className="small-icon" />出貨狀態</span><select value={accountingShippingFilter} onChange={(e) => setAccountingShippingFilter(e.target.value)}><option value="全部">全部</option><option value="待出貨">待出貨</option><option value="理貨中">理貨中</option><option value="換貨待出庫">換貨待出庫</option><option value="已退款">已退款</option></select></label>
              </div>
            </div>

            <div className="card order-panel warehouse-queue-card accounting-queue-card-warehouse">
              <div className="panel-head compact-head">
                <div><div className="panel-title">訂單資訊</div></div>
              </div>
              <div className="shipping-queue accounting-queue accounting-queue-v2">
                {pagedAccountingQueue.map((item: any) => (
                  <button key={item.orderNo} type="button" className={`shipping-row accounting-row accounting-select-row ${selectedAccountingRecord?.orderNo === item.orderNo ? 'selected' : ''}`} onClick={() => selectAccountingOrder(item.orderNo)}>
                    <div>
                      <div className="shipping-order">{item.orderNo}</div>
                      <div className="shipping-meta">{item.customer} / {item.date} / {item.paymentMethod} / 發票 {item.invoiceNo}</div>
                      <div className="shipping-meta">運費 ${item.shippingFee} / 稅率 {item.taxRate}% / 證明：{item.proof}</div>
                    </div>
                    <div className="shipping-actions accounting-statuses warehouse-order-statuses">
                      <span className={`badge ${item.paymentStatus === '已收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                      <span className={`badge ${item.shippingStatus === '待出貨' || item.shippingStatus === '已退款' ? 'badge-danger' : item.shippingStatus.includes('理貨') ? 'badge-soft' : item.shippingStatus === '已出貨' ? 'badge-success' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                      <strong className="accounting-amount">${item.amount}</strong>
                    </div>
                  </button>
                ))}
                {!pagedAccountingQueue.length && <div className="warehouse-empty-state">查無符合條件的訂單</div>}
              </div>
              <div className="pagination-row">
                <button type="button" className="ghost-button pagination-btn" onClick={() => setAccountingPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}><ChevronLeft className="small-icon" />上一頁</button>
                <div className="pagination-pages">
                  {pageNumbers.map((page) => (
                    <button key={page} type="button" className={`pagination-page ${safePage === page ? 'active' : ''}`} onClick={() => setAccountingPage(page)}>{page}</button>
                  ))}
                </div>
                <button type="button" className="ghost-button pagination-btn" onClick={() => setAccountingPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages}>下一頁<ChevronRight className="small-icon" /></button>
              </div>
            </div>
          </div>

          <div className="warehouse-side warehouse-stack">
            <div className="card order-panel sticky-panel warehouse-side-panel warehouse-command-panel accounting-side-panel">
              <div className="warehouse-side-section">
                <div className="warehouse-card-head">
                  <div><div className="flow-title">收款作業</div></div>
                  <ClipboardCheck className="small-icon" />
                </div>

                <div className="warehouse-check-summary-grid">
                  <div className={`warehouse-check-summary-card ${(selectedAccountingSourceRecord?.paymentStatus === '已收款' || selectedAccountingSourceRecord?.paymentStatus === '免收款') ? 'ok' : 'bad'}`}>
                    <span>收款狀態</span>
                    <strong>{selectedAccountingSourceRecord?.paymentStatus || '未選擇'}</strong>
                  </div>
                  <div className={`warehouse-check-summary-card ${selectedAccountingSourceRecord?.shippingStatus === '已出貨' ? 'ok' : 'bad'}`}>
                    <span>出貨狀態</span>
                    <strong>{selectedAccountingSourceRecord?.shippingStatus || '未選擇'}</strong>
                  </div>
                </div>

                <div className="warehouse-form-grid warehouse-command-fields">
                  <div className="fake-field"><span>訂單編號</span><strong>{accountingDraft?.orderNo || '未選擇'}</strong></div>
                  <div className="fake-field"><span>客戶</span><strong>{accountingDraft?.customer || '-'}</strong></div>
                  <div className="fake-field"><span>未稅價</span><strong>{accountingDraft?.untaxedAmount || '-'}</strong></div>
                  <div className="fake-field"><span>實收總額</span><strong>${accountingActualReceived || 0}</strong></div>
                  <div className="fake-field"><span>收款方式</span><strong><select value={accountingDraft?.paymentMethod || ''} onChange={(e) => updateAccountingDraftField('paymentMethod', e.target.value)}><option value="待確認">待確認</option><option value="銀行轉帳">銀行轉帳</option><option value="LINE Pay">LINE Pay</option><option value="現金">現金</option><option value="信用卡">信用卡</option><option value="其他">其他</option></select></strong></div>
                  <div className="fake-field"><span>發票 / 單號</span><strong><input value={accountingDraft?.invoiceNo || ''} onChange={(e) => updateAccountingDraftField('invoiceNo', e.target.value)} placeholder="輸入發票或退款單號" /></strong></div>
                  <div className="fake-field"><span>稅率 %</span><strong><input value={accountingDraft?.taxRate || ''} onChange={(e) => updateAccountingDraftField('taxRate', e.target.value)} inputMode="decimal" placeholder="輸入稅率" /></strong></div>
                  <div className="fake-field"><span>應稅金額</span><strong>{String(accountingTaxAmount || 0)}</strong></div>
                  <div className="fake-field"><span>運費</span><strong><input value={accountingDraft?.shippingFee || ''} onChange={(e) => updateAccountingDraftField('shippingFee', e.target.value)} inputMode="decimal" placeholder="輸入運費" /></strong></div>
                  <div className="fake-field wide"><span>收款證明 / 備註</span><strong><textarea rows={4} value={accountingDraft?.proof || ''} onChange={(e) => updateAccountingDraftField('proof', e.target.value)} placeholder="輸入收款備註" /></strong></div>
                </div>

                <div className="warehouse-scan-hint-grid accounting-proof-grid-warehouse">
                  <button type="button" className="warehouse-scan-hint idle accounting-proof-trigger" onClick={() => accountingProofInputRef?.current?.click()}>
                    <Receipt className="small-icon" />收款證明
                  </button>
                  <div className="warehouse-scan-hint idle"><ShieldCheck className="small-icon" />AI 辨識</div>
                  <div className="warehouse-scan-hint idle"><Clock3 className="small-icon" />最新狀態：{selectedAccountingSourceRecord?.paymentStatus || '未選擇'}</div>
                </div>

                <input ref={accountingProofInputRef} type="file" accept="image/*,.pdf" className="hidden-file-input" onChange={(e) => handleAccountingProofUpload(e.target.files?.[0] || null)} />
              </div>


              <div className="warehouse-side-section">
                <div className="accounting-action-row warehouse-action-row">
                  <button type="button" className="primary-button" onClick={saveAccountingDraft}><RefreshCw className="small-icon" />保存資料</button>
                  <button type="button" className="ghost-button compact-btn" onClick={() => triggerAccountingAction('pay')}><CreditCard className="small-icon" />確認收款</button>
                  <button type="button" className="ghost-button compact-btn" onClick={() => triggerAccountingAction('refund')}><Receipt className="small-icon" />送交退款</button>
                </div>
                {accountingNotice && <div className={`inline-action-notice ${accountingNotice.tone}`}><strong>{accountingNotice.text}</strong></div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {accountingTab === 'bonus' && (
        <section className="accounting-bonus-layout">
          <div className="card order-panel accounting-bonus-entry-card">
            <div className="panel-head">
              <div><div className="panel-title">獎金入帳</div><div className="panel-desc">獨立於收款作業，單獨管理獎金入帳與後續報表連動。</div></div>
              <span className="badge badge-role">登入者：{user?.loginId || '-'}</span>
            </div>
            <div className="warehouse-form-grid warehouse-command-fields treasury-expense-grid">
              <div className="fake-field"><span>入帳日期</span><strong><input type="date" value={bonusDraft.date} onChange={(e) => updateBonusDraftField('date', e.target.value)} /></strong></div>
              <div className="fake-field"><span>入帳時間</span><strong><input type="time" value={bonusDraft.time} onChange={(e) => updateBonusDraftField('time', e.target.value)} /></strong></div>
              <div className="fake-field"><span>金額</span><strong><input value={bonusDraft.amount} onChange={(e) => updateBonusDraftField('amount', e.target.value)} inputMode="decimal" placeholder="輸入獎金金額" /></strong></div>
              <div className="fake-field wide"><span>備註</span><strong><input value={bonusDraft.note} onChange={(e) => updateBonusDraftField('note', e.target.value)} placeholder="例如：業績獎金 / 推廣獎金" /></strong></div>
            </div>
            <div className="accounting-action-row warehouse-action-row">
              <button type="button" className="primary-button" onClick={saveBonusEntry}><Coins className="small-icon" />加入獎金</button>
            </div>
          </div>

          <div className="card order-panel accounting-bonus-log-card">
            <div className="panel-head">
              <div><div className="panel-title">獎金入帳紀錄</div><div className="panel-desc">這裡的資料會同步反映到營運報表摘要區。</div></div>
              <span className="badge badge-soft">合計 ${bonusTotal.toLocaleString()}</span>
            </div>
            <div className="treasury-expense-log">
              {bonusLogs.map((item: any) => (
                <div key={item.id} className="treasury-expense-row">
                  <div>
                    <strong>{item.note || '獎金入帳'}</strong>
                    <div className="shipping-meta">{item.date} {item.time} / {item.operator}</div>
                  </div>
                  <div className="treasury-expense-right">
                    <strong>${item.amount}</strong>
                    <span>已登記</span>
                  </div>
                </div>
              ))}
              {!bonusLogs.length && <div className="warehouse-empty-state">尚未建立獎金入帳紀錄</div>}
            </div>
          </div>
        </section>
      )}

      {accountingTab === 'treasury' && (
        <section className="accounting-treasury-layout">
          <div className="accounting-treasury-main">
            <div className="accounting-board-grid-v2">
              {treasurySummary.map((item: any) => (
                <div key={item.title} className="card accounting-board-card-v2">
                  <div className="accounting-board-kicker">{item.title}</div>
                  <div className="accounting-board-value">{item.value}</div>
                  <div className="accounting-board-sub">{item.sub}</div>
                </div>
              ))}
            </div>

            <div className="card order-panel">
              <div className="panel-head">
                <div><div className="panel-title">退款待辦清單</div></div>
                <span className="badge badge-soft">出納</span>
              </div>
              <div className="treasury-queue">
                {treasuryQueue.map((item: any) => (
                  <button key={item.orderNo} type="button" className={`shipping-row accounting-row accounting-select-row ${selectedTreasuryRecord?.orderNo === item.orderNo ? 'selected' : ''}`} onClick={() => selectTreasuryOrder(item.orderNo)}>
                    <div>
                      <div className="shipping-order">{item.orderNo}</div>
                      <div className="shipping-meta">{item.customer} / {item.date} / {item.paymentMethod || '原路退回'}</div>
                      <div className="shipping-meta">退款金額 ${item.actualReceived || item.amount} / 證明：{item.proof || '待上傳'}</div>
                    </div>
                    <div className="shipping-actions accounting-statuses warehouse-order-statuses">
                      <span className={`badge ${item.paymentStatus === '已退款' ? 'badge-success' : 'badge-danger'}`}>{item.paymentStatus}</span>
                    </div>
                  </button>
                ))}
                {!treasuryQueue.length && <div className="warehouse-empty-state">目前沒有待處理退款</div>}
              </div>
            </div>
          </div>

          <div className="accounting-treasury-side">
            <div className="card order-panel sticky-panel">
              <div className="warehouse-side-section">
                <div className="warehouse-card-head">
                  <div><div className="flow-title">退款撥款</div></div>
                  <div className="badge badge-role">出納：{user?.loginId || '-'}</div>
                </div>

                <div className="warehouse-form-grid warehouse-command-fields">
                  <div className="fake-field"><span>訂單編號</span><strong>{treasuryDraft.orderNo || '未選擇'}</strong></div>
                  <div className="fake-field"><span>客戶</span><strong>{treasuryDraft.customer || '-'}</strong></div>
                  <div className="fake-field"><span>退款金額</span><strong><input value={treasuryDraft.refundAmount} onChange={(e) => updateTreasuryDraftField('refundAmount', e.target.value)} inputMode="decimal" placeholder="輸入退款金額" /></strong></div>
                  <div className="fake-field"><span>退款方式</span><strong><select value={treasuryDraft.payoutMethod} onChange={(e) => updateTreasuryDraftField('payoutMethod', e.target.value)}><option value="原路退回">原路退回</option><option value="銀行轉帳">銀行轉帳</option><option value="現金">現金</option><option value="其他">其他</option></select></strong></div>
                  <div className="fake-field wide"><span>退款說明</span><strong><textarea rows={4} value={treasuryDraft.note} onChange={(e) => updateTreasuryDraftField('note', e.target.value)} placeholder="補充退款備註" /></strong></div>
                  <div className="fake-field wide"><span>退款證明</span><strong>{treasuryDraft.proof || '待上傳'}</strong></div>
                </div>

                <div className="warehouse-scan-hint-grid accounting-proof-grid-warehouse">
                  <button type="button" className="warehouse-scan-hint idle accounting-proof-trigger" onClick={() => treasuryProofInputRef?.current?.click()}>
                    <FileText className="small-icon" />退款證明
                  </button>
                  <div className="warehouse-scan-hint idle"><ShieldCheck className="small-icon" />自動載入已啟動</div>
                  <div className="warehouse-scan-hint idle"><Clock3 className="small-icon" />狀態：{selectedTreasuryRecord?.paymentStatus || '未選擇'}</div>
                </div>

                <input ref={treasuryProofInputRef} type="file" accept="image/*,.pdf" className="hidden-file-input" onChange={(e) => handleTreasuryProofUpload(e.target.files?.[0] || null)} />
              </div>

              <div className="warehouse-side-section">
                <div className="accounting-action-row warehouse-action-row">
                  <button type="button" className="primary-button" onClick={confirmTreasuryRefund}><Wallet className="small-icon" />完成退款</button>
                </div>
                {treasuryNotice && <div className={`inline-action-notice ${treasuryNotice.tone}`}><strong>{treasuryNotice.text}</strong></div>}
              </div>
            </div>

            <div className="card order-panel">
              <div className="panel-head">
                <div><div className="panel-title">支出作業</div></div>
                <span className="badge badge-role">登入者：{user?.loginId || '-'}</span>
              </div>
              <div className="warehouse-form-grid warehouse-command-fields treasury-expense-grid">
                <div className="fake-field"><span>分類</span><strong><select value={treasuryExpenseDraft.category} onChange={(e) => updateTreasuryExpenseField('category', e.target.value)}>{treasuryExpenseCategories.map((item: string) => <option key={item} value={item}>{item}</option>)}</select></strong></div>
                <div className="fake-field"><span>金額</span><strong><input value={treasuryExpenseDraft.amount} onChange={(e) => updateTreasuryExpenseField('amount', e.target.value)} inputMode="decimal" placeholder="輸入金額" /></strong></div>
                <div className="fake-field"><span>單號 / 參考號</span><strong><input value={treasuryExpenseDraft.referenceNo} onChange={(e) => updateTreasuryExpenseField('referenceNo', e.target.value)} placeholder="輸入參考號碼" /></strong></div>
                <div className="fake-field wide"><span>備註</span><strong><textarea rows={3} value={treasuryExpenseDraft.note} onChange={(e) => updateTreasuryExpenseField('note', e.target.value)} placeholder="輸入支出說明" /></strong></div>
                <div className="fake-field wide"><span>支出證明</span><strong>{treasuryExpenseDraft.proof || '待上傳'}</strong></div>
              </div>
              <div className="accounting-action-row warehouse-action-row">
                <button type="button" className="ghost-button compact-btn" onClick={() => treasuryExpenseProofInputRef?.current?.click()}><Receipt className="small-icon" />上傳支出證明</button>
                <button type="button" className="primary-button" onClick={saveTreasuryExpense}><RefreshCw className="small-icon" />加入支出</button>
              </div>
              <input ref={treasuryExpenseProofInputRef} type="file" accept="image/*,.pdf" className="hidden-file-input" onChange={(e) => handleTreasuryExpenseProofUpload(e.target.files?.[0] || null)} />
              <div className="treasury-expense-log">
                {treasuryExpenseLogs.map((item: any) => (
                  <div key={item.id} className="treasury-expense-row">
                    <div>
                      <strong>{item.category}</strong>
                      <div className="shipping-meta">{item.createdAt} / {item.referenceNo} / {item.operator}</div>
                    </div>
                    <div className="treasury-expense-right">
                      <strong>${item.amount}</strong>
                      <span>{item.proof === '待上傳' ? '待補證明' : '已附證明'}</span>
                    </div>
                  </div>
                ))}
                {!treasuryExpenseLogs.length && <div className="warehouse-empty-state">尚未建立支出紀錄</div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {accountingTab === 'stats' && (
        <section className="accounting-stats-layout-v3">
          <div className="accounting-stats-main-v3">
            <div className="accounting-visual-grid-v3">
              <div className="card order-panel accounting-visual-card">
                <div className="panel-head"><div><div className="panel-title">收支占比</div></div><span className="badge badge-soft">圓圖</span></div>
                <div className="accounting-donut-wrap">
                  <div className="accounting-donut-chart">
                    <div className="accounting-donut-hole">
                      <strong>營運</strong>
                      <span>本期概覽</span>
                    </div>
                  </div>
                  <div className="accounting-donut-legend">
                    <div><span className="legend-dot income" />已收款</div>
                    <div><span className="legend-dot refund" />退款</div>
                    <div><span className="legend-dot expense" />支出</div>
                  </div>
                </div>
              </div>

              <div className="card order-panel accounting-visual-card">
                <div className="panel-head"><div><div className="panel-title">營運流向</div></div><span className="badge badge-soft">樹狀</span></div>
                <div className="accounting-tree-map">
                  <div className="tree-block tree-income"><strong>收款</strong><span>訂單收入</span></div>
                  <div className="tree-column">
                    <div className="tree-block tree-refund"><strong>退款</strong><span>退貨 / 退款</span></div>
                    <div className="tree-block tree-expense"><strong>支出</strong><span>採購 / 運費 / 雜支</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card order-panel accounting-trend-card-v3">
              <div className="panel-head"><div><div className="panel-title">區間營收趨勢</div></div><span className="badge badge-soft">柱狀</span></div>
              <div className="accounting-bar-chart-v3">
                {accountingTrendBars.map((item: any) => (
                  <div key={item.label} className="accounting-bar-item-v3">
                    <div className="accounting-bar-rail">
                      <div className="accounting-bar-fill-v3" style={{ height: `${Math.max(item.width, 12)}%` }} />
                    </div>
                    <div className="accounting-bar-label">{item.label}</div>
                    <div className="accounting-bar-value">${item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="accounting-stats-side-v3">
            <div className="card accounting-insight-card-v3">
              <Sparkles className="small-icon" />
              <div className="accounting-insight-title">營運摘要</div>
              <div className="accounting-insight-list">
                <div className="insight-row"><span>收款主軸</span><strong>訂單完成後入帳</strong></div>
                <div className="insight-row"><span>退款主軸</span><strong>退款進行中 → 出納完成</strong></div>
                <div className="insight-row"><span>支出主軸</span><strong>採購 / 運費 / 雜支分流</strong></div>
                <div className="insight-row"><span>獎金入帳</span><strong>${bonusTotal.toLocaleString()} / {bonusLogs.length} 筆</strong></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {accountingTab === 'ranking' && (
        <section className="accounting-ranking-layout-v2">
          <div className="card order-panel">
            <div className="panel-head"><div><div className="panel-title">人員排名</div></div><span className="badge badge-role">排行</span></div>
            <div className="ranking-list-v2">
              {salesRanking.map((item: any, index: number) => (
                <div key={item.name} className="ranking-row-v2">
                  <div className="ranking-left"><div className="ranking-index">#{index + 1}</div><div><div className="ranking-name">{item.name}</div><div className="ranking-meta">{item.role}</div></div></div>
                  <div className="ranking-right"><strong>${item.amount}</strong><span>{item.orders} 筆</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card order-panel">
            <div className="panel-head"><div><div className="panel-title">熱銷商品</div></div><span className="badge badge-soft">熱銷</span></div>
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


      {accountingTab === 'evaluation' && (
        <section className="accounting-evaluation-layout">
          <div className="card order-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">核心成員評鑑結果</div>
                <div className="panel-desc">系統依四大維度平均後，自動結算總分、K值與榮譽勳章。評分者採匿名，不顯示來源。</div>
              </div>
              <span className="badge badge-soft">匿名 {evaluationSubmissions.length} 份</span>
            </div>
            <div className="evaluation-quarter-row accounting-quarter-row">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                <button key={quarter} type="button" className={`evaluation-quarter-btn ${evaluationQuarter === quarter ? 'active' : ''}`} onClick={() => setEvaluationQuarter(quarter as any)}>{quarter}</button>
              ))}
            </div>
            <div className="accounting-evaluation-table">
              <div className="accounting-evaluation-head">
                <span>核心成員</span>
                <span>業績</span>
                <span>協作</span>
                <span>專業</span>
                <span>效率</span>
                <span>總分</span>
                <span>K值</span>
                <span>勳章</span>
              </div>
              {evaluationQuarterResults.map((item: any) => (
                <div key={`${item.quarter}-${item.loginId}`} className="accounting-evaluation-row">
                  <div className="accounting-evaluation-name"><UserRound className="small-icon" />{item.name}</div>
                  <span>{item.sales}</span>
                  <span>{item.collaboration}</span>
                  <span>{item.professional}</span>
                  <span>{item.efficiency}</span>
                  <strong>{item.total}</strong>
                  <span>{item.kValue.toFixed(2)}</span>
                  <span className="badge badge-neutral">{item.medal}</span>
                </div>
              ))}
              {!evaluationQuarterResults.length && <div className="warehouse-empty-state">目前尚無評鑑結果</div>}
            </div>
          </div>
        </section>
      )}

    </section>
  );
}

import { CreditCard, BarChart3, Trophy, Search, CalendarRange, Truck, Receipt, User, Wallet, BadgePercent, FileText, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AccountingModule(props: any) {
  const {
    paymentQueue, accountingSummary, accountingTab, setAccountingTab,
    filteredAccountingQueue, accountingOpsTotal,
    accountingKeyword, setAccountingKeyword,
    accountingPaymentFilter, setAccountingPaymentFilter,
    accountingShippingFilter, setAccountingShippingFilter,
    accountingDateStart, setAccountingDateStart,
    accountingDateEnd, setAccountingDateEnd,
    accountingNotice, selectedAccountingRecord,
    triggerAccountingAction, selectAccountingOrder,
    updateAccountingRecord, updateAccountingAmountField,
    accountingBoards, accountingTrendBars, salesRanking, hotProductsBoard,
    SectionIntro, SummaryCard,
  } = props;

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (selectedAccountingRecord) {
      setForm(selectedAccountingRecord);
    }
  }, [selectedAccountingRecord]);

  const updateField = (key: string, value: any) => {
    const next = { ...form, [key]: value };
    setForm(next);
    updateAccountingRecord({ [key]: value });
  };

  return (
    <>
      <SectionIntro title="會計中心骨架" desc="會計作業" />

      {accountingTab === 'ops' && (
        <>
          <div className="card">
            {filteredAccountingQueue.map((item: any) => (
              <div key={item.orderNo} onClick={() => selectAccountingOrder(item.orderNo)}>
                {item.orderNo}
              </div>
            ))}
          </div>

          {selectedAccountingRecord && (
            <div className="card">
              <input value={form.orderNo || ''} readOnly />
              <input value={form.customer || ''} readOnly />

              <input
                type="number"
                value={form.untaxedAmount || 0}
                onChange={(e)=>updateField('untaxedAmount', Number(e.target.value))}
              />

              <input
                type="number"
                value={form.taxRate || 0}
                onChange={(e)=>updateField('taxRate', Number(e.target.value))}
              />

              <input
                type="number"
                value={form.shippingFee || 0}
                onChange={(e)=>updateField('shippingFee', Number(e.target.value))}
              />

              <input value={form.amount || 0} readOnly />

              <input
                value={form.paymentMethod || ''}
                onChange={(e)=>updateField('paymentMethod', e.target.value)}
              />

              <input
                value={form.invoiceNo || ''}
                onChange={(e)=>updateField('invoiceNo', e.target.value)}
              />

              <textarea
                value={form.proof || ''}
                onChange={(e)=>updateField('proof', e.target.value)}
              />

              <button onClick={()=>triggerAccountingAction('pay')}>收款</button>
              <button onClick={()=>triggerAccountingAction('refund')}>退款</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

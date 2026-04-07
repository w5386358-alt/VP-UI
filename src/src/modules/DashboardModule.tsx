export default function DashboardModule(props: any) {
  const { workflowCards, WorkflowModule, itemCount, shippingMethod, grandTotal } = props;
  return (
    <>
      <section className="workflow-grid">
        {workflowCards.map((card: any) => <WorkflowModule key={card.title} card={card} />)}
      </section>

      <section className="two-column-grid">
        <div className="card content-card">
          <h2>系統整理</h2>
          <div className="stack-list">
            <div>1. 整理全站畫面與名稱</div>
            <div>2. 版面更乾淨、整齊、直覺</div>
            <div>3. 標題、按鈕、提示語統一</div>
            <div>4. 保持手機單欄閱讀</div>
            <div>5. 訂購、會計、倉儲同步整理</div>
          </div>
        </div>
        <div className="card content-card">
          <h2>待補功能</h2>
          <div className="stack-list compact">
            <div>商品與購物車</div>
            <div>訂單主檔 / 明細</div>
            <div>收款 / 退款 / 報表</div>
            <div>庫存查詢 / QR / 出貨</div>
            <div>個人資料 / 訂單 / 業績</div>
          </div>
        </div>
      </section>

      <div className="mobile-order-bar card">
        <div>
          <div className="mobile-order-title">訂單摘要</div>
          <div className="mobile-order-sub">{itemCount} 件商品 / {shippingMethod}</div>
        </div>
        <div className="mobile-order-total">${grandTotal}</div>
      </div>
    </>
  );
}

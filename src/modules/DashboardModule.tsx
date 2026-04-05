export default function DashboardModule(props: any) {
  const { workflowCards, WorkflowModule, itemCount, shippingMethod, grandTotal } = props;
  return (
    <>
      <section className="workflow-grid">
        {workflowCards.map((card: any) => <WorkflowModule key={card.title} card={card} />)}
      </section>

      <section className="two-column-grid">
        <div className="card content-card">
          <h2>本次整理重點</h2>
          <div className="stack-list">
            <div>1. 保留既有架構，只整理畫面與命名</div>
            <div>2. 版面改成更乾淨、整齊、直覺</div>
            <div>3. 主資料頁統一視覺與操作名稱</div>
            <div>4. 手機版維持單欄閱讀</div>
            <div>5. 訂購、會計、倉儲畫面同步整理</div>
          </div>
        </div>
        <div className="card content-card">
          <h2>下一步</h2>
          <div className="stack-list compact">
            <div>商品前台購物車</div>
            <div>訂單主檔 / 明細寫入</div>
            <div>收款 / 退款 / 銷售統計</div>
            <div>庫存查詢 / QR / 出貨流程</div>
            <div>個人資料 / 歷史訂單 / 業績</div>
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

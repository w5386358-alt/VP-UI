export default function DashboardModule(props: any) {
  const { workflowCards, WorkflowModule, itemCount, shippingMethod, grandTotal } = props;
  return (
    <>
      <section className="workflow-grid">
        {workflowCards.map((card: any) => <WorkflowModule key={card.title} card={card} />)}
      </section>

      <section className="two-column-grid">
        <div className="card content-card">
          <h2>這版 UI 做了什麼</h2>
          <div className="stack-list">
            <div>1. 沿用你現有前端版本，不重寫資料架構</div>
            <div>2. 把資訊密度整理成可閱讀、可延伸的模組版位</div>
            <div>3. 商品 / 客戶 / 人員 三個主資料頁統一視覺規格</div>
            <div>4. 手機版改成單欄式閱讀，保留後續做底部導覽空間</div>
            <div>5. 為訂單、會計、倉儲預留符合你 GAS 邏輯的UI骨架</div>
          </div>
        </div>
        <div className="card content-card">
          <h2>接下來可直接往下做</h2>
          <div className="stack-list compact">
            <div>商品前台購物車</div>
            <div>訂單主檔 / 明細寫入</div>
            <div>收款 / 退款 / 銷售統計</div>
            <div>庫存查詢 / QR / 出貨流程</div>
            <div>個人歷史訂單 / 累積業績</div>
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
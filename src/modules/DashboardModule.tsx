export default function DashboardModule(props: any) {
  const { workflowCards, WorkflowModule, itemCount, shippingMethod, grandTotal } = props;
  const primaryCards = workflowCards.slice(0, 2);
  const secondaryCards = workflowCards.slice(2);

  return (
    <div className="dashboard-shell dashboard-shell-v2">
      <section className="dashboard-hero-grid dashboard-hero-grid-v2">
        <div className="card dashboard-hero-card dashboard-hero-card-v2">
          <div className="dashboard-hero-kicker"></div>
          <h3 className="dashboard-hero-title">八大模組整合在同一後台，快速掌握目前營運狀態。</h3>
          <p className="dashboard-hero-desc">從這裡快速查看重點摘要、待辦事項與功能區。</p>
          <div className="dashboard-hero-metrics dashboard-hero-metrics-v2">
            <div className="dashboard-metric-pill"><span>訂單摘要</span><strong>{itemCount} 件商品</strong></div>
            <div className="dashboard-metric-pill"><span>配送方式</span><strong>{shippingMethod}</strong></div>
            <div className="dashboard-metric-pill accent"><span>目前金額</span><strong>${grandTotal}</strong></div>
          </div>
        </div>

        <div className="dashboard-side-stack dashboard-side-stack-v2">
          <div className="card dashboard-side-card soft-rose"><div className="dashboard-side-label">目前重點</div><div className="dashboard-side-title">白紙 UI 重構</div><div className="dashboard-side-desc">先統一視覺，再逐步補齊資料。</div></div>
          <div className="card dashboard-side-card soft-gold"><div className="dashboard-side-title">系統概況</div></div>
          <div className="card dashboard-side-card soft-pearl"><div className="dashboard-side-label">下一步</div><div className="dashboard-side-title">資料回接</div><div className="dashboard-side-desc">下一步再補齊資料與同步流程。</div></div>
        </div>
      </section>

      <section className="dashboard-feature-grid dashboard-feature-grid-v2">
        <div className="dashboard-feature-main">{primaryCards.map((card: any) => (<WorkflowModule key={card.title} card={card} />))}</div>
        <div className="dashboard-feature-side">
          <div className="card dashboard-note-card dashboard-note-card-v2"><div className="dashboard-note-title">目前狀態</div><div className="stack-list compact"><div>已完成新介面主骨架</div><div>八大模組已分區整理</div><div>接下來整理細節與欄位</div></div></div>
          {secondaryCards.map((card: any) => (<WorkflowModule key={card.title} card={card} />))}
        </div>
      </section>

      <section className="dashboard-bottom-grid dashboard-bottom-grid-v2">
        
        <div className="card content-card dashboard-bottom-card"><h2>後續整理順序</h2><div className="stack-list compact"><div>商品 / 客戶 / 人員資料區</div><div>訂購 / 會計 / 倉儲流程區</div><div>個人資料與歷史紀錄區</div><div>最後再回接同步與 Firebase</div></div></div>
      </section>
    </div>
  );
}

export default function DashboardModule(props: any) {
  const { workflowCards, WorkflowModule, itemCount, shippingMethod, grandTotal } = props;
  const primaryCards = workflowCards.slice(0, 2);
  const secondaryCards = workflowCards.slice(2);

  return (
    <div className="dashboard-shell dashboard-shell-v2">
      <section className="dashboard-hero-grid dashboard-hero-grid-v2">
        <div className="card dashboard-hero-card dashboard-hero-card-v2">
          <div className="dashboard-hero-kicker">Overview Center</div>
          <h3 className="dashboard-hero-title">八大區白紙 UI 已經開始成形，現在改的是模組節奏，不是舊版換色。</h3>
          <p className="dashboard-hero-desc">先把儀表板做成偏品牌首頁的閱讀感：主敘事在左，運作狀態與摘要在右，下面再切成功能區。</p>
          <div className="dashboard-hero-metrics dashboard-hero-metrics-v2">
            <div className="dashboard-metric-pill"><span>訂單摘要</span><strong>{itemCount} 件商品</strong></div>
            <div className="dashboard-metric-pill"><span>配送方式</span><strong>{shippingMethod}</strong></div>
            <div className="dashboard-metric-pill accent"><span>目前金額</span><strong>${grandTotal}</strong></div>
          </div>
        </div>

        <div className="dashboard-side-stack dashboard-side-stack-v2">
          <div className="card dashboard-side-card soft-rose"><div className="dashboard-side-label">Current Focus</div><div className="dashboard-side-title">白紙 UI 重構</div><div className="dashboard-side-desc">先做新殼，再慢慢回接邏輯。</div></div>
          <div className="card dashboard-side-card soft-gold"><div className="dashboard-side-label">This Stage</div><div className="dashboard-side-title">模組節奏</div><div className="dashboard-side-desc">讓每一區都有自己的閱讀路徑與工作感。</div></div>
          <div className="card dashboard-side-card soft-pearl"><div className="dashboard-side-label">Next Step</div><div className="dashboard-side-title">資料回接</div><div className="dashboard-side-desc">等 UI 殼穩定後，再往功能與同步靠。</div></div>
        </div>
      </section>

      <section className="dashboard-feature-grid dashboard-feature-grid-v2">
        <div className="dashboard-feature-main">{primaryCards.map((card: any) => (<WorkflowModule key={card.title} card={card} />))}</div>
        <div className="dashboard-feature-side">
          <div className="card dashboard-note-card dashboard-note-card-v2"><div className="dashboard-note-title">目前進度</div><div className="stack-list compact"><div>已脫離舊版固定框架</div><div>八大區開始分化成不同工作台</div><div>下一步繼續補剩餘模組與細節</div></div></div>
          {secondaryCards.map((card: any) => (<WorkflowModule key={card.title} card={card} />))}
        </div>
      </section>

      <section className="dashboard-bottom-grid dashboard-bottom-grid-v2">
        <div className="card content-card dashboard-bottom-card"><h2>系統整理</h2><div className="stack-list"><div>1. 先完成八大區新骨架</div><div>2. 每區都有自己的閱讀節奏</div><div>3. 操作區、資訊區、摘要區重新分工</div><div>4. 後面再接功能與資料搬運</div></div></div>
        <div className="card content-card dashboard-bottom-card"><h2>接下來搬運順序</h2><div className="stack-list compact"><div>商品 / 客戶 / 人員資料區</div><div>訂購 / 會計 / 倉儲流程區</div><div>個人資料與歷史紀錄區</div><div>最後再回接同步與 Firebase</div></div></div>
      </section>
    </div>
  );
}

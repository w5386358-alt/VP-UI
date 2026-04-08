export default function DashboardModule(props: any) {
  const { workflowCards, WorkflowModule, itemCount, shippingMethod, grandTotal } = props;
  const primaryCards = workflowCards.slice(0, 2);
  const secondaryCards = workflowCards.slice(2);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero-grid">
        <div className="card dashboard-hero-card">
          <div className="dashboard-hero-kicker">Overview Center</div>
          <h3 className="dashboard-hero-title">八大區 UI 白紙版已啟動，先把骨架、閱讀路徑與卡片節奏做對。</h3>
          <p className="dashboard-hero-desc">現在優先驗收版型，不急著綁同步。等外觀與操作路徑穩定後，再把資料與 Firebase 一塊一塊搬回來。</p>
          <div className="dashboard-hero-metrics">
            <div className="dashboard-metric-pill">
              <span>訂單摘要</span>
              <strong>{itemCount} 件商品</strong>
            </div>
            <div className="dashboard-metric-pill">
              <span>配送方式</span>
              <strong>{shippingMethod}</strong>
            </div>
            <div className="dashboard-metric-pill accent">
              <span>目前金額</span>
              <strong>${grandTotal}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-side-stack">
          <div className="card dashboard-side-card soft-rose">
            <div className="dashboard-side-label">Current Focus</div>
            <div className="dashboard-side-title">白紙 UI 重構</div>
            <div className="dashboard-side-desc">先做新殼，再慢慢回接邏輯。</div>
          </div>
          <div className="card dashboard-side-card soft-gold">
            <div className="dashboard-side-label">This Stage</div>
            <div className="dashboard-side-title">版型優先</div>
            <div className="dashboard-side-desc">先看格局、距離、層級是否開始像設計稿。</div>
          </div>
        </div>
      </section>

      <section className="dashboard-feature-grid">
        <div className="dashboard-feature-main">
          {primaryCards.map((card: any) => (
            <WorkflowModule key={card.title} card={card} />
          ))}
        </div>
        <div className="dashboard-feature-side">
          <div className="card dashboard-note-card">
            <div className="dashboard-note-title">目前進度</div>
            <div className="stack-list compact">
              <div>已脫離舊版單純換色狀態</div>
              <div>開始建立新工作區骨架與留白</div>
              <div>下一步拉開各模組內部節奏</div>
            </div>
          </div>
          {secondaryCards.map((card: any) => (
            <WorkflowModule key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="card content-card dashboard-bottom-card">
          <h2>系統整理</h2>
          <div className="stack-list">
            <div>1. 先完成八大區新骨架</div>
            <div>2. 拉開主副欄比例與卡片層級</div>
            <div>3. 操作區、資訊區、摘要區重新分工</div>
            <div>4. 手機版再跟著桌機版結構微調</div>
          </div>
        </div>
        <div className="card content-card dashboard-bottom-card">
          <h2>接下來搬運順序</h2>
          <div className="stack-list compact">
            <div>商品 / 客戶 / 人員資料區</div>
            <div>訂購 / 會計 / 倉儲流程區</div>
            <div>個人資料與歷史紀錄區</div>
            <div>最後再回接同步與 Firebase</div>
          </div>
        </div>
      </section>
    </div>
  );
}

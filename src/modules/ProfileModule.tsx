import { QrCode, RefreshCw, Search, CalendarRange } from 'lucide-react';

export default function ProfileModule(props: any) {
  const { personalOrders, personalSummary, profileQuickActions, user, getRankClass, keyword, setKeyword, SectionIntro, SummaryCard } = props;
  return (
    <>
      <SectionIntro
        title="個人資料 / 我的歷史訂單"
        desc="這版先把個人資料、累積業績、歷史訂單、掃碼與刷新整理按鈕的位置排好，後面直接沿用你原本 GAS 的個人流程去接。"
        stats={[`歷史訂單 ${personalOrders.length} 筆`, '個人資料 / 業績雙區塊', '掃碼 / 刷新整理 預留']}
      />

      <section className="summary-grid">
        {personalSummary.map((item: any) => <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />)}
      </section>

      <section className="profile-action-grid">
        {profileQuickActions.map((item: any) => {
          const Icon = item.icon;
          return <div key={item.title} className="card profile-action-card"><div className="profile-action-icon"><Icon className="small-icon" /></div><div className="profile-action-title">{item.title}</div><div className="profile-action-desc">{item.desc}</div></div>;
        })}
      </section>

      <section className="two-column-grid profile-top-grid">
        <div className="card order-panel">
          <div className="panel-head"><div><div className="panel-title">個人資料</div><div className="panel-desc">上半部先固定你的個人資訊卡位：姓名、員工編號、登入 ID、身分、階級、員編 QR。</div></div><span className="badge badge-role">個人中心</span></div>
          <div className="profile-identity-card">
            <div className="profile-avatar">秉</div>
            <div className="profile-main">
              <div className="profile-name">{user.name}</div>
              <div className="profile-id-row">員工編號：VP001 / 登入 ID：{user.loginId}</div>
              <div className="data-chip-row"><span className="badge badge-role">身分 / 管理員</span><span className={getRankClass(user.rank)}>階級 / {user.rank}</span><span className="badge badge-neutral">價格層級 / 總代理價格</span></div>
            </div>
            <div className="profile-qr-box"><QrCode className="profile-qr-icon" /><span>員編 QR 預留</span></div>
          </div>
        </div>

        <div className="card order-panel">
          <div className="panel-head compact-head"><div><div className="panel-title">我的累積業績</div><div className="panel-desc">下半部對齊你的個人業績與排名邏輯。</div></div></div>
          <div className="profile-performance-grid">
            <div className="metric-box large"><span>累積業績</span><strong>$128,600</strong></div>
            <div className="metric-box large"><span>完成訂單數</span><strong>86</strong></div>
            <div className="metric-box large"><span>目前排名</span><strong>#3</strong></div>
            <div className="metric-box large"><span>退款扣回影響</span><strong>-$1,240</strong></div>
          </div>
          <div className="profile-note-list"><div className="profile-note-item">本月主力商品：女神酵素液 / 美妍X關鍵賦活飲</div><div className="profile-note-item">待追蹤：1 筆待收款、2 筆待出貨、1 筆換貨處理</div></div>
        </div>
      </section>

      <section className="card order-panel profile-history-panel">
        <div className="panel-head"><div><div className="panel-title">我的歷史訂單</div><div className="panel-desc">保留你指定的搜尋、掃碼、刷新整理三個操作節奏，後續可直接接歷史訂單完整查詢。</div></div><div className="history-toolbar"><button type="button" className="ghost-button compact-btn"><QrCode className="small-icon" />掃碼</button><button type="button" className="ghost-button compact-btn"><RefreshCw className="small-icon" />刷新整理</button></div></div>
        <div className="history-filter-row"><div className="search-wrap inline-search"><Search className="search-icon" /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜尋訂單編號 / 狀態 / 日期" /></div><button type="button" className="primary-button compact-primary">輸入</button></div>
        <div className="history-list">
          {personalOrders.filter((item: any) => !keyword.trim() || `${item.orderNo} ${item.date} ${item.paymentStatus} ${item.shippingStatus} ${item.mainStatus}`.toLowerCase().includes(keyword.trim().toLowerCase())).map((item: any) => (
            <div key={item.orderNo} className="history-row">
              <div className="history-main">
                <div className="history-order">{item.orderNo}</div>
                <div className="history-meta"><CalendarRange className="small-icon" />{item.date}</div>
                <div className="history-statuses"><span className={`badge ${item.paymentStatus.includes('已收款') ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span><span className={`badge ${item.shippingStatus.includes('已出貨') || item.shippingStatus.includes('理貨') ? 'badge-success' : item.shippingStatus.includes('換貨') ? 'badge-neutral' : 'badge-danger'}`}>{item.shippingStatus}</span><span className="badge badge-soft">{item.mainStatus}</span></div>
              </div>
              <div className="history-side"><div className="history-amount">${item.amount}</div><button type="button" className="ghost-button compact-btn history-detail-btn">查看詳情</button></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import { QrCode, RefreshCw, Search, CalendarRange, Phone, User2, ClipboardList, Sparkles, Wallet, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ProfileModule(props: any) {
  const { personalOrders, personalSummary, profileQuickActions, user, getRankClass, keyword, setKeyword, priceTierLabel, SectionIntro, SummaryCard, ownCustomerRecords = [], allOrderRecords = [] } = props;

  const myCustomerCards = ownCustomerRecords.map((customer: any) => {
    const relatedOrders = allOrderRecords.filter((item: any) => item.customer === customer.name);
    const latestOrder = relatedOrders[0];
    return {
      ...customer,
      orderCount: relatedOrders.length,
      latestOrderNo: latestOrder?.orderNo || '尚無訂單',
      latestOrderStatus: latestOrder ? `${latestOrder.paymentStatus} / ${latestOrder.shippingStatus}` : '尚無訂單',
    };
  });

  return (
    <>
      <SectionIntro
        title="個人資料"
        desc="個人資料與常用入口。"
        stats={[`歷史訂單 ${personalOrders.length} 筆`, `我的客戶 ${myCustomerCards.length} 位`, '個人業績 / 快捷入口']}
      />

      <section className="profile-shell-v2">
        <div className="profile-hero-card-v2 card">
          <div className="profile-hero-identity">
            <div className="profile-hero-avatar">秉</div>
            <div>
              <div className="profile-hero-name">{user.name}</div>
              <div className="profile-hero-id">員工編號：VP001 / 登入 ID：{user.loginId}</div>
              <div className="data-chip-row"><span className="badge badge-role">角色 / 管理</span><span className={getRankClass(user.rank)}>階級 / {user.rank}</span><span className="badge badge-neutral">價格層級 / {priceTierLabel}</span></div>
            </div>
          </div>
          <div className="profile-hero-side-grid">
            <div className="profile-hero-mini"><Wallet className="small-icon" /><div><span>累積業績</span><strong>$128,600</strong></div></div>
            <div className="profile-hero-mini"><ShieldCheck className="small-icon" /><div><span>目前排名</span><strong>#3</strong></div></div>
            <div className="profile-hero-mini accent"><QrCode className="small-icon" /><div><span>員編 QR</span><strong>已建立</strong></div></div>
          </div>
        </div>

        <section className="profile-overview-grid-v2">
          <div className="profile-summary-grid-v2">{personalSummary.map((item: any) => <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />)}</div>
          <div className="card profile-quick-panel-v2">
            <div className="panel-head compact-head"><div><div className="panel-title">快捷入口</div><div className="panel-desc">常用入口。</div></div><Sparkles className="small-icon" /></div>
            <div className="profile-action-grid profile-action-grid-v2">
              {profileQuickActions.map((item: any) => {
                const Icon = item.icon;
                return <div key={item.title} className="profile-action-card profile-action-card-v2"><div className="profile-action-icon"><Icon className="small-icon" /></div><div className="profile-action-title">{item.title}</div><div className="profile-action-desc">{item.desc}</div></div>;
              })}
            </div>
          </div>
        </section>

        <section className="profile-content-grid-v2">
          <div className="card order-panel profile-customer-panel-v2">
            <div className="panel-head"><div><div className="panel-title">我的客戶</div><div className="panel-desc">查看我的客戶。</div></div><span className="badge badge-neutral">姓名 / 電話 / 最新訂單</span></div>
            <div className="profile-customer-grid profile-customer-grid-v2">
              {myCustomerCards.map((item: any) => (
                <div key={item.id} className="profile-customer-card profile-customer-card-v2">
                  <div className="profile-customer-head"><div className="profile-customer-name"><User2 className="small-icon" />{item.name}</div><span className="badge badge-soft">{item.orderCount} 筆</span></div>
                  <div className="profile-customer-meta"><Phone className="small-icon" />{item.phone || '-'}</div>
                  <div className="profile-customer-order"><div className="profile-customer-order-no"><ClipboardList className="small-icon" />{item.latestOrderNo}</div><div className="profile-customer-order-status">{item.latestOrderStatus}</div></div>
                </div>
              ))}
              {!myCustomerCards.length && <div className="warehouse-empty-state">沒有屬於你的客戶資料</div>}
            </div>
          </div>

          <div className="card order-panel profile-history-panel-v2">
            <div className="panel-head"><div><div className="panel-title">我的歷史訂單</div><div className="panel-desc">查看歷史訂單。</div></div><div className="history-toolbar"><button type="button" className="ghost-button compact-btn"><QrCode className="small-icon" />掃碼</button><button type="button" className="ghost-button compact-btn"><RefreshCw className="small-icon" />重新整理</button></div></div>
            <div className="history-filter-row"><div className="search-wrap inline-search"><Search className="search-icon" /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜尋訂單編號 / 狀態 / 日期" /></div><button type="button" className="primary-button compact-primary">搜尋</button></div>
            <div className="history-list">
              {personalOrders.filter((item: any) => !keyword.trim() || `${item.orderNo} ${item.date} ${item.paymentStatus} ${item.shippingStatus} ${item.mainStatus}`.toLowerCase().includes(keyword.trim().toLowerCase())).map((item: any) => (
                <div key={item.orderNo} className="history-row history-row-v2">
                  <div className="history-main">
                    <div className="history-order">{item.orderNo}</div>
                    <div className="history-meta"><CalendarRange className="small-icon" />{item.date}</div>
                    <div className="history-statuses"><span className={`badge ${item.paymentStatus.includes('已收款') ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span><span className={`badge ${item.shippingStatus.includes('已出貨') || item.shippingStatus.includes('理貨') ? 'badge-success' : item.shippingStatus.includes('換貨') ? 'badge-neutral' : 'badge-danger'}`}>{item.shippingStatus}</span><span className="badge badge-soft">{item.mainStatus}</span></div>
                  </div>
                  <div className="history-side"><div className="history-amount">${item.amount}</div><button type="button" className="ghost-button compact-btn history-detail-btn">查看詳情</button></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

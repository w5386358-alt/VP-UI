import { useMemo } from 'react';
import { CalendarRange, Phone, User2, ClipboardList, ChevronRight, Wallet, ShieldCheck, Users, BarChart3 } from 'lucide-react';

export default function DashboardModule(props: any) {
  const { user, getRankClass, priceTierLabel, personalOrders = [], ownCustomerRecords = [], allOrderRecords = [] } = props;

  const myCustomerCards = useMemo(() => ownCustomerRecords.map((customer: any) => {
    const relatedOrders = allOrderRecords.filter((item: any) => item.customer === customer.name);
    const latestOrder = relatedOrders[0];
    return {
      ...customer,
      orderCount: relatedOrders.length,
      latestOrderNo: latestOrder?.orderNo || '尚無訂單',
      latestOrderStatus: latestOrder ? `${latestOrder.paymentStatus} / ${latestOrder.shippingStatus}` : '尚無訂單',
    };
  }), [ownCustomerRecords, allOrderRecords]);

  const dashboardStats = [
    { title: '累積銷售排名', value: '#3', sub: '本月持續穩定推進', icon: ShieldCheck },
    { title: '本季成交總額', value: '$128.6k', sub: '依既有個人資料邏輯延伸', icon: Wallet },
    { title: '管理客戶總數', value: `${myCustomerCards.length}`, sub: '我的客戶資料同步整理', icon: Users },
  ];

  const latestOrders = personalOrders.slice(0, 4);
  const latestCustomers = myCustomerCards.slice(0, 4);
  const rankingTree = [
    { label: '服務評價', value: 86 },
    { label: '回購表現', value: 72 },
    { label: '流程配合', value: 91 },
    { label: '整體綜合', value: 80 },
  ];

  return (
    <div className="dashboard-personal-shell">
      <section className="dashboard-personal-grid">
        <div className="card dashboard-profile-card">
          <div className="dashboard-profile-art" />
          <div className="dashboard-profile-avatar">秉</div>
          <div className="dashboard-profile-name">{user.name}</div>
          <div className="dashboard-profile-role">VP 訂購 ERP 核心使用者</div>
          <div className="dashboard-profile-badges">
            <span className="badge badge-role">帳號 / {user.loginId}</span>
            <span className={getRankClass(user.rank)}>階級 / {user.rank}</span>
          </div>
          <div className="dashboard-profile-badges secondary">
            <span className="badge badge-neutral">價格層級 / {priceTierLabel}</span>
          </div>
          <div className="dashboard-profile-detail-list">
            <div><span>聯絡方式</span><strong>依原個人資料邏輯載入</strong></div>
            <div><span>客戶範圍</span><strong>我的客戶 {myCustomerCards.length} 位</strong></div>
            <div><span>歷史訂單</span><strong>{personalOrders.length} 筆</strong></div>
          </div>
        </div>

        <div className="dashboard-personal-main">
          <div className="dashboard-hero-stat-grid">
            {dashboardStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card dashboard-hero-stat-card">
                  <div className="dashboard-hero-stat-icon"><Icon className="small-icon" /></div>
                  <div className="dashboard-hero-stat-title">{item.title}</div>
                  <div className="dashboard-hero-stat-value">{item.value}</div>
                  <div className="dashboard-hero-stat-sub">{item.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="card dashboard-history-card">
            <div className="panel-head">
              <div>
                <div className="panel-title">我的歷史訂單</div>
                <div className="panel-desc">保留個人資料原本的歷史訂單邏輯，集中放在儀表板首頁。</div>
              </div>
            </div>
            <div className="dashboard-history-list">
              {latestOrders.map((item: any) => (
                <div key={item.orderNo} className="dashboard-history-row">
                  <div className="dashboard-history-icon"><ClipboardList className="small-icon" /></div>
                  <div className="dashboard-history-main">
                    <div className="dashboard-history-title">{item.orderNo}</div>
                    <div className="dashboard-history-meta"><CalendarRange className="small-icon" />{item.date}</div>
                    <div className="dashboard-history-status">{item.paymentStatus} / {item.shippingStatus} / {item.mainStatus}</div>
                  </div>
                  <div className="dashboard-history-side">${item.amount?.toLocaleString?.() || item.amount}</div>
                </div>
              ))}
              {!latestOrders.length && <div className="warehouse-empty-state">尚無歷史訂單</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-personal-bottom-grid">
        <div className="card dashboard-tree-card">
          <div className="panel-head">
            <div>
              <div className="panel-title">評鑑分數樹狀圖</div>
              <div className="panel-desc">原年度榮譽勳章區改為評鑑視覺區，之後可再接真實邏輯。</div>
            </div>
            <span className="badge badge-soft">評鑑</span>
          </div>
          <div className="dashboard-tree-wrap">
            <div className="dashboard-tree-trunk" />
            <div className="dashboard-tree-branches">
              {rankingTree.map((item) => (
                <div key={item.label} className="dashboard-tree-branch">
                  <div className="dashboard-tree-node">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card dashboard-customer-card">
          <div className="panel-head">
            <div>
              <div className="panel-title">我的客戶資料</div>
              <div className="panel-desc">把原個人資料中的客戶邏輯同步搬進儀表板。</div>
            </div>
            <span className="badge badge-neutral">客戶 {myCustomerCards.length}</span>
          </div>
          <div className="dashboard-customer-list">
            {latestCustomers.map((item: any) => (
              <div key={item.id} className="dashboard-customer-row">
                <div className="dashboard-customer-head">
                  <div className="dashboard-customer-name"><User2 className="small-icon" />{item.name}</div>
                  <span className="badge badge-soft">{item.level || '一般'}</span>
                </div>
                <div className="dashboard-customer-meta"><Phone className="small-icon" />{item.phone || '-'}</div>
                <div className="dashboard-customer-order-line">
                  <span>{item.latestOrderNo}</span>
                  <ChevronRight className="small-icon" />
                </div>
              </div>
            ))}
            {!latestCustomers.length && <div className="warehouse-empty-state">目前沒有屬於你的客戶資料</div>}
          </div>
        </div>

        <div className="card dashboard-growth-card">
          <div className="panel-head">
            <div>
              <div className="panel-title">銷售表現趨勢</div>
              <div className="panel-desc">先保留視覺趨勢模組，後續再接真實統計。</div>
            </div>
            <BarChart3 className="small-icon" />
          </div>
          <div className="dashboard-growth-bars">
            {[42, 58, 47, 71, 64, 86].map((height, index) => (
              <div key={index} className="dashboard-growth-item">
                <div className="dashboard-growth-bar" style={{ height: `${height}%` }} />
                <span>{['DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

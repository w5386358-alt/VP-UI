import { useMemo } from 'react';
import { CalendarRange, Phone, User2, ClipboardList, ChevronRight, BarChart3, Users, BadgeDollarSign, ShoppingBag, Star } from 'lucide-react';

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

  const latestOrders = personalOrders.slice(0, 4);
  const latestCustomers = myCustomerCards.slice(0, 4);
  const rankingTree = [
    { label: '服務評價', value: 86 },
    { label: '回購表現', value: 72 },
    { label: '流程配合', value: 91 },
    { label: '整體綜合', value: 80 },
  ];
  const totalSales = personalOrders.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
  const averageScore = Math.round(rankingTree.reduce((sum, item) => sum + item.value, 0) / rankingTree.length);
  const statCards = [
    {
      title: '我的歷史訂單',
      value: `${personalOrders.length}`,
      sub: '沿用原個人資料訂單邏輯',
      icon: ShoppingBag,
    },
    {
      title: '我的客戶資料',
      value: `${myCustomerCards.length}`,
      sub: '目前由你管理的客戶數',
      icon: Users,
    },
    {
      title: '個人評鑑平均',
      value: `${averageScore}`,
      sub: `累計銷售 $${totalSales.toLocaleString()}`,
      icon: Star,
    },
  ];
  const radarLevels = [1, 0.75, 0.5, 0.25];
  const center = 160;
  const outerRadius = 112;
  const radarPoints = rankingTree.map((item, index) => {
    const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
    const radius = outerRadius * (item.value / 100);
    return {
      ...item,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (outerRadius + 34),
      labelY: center + Math.sin(angle) * (outerRadius + 34),
      axisX: center + Math.cos(angle) * outerRadius,
      axisY: center + Math.sin(angle) * outerRadius,
    };
  });
  const radarPolygon = radarPoints.map((item) => `${item.x},${item.y}`).join(' ');

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
          <div className="dashboard-hero-stat-grid dashboard-hero-stat-grid-v3">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card dashboard-hero-stat-card dashboard-hero-stat-card-v3 compact-card">
                  <div className="dashboard-hero-stat-icon"><Icon className="small-icon" /></div>
                  <div className="dashboard-hero-stat-title">{item.title}</div>
                  <div className="dashboard-hero-stat-value">{item.value}</div>
                  <div className="dashboard-hero-stat-sub">{item.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="dashboard-feature-grid">
            <div className="card dashboard-history-card compact-card">
              <div className="panel-head">
                <div>
                  <div className="panel-title">我的歷史訂單</div>
                  <div className="panel-desc">保留原個人資料中的歷史訂單邏輯，集中放在儀表板首頁。</div>
                </div>
                <span className="badge badge-soft">{personalOrders.length} 筆</span>
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

            <div className="card dashboard-customer-card compact-card">
              <div className="panel-head">
                <div>
                  <div className="panel-title">我的客戶資料</div>
                  <div className="panel-desc">把原個人資料中的客戶邏輯同步搬進儀表板。</div>
                </div>
                <span className="badge badge-neutral"><Users className="small-icon" />{myCustomerCards.length}</span>
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
          </div>
        </div>
      </section>

      <section className="dashboard-personal-bottom-grid">
        <div className="card dashboard-tree-card compact-card">
          <div className="panel-head">
            <div>
              <div className="panel-title">個人評鑑雷達能力圖</div>
              <div className="panel-desc">改成中心雷達能力圖，分數越高就越往對應能力軸延伸。</div>
            </div>
            <span className="badge badge-soft">評鑑</span>
          </div>
          <div className="dashboard-tree-layout radar-layout">
            <div className="dashboard-tree-visual radar-visual">
              <svg className="dashboard-radar-svg" viewBox="0 0 320 320" aria-label="個人評鑑雷達能力圖">
                {radarLevels.map((level) => {
                  const points = rankingTree.map((_, index) => {
                    const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
                    const radius = outerRadius * level;
                    const x = center + Math.cos(angle) * radius;
                    const y = center + Math.sin(angle) * radius;
                    return `${x},${y}`;
                  }).join(' ');
                  return <polygon key={level} points={points} className="dashboard-radar-grid" />;
                })}
                {radarPoints.map((item) => (
                  <line key={item.label} x1={center} y1={center} x2={item.axisX} y2={item.axisY} className="dashboard-radar-axis" />
                ))}
                <polygon points={radarPolygon} className="dashboard-radar-shape" />
                {radarPoints.map((item) => (
                  <circle key={item.label} cx={item.x} cy={item.y} r="6" className="dashboard-radar-point" />
                ))}
              </svg>
              <div className="dashboard-radar-center-badge">
                <span className="dashboard-eval-hub-label">綜合評分</span>
                <strong className="dashboard-eval-hub-score">{averageScore}</strong>
              </div>
              {radarPoints.map((item) => (
                <div
                  key={item.label}
                  className="dashboard-radar-label"
                  style={{ left: `${item.labelX}px`, top: `${item.labelY}px` }}
                >
                  <span className="dashboard-tree-label">{item.label}</span>
                  <strong className="dashboard-tree-score">{item.value}</strong>
                </div>
              ))}
            </div>
            <div className="dashboard-tree-score-grid radar-summary-grid">
              {rankingTree.map((item) => (
                <div key={item.label} className="dashboard-tree-score-card summary-card-lite radar-summary-card">
                  <span className="dashboard-tree-label">{item.label}</span>
                  <strong className="dashboard-tree-score">{item.value}</strong>
                  <small className="dashboard-tree-mini-desc">分數越高，雷達圖越往該能力軸延伸</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card dashboard-growth-card compact-card">
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

import { useMemo } from 'react';
import { CalendarRange, Phone, User2, ClipboardList, ChevronRight, BarChart3, Users, ShoppingBag, Star, Medal } from 'lucide-react';

export default function DashboardModule(props: any) {
  const {
    user, getRankClass, priceTierLabel, personalOrders = [], ownCustomerRecords = [], allOrderRecords = [],
    dashboardAvatarImage = '', dashboardAvatarInputRef, handleDashboardAvatarUpload,
    evaluationQuarter = 'Q1', setEvaluationQuarter, evaluationSummary,
  } = props;

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
    { label: '業績', value: Number(evaluationSummary?.averageScores?.sales || 0) },
    { label: '協作', value: Number(evaluationSummary?.averageScores?.collaboration || 0) },
    { label: '專業', value: Number(evaluationSummary?.averageScores?.professional || 0) },
    { label: '效率', value: Number(evaluationSummary?.averageScores?.efficiency || 0) },
  ];
  const totalSales = personalOrders.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
  const averageScore = Number(evaluationSummary?.totalScore || 0);
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
      sub: `${evaluationQuarter} / ${evaluationSummary?.badge || '精進級'}`,
      icon: Star,
    },
  ];
  const radarLevels = [1, 0.75, 0.5, 0.25];
  const svgSize = 360;
  const center = svgSize / 2;
  const outerRadius = 92;
  const labelRadius = 136;
  const radarPoints = rankingTree.map((item, index) => {
    const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
    const axisRadius = outerRadius;
    const radius = axisRadius * (item.value / [40, 25, 20, 15][index]);
    const axisX = center + Math.cos(angle) * axisRadius;
    const axisY = center + Math.sin(angle) * axisRadius;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;
    return {
      ...item,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      axisX,
      axisY,
      labelX,
      labelY,
      textAnchor: index === 1 ? 'start' : index === 3 ? 'end' : 'middle',
      labelOffsetY: index === 0 ? -8 : index === 2 ? 10 : -2,
      scoreOffsetY: index === 0 ? 18 : index === 2 ? 36 : 20,
    };
  });
  const radarPolygon = radarPoints.map((item) => `${item.x},${item.y}`).join(' ');

  return (
    <div className="dashboard-personal-shell">
      <section className="dashboard-personal-grid">
        <div className="card dashboard-profile-card">
          <div className="dashboard-profile-art" />
          <button type="button" className="dashboard-profile-avatar uploadable-avatar" onClick={() => dashboardAvatarInputRef?.current?.click()}>
            {dashboardAvatarImage ? <img src={dashboardAvatarImage} alt={user.name} className="dashboard-profile-avatar-image" /> : '秉'}
          </button>
          <input ref={dashboardAvatarInputRef} type="file" accept="image/*" className="hidden-file-input" onChange={(e) => { handleDashboardAvatarUpload?.(e.target.files?.[0] || null); e.target.value = ''; }} />
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
            <div><span><User2 className="tiny-icon" /> 本季勳章</span><strong>{evaluationSummary?.badge || '精進級'}</strong></div>
            <div><span><Medal className="tiny-icon" /> K值</span><strong>{Number(evaluationSummary?.kValue || 0.9).toFixed(2)}</strong></div>
            <div><span><Phone className="tiny-icon" /> 評鑑季度</span><strong>{evaluationQuarter}</strong></div>
            <div><span><CalendarRange className="tiny-icon" /> 累計銷售</span><strong>${totalSales.toLocaleString()}</strong></div>
          </div>
        </div>

        <div className="dashboard-main-stack">
          <div className="dashboard-stat-grid compact">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card dashboard-stat-card compact">
                  <div className="dashboard-stat-head"><span>{item.title}</span><Icon className="small-icon" /></div>
                  <div className="dashboard-stat-value">{item.value}</div>
                  <div className="dashboard-stat-sub">{item.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="dashboard-content-grid compact">
            <div className="card dashboard-radar-card radar-card-center compact-radar-card">
              <div className="dashboard-radar-head compact-radar-head">
                <div>
                  <div className="dashboard-card-title">能力評鑑雷達</div>
                  <div className="dashboard-card-subtitle">依季度切換查看匿名評鑑彙總結果</div>
                </div>
                <div className="dashboard-quarter-switch">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((item) => (
                    <button key={item} type="button" className={`dashboard-quarter-btn ${evaluationQuarter === item ? 'active' : ''}`} onClick={() => setEvaluationQuarter?.(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="dashboard-radar-wrap centered-radar-wrap compact-radar-wrap">
                <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="dashboard-radar-svg compact-radar-svg" role="img" aria-label="個人能力雷達圖">
                  {radarLevels.map((level) => {
                    const levelPoints = radarPoints.map((point, index) => {
                      const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
                      const radius = outerRadius * level;
                      return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
                    }).join(' ');
                    return <polygon key={level} points={levelPoints} className="dashboard-radar-gridline" />;
                  })}
                  {radarPoints.map((point) => (
                    <line key={`axis-${point.label}`} x1={center} y1={center} x2={point.axisX} y2={point.axisY} className="dashboard-radar-axis" />
                  ))}
                  <polygon points={radarPolygon} className="dashboard-radar-area" />
                  {radarPoints.map((point) => (
                    <g key={point.label}>
                      <circle cx={point.x} cy={point.y} r={5.5} className="dashboard-radar-dot" />
                      <text x={point.labelX} y={point.labelY + point.labelOffsetY} textAnchor={point.textAnchor as any} className="dashboard-radar-label">{point.label}</text>
                      <text x={point.labelX} y={point.labelY + point.scoreOffsetY} textAnchor={point.textAnchor as any} className="dashboard-radar-score">{point.value}</text>
                    </g>
                  ))}
                  <text x={center} y={center + 8} textAnchor="middle" className="dashboard-radar-total-score">{averageScore}</text>
                </svg>
              </div>
            </div>

            <div className="dashboard-side-stack compact-side-stack">
              <div className="card dashboard-list-card compact-list-card">
                <div className="dashboard-card-title">最近訂單</div>
                <div className="dashboard-link-list compact-link-list">
                  {latestOrders.length ? latestOrders.map((item: any) => (
                    <div key={item.orderNo} className="dashboard-link-row compact-link-row">
                      <div>
                        <div className="dashboard-link-title">{item.orderNo}</div>
                        <div className="dashboard-link-sub">{item.paymentStatus} / {item.shippingStatus}</div>
                      </div>
                      <ChevronRight className="small-icon" />
                    </div>
                  )) : <div className="dashboard-empty-inline">目前還沒有個人訂單資料</div>}
                </div>
              </div>

              <div className="card dashboard-list-card compact-list-card">
                <div className="dashboard-card-title">我的客戶</div>
                <div className="dashboard-link-list compact-link-list">
                  {latestCustomers.length ? latestCustomers.map((item: any) => (
                    <div key={item.id} className="dashboard-link-row compact-link-row">
                      <div>
                        <div className="dashboard-link-title">{item.name}</div>
                        <div className="dashboard-link-sub">{item.phone} / {item.latestOrderStatus}</div>
                      </div>
                      <ChevronRight className="small-icon" />
                    </div>
                  )) : <div className="dashboard-empty-inline">目前沒有指派客戶資料</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

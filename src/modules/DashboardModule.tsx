import { useMemo } from 'react';
import { CalendarRange, Phone, User2, ClipboardList, ChevronRight, BarChart3, Users, ShoppingBag, Star } from 'lucide-react';

export default function DashboardModule(props: any) {
  const { personalOrders = [], ownCustomerRecords = [], allOrderRecords = [], evaluationQuarter, setEvaluationQuarter, dashboardRadarMetrics = [], myEvaluationQuarterResult } = props;

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
  const rankingTree = dashboardRadarMetrics.length ? dashboardRadarMetrics : [
    { label: '業績', value: 0 },
    { label: '協作', value: 0 },
    { label: '專業', value: 0 },
    { label: '效率', value: 0 },
  ];
  const totalSales = personalOrders.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
  const averageScore = myEvaluationQuarterResult?.total || 0;
  const medal = myEvaluationQuarterResult?.medal || '精進級';
  const statCards = [
    { title: '我的歷史訂單', value: `${personalOrders.length}`, sub: '沿用原個人資料訂單邏輯', icon: ShoppingBag },
    { title: '我的客戶資料', value: `${myCustomerCards.length}`, sub: '目前由你管理的客戶數', icon: Users },
    { title: '累積成交金額', value: `$${totalSales.toLocaleString()}`, sub: '沿用歷史訂單累積結果', icon: ShoppingBag },
    { title: '個人評鑑平均', value: `${averageScore}`, sub: `${evaluationQuarter} / ${medal}`, icon: Star },
  ];
  const radarLevels = [1, 0.75, 0.5, 0.25];
  const svgSize = 360;
  const center = svgSize / 2;
  const outerRadius = 92;
  const labelRadius = 136;
  const radarPoints = rankingTree.map((item: any, index: number) => {
    const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
    const radius = outerRadius * ((item.value || 0) / 100);
    const axisX = center + Math.cos(angle) * outerRadius;
    const axisY = center + Math.sin(angle) * outerRadius;
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
  const radarPolygon = radarPoints.map((item: any) => `${item.x},${item.y}`).join(' ');

  return (
    <div className="dashboard-personal-shell">
      <section className="dashboard-personal-grid dashboard-personal-grid-clean">
        <div className="dashboard-personal-main dashboard-personal-main-full">
          <div className="dashboard-hero-stat-grid dashboard-hero-stat-grid-v3 dashboard-hero-stat-grid-clean">
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

          <div className="dashboard-feature-grid dashboard-feature-grid-clean">
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
              <div className="panel-desc">四個季度可切換查看，能力項目已改為業績、協作、專業、效率。</div>
            </div>
            <span className="badge badge-soft">{evaluationQuarter}</span>
          </div>
          <div className="evaluation-quarter-row dashboard-quarter-row">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
              <button key={quarter} type="button" className={`evaluation-quarter-btn ${evaluationQuarter === quarter ? 'active' : ''}`} onClick={() => setEvaluationQuarter(quarter)}>{quarter}</button>
            ))}
          </div>
          <div className="dashboard-tree-layout radar-layout">
            <div className="dashboard-tree-visual radar-visual">
              <svg className="dashboard-radar-svg" viewBox={`0 0 ${svgSize} ${svgSize}`} aria-label="個人評鑑雷達能力圖">
                {radarLevels.map((level) => {
                  const points = rankingTree.map((_: any, index: number) => {
                    const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
                    const radius = outerRadius * level;
                    const x = center + Math.cos(angle) * radius;
                    const y = center + Math.sin(angle) * radius;
                    return `${x},${y}`;
                  }).join(' ');
                  return <polygon key={level} points={points} className="dashboard-radar-grid" />;
                })}
                {radarPoints.map((item: any) => (
                  <line key={item.label} x1={center} y1={center} x2={item.axisX} y2={item.axisY} className="dashboard-radar-axis" />
                ))}
                <polygon points={radarPolygon} className="dashboard-radar-shape" />
                {radarPoints.map((item: any) => (
                  <circle key={item.label} cx={item.x} cy={item.y} r="5.5" className="dashboard-radar-point" />
                ))}
                <g className="dashboard-radar-center-group">
                  <circle cx={center} cy={center} r="30" className="dashboard-radar-center-disc" />
                  <text x={center} y={center - 4} textAnchor="middle" className="dashboard-radar-center-title">綜合評分</text>
                  <text x={center} y={center + 18} textAnchor="middle" className="dashboard-radar-center-score">{averageScore}</text>
                </g>
                {radarPoints.map((item: any) => (
                  <g key={item.label} className="dashboard-radar-label-group">
                    <text x={item.labelX} y={item.labelY + item.labelOffsetY} textAnchor={item.textAnchor as any} className="dashboard-radar-svg-label">{item.label}</text>
                    <text x={item.labelX} y={item.labelY + item.scoreOffsetY} textAnchor={item.textAnchor as any} className="dashboard-radar-svg-score">{item.value}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="dashboard-tree-score-grid radar-summary-grid">
              {rankingTree.map((item: any) => (
                <div key={item.label} className="dashboard-tree-score-card summary-card-lite radar-summary-card">
                  <span className="dashboard-tree-label">{item.label}</span>
                  <strong className="dashboard-tree-score">{item.value}</strong>
                  <small className="dashboard-tree-mini-desc">{evaluationQuarter} 能力得分</small>
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

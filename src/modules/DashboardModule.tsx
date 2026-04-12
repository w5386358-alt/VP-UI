import { useMemo, useState } from 'react';
import { CalendarRange, Phone, User2, ClipboardList, BarChart3, Users, ShoppingBag, Star, Eye } from 'lucide-react';

export default function DashboardModule(props: any) {
  const { personalOrders = [], ownCustomerRecords = [], allOrderRecords = [], evaluationQuarter, myEvaluationQuarterResult } = props;

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

  const [ordersPage, setOrdersPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const dashPageSize = 4;
  const totalOrderPages = Math.max(1, Math.ceil(personalOrders.length / dashPageSize));
  const totalCustomerPages = Math.max(1, Math.ceil(myCustomerCards.length / dashPageSize));
  const safeOrdersPage = Math.min(ordersPage, totalOrderPages);
  const safeCustomersPage = Math.min(customersPage, totalCustomerPages);
  const latestOrders = personalOrders.slice((safeOrdersPage - 1) * dashPageSize, safeOrdersPage * dashPageSize);
  const latestCustomers = myCustomerCards.slice((safeCustomersPage - 1) * dashPageSize, safeCustomersPage * dashPageSize);
  const totalSales = personalOrders.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
  const averageScore = myEvaluationQuarterResult?.total || 0;
  const medal = myEvaluationQuarterResult?.medal || '精進級';
  const statCards = [
    { title: '我的歷史訂單', value: `${personalOrders.length}`, sub: '沿用原個人資料訂單邏輯', icon: ShoppingBag },
    { title: '我的客戶資料', value: `${myCustomerCards.length}`, sub: '目前由你管理的客戶數', icon: Users },
    { title: '累積成交額', value: `$${totalSales.toLocaleString()}`, sub: '沿用歷史訂單累積結果', icon: ShoppingBag },
    { title: '個人評鑑平均', value: `${averageScore}`, sub: `${evaluationQuarter} / ${medal}`, icon: Star },
  ];

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
                    <div className="dashboard-history-icon"><ClipboardList className="dashboard-mini-icon" /></div>
                    <div className="dashboard-history-main">
                      <div className="dashboard-history-title">{item.orderNo}</div>
                      <div className="dashboard-history-meta"><CalendarRange className="dashboard-mini-icon" />{item.date}</div>
                      <div className="dashboard-history-status">{item.paymentStatus} / {item.shippingStatus} / {item.mainStatus}</div>
                    </div>
                    <div className="dashboard-history-side">${item.amount?.toLocaleString?.() || item.amount}</div>
                  </div>
                ))}
                {!latestOrders.length && <div className="warehouse-empty-state">尚無歷史訂單</div>}
              </div>
              <div className="pagination-row pagination-row-minimal pagination-row-angle">
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setOrdersPage((page) => Math.max(1, page - 1))} disabled={safeOrdersPage === 1} aria-label="上一頁">&lt;</button>
                <div className="pagination-pages pagination-pages-single">
                  <button type="button" className="pagination-page active">{safeOrdersPage}</button>
                </div>
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setOrdersPage((page) => Math.min(totalOrderPages, page + 1))} disabled={safeOrdersPage === totalOrderPages} aria-label="下一頁">&gt;</button>
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
                  <div key={item.id} className="dashboard-customer-row compact-inline">
                    <div className="dashboard-customer-name"><User2 className="dashboard-mini-icon" />{item.name}</div>
                    <div className="dashboard-customer-meta compact"><Phone className="dashboard-mini-icon" />{item.phone || '-'}</div>
                    <button type="button" className="dashboard-eye-button" aria-label={`查看 ${item.name} 的歷史訂單`} title="查看這位客戶的歷史訂單">
                      <Eye className="dashboard-mini-icon" />
                    </button>
                    <span className="badge badge-soft dashboard-customer-level">{item.level || '一般客戶'}</span>
                  </div>
                ))}
                {!latestCustomers.length && <div className="warehouse-empty-state">目前沒有屬於你的客戶資料</div>}
              </div>
              <div className="pagination-row pagination-row-minimal pagination-row-angle">
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setCustomersPage((page) => Math.max(1, page - 1))} disabled={safeCustomersPage === 1} aria-label="上一頁">&lt;</button>
                <div className="pagination-pages pagination-pages-single">
                  <button type="button" className="pagination-page active">{safeCustomersPage}</button>
                </div>
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setCustomersPage((page) => Math.min(totalCustomerPages, page + 1))} disabled={safeCustomersPage === totalCustomerPages} aria-label="下一頁">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-personal-bottom-grid dashboard-personal-bottom-grid-single">
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

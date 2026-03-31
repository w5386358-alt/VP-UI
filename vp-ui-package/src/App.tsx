import { useMemo, useState } from 'react';
import { BarChart3, CreditCard, Crown, LayoutDashboard, Package2, Search, UserRound, WalletCards, ReceiptText, RefreshCcw, Upload, Camera, ScanLine, TrendingUp, Trophy, Boxes, ChartNoAxesCombined } from 'lucide-react';

type MainTab = 'dashboard' | 'orders' | 'warehouse' | 'accounting' | 'profile';
type AccountingTab = 'payment' | 'analytics' | 'ranking';

type OrderRow = {
  orderNo: string;
  customer: string;
  amount: number;
  paymentStatus: string;
  shippingStatus: string;
  date: string;
};

const orderRows: OrderRow[] = [
  { orderNo: 'VP20260401-001', customer: '王小美', amount: 3680, paymentStatus: '未收款', shippingStatus: '待出貨', date: '2026/04/01' },
  { orderNo: 'VP20260401-002', customer: '陳太太', amount: 5200, paymentStatus: '已收款', shippingStatus: '已出貨', date: '2026/04/01' },
  { orderNo: 'EX20260401-003', customer: '林先生', amount: 2480, paymentStatus: '已退款', shippingStatus: '已退貨', date: '2026/03/31' },
  { orderNo: 'VP20260331-008', customer: '蔡小姐', amount: 1890, paymentStatus: '已收款', shippingStatus: '已完成', date: '2026/03/31' },
];

const salesRanks = [
  ['秉宸老師', 'NT$ 86,000'],
  ['小安', 'NT$ 74,300'],
  ['小晴', 'NT$ 61,500'],
  ['阿傑', 'NT$ 52,800'],
];

const hotItems = [
  ['瞬白激光精華4G', '328 件'],
  ['奇肌修復全能霜', '276 件'],
  ['超導緊緻面膜', '251 件'],
  ['女神酵素液', '230 件'],
];

function fmt(n: number) {
  return `NT$ ${n.toLocaleString('zh-TW')}`;
}

function statusClass(value: string) {
  if (['未收款', '待出貨', '待收款'].includes(value)) return 'status danger';
  if (['已收款', '已出貨', '已完成'].includes(value)) return 'status success';
  if (['已退款', '已退貨', '已換貨'].includes(value)) return 'status refund';
  return 'status';
}

function Sidebar({
  mainTab,
  setMainTab,
}: {
  mainTab: MainTab;
  setMainTab: (tab: MainTab) => void;
}) {
  const items: { key: MainTab; label: string; icon: JSX.Element }[] = [
    { key: 'dashboard', label: '總覽', icon: <LayoutDashboard size={18} /> },
    { key: 'orders', label: '訂購介面', icon: <WalletCards size={18} /> },
    { key: 'warehouse', label: '倉儲中心', icon: <Boxes size={18} /> },
    { key: 'accounting', label: '會計中心', icon: <CreditCard size={18} /> },
    { key: 'profile', label: '個人資料', icon: <UserRound size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-card">
        <div className="brand-logo">VP</div>
        <div>
          <div className="brand-title">VP 訂購系統</div>
          <div className="brand-subtitle">Vercel UI 備份優化版</div>
        </div>
      </div>

      <div className="nav-group">
        {items.map((item) => (
          <button
            key={item.key}
            className={`nav-btn ${mainTab === item.key ? 'active' : ''}`}
            onClick={() => setMainTab(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="chip-label">身分</span>
          <strong>系統管理員</strong>
        </div>
        <div className="user-chip rank">
          <span className="chip-label">階級</span>
          <strong>核心人員</strong>
        </div>
      </div>
    </aside>
  );
}

function DashboardPage({ setMainTab }: { setMainTab: (tab: MainTab) => void }) {
  return (
    <div className="page-body">
      <section className="hero-card">
        <div>
          <h1>VP UI 進度延續版</h1>
          <p>已接續你記錄的 v9.3 倉儲穩定節點，並往下補上會計中心精修 UI。</p>
        </div>
        <div className="hero-actions">
          <button className="ghost-btn" onClick={() => setMainTab('warehouse')}>看倉儲中心</button>
          <button className="primary-btn" onClick={() => setMainTab('accounting')}>進入會計中心</button>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">今日訂單</span>
          <strong className="metric-value">28</strong>
          <span className="metric-foot">含換貨單 / 補單</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">待出貨</span>
          <strong className="metric-value">12</strong>
          <span className="metric-foot">倉儲優先處理</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">待收款</span>
          <strong className="metric-value">7</strong>
          <span className="metric-foot">會計追蹤中</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">本月營收</span>
          <strong className="metric-value">NT$ 128,600</strong>
          <span className="metric-foot">實收統計視覺區</span>
        </article>
      </section>
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="page-body">
      <section className="panel-card">
        <div className="section-head">
          <h2>訂購介面骨架</h2>
          <span className="soft-badge">保留位置</span>
        </div>
        <div className="placeholder-grid">
          <div className="placeholder-box tall">
            <Search size={18} />
            <span>商品搜尋 / 分類 / 輸入按鈕</span>
          </div>
          <div className="placeholder-box tall">
            <Package2 size={18} />
            <span>商品列表卡片區</span>
          </div>
          <div className="placeholder-box tall">
            <ReceiptText size={18} />
            <span>購物車 / 訂單摘要</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function WarehousePage() {
  return (
    <div className="page-body">
      <section className="section-head page-head-inline">
        <div>
          <h1>倉儲中心</h1>
          <p>沿用你記錄的 v9.3 視覺節點，維持穩定版面。</p>
        </div>
      </section>

      <div className="warehouse-grid">
        <div className="panel-card">
          <div className="section-head">
            <h2>出貨區</h2>
            <span className="soft-badge">v9.3 穩定基底</span>
          </div>
          <div className="ship-layout">
            <div className="placeholder-box"><ScanLine size={18} /><span>掃碼出貨</span></div>
            <div className="info-tiles">
              <div className="info-tile"><span>訂單編號</span><strong>VP20260401-002</strong></div>
              <div className="info-tile"><span>客戶</span><strong>陳太太</strong></div>
              <div className="info-tile"><span>狀態</span><strong>待出貨</strong></div>
              <div className="info-tile"><span>件數</span><strong>3 件</strong></div>
            </div>
          </div>
        </div>

        <div className="panel-card">
          <div className="section-head">
            <h2>最近異動紀錄</h2>
            <span className="soft-badge">右側紀錄區</span>
          </div>
          <div className="activity-list">
            <div className="activity-item"><strong>09:35</strong><span>VP20260401-002 完成配貨</span></div>
            <div className="activity-item"><strong>09:20</strong><span>P301 入庫 24 件</span></div>
            <div className="activity-item"><strong>09:02</strong><span>EX20260401-003 換貨出庫建立</span></div>
          </div>
        </div>
      </div>

      <div className="warehouse-grid second">
        <div className="panel-card">
          <div className="section-head">
            <h2>庫存區</h2>
            <span className="soft-badge">庫存 / 查詢</span>
          </div>
          <div className="placeholder-grid">
            <div className="placeholder-box"><Package2 size={18} /><span>入庫作業</span></div>
            <div className="placeholder-box"><Search size={18} /><span>條碼 / QR 查詢</span></div>
            <div className="placeholder-box"><BarChart3 size={18} /><span>庫存摘要</span></div>
          </div>
        </div>

        <div className="panel-card">
          <div className="section-head">
            <h2>查詢區</h2>
            <span className="soft-badge">掃碼帶入</span>
          </div>
          <div className="placeholder-box tall"><ScanLine size={18} /><span>條碼 / QR / 訂單查詢結果展示位</span></div>
        </div>
      </div>
    </div>
  );
}

function AccountingPage() {
  const [tab, setTab] = useState<AccountingTab>('payment');
  const [keyword, setKeyword] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('全部');
  const [shippingFilter, setShippingFilter] = useState('全部');

  const filteredRows = useMemo(() => {
    return orderRows.filter((row) => {
      const k = keyword.trim();
      const matchKeyword = !k || [row.orderNo, row.customer, row.date].join(' ').includes(k);
      const matchPayment = paymentFilter === '全部' || row.paymentStatus === paymentFilter;
      const matchShipping = shippingFilter === '全部' || row.shippingStatus === shippingFilter;
      return matchKeyword && matchPayment && matchShipping;
    });
  }, [keyword, paymentFilter, shippingFilter]);

  return (
    <div className="page-body">
      <header className="page-topbar">
        <div>
          <h1>會計中心</h1>
          <p>收款 / 退款、銷售統計、排行榜與熱銷分析</p>
        </div>
        <div className="header-btns">
          <button className="ghost-btn"><RefreshCcw size={16} />刷新整理</button>
          <button className="primary-btn">匯出報表</button>
        </div>
      </header>

      <div className="subtabs">
        <button className={`subtab ${tab === 'payment' ? 'active' : ''}`} onClick={() => setTab('payment')}>
          <CreditCard size={16} />收款 / 退款作業
        </button>
        <button className={`subtab ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}>
          <TrendingUp size={16} />銷售統計
        </button>
        <button className={`subtab ${tab === 'ranking' ? 'active' : ''}`} onClick={() => setTab('ranking')}>
          <Trophy size={16} />排行榜 / 熱銷
        </button>
      </div>

      {tab === 'payment' && (
        <>
          <div className="accounting-top">
            <section className="panel-card">
              <div className="section-head">
                <h2>查詢 / 篩選</h2>
                <span className="soft-badge">訂單紀錄</span>
              </div>

              <div className="filters-grid">
                <label className="field">
                  <span>訂單編號 / 客戶 / 電話</span>
                  <div className="input-inline">
                    <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="請輸入關鍵字" />
                    <button className="ghost-btn small">輸入</button>
                  </div>
                </label>

                <label className="field">
                  <span>起算日</span>
                  <input type="date" />
                </label>

                <label className="field">
                  <span>結算日</span>
                  <input type="date" />
                </label>

                <label className="field">
                  <span>款項狀態</span>
                  <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                    <option>全部</option>
                    <option>未收款</option>
                    <option>已收款</option>
                    <option>已退款</option>
                  </select>
                </label>

                <label className="field">
                  <span>商品狀態</span>
                  <select value={shippingFilter} onChange={(e) => setShippingFilter(e.target.value)}>
                    <option>全部</option>
                    <option>待出貨</option>
                    <option>已出貨</option>
                    <option>已完成</option>
                    <option>已退貨</option>
                  </select>
                </label>

                <label className="field full">
                  <span>備註 / 篩選補充</span>
                  <input placeholder="例如：只看已出貨未退款訂單" />
                </label>
              </div>
            </section>

            <section className="panel-card">
              <div className="section-head">
                <h2>收款證明</h2>
                <span className="soft-badge">上傳區</span>
              </div>

              <div className="upload-grid">
                <button className="upload-card">
                  <Upload size={18} />
                  <strong>上傳收據</strong>
                  <span>支援圖片 / PDF</span>
                </button>
                <button className="upload-card">
                  <Camera size={18} />
                  <strong>拍照上傳</strong>
                  <span>手機可直接拍攝</span>
                </button>
                <button className="upload-card">
                  <ReceiptText size={18} />
                  <strong>匯款截圖</strong>
                  <span>銀行或轉帳紀錄</span>
                </button>
                <button className="upload-card">
                  <ChartNoAxesCombined size={18} />
                  <strong>AI 辨識預留</strong>
                  <span>後續可接自動辨識</span>
                </button>
              </div>
            </section>
          </div>

          <section className="panel-card">
            <div className="section-head">
              <h2>訂單紀錄</h2>
              <div className="table-actions">
                <button className="ghost-btn small">批次收款</button>
                <button className="ghost-btn small">批次退款</button>
              </div>
            </div>

            <div className="table-shell">
              <table className="ui-table">
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>客戶</th>
                    <th>金額</th>
                    <th>款項狀態</th>
                    <th>商品狀態</th>
                    <th>日期</th>
                    <th>動作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.orderNo}>
                      <td>{row.orderNo}</td>
                      <td>{row.customer}</td>
                      <td>{fmt(row.amount)}</td>
                      <td><span className={statusClass(row.paymentStatus)}>{row.paymentStatus}</span></td>
                      <td><span className={statusClass(row.shippingStatus)}>{row.shippingStatus}</span></td>
                      <td>{row.date}</td>
                      <td>
                        <div className="row-actions">
                          {row.paymentStatus === '未收款' && <button className="row-btn success">確認收款</button>}
                          {row.paymentStatus !== '已退款' && <button className="row-btn danger">退款作業</button>}
                          <button className="row-btn muted">查看明細</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredRows.length && (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-block">目前沒有符合條件的資料</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {tab === 'analytics' && (
        <>
          <section className="metric-grid">
            <article className="metric-card">
              <span className="metric-label">區間營收</span>
              <strong className="metric-value">NT$ 128,600</strong>
            </article>
            <article className="metric-card">
              <span className="metric-label">稅金總額</span>
              <strong className="metric-value">NT$ 6,430</strong>
            </article>
            <article className="metric-card">
              <span className="metric-label">運費總額</span>
              <strong className="metric-value">NT$ 3,120</strong>
            </article>
            <article className="metric-card">
              <span className="metric-label">毛利</span>
              <strong className="metric-value">NT$ 38,560</strong>
            </article>
          </section>

          <div className="analytics-grid">
            <section className="panel-card">
              <div className="section-head">
                <h2>營收趨勢</h2>
                <span className="soft-badge">報表視覺區</span>
              </div>
              <div className="bar-chart">
                {[40, 62, 48, 74, 56, 88, 67].map((h, i) => (
                  <div key={i} className="bar-col">
                    <div className="bar-fill" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </section>

            <section className="panel-card">
              <div className="section-head">
                <h2>收款結構</h2>
                <span className="soft-badge">開會版型</span>
              </div>
              <div className="donut-area">
                <div className="donut" />
                <div className="legend-list">
                  <div><span className="legend-dot dot1" /> 已收款</div>
                  <div><span className="legend-dot dot2" /> 未收款</div>
                  <div><span className="legend-dot dot3" /> 已退款</div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {tab === 'ranking' && (
        <div className="ranking-grid">
          <section className="panel-card">
            <div className="section-head">
              <h2>業績排行榜</h2>
              <span className="soft-badge">Top Sales</span>
            </div>
            <div className="rank-list">
              {salesRanks.map(([name, amount], idx) => (
                <div key={name} className="rank-card">
                  <div className="rank-no">{idx + 1}</div>
                  <div className="rank-name">{name}</div>
                  <div className="rank-value">{amount}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-card">
            <div className="section-head">
              <h2>熱銷商品</h2>
              <span className="soft-badge">Hot Items</span>
            </div>
            <div className="rank-list">
              {hotItems.map(([name, count], idx) => (
                <div key={name} className="rank-card">
                  <div className="rank-no">{idx + 1}</div>
                  <div className="rank-name">{name}</div>
                  <div className="rank-value">{count}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="page-body">
      <section className="profile-grid">
        <div className="panel-card">
          <div className="section-head">
            <h2>個人資料</h2>
            <span className="soft-badge">骨架保留</span>
          </div>
          <div className="profile-info">
            <div className="info-line"><span>姓名</span><strong>吳秉宸</strong></div>
            <div className="info-line"><span>員工編號</span><strong>VP001</strong></div>
            <div className="info-line"><span>身分</span><strong>系統管理員</strong></div>
            <div className="info-line"><span>階級</span><strong>核心人員</strong></div>
          </div>
        </div>

        <div className="panel-card">
          <div className="section-head">
            <h2>累積業績</h2>
            <span className="soft-badge">我的成績</span>
          </div>
          <div className="metric-grid single">
            <article className="metric-card">
              <span className="metric-label">累積業績</span>
              <strong className="metric-value">NT$ 2,380,000</strong>
            </article>
            <article className="metric-card">
              <span className="metric-label">完成訂單數</span>
              <strong className="metric-value">486</strong>
            </article>
            <article className="metric-card">
              <span className="metric-label">目前排名</span>
              <strong className="metric-value">#1</strong>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('accounting');

  return (
    <div className="app-shell">
      <Sidebar mainTab={mainTab} setMainTab={setMainTab} />
      <main className="main-area">
        {mainTab === 'dashboard' && <DashboardPage setMainTab={setMainTab} />}
        {mainTab === 'orders' && <OrdersPage />}
        {mainTab === 'warehouse' && <WarehousePage />}
        {mainTab === 'accounting' && <AccountingPage />}
        {mainTab === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}

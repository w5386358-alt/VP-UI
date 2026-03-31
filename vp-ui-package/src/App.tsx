import React, { useEffect, useMemo, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {
  Bell,
  LogOut,
  Search,
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
  ShieldCheck,
  BarChart3,
  Package,
  Users,
  UserCog,
  ShoppingCart,
  Warehouse,
  ChevronRight,
  Sparkles,
  ScanLine,
  CreditCard,
  Boxes,
  ClipboardList,
  ArrowUpRight,
} from 'lucide-react';

type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type NavKey = 'dashboard' | 'products' | 'customers' | 'staff' | 'orders' | 'inventory';

type Product = { id: string; code: string; name: string; category: string; price: number; enabled: boolean; stock: number };
type Customer = { id: string; name: string; phone: string; level: string };
type Staff = { id: string; name: string; loginId: string; role: string; rank: string; enabled: boolean };
type SessionUser = { name: string; loginId: string; role: Role; rank: string };

type WorkflowCard = {
  title: string;
  desc: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
};

const mockProducts: Product[] = [
  { id: '1', code: 'E401', name: '女神酵素液', category: '保健', price: 899, enabled: true, stock: 36 },
  { id: '2', code: 'E402', name: '美妍X關鍵賦活飲', category: '保健', price: 1380, enabled: true, stock: 18 },
  { id: '3', code: 'P301', name: '瞬白激光精華4G', category: '保養', price: 1680, enabled: true, stock: 9 },
  { id: '4', code: 'P304', name: '奇肌修復全能霜', category: '保養', price: 1980, enabled: false, stock: 0 },
];

const mockCustomers: Customer[] = [
  { id: 'c1', name: '王小美', phone: '0912345678', level: 'VIP' },
  { id: 'c2', name: '林雅雯', phone: '0988777666', level: '一般' },
  { id: 'c3', name: '陳佳玲', phone: '0933555777', level: '代理' },
];

const mockStaff: Staff[] = [
  { id: 's1', name: '吳秉宸', loginId: 'vp001', role: '管理員', rank: '核心人員', enabled: true },
  { id: 's2', name: '王小婷', loginId: 'vp002', role: '銷售', rank: '普通銷售', enabled: true },
  { id: 's3', name: '陳小安', loginId: 'vp003', role: '會計', rank: '高級銷售', enabled: true },
];

const navItems: { key: NavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: '總覽', icon: BarChart3 },
  { key: 'products', label: '商品', icon: Package },
  { key: 'customers', label: '客戶', icon: Users },
  { key: 'staff', label: '人員', icon: UserCog },
  { key: 'orders', label: '訂單', icon: ShoppingCart },
  { key: 'inventory', label: '倉儲', icon: Warehouse },
];

const workflowCards: WorkflowCard[] = [
  {
    title: '訂購介面',
    desc: '依 GAS 既有邏輯承接商品、客戶、價格層級、購物車與下單流程，之後直接延伸為正式前台。',
    accent: 'rose',
    icon: Sparkles,
    bullets: ['商品列表 / 分類 / 搜尋', '客戶資料 / 配送欄位', '訂單主檔 / 訂單明細'],
  },
  {
    title: '會計中心',
    desc: '預留收款、退款、報表、排行榜版位，維持你原本 GAS 的金流與績效邏輯不變。',
    accent: 'gold',
    icon: CreditCard,
    bullets: ['未稅價 / 稅額 / 實收', '已收款 / 已退款 狀態', '銷售統計 / 排行榜'],
  },
  {
    title: '倉儲中心',
    desc: '對齊 inventory / inventory_logs / shipping，讓 QR、條碼、出貨與回補邏輯有對應 UI。',
    accent: 'pearl',
    icon: Boxes,
    bullets: ['出貨區 / 庫存區 / 查詢區', '條碼 / QR 身分識別', '入庫 / 出貨 / 退貨 / 換貨'],
  },
  {
    title: '個人資料',
    desc: '保留歷史訂單、個人業績、員編與權限顯示，之後直接套進你的使用者流程。',
    accent: 'lavender',
    icon: ClipboardList,
    bullets: ['我的歷史訂單', '累積業績 / 排名', '身分 / 階級 / 價格層級'],
  },
];

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : ({} as Record<string, string>);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
}

function getDb() {
  if (!hasFirebaseConfig()) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

function normalizeProduct(id: string, data: any): Product {
  return {
    id,
    code: data.code || data.productCode || data.productId || '-',
    name: data.name || data.productName || '未命名商品',
    category: data.category || data.productCategory || '未分類',
    price: Number(data.price || data.vipPrice || data.salePrice || 0),
    enabled: data.enabled ?? data.isActive ?? true,
    stock: Number(data.stock || data.currentStock || 0),
  };
}

function normalizeCustomer(id: string, data: any): Customer {
  return {
    id,
    name: data.name || data.customerName || '未命名客戶',
    phone: data.phone || data.customerPhone || '-',
    level: data.level || data.tier || data.customerLevel || '一般',
  };
}

function normalizeStaff(id: string, data: any): Staff {
  return {
    id,
    name: data.name || data.staffName || '未命名人員',
    loginId: data.loginId || data.staffId || data.id || '-',
    role: data.role || '未設定',
    rank: data.rank || '普通銷售',
    enabled: data.enabled ?? data.isActive ?? true,
  };
}

function getRankClass(rank: string) {
  if (rank.includes('核心')) return 'badge badge-rank-core';
  if (rank.includes('高級')) return 'badge badge-rank-senior';
  return 'badge badge-rank-normal';
}

function getSearchPlaceholder(active: NavKey) {
  switch (active) {
    case 'products':
      return '搜尋商品編號 / 商品名稱 / 分類';
    case 'customers':
      return '搜尋客戶姓名 / 電話 / 客戶層級';
    case 'staff':
      return '搜尋姓名 / 登入ID / 角色 / 階級';
    case 'orders':
      return '之後會接訂單編號 / 客戶 / 收款 / 出貨';
    case 'inventory':
      return '之後會接條碼 / QR / 商品 / 出貨狀態';
    default:
      return '搜尋系統資料與模組';
  }
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return <span className={enabled ? 'badge badge-success' : 'badge badge-danger'}>{enabled ? '啟用中' : '停用'}</span>;
}

function SummaryCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="card summary-card">
      <div className="summary-title">{title}</div>
      <div className="summary-value">{value}</div>
      <div className="summary-sub">{sub}</div>
    </div>
  );
}

function WorkflowModule({ card }: { card: WorkflowCard }) {
  const Icon = card.icon;
  return (
    <div className={`card workflow-card workflow-${card.accent}`}>
      <div className="workflow-head">
        <div className="workflow-icon-wrap">
          <Icon className="workflow-icon" />
        </div>
        <div>
          <div className="workflow-title">{card.title}</div>
          <div className="workflow-desc">{card.desc}</div>
        </div>
      </div>
      <div className="workflow-list">
        {card.bullets.map((bullet) => (
          <div key={bullet} className="workflow-bullet">
            <ChevronRight className="small-icon" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionIntro({ title, desc, stats }: { title: string; desc: string; stats: string[] }) {
  return (
    <div className="card section-intro-card">
      <div>
        <div className="section-intro-title">{title}</div>
        <div className="section-intro-desc">{desc}</div>
      </div>
      <div className="section-stat-row">
        {stats.map((stat) => (
          <span key={stat} className="badge badge-neutral">{stat}</span>
        ))}
      </div>
    </div>
  );
}

function PlaceholderCard({ title, desc, bullets }: { title: string; desc: string; bullets: string[] }) {
  return (
    <div className="card placeholder-card">
      <div className="placeholder-title">{title}</div>
      <div className="placeholder-desc">{desc}</div>
      <div className="placeholder-grid">
        {bullets.map((item) => (
          <div key={item} className="placeholder-bullet">
            <ArrowUpRight className="small-icon" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState<NavKey>('dashboard');
  const [booting, setBooting] = useState(true);
  const [bootMessage, setBootMessage] = useState('初始化中...');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [dataMode, setDataMode] = useState<'firebase' | 'mock'>('mock');
  const [user] = useState<SessionUser>({ name: '吳秉宸', loginId: 'vp001', role: 'admin', rank: '核心人員' });

  async function loadFirebaseData() {
    setBooting(true);
    try {
      const db = getDb();
      if (!db) {
        setDataMode('mock');
        setFirebaseReady(false);
        setProducts(mockProducts);
        setCustomers(mockCustomers);
        setStaff(mockStaff);
        setBootMessage('Firebase 未設定，先用目前版本畫面保底');
        return;
      }

      const [productsSnap, customersSnap, staffSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'customers')),
        getDocs(collection(db, 'staff')),
      ]);

      const nextProducts = productsSnap.docs.map((doc) => normalizeProduct(doc.id, doc.data()));
      const nextCustomers = customersSnap.docs.map((doc) => normalizeCustomer(doc.id, doc.data()));
      const nextStaff = staffSnap.docs.map((doc) => normalizeStaff(doc.id, doc.data()));

      setProducts(nextProducts.length ? nextProducts : mockProducts);
      setCustomers(nextCustomers.length ? nextCustomers : mockCustomers);
      setStaff(nextStaff.length ? nextStaff : mockStaff);
      setFirebaseReady(true);
      setDataMode('firebase');
      setBootMessage('Firebase 真資料已接入，目前版本可直接延續');
    } catch (error) {
      console.error(error);
      setProducts(mockProducts);
      setCustomers(mockCustomers);
      setStaff(mockStaff);
      setFirebaseReady(false);
      setDataMode('mock');
      setBootMessage('Firebase 讀取失敗，已切回 mock 畫面保底');
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => {
    void loadFirebaseData();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.code, p.name, p.category].join(' ').toLowerCase().includes(q));
  }, [keyword, products]);

  const filteredCustomers = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => [c.name, c.phone, c.level].join(' ').toLowerCase().includes(q));
  }, [keyword, customers]);

  const filteredStaff = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) => [s.name, s.loginId, s.role, s.rank].join(' ').toLowerCase().includes(q));
  }, [keyword, staff]);

  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const enabledProducts = products.filter((p) => p.enabled).length;
  const vipCustomers = customers.filter((c) => ['VIP', '代理'].some((tag) => c.level.includes(tag))).length;
  const activeStaff = staff.filter((s) => s.enabled).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand card">
          <div className="brand-kicker">VP SYSTEM</div>
          <div className="brand-title">Vercel UI</div>
          <div className="brand-subtitle">沿用你目前版本，只做 UI 設計優化，不破壞既有架構</div>
        </div>

        <div className="card user-card">
          <div className="muted-label">目前登入</div>
          <div className="user-name">{user.name}</div>
          <div className="user-id">ID：{user.loginId}</div>
          <div className="badge-row">
            <span className="badge badge-role">身分 / 管理員</span>
            <span className={getRankClass(user.rank)}>階級 / {user.rank}</span>
          </div>
        </div>

        <div className="card source-card">
          <div>
            <div className="muted-label">資料來源</div>
            <div className="source-value">{dataMode === 'firebase' ? 'Firebase' : 'Mock'}</div>
          </div>
          {firebaseReady ? <Wifi className="status-icon ok" /> : <WifiOff className="status-icon bad" />}
        </div>

        <div className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`nav-button ${active === item.key ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-tip card">
          <div className="sidebar-tip-title">目前策略</div>
          <div className="sidebar-tip-desc">先穩定承接 GAS 功能邏輯，再往訂購、會計、倉儲三大主模組擴充。</div>
        </div>

        <div className="sidebar-actions">
          <button type="button" className="ghost-button"><Bell className="small-icon" />通知</button>
          <button type="button" className="ghost-button"><LogOut className="small-icon" />登出</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="hero-card card">
          <div className="hero-copy">
            <div className="page-kicker">VP 訂購系統 / Vercel UI</div>
            <h1>沿用既有版本，專做高質感 UI 升級</h1>
            <p>
              這版以你現在的作品為基底，不亂改功能結構，只先把畫面層級、閱讀節奏、手機體驗與模組布局整理到可繼續擴充的狀態。
            </p>
            <div className="hero-badges">
              <span className="badge badge-soft">不破壞版本</span>
              <span className="badge badge-soft">保留 Firebase 接法</span>
              <span className="badge badge-soft">對齊 GAS 功能邏輯</span>
            </div>
          </div>
          <div className="hero-side">
            <div className="hero-status card">
              <div className="hero-status-head">
                {firebaseReady ? <ShieldCheck className="small-icon" /> : <Database className="small-icon" />}
                <span>{bootMessage}</span>
              </div>
              <div className="hero-status-list">
                <div><span>商品資料</span><strong>{products.length}</strong></div>
                <div><span>客戶資料</span><strong>{customers.length}</strong></div>
                <div><span>人員資料</span><strong>{staff.length}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="topbar">
          <div>
            <div className="section-tag">{navItems.find((item) => item.key === active)?.label}</div>
            <div className="topbar-title">模組操作區</div>
          </div>
          <div className="toolbar">
            <div className="search-wrap">
              <Search className="search-icon" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={getSearchPlaceholder(active)} />
            </div>
            <button type="button" className="primary-button" onClick={() => void loadFirebaseData()}>
              <RefreshCw className="small-icon" />刷新資料
            </button>
          </div>
        </div>

        {booting ? (
          <div className="card loading-card">
            <div className="spinner" />
            <div className="loading-title">{bootMessage}</div>
            <div className="loading-desc">正在建立目前版本的 UI 介面層與資料介接層</div>
          </div>
        ) : (
          <>
            <div className={`card banner-card ${firebaseReady ? 'success' : 'warning'}`}>
              {firebaseReady ? <ShieldCheck className="small-icon" /> : <Database className="small-icon" />}
              <div>
                <div className="banner-title">{bootMessage}</div>
                <div className="banner-desc">
                  {firebaseReady
                    ? '目前已直接讀取 Firebase 的 products / customers / staff，可繼續往訂單、倉儲、會計模組擴充。'
                    : '目前先用 mock 畫面保底，不影響你後續接真資料。'}
                </div>
              </div>
            </div>

            <section className="summary-grid">
              <SummaryCard title="商品總數" value={String(products.length)} sub={`啟用 ${enabledProducts} / 停用 ${products.length - enabledProducts}`} />
              <SummaryCard title="客戶總數" value={String(customers.length)} sub={`VIP / 代理 ${vipCustomers}`} />
              <SummaryCard title="人員總數" value={String(staff.length)} sub={`啟用中 ${activeStaff}`} />
              <SummaryCard title="低庫存提醒" value={String(lowStockCount)} sub="stock <= 10" />
            </section>

            {active === 'dashboard' && (
              <>
                <section className="workflow-grid">
                  {workflowCards.map((card) => <WorkflowModule key={card.title} card={card} />)}
                </section>

                <section className="two-column-grid">
                  <div className="card content-card">
                    <h2>這版 UI 做了什麼</h2>
                    <div className="stack-list">
                      <div>1. 沿用你現有前端版本，不重寫資料架構</div>
                      <div>2. 把資訊密度整理成可閱讀、可延伸的模組版位</div>
                      <div>3. 商品 / 客戶 / 人員 三個主資料頁統一視覺規格</div>
                      <div>4. 手機版改成單欄式閱讀，保留後續做底部導覽空間</div>
                      <div>5. 為訂單、會計、倉儲預留符合你 GAS 邏輯的UI骨架</div>
                    </div>
                  </div>
                  <div className="card content-card">
                    <h2>接下來可直接往下做</h2>
                    <div className="stack-list compact">
                      <div>商品前台購物車</div>
                      <div>訂單主檔 / 明細寫入</div>
                      <div>收款 / 退款 / 銷售統計</div>
                      <div>庫存查詢 / QR / 出貨流程</div>
                      <div>個人歷史訂單 / 累積業績</div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {active === 'products' && (
              <>
                <SectionIntro
                  title="商品主資料"
                  desc="這區先承接你原本產品資料庫邏輯，重點放在編號、名稱、分類、價格與庫存狀態的閱讀效率。"
                  stats={[`總數 ${products.length}`, `啟用 ${enabledProducts}`, `低庫存 ${lowStockCount}`]}
                />
                <section className="record-grid">
                  {filteredProducts.map((item) => (
                    <div key={item.id} className="card data-card product-card">
                      <div className="data-card-top">
                        <span className="data-code">{item.code}</span>
                        <StatusBadge enabled={item.enabled} />
                      </div>
                      <div className="data-card-title">{item.name}</div>
                      <div className="data-card-subtitle">{item.category}</div>
                      <div className="metric-row three">
                        <div className="metric-box">
                          <span>價格</span>
                          <strong>${item.price}</strong>
                        </div>
                        <div className="metric-box">
                          <span>庫存</span>
                          <strong>{item.stock}</strong>
                        </div>
                        <div className="metric-box">
                          <span>狀態</span>
                          <strong>{item.enabled ? '上架' : '停用'}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}

            {active === 'customers' && (
              <>
                <SectionIntro
                  title="客戶主資料"
                  desc="維持你原本客戶檔資料邏輯，先把姓名、電話、客戶層級做成適合手機閱讀的資訊卡。"
                  stats={[`總數 ${customers.length}`, `VIP / 代理 ${vipCustomers}`, '後續可接地址 / 配送資訊']}
                />
                <section className="record-grid customer-grid">
                  {filteredCustomers.map((item) => (
                    <div key={item.id} className="card data-card customer-card">
                      <div className="data-card-title">{item.name}</div>
                      <div className="data-card-subtitle">{item.phone}</div>
                      <div className="data-chip-row">
                        <span className="badge badge-role">{item.level}</span>
                        <span className="badge badge-neutral">客戶ID {item.id}</span>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}

            {active === 'staff' && (
              <>
                <SectionIntro
                  title="人員主資料"
                  desc="這區保留你的人員管理邏輯，強化角色、階級、登入 ID 的呈現，方便後面接權限與個人資料頁。"
                  stats={[`總數 ${staff.length}`, `啟用中 ${activeStaff}`, '後續可接角色權限']}
                />
                <section className="record-grid staff-grid">
                  {filteredStaff.map((item) => (
                    <div key={item.id} className="card data-card staff-card">
                      <div className="data-card-top">
                        <span className="badge badge-neutral">{item.role}</span>
                        <StatusBadge enabled={item.enabled} />
                      </div>
                      <div className="data-card-title">{item.name}</div>
                      <div className="data-card-subtitle">登入 ID：{item.loginId}</div>
                      <div className="data-chip-row">
                        <span className={getRankClass(item.rank)}>{item.rank}</span>
                        <span className="badge badge-role">{item.role}</span>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}

            {active === 'orders' && (
              <PlaceholderCard
                title="訂單模組 UI 骨架已預留"
                desc="下一步直接承接 orders / order_items / payments。畫面會朝你的 GAS 下單邏輯做：客戶資料、配送方式、購物車、價格層級、收款狀態。"
                bullets={['訂單主檔 / 明細', '客戶資料 / 地址 / 配送', '已收款 / 待出貨 / 已完成', '行動版購物車抽屜']}
              />
            )}

            {active === 'inventory' && (
              <PlaceholderCard
                title="倉儲模組 UI 骨架已預留"
                desc="下一步直接承接 inventory / inventory_logs / shipping，對齊你現在的條碼、QR、入庫、出貨、退貨、換貨邏輯。"
                bullets={['出貨區 / 庫存區 / 查詢區', '商品條碼 / QR 身分識別', '出入庫紀錄時間軸', '退貨 / 換貨 / 回補庫存']}
              />
            )}
          </>
        )}
      </main>

      <div className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.key} type="button" className={`mobile-nav-btn ${active === item.key ? 'active' : ''}`} onClick={() => setActive(item.key)}>
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" className="mobile-nav-btn refresh" onClick={() => void loadFirebaseData()}>
          <RefreshCw className="nav-icon" />
          <span>刷新</span>
        </button>
      </div>
    </div>
  );
}

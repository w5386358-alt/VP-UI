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
  CreditCard,
  Boxes,
  ClipboardList,
  ArrowUpRight,
  Truck,
  Store,
  MapPin,
  Phone,
  User,
  Wallet,
  BadgePercent,
  FileText,
  Receipt,
  History,
  Trophy,
  QrCode,
  CalendarRange,
} from 'lucide-react';

type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type NavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'products' | 'customers' | 'staff' | 'profile';

type Product = { id: string; code: string; name: string; category: string; price: number; enabled: boolean; stock: number };
type Customer = { id: string; name: string; phone: string; level: string };
type Staff = { id: string; name: string; loginId: string; role: string; rank: string; enabled: boolean };
type SessionUser = { name: string; loginId: string; role: Role; rank: string };
type ShippingMethod = '宅配' | '店到店' | '自取';
type CartItem = Product & { qty: number };
type WarehouseTab = 'shipping' | 'stock' | 'query';

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
  { id: '5', code: 'P305', name: '超逆齡修復菁萃', category: '保養', price: 2280, enabled: true, stock: 14 },
  { id: '6', code: 'E408', name: '魔力抹茶機能飲', category: '保健', price: 1380, enabled: true, stock: 22 },
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
  { key: 'orders', label: '訂購', icon: ShoppingCart },
  { key: 'inventory', label: '倉儲', icon: Warehouse },
  { key: 'accounting', label: '會計中心', icon: CreditCard },
  { key: 'products', label: '商品', icon: Package },
  { key: 'customers', label: '客戶', icon: Users },
  { key: 'staff', label: '人員', icon: UserCog },
  { key: 'profile', label: '個人資料', icon: ClipboardList },
];


const shippingQueue = [
  { orderNo: 'VP20260331-001', customer: '王小美', paymentStatus: '已收款', shippingStatus: '待出貨', itemCount: 3, urgency: 'high' },
  { orderNo: 'VP20260331-002', customer: '林雅雯', paymentStatus: '已收款', shippingStatus: '理貨中', itemCount: 2, urgency: 'medium' },
  { orderNo: 'EX20260331-001', customer: '陳佳玲', paymentStatus: '免收款', shippingStatus: '換貨待出庫', itemCount: 1, urgency: 'medium' },
];

const inventoryFlow = [
  { title: '入庫作業', desc: '對齊 inventory_logs，支援商品條碼 + QR 身分識別寫入。', tags: ['入庫', '期初', '供應商'] },
  { title: '庫存查詢', desc: '以商品條碼查總庫存，以 QR 身分識別查個別數量。', tags: ['商品條碼', 'QR(A)*2', 'QR(B)*1'] },
  { title: '異動紀錄', desc: '出貨、退貨、換貨退回、換貨出庫、報廢都能留痕跡。', tags: ['inventory_logs', '時間軸', '防超賣'] },
];

const queryExamples = [
  { label: '商品條碼查詢', value: '顯示商品名稱、商品條碼、總庫存、最近入庫時間、各 QR 加總' },
  { label: 'QR 身分識別查詢', value: '顯示該 QR 數量、入庫時間、入庫人員、商品名稱與條碼' },
  { label: '訂單查詢', value: '顯示待出貨 / 已出貨 / 已退款 / 已換貨，供出貨與回補判讀' },
];


const paymentQueue = [
  { orderNo: 'VP20260331-001', customer: '王小美', paymentStatus: '待收款', shippingStatus: '待出貨', amount: 4259, shippingFee: 100, taxRate: 5, proof: '待上傳' },
  { orderNo: 'VP20260331-002', customer: '林雅雯', paymentStatus: '已收款', shippingStatus: '理貨中', amount: 2825, shippingFee: 65, taxRate: 0, proof: '已上傳' },
  { orderNo: 'EX20260331-001', customer: '陳佳玲', paymentStatus: '退款處理中', shippingStatus: '換貨待出庫', amount: 65, shippingFee: 65, taxRate: 0, proof: '換貨單' },
];

const accountingSummary = [
  { title: '今日實收', value: '$7,149', sub: '依實收總額統計' },
  { title: '待收款', value: '$4,259', sub: '待確認收款 1 筆' },
  { title: '退款處理', value: '$65', sub: '換貨運費獨立處理' },
  { title: '本月毛利', value: '$18,420', sub: '原價 - 稅額 - 運費 - 成本' },
];

const accountingBoards = [
  {
    title: '收款 / 退款作業',
    desc: '保留未稅價、應稅價%、運費、實收總額、統一編號、收款證明上傳的版位。',
    bullets: ['已收款 / 已退款 防呆', '訂單紀錄日期區間', '收據 / 匯款截圖 / AI辨識位'],
  },
  {
    title: '銷售統計',
    desc: '給會議看的營收板，後續可直接接區間營收、稅額、運費、毛利與商品銷售圖。',
    bullets: ['區間營收', '稅金總額', '運費總額'],
  },
  {
    title: '排行榜 / 熱銷',
    desc: '銷售冠軍、完成訂單數、熱門商品、退貨影響值都先預留位置。',
    bullets: ['人員排行', '商品熱銷排行', '退款扣回績效'],
  },
];
const personalSummary = [
  { title: '累積業績', value: '$128,600', sub: '退款與退貨需反向扣回' },
  { title: '完成訂單數', value: '86', sub: '含正常完成與已出貨單' },
  { title: '目前排名', value: '#3', sub: '本月銷售排行' },
  { title: '待追蹤', value: '4', sub: '待收款 / 待出貨 / 退款影響' },
];

const personalOrders = [
  { orderNo: 'VP20260329-021', date: '2026/03/29 14:20', amount: 3680, paymentStatus: '已收款', shippingStatus: '已出貨', mainStatus: '已完成' },
  { orderNo: 'VP20260330-008', date: '2026/03/30 11:05', amount: 4259, paymentStatus: '待收款', shippingStatus: '待出貨', mainStatus: '處理中' },
  { orderNo: 'EX20260330-001', date: '2026/03/30 18:42', amount: 65, paymentStatus: '退款處理中', shippingStatus: '換貨待出庫', mainStatus: '換貨處理' },
  { orderNo: 'VP20260331-002', date: '2026/03/31 09:08', amount: 2825, paymentStatus: '已收款', shippingStatus: '理貨中', mainStatus: '出貨中' },
];



const workflowCards: WorkflowCard[] = [
  {
    title: '訂購介面',
    desc: '依 GAS 既有邏輯承接商品、客戶、價格層級、購物車與下單流程，這版先把前台骨架與資料卡位整理好。',
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
      return '搜尋商品 / 客戶 / 電話 / 配送方式';
    case 'inventory':
      return '之後會接條碼 / QR / 商品 / 出貨狀態';
    case 'accounting':
      return '搜尋訂單編號 / 客戶 / 收款狀態 / 退款狀態 / 收款證明';
    case 'profile':
      return '搜尋我的歷史訂單 / 訂單編號 / 狀態 / 日期';
    default:
      return '搜尋系統資料與模組';
  }
}

function getShippingFee(method: ShippingMethod) {
  if (method === '宅配') return 100;
  if (method === '店到店') return 65;
  return 0;
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

  const [cart, setCart] = useState<CartItem[]>([
    { ...mockProducts[0], qty: 1 },
    { ...mockProducts[2], qty: 2 },
  ]);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('宅配');
  const [customerName, setCustomerName] = useState('王小美');
  const [customerPhone, setCustomerPhone] = useState('0912345678');
  const [customerAddress, setCustomerAddress] = useState('新竹市東區食品路 88 號');
  const [remark, setRemark] = useState('晚上可收件，若自取請先通知。');
  const [discountMode, setDiscountMode] = useState<'無' | '固定金額'>('無');
  const [discountValue, setDiscountValue] = useState(0);
  const [warehouseTab, setWarehouseTab] = useState<WarehouseTab>('shipping');

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

  const filteredOrderProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const source = products.filter((item) => item.enabled);
    if (!q) return source;
    return source.filter((item) => [item.code, item.name, item.category].join(' ').toLowerCase().includes(q));
  }, [keyword, products]);

  const shippingFee = getShippingFee(shippingMethod);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const discountAmount = discountMode === '固定金額' ? discountValue : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const enabledProducts = products.filter((p) => p.enabled).length;
  const vipCustomers = customers.filter((c) => ['VIP', '代理'].some((tag) => c.level.includes(tag))).length;
  const activeStaff = staff.filter((s) => s.enabled).length;

  function addToCart(item: Product) {
    if (!item.enabled || item.stock <= 0) return;
    setCart((prev) => {
      const found = prev.find((entry) => entry.id === item.id);
      if (found) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, qty: Math.min(entry.qty + 1, Math.max(item.stock, 1)) } : entry,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function updateQty(id: string, nextQty: number) {
    setCart((prev) =>
      prev
        .map((entry) => (entry.id === id ? { ...entry, qty: Math.max(1, Math.min(nextQty, Math.max(entry.stock, 1))) } : entry))
        .filter((entry) => entry.qty > 0),
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((entry) => entry.id !== id));
  }

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

        <div className="nav-group-title">主功能選單</div>
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

        <div className="card accounting-shortcut">
          <div className="shortcut-title">本版修正</div>
          <button
            type="button"
            onClick={() => setActive('accounting')}
            className={`shortcut-button ${active === 'accounting' ? 'active' : ''}`}
          >
            <CreditCard className="small-icon" />會計中心
          </button>
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
                  desc="先把客戶姓名、電話與客戶層級整理成較易閱讀的卡片模式，後續可直接接地址、收件方式、歷史訂單。"
                  stats={[`總數 ${customers.length}`, `VIP / 代理 ${vipCustomers}`, '可延伸地址 / 配送資訊']}
                />
                <section className="record-grid customer-grid">
                  {filteredCustomers.map((item) => (
                    <div key={item.id} className="card data-card">
                      <div className="data-card-top">
                        <span className="badge badge-neutral">客戶資料</span>
                        <span className="badge badge-soft">{item.level}</span>
                      </div>
                      <div className="data-card-title">{item.name}</div>
                      <div className="data-card-subtitle">電話：{item.phone}</div>
                      <div className="data-chip-row">
                        <span className="badge badge-neutral">地址欄位待接</span>
                        <span className="badge badge-neutral">歷史訂單待接</span>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}

            {active === 'staff' && (
              <>
                <SectionIntro
                  title="人員管理"
                  desc="承接你原本人員管理表的邏輯，這版先整理登入 ID、角色、階級與啟用狀態的視覺層級。"
                  stats={[`總數 ${staff.length}`, `啟用中 ${activeStaff}`, '角色 / 階級 / 權限骨架']}
                />
                <section className="record-grid staff-grid">
                  {filteredStaff.map((item) => (
                    <div key={item.id} className="card data-card">
                      <div className="data-card-top">
                        <span className="badge badge-role">{item.role}</span>
                        <StatusBadge enabled={item.enabled} />
                      </div>
                      <div className="data-card-title">{item.name}</div>
                      <div className="data-card-subtitle">登入 ID：{item.loginId}</div>
                      <div className="data-chip-row">
                        <span className={getRankClass(item.rank)}>階級 / {item.rank}</span>
                        <span className="badge badge-neutral">權限模組待接</span>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}

            {active === 'orders' && (
              <>
                <SectionIntro
                  title="訂購介面骨架"
                  desc="這版先把前台購物、客戶資料、配送方式、訂單摘要放進同一個工作流裡，版型直接對齊你之後要接的 GAS 下單邏輯。"
                  stats={[`購物車 ${itemCount} 件`, `配送 ${shippingMethod}`, `合計 $${grandTotal}`]}
                />

                <section className="order-layout">
                  <div className="order-main">
                    <div className="card order-panel">
                      <div className="panel-head">
                        <div>
                          <div className="panel-title">商品列表</div>
                          <div className="panel-desc">保留商品分類 / 搜尋 / 加入購物車節奏，後續可直接接前台正式下單流程。</div>
                        </div>
                        <span className="badge badge-soft">價格層級 / {user.rank === '核心人員' ? '總代理價格' : 'VIP價格'}</span>
                      </div>

                      <div className="catalog-grid">
                        {filteredOrderProducts.map((item) => (
                          <div key={item.id} className="catalog-card">
                            <div className="catalog-meta-row">
                              <span className="data-code">{item.code}</span>
                              <span className={`badge ${item.stock <= 10 ? 'badge-danger' : 'badge-success'}`}>
                                {item.stock <= 10 ? `低庫存 ${item.stock}` : `庫存 ${item.stock}`}
                              </span>
                            </div>
                            <div className="catalog-name">{item.name}</div>
                            <div className="catalog-desc">{item.category} / 依身分與階級可切換價格顯示</div>
                            <div className="catalog-footer">
                              <div>
                                <div className="mini-label">目前價格</div>
                                <div className="catalog-price">${item.price}</div>
                              </div>
                              <button type="button" className="mini-add-btn" onClick={() => addToCart(item)} disabled={!item.enabled || item.stock <= 0}>
                                加入
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card order-panel">
                      <div className="panel-head">
                        <div>
                          <div className="panel-title">客戶與配送資料</div>
                          <div className="panel-desc">欄位命名依你後續 GAS 邏輯保留：客戶姓名、電話、地址、配送方式、備註。</div>
                        </div>
                        <span className="badge badge-neutral">訂單主檔欄位</span>
                      </div>

                      <div className="form-grid two-col">
                        <label className="field-card">
                          <span className="field-label"><User className="small-icon" />客戶姓名</span>
                          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="請輸入客戶姓名" />
                        </label>
                        <label className="field-card">
                          <span className="field-label"><Phone className="small-icon" />客戶電話</span>
                          <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="請輸入電話" />
                        </label>
                        <label className="field-card field-span-2">
                          <span className="field-label"><MapPin className="small-icon" />收件地址 / 店名</span>
                          <input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="宅配填地址，店到店填店名，自取可留空" />
                        </label>
                      </div>

                      <div className="shipping-method-row">
                        {(['宅配', '店到店', '自取'] as ShippingMethod[]).map((method) => (
                          <button
                            key={method}
                            type="button"
                            className={`shipping-chip ${shippingMethod === method ? 'active' : ''}`}
                            onClick={() => setShippingMethod(method)}
                          >
                            {method === '自取' ? <Store className="small-icon" /> : <Truck className="small-icon" />}
                            <span>{method}</span>
                            <strong>${getShippingFee(method)}</strong>
                          </button>
                        ))}
                      </div>

                      <div className="form-grid two-col form-gap-top">
                        <label className="field-card">
                          <span className="field-label"><BadgePercent className="small-icon" />折扣模式</span>
                          <select value={discountMode} onChange={(e) => setDiscountMode(e.target.value as '無' | '固定金額')}>
                            <option value="無">無</option>
                            <option value="固定金額">固定金額</option>
                          </select>
                        </label>
                        <label className="field-card">
                          <span className="field-label"><Wallet className="small-icon" />折扣金額</span>
                          <input
                            type="number"
                            min={0}
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value || 0))}
                            placeholder="0"
                            disabled={discountMode === '無'}
                          />
                        </label>
                        <label className="field-card field-span-2">
                          <span className="field-label"><FileText className="small-icon" />訂單備註</span>
                          <textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={4} placeholder="例：收款提醒、配送備註、時間要求" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="order-side">
                    <div className="card order-panel sticky-panel">
                      <div className="panel-head compact-head">
                        <div>
                          <div className="panel-title">購物車摘要</div>
                          <div className="panel-desc">之後可直接對接 order_items、shipping、payments。</div>
                        </div>
                        <span className="badge badge-role">{itemCount} 件</span>
                      </div>

                      <div className="cart-list">
                        {cart.map((item) => (
                          <div key={item.id} className="cart-item">
                            <div className="cart-item-top">
                              <div>
                                <div className="cart-name">{item.name}</div>
                                <div className="cart-meta">{item.code} / 單價 ${item.price}</div>
                              </div>
                              <button type="button" className="text-button" onClick={() => removeFromCart(item.id)}>移除</button>
                            </div>
                            <div className="cart-item-bottom">
                              <div className="qty-box">
                                <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                                <span>{item.qty}</span>
                                <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                              </div>
                              <strong>${item.price * item.qty}</strong>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="summary-lines">
                        <div><span>商品小計</span><strong>${subtotal}</strong></div>
                        <div><span>運費</span><strong>${shippingFee}</strong></div>
                        <div><span>折扣</span><strong>-${discountAmount}</strong></div>
                        <div className="grand"><span>訂單總額</span><strong>${grandTotal}</strong></div>
                      </div>

                      <button type="button" className="primary-button full-width">
                        <Receipt className="small-icon" />送出訂單（UI示意）
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {active === 'inventory' && (
              <>
                <SectionIntro
                  title="倉儲中心骨架"
                  desc="這版先把倉儲拆成出貨區、庫存區、查詢區，版面依你原本 GAS 倉儲邏輯去排，不亂動資料規則。"
                  stats={[`待出貨 ${shippingQueue.length}`, `低庫存 ${lowStockCount}`, 'QR / 條碼 / 出貨單骨架']}
                />

                <div className="warehouse-tab-row">
                  <button type="button" className={`warehouse-tab ${warehouseTab === 'shipping' ? 'active' : ''}`} onClick={() => setWarehouseTab('shipping')}>
                    <Truck className="small-icon" />出貨區
                  </button>
                  <button type="button" className={`warehouse-tab ${warehouseTab === 'stock' ? 'active' : ''}`} onClick={() => setWarehouseTab('stock')}>
                    <Boxes className="small-icon" />庫存區
                  </button>
                  <button type="button" className={`warehouse-tab ${warehouseTab === 'query' ? 'active' : ''}`} onClick={() => setWarehouseTab('query')}>
                    <Search className="small-icon" />查詢區
                  </button>
                </div>

                {warehouseTab === 'shipping' && (
                  <section className="warehouse-layout">
                    <div className="warehouse-main">
                      <div className="card order-panel">
                        <div className="panel-head">
                          <div>
                            <div className="panel-title">待出貨訂單</div>
                            <div className="panel-desc">先把出貨作業、出貨單、已收款判斷集中在同一區，方便你下一步接 shipping 與 orders。</div>
                          </div>
                          <span className="badge badge-danger">需優先處理 {shippingQueue.length} 筆</span>
                        </div>

                        <div className="shipping-queue">
                          {shippingQueue.map((item) => (
                            <div key={item.orderNo} className="shipping-row">
                              <div>
                                <div className="shipping-order">{item.orderNo}</div>
                                <div className="shipping-meta">{item.customer} / {item.itemCount} 件 / {item.paymentStatus}</div>
                              </div>
                              <div className="shipping-actions">
                                <span className={`badge ${item.urgency === 'high' ? 'badge-danger' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                                <button type="button" className="ghost-button compact-btn">出貨作業</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="warehouse-side">
                      <div className="card order-panel sticky-panel">
                        <div className="panel-head compact-head">
                          <div>
                            <div className="panel-title">出貨區重點</div>
                            <div className="panel-desc">直接對齊你原本出貨邏輯。</div>
                          </div>
                        </div>
                        <div className="stack-list compact">
                          <div>已收款才可出貨</div>
                          <div>同 QR 多數量要依剩餘可出貨數量判讀</div>
                          <div>換貨 B 需自動產生金額 0 的出貨單</div>
                          <div>shipping / orders / inventory / inventory_logs 要一起留痕跡</div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {warehouseTab === 'stock' && (
                  <section className="warehouse-flow-grid">
                    {inventoryFlow.map((item) => (
                      <div key={item.title} className="card flow-card">
                        <div className="flow-title">{item.title}</div>
                        <div className="flow-desc">{item.desc}</div>
                        <div className="data-chip-row">
                          {item.tags.map((tag) => <span key={tag} className="badge badge-neutral">{tag}</span>)}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {warehouseTab === 'query' && (
                  <section className="warehouse-query-grid">
                    {queryExamples.map((item) => (
                      <div key={item.label} className="card query-card">
                        <div className="query-label">{item.label}</div>
                        <div className="query-value">{item.value}</div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}


            {active === 'accounting' && (
              <>
                <SectionIntro
                  title="會計中心骨架"
                  desc="這版先把收款 / 退款作業、銷售統計、排行榜三塊版位整理好，欄位命名直接對齊你後面要接的 GAS 會計邏輯。"
                  stats={[`待收款 ${paymentQueue.filter((item) => item.paymentStatus === '待收款').length} 筆`, '已收款 / 已退款 防呆位', '報表 / 排行榜骨架']}
                />

                <section className="summary-grid">
                  {accountingSummary.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />
                  ))}
                </section>

                <section className="two-column-grid accounting-top-grid">
                  <div className="card order-panel">
                    <div className="panel-head">
                      <div>
                        <div className="panel-title">收款 / 退款作業</div>
                        <div className="panel-desc">保留你指定的欄位：統一編號、未稅價、應稅價%、運費、實收總額、收款證明。</div>
                      </div>
                      <span className="badge badge-role">會計流程</span>
                    </div>

                    <div className="form-grid two-col accounting-form-grid">
                      <label className="field-card">
                        <span className="field-label"><Receipt className="small-icon" />訂單編號</span>
                        <input value="VP20260331-001" readOnly />
                      </label>
                      <label className="field-card">
                        <span className="field-label"><User className="small-icon" />客戶姓名</span>
                        <input value="王小美" readOnly />
                      </label>
                      <label className="field-card">
                        <span className="field-label"><Wallet className="small-icon" />未稅價</span>
                        <input value="4056" readOnly />
                      </label>
                      <label className="field-card">
                        <span className="field-label"><BadgePercent className="small-icon" />應稅價 %</span>
                        <input value="5" readOnly />
                      </label>
                      <label className="field-card">
                        <span className="field-label"><Truck className="small-icon" />運費</span>
                        <input value="100" readOnly />
                      </label>
                      <label className="field-card">
                        <span className="field-label"><CreditCard className="small-icon" />實收總額</span>
                        <input value="4259" readOnly />
                      </label>
                      <label className="field-card field-span-2">
                        <span className="field-label"><FileText className="small-icon" />收款證明 / 備註</span>
                        <textarea rows={4} readOnly value="保留收據、匯款紀錄、轉帳截圖、AI辨識結果的位置。" />
                      </label>
                    </div>

                    <div className="accounting-action-row">
                      <button type="button" className="primary-button"><CreditCard className="small-icon" />確認收款</button>
                      <button type="button" className="ghost-button compact-btn"><RefreshCw className="small-icon" />確認退款</button>
                    </div>
                  </div>

                  <div className="card order-panel">
                    <div className="panel-head compact-head">
                      <div>
                        <div className="panel-title">會計模組重點</div>
                        <div className="panel-desc">依你目前規格，這邊先把規則放好。</div>
                      </div>
                    </div>
                    <div className="stack-list compact">
                      <div>待收款 / 未收款 / 待出貨一律紅色</div>
                      <div>已收款 / 已完成 / 已出貨一律綠色</div>
                      <div>已退款必須防重複操作</div>
                      <div>退款會影響報表、毛利、排行、個人業績</div>
                      <div>訂單紀錄需支援日期區間與狀態篩選</div>
                    </div>
                  </div>
                </section>

                <section className="card order-panel">
                  <div className="panel-head">
                    <div>
                      <div className="panel-title">訂單紀錄 / 收款狀態</div>
                      <div className="panel-desc">這裡先整理會計最常看的列表，後續直接接 payments / refunds / sales_report。</div>
                    </div>
                    <span className="badge badge-soft">日期區間 / 狀態篩選待接</span>
                  </div>

                  <div className="shipping-queue accounting-queue">
                    {paymentQueue.map((item) => (
                      <div key={item.orderNo} className="shipping-row accounting-row">
                        <div>
                          <div className="shipping-order">{item.orderNo}</div>
                          <div className="shipping-meta">{item.customer} / 運費 ${item.shippingFee} / 稅率 {item.taxRate}% / 證明：{item.proof}</div>
                        </div>
                        <div className="shipping-actions accounting-statuses">
                          <span className={`badge ${item.paymentStatus === '已收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                          <span className={`badge ${item.shippingStatus.includes('待') ? 'badge-danger' : 'badge-soft'}`}>{item.shippingStatus}</span>
                          <strong className="accounting-amount">${item.amount}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="three-column-grid">
                  {accountingBoards.map((item) => (
                    <PlaceholderCard key={item.title} title={item.title} desc={item.desc} bullets={item.bullets} />
                  ))}
                </section>
              </>
            )}

            {active === 'profile' && (
              <>
                <SectionIntro
                  title="個人資料 / 我的歷史訂單"
                  desc="這版先把個人資料、累積業績、歷史訂單、掃碼與刷新整理按鈕的位置排好，後面直接沿用你原本 GAS 的個人流程去接。"
                  stats={[`歷史訂單 ${personalOrders.length} 筆`, '個人資料 / 業績雙區塊', '掃碼 / 刷新整理 預留']}
                />

                <section className="summary-grid">
                  {personalSummary.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />
                  ))}
                </section>

                <section className="two-column-grid profile-top-grid">
                  <div className="card order-panel">
                    <div className="panel-head">
                      <div>
                        <div className="panel-title">個人資料</div>
                        <div className="panel-desc">上半部先固定你的個人資訊卡位：姓名、員工編號、登入 ID、身分、階級、員編 QR。</div>
                      </div>
                      <span className="badge badge-role">個人中心</span>
                    </div>

                    <div className="profile-identity-card">
                      <div className="profile-avatar">秉</div>
                      <div className="profile-main">
                        <div className="profile-name">{user.name}</div>
                        <div className="profile-id-row">員工編號：VP001 / 登入 ID：{user.loginId}</div>
                        <div className="data-chip-row">
                          <span className="badge badge-role">身分 / 管理員</span>
                          <span className={getRankClass(user.rank)}>階級 / {user.rank}</span>
                          <span className="badge badge-neutral">價格層級 / 總代理價格</span>
                        </div>
                      </div>
                      <div className="profile-qr-box">
                        <QrCode className="profile-qr-icon" />
                        <span>員編 QR 預留</span>
                      </div>
                    </div>
                  </div>

                  <div className="card order-panel">
                    <div className="panel-head compact-head">
                      <div>
                        <div className="panel-title">我的累積業績</div>
                        <div className="panel-desc">下半部對齊你的個人業績與排名邏輯。</div>
                      </div>
                    </div>
                    <div className="profile-performance-grid">
                      <div className="metric-box large"><span>累積業績</span><strong>$128,600</strong></div>
                      <div className="metric-box large"><span>完成訂單數</span><strong>86</strong></div>
                      <div className="metric-box large"><span>目前排名</span><strong>#3</strong></div>
                      <div className="metric-box large"><span>退款扣回影響</span><strong>-$1,240</strong></div>
                    </div>
                  </div>
                </section>

                <section className="card order-panel profile-history-panel">
                  <div className="panel-head">
                    <div>
                      <div className="panel-title">我的歷史訂單</div>
                      <div className="panel-desc">保留你指定的搜尋、掃碼、刷新整理三個操作節奏，後續可直接接歷史訂單完整查詢。</div>
                    </div>
                    <div className="history-toolbar">
                      <button type="button" className="ghost-button compact-btn"><QrCode className="small-icon" />掃碼</button>
                      <button type="button" className="ghost-button compact-btn"><RefreshCw className="small-icon" />刷新整理</button>
                    </div>
                  </div>

                  <div className="history-filter-row">
                    <div className="search-wrap inline-search">
                      <Search className="search-icon" />
                      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜尋訂單編號 / 狀態 / 日期" />
                    </div>
                    <button type="button" className="primary-button compact-primary">輸入</button>
                  </div>

                  <div className="history-list">
                    {personalOrders
                      .filter((item) => !keyword.trim() || `${item.orderNo} ${item.date} ${item.paymentStatus} ${item.shippingStatus} ${item.mainStatus}`.toLowerCase().includes(keyword.trim().toLowerCase()))
                      .map((item) => (
                      <div key={item.orderNo} className="history-row">
                        <div>
                          <div className="history-order">{item.orderNo}</div>
                          <div className="history-meta"><CalendarRange className="small-icon" />{item.date}</div>
                        </div>
                        <div className="history-statuses">
                          <span className={`badge ${item.paymentStatus.includes('已收款') ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                          <span className={`badge ${item.shippingStatus.includes('已出貨') || item.shippingStatus.includes('理貨') ? 'badge-success' : item.shippingStatus.includes('換貨') ? 'badge-neutral' : 'badge-danger'}`}>{item.shippingStatus}</span>
                          <span className="badge badge-soft">{item.mainStatus}</span>
                        </div>
                        <div className="history-amount">${item.amount}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
            )}
          </>
        )}
      </main>
    </div>
  );
}

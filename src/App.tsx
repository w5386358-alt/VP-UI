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
type AccountingTab = 'ops' | 'stats' | 'ranking';

type WorkflowCard = {
  title: string;
  desc: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
};

type NoticeTone = 'success' | 'warning' | 'error';
type ActionNotice = { text: string; tone: NoticeTone };

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

const warehouseSummary = [
  { title: '待出貨', value: '12', sub: '已收款待出貨 8 / 換貨待出庫 4' },
  { title: '低庫存', value: '3', sub: '安全值以下需先補貨' },
  { title: '今日入出庫', value: '26', sub: '含入庫 / 出貨 / 退貨 / 換貨' },
  { title: '待查異常', value: '2', sub: 'QR 重覆掃描 / 數量需覆核' },
];

const shippingChecklist = [
  { title: '掃描驗證', desc: '商品條碼 + QR 身分識別雙條件驗證，先擋掉錯貨與重覆出貨。' },
  { title: '數量判讀', desc: '改看剩餘可出貨數量，不只看 QR 狀態字樣，避免同 QR 剩餘量被卡死。' },
  { title: '完成連動', desc: 'shipping、orders、inventory、inventory_logs、sales_report 同步留痕跡。' },
];

const stockSnapshot = [
  { code: 'E401', name: '女神酵素液', stock: 36, safe: 12, qr: 'QR(A)*18 / QR(B)*18', status: '正常' },
  { code: 'P301', name: '瞬白激光精華4G', stock: 9, safe: 10, qr: 'QR(P1)*6 / QR(P2)*3', status: '低庫存' },
  { code: 'E408', name: '魔力抹茶機能飲', stock: 22, safe: 8, qr: 'QR(M)*22', status: '正常' },
];

const warehouseRecentLogs = [
  { time: '09:12', type: '出貨', note: 'VP20260331-001 完成出貨，扣減 E401*2 / P301*1' },
  { time: '10:45', type: '入庫', note: 'E402 補貨 12 件，寫入 inventory_logs' },
  { time: '11:18', type: '換貨', note: 'EX20260331-001 建立 B 商品待出貨單，金額 0、運費獨立' },
  { time: '13:05', type: '退貨', note: 'QR(A-018) 驗退回庫，待 QC 判定是否可再販售' },
];


const paymentQueue = [
  { orderNo: 'VP20260331-001', customer: '王小美', paymentStatus: '待收款', shippingStatus: '待出貨', amount: 4259, shippingFee: 100, taxRate: 5, proof: '待上傳', date: '2026/03/31', paymentMethod: '銀行轉帳', invoiceNo: '待補' },
  { orderNo: 'VP20260331-002', customer: '林雅雯', paymentStatus: '已收款', shippingStatus: '理貨中', amount: 2825, shippingFee: 65, taxRate: 0, proof: '已上傳', date: '2026/03/31', paymentMethod: 'LINE Pay', invoiceNo: 'AA-20318' },
  { orderNo: 'EX20260331-001', customer: '陳佳玲', paymentStatus: '退款處理中', shippingStatus: '換貨待出庫', amount: 65, shippingFee: 65, taxRate: 0, proof: '換貨單', date: '2026/03/30', paymentMethod: '退款重開單', invoiceNo: 'EX-99001' },
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

const accountingTrendBars = [
  { label: '3/27', value: 62 },
  { label: '3/28', value: 78 },
  { label: '3/29', value: 54 },
  { label: '3/30', value: 86 },
  { label: '3/31', value: 92 },
  { label: '4/01', value: 73 },
];

const salesRanking = [
  { name: '吳秉宸', value: '$128,600', meta: '完成 86 單 / 退款扣回已計入' },
  { name: '王小婷', value: '$92,400', meta: '完成 63 單 / 穩定成長' },
  { name: '陳小安', value: '$88,120', meta: '會計支援 / 兼銷售績效' },
];

const hotProductsBoard = [
  { name: '女神酵素液', value: '168 件', meta: '本月回購最高' },
  { name: '瞬白激光精華4G', value: '121 件', meta: '高單價主力商品' },
  { name: '魔力抹茶機能飲', value: '96 件', meta: '促銷轉換佳' },
];

const personalSummary = [
  { title: '累積業績', value: '$128,600', sub: '退款與退貨需反向扣回' },
  { title: '完成訂單數', value: '86', sub: '含正常完成與已出貨單' },
  { title: '目前排名', value: '#3', sub: '本月銷售排行' },
  { title: '待追蹤', value: '4', sub: '待收款 / 待出貨 / 退款影響' },
];

const profileQuickActions = [
  { title: '員編掃碼', desc: '保留手機掃碼入口，後續直接接你的個人條碼 / QR 查詢。', icon: QrCode },
  { title: '歷史刷新', desc: '維持你原本的刷新整理節奏，不改操作習慣。', icon: RefreshCw },
  { title: '業績查詢', desc: '之後直接承接個人排名、退款扣回與完成單數。', icon: Trophy },
];

const personalOrders = [
  { orderNo: 'VP20260329-021', date: '2026/03/29 14:20', amount: 3680, paymentStatus: '已收款', shippingStatus: '已出貨', mainStatus: '已完成' },
  { orderNo: 'VP20260330-008', date: '2026/03/30 11:05', amount: 4259, paymentStatus: '待收款', shippingStatus: '待出貨', mainStatus: '處理中' },
  { orderNo: 'EX20260330-001', date: '2026/03/30 18:42', amount: 65, paymentStatus: '退款處理中', shippingStatus: '換貨待出庫', mainStatus: '換貨處理' },
  { orderNo: 'VP20260331-002', date: '2026/03/31 09:08', amount: 2825, paymentStatus: '已收款', shippingStatus: '理貨中', mainStatus: '出貨中' },
];


const orderCategoryChips = ['全部商品', '保健', '保養', '優惠組合'];

const quickCustomerCards = [
  { name: '王小美', phone: '0912345678', address: '新竹市東區食品路 88 號', method: '宅配' as ShippingMethod },
  { name: '林雅雯', phone: '0988777666', address: '竹北市成功八路 12 號', method: '店到店' as ShippingMethod },
  { name: '門市自取客', phone: '0900111222', address: '自取免填地址', method: '自取' as ShippingMethod },
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
  const [accountingTab, setAccountingTab] = useState<AccountingTab>('ops');
  const [accountingKeyword, setAccountingKeyword] = useState('');
  const [accountingPaymentFilter, setAccountingPaymentFilter] = useState('全部');
  const [accountingShippingFilter, setAccountingShippingFilter] = useState('全部');
  const [orderCategory, setOrderCategory] = useState('全部商品');
  const [profileKeyword, setProfileKeyword] = useState('');
  const [profileOrders, setProfileOrders] = useState(personalOrders);
  const [selectedProfileOrder, setSelectedProfileOrder] = useState(personalOrders[0]);
  const [actionNotice, setActionNotice] = useState<ActionNotice>({ text: '', tone: 'success' });

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

  useEffect(() => {
    if (!actionNotice.text) return;
    const timer = window.setTimeout(() => {
      setActionNotice((prev) => (prev.text ? { ...prev, text: '' } : prev));
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [actionNotice]);

  function showActionNotice(text: string, tone: NoticeTone = 'success') {
    setActionNotice({ text, tone });
  }


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
    const source = products.filter((item) => item.enabled).filter((item) => orderCategory === '全部商品' || item.category === orderCategory);
    if (!q) return source;
    return source.filter((item) => [item.code, item.name, item.category].join(' ').toLowerCase().includes(q));
  }, [keyword, products, orderCategory]);

  const filteredAccountingQueue = useMemo(() => {
    const q = accountingKeyword.trim().toLowerCase();
    return paymentQueue.filter((item) => {
      const matchKeyword = !q || [item.orderNo, item.customer, item.paymentStatus, item.shippingStatus, item.paymentMethod, item.invoiceNo].join(' ').toLowerCase().includes(q);
      const matchPayment = accountingPaymentFilter === '全部' || item.paymentStatus === accountingPaymentFilter;
      const matchShipping = accountingShippingFilter === '全部' || item.shippingStatus === accountingShippingFilter;
      return matchKeyword && matchPayment && matchShipping;
    });
  }, [accountingKeyword, accountingPaymentFilter, accountingShippingFilter]);

  const filteredProfileOrders = useMemo(() => {
    const q = profileKeyword.trim().toLowerCase();
    if (!q) return profileOrders;
    return profileOrders.filter((item) => `${item.orderNo} ${item.date} ${item.paymentStatus} ${item.shippingStatus} ${item.mainStatus}`.toLowerCase().includes(q));
  }, [profileKeyword, profileOrders]);

  const accountingOpsTotal = filteredAccountingQueue.reduce((sum, item) => sum + item.amount, 0);

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

  function applyQuickCustomer(name: string, phone: string, address: string, method: ShippingMethod) {
    setCustomerName(name);
    setCustomerPhone(phone);
    setCustomerAddress(address);
    setShippingMethod(method);
  }

  function handleProfileAction(action: 'scan' | 'refresh' | 'search' | 'detail', order = selectedProfileOrder) {
    if (action === 'scan') {
      showActionNotice('⚠️ 掃碼待接', 'warning');
      return;
    }
    if (action === 'refresh') {
      const refreshed = [...profileOrders].sort((a, b) => b.date.localeCompare(a.date));
      setProfileOrders(refreshed);
      setSelectedProfileOrder(refreshed[0]);
      showActionNotice('✅ 已更新');
      return;
    }
    if (action === 'search') {
      showActionNotice(filteredProfileOrders.length ? '✅ 已查詢' : '❌ 查無資料', filteredProfileOrders.length ? 'success' : 'error');
      return;
    }
    setSelectedProfileOrder(order);
    showActionNotice(`✅ ${order.orderNo}`);
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

        {actionNotice.text && (
          <div className={`action-notice action-notice-${actionNotice.tone}`}>{actionNotice.text}</div>
        )}

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

                <div className="mobile-order-bar card">
                  <div>
                    <div className="mobile-order-title">訂單摘要</div>
                    <div className="mobile-order-sub">{itemCount} 件商品 / {shippingMethod}</div>
                  </div>
                  <div className="mobile-order-total">${grandTotal}</div>
                </div>
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

                      <div className="order-toolbar-row">
                        <div className="chip-filter-row">
                          {orderCategoryChips.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              className={`filter-chip ${orderCategory === chip ? 'active' : ''}`}
                              onClick={() => setOrderCategory(chip)}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                        <button type="button" className="ghost-button compact-btn">輸入</button>
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

                      <div className="quick-customer-grid">
                        {quickCustomerCards.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            className="quick-customer-card"
                            onClick={() => applyQuickCustomer(item.name, item.phone, item.address, item.method)}
                          >
                            <div className="quick-customer-name">{item.name}</div>
                            <div className="quick-customer-meta">{item.phone} / {item.method}</div>
                          </button>
                        ))}
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
                  title="倉儲中心細化版"
                  desc="這版開始把出貨、庫存、查詢三區做得更接近實際操作畫面，仍然只動 UI，不去破壞你原本 GAS 倉儲邏輯。"
                  stats={[`待出貨 ${shippingQueue.length}`, `低庫存 ${lowStockCount}`, 'QR / 條碼 / 出貨單 / 異動紀錄']}
                />

                <section className="summary-grid">
                  {warehouseSummary.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />
                  ))}
                </section>

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
                    <div className="warehouse-main warehouse-stack">
                      <div className="card order-panel">
                        <div className="panel-head">
                          <div>
                            <div className="panel-title">待出貨訂單</div>
                            <div className="panel-desc">先把待出貨、已收款、換貨待出庫集中在同一個作業面板。</div>
                          </div>
                          <span className="badge badge-danger">今日重點 {shippingQueue.length} 筆</span>
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
                                <button type="button" className="ghost-button compact-btn">掃碼出貨</button>
                                <button type="button" className="ghost-button compact-btn">查看出貨單</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="warehouse-detail-grid">
                        <div className="card warehouse-detail-card">
                          <div className="warehouse-card-head">
                            <div>
                              <div className="flow-title">出貨作業流程</div>
                              <div className="flow-desc">用 UI 先把你原本掃碼與出貨節奏排出來。</div>
                            </div>
                            <QrCode className="small-icon" />
                          </div>
                          <div className="warehouse-checklist">
                            {shippingChecklist.map((item) => (
                              <div key={item.title} className="warehouse-check-item">
                                <div className="warehouse-check-title">{item.title}</div>
                                <div className="warehouse-check-desc">{item.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="card warehouse-detail-card">
                          <div className="warehouse-card-head">
                            <div>
                              <div className="flow-title">出貨資訊面板</div>
                              <div className="flow-desc">保留你後面要接的欄位位置，不改作業邏輯。</div>
                            </div>
                            <FileText className="small-icon" />
                          </div>
                          <div className="warehouse-form-grid">
                            <div className="fake-field"><span>訂單編號</span><strong>VP20260331-001</strong></div>
                            <div className="fake-field"><span>出貨狀態</span><strong>待出貨</strong></div>
                            <div className="fake-field"><span>收款狀態</span><strong>已收款</strong></div>
                            <div className="fake-field"><span>追蹤編號</span><strong>待填入</strong></div>
                            <div className="fake-field wide"><span>掃碼結果</span><strong>商品條碼 + QR 身分識別比對成功後才放行</strong></div>
                          </div>
                          <div className="accounting-action-row">
                            <button type="button" className="primary-button"><Truck className="small-icon" />完成出貨</button>
                            <button type="button" className="ghost-button"><Receipt className="small-icon" />列印出貨單</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="warehouse-side warehouse-stack">
                      <div className="card order-panel sticky-panel">
                        <div className="panel-head compact-head">
                          <div>
                            <div className="panel-title">出貨區提醒</div>
                            <div className="panel-desc">這裡先放你最在意的防呆規則。</div>
                          </div>
                        </div>
                        <div className="stack-list compact">
                          <div>未收款不可出貨</div>
                          <div>同 QR 多數量要看剩餘可出貨數量</div>
                          <div>換貨 B 要自動產生金額 0 出貨單</div>
                          <div>舊資料也要留下 shipping 痕跡</div>
                        </div>
                      </div>

                      <div className="card order-panel">
                        <div className="panel-head compact-head">
                          <div>
                            <div className="panel-title">最近異動紀錄</div>
                            <div className="panel-desc">把 inventory_logs 的閱讀感先做出來。</div>
                          </div>
                        </div>
                        <div className="warehouse-log-list">
                          {warehouseRecentLogs.map((item) => (
                            <div key={`${item.time}-${item.type}`} className="warehouse-log-item">
                              <div className="warehouse-log-time">{item.time}</div>
                              <div>
                                <div className="warehouse-log-type">{item.type}</div>
                                <div className="warehouse-log-note">{item.note}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {warehouseTab === 'stock' && (
                  <section className="warehouse-stack-section">
                    <div className="warehouse-flow-grid">
                      {inventoryFlow.map((item) => (
                        <div key={item.title} className="card flow-card">
                          <div className="flow-title">{item.title}</div>
                          <div className="flow-desc">{item.desc}</div>
                          <div className="data-chip-row">
                            {item.tags.map((tag) => <span key={tag} className="badge badge-neutral">{tag}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="warehouse-stock-grid">
                      {stockSnapshot.map((item) => (
                        <div key={item.code} className="card stock-snapshot-card">
                          <div className="stock-card-top">
                            <div>
                              <div className="shipping-order">{item.name}</div>
                              <div className="shipping-meta">{item.code} / 安全庫存 {item.safe}</div>
                            </div>
                            <span className={`badge ${item.status === '低庫存' ? 'badge-danger' : 'badge-success'}`}>{item.status}</span>
                          </div>
                          <div className="stock-big-number">{item.stock}</div>
                          <div className="stock-sub">目前庫存</div>
                          <div className="fake-field wide"><span>QR 身分識別</span><strong>{item.qr}</strong></div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {warehouseTab === 'query' && (
                  <section className="warehouse-stack-section">
                    <div className="warehouse-query-grid">
                      {queryExamples.map((item) => (
                        <div key={item.label} className="card query-card">
                          <div className="query-label">{item.label}</div>
                          <div className="query-value">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="warehouse-tool-grid">
                      <div className="card warehouse-tool-card">
                        <div className="warehouse-card-head">
                          <div>
                            <div className="flow-title">條碼 / QR 快速查詢</div>
                            <div className="flow-desc">後面接掃碼器時，就直接沿用這個位置。</div>
                          </div>
                          <Search className="small-icon" />
                        </div>
                        <div className="warehouse-form-grid">
                          <div className="fake-field wide"><span>查詢條件</span><strong>輸入商品條碼 / QR 身分識別 / 訂單編號</strong></div>
                          <div className="fake-field"><span>查詢模式</span><strong>精準查詢</strong></div>
                          <div className="fake-field"><span>最近紀錄</span><strong>保留 20 筆</strong></div>
                        </div>
                        <div className="accounting-action-row">
                          <button type="button" className="primary-button"><Search className="small-icon" />立即查詢</button>
                          <button type="button" className="ghost-button"><QrCode className="small-icon" />掃碼帶入</button>
                        </div>
                      </div>

                      <div className="card warehouse-tool-card">
                        <div className="warehouse-card-head">
                          <div>
                            <div className="flow-title">查詢結果展示位</div>
                            <div className="flow-desc">依你之前定義的顯示規則先排版。</div>
                          </div>
                          <History className="small-icon" />
                        </div>
                        <div className="warehouse-result-list">
                          <div className="warehouse-result-item">
                            <div className="warehouse-result-title">商品條碼模式</div>
                            <div className="warehouse-result-desc">商品名稱、商品條碼、總庫存、最近入庫時間、QR(A)*2 / QR(B)*1</div>
                          </div>
                          <div className="warehouse-result-item">
                            <div className="warehouse-result-title">QR 模式</div>
                            <div className="warehouse-result-desc">只顯示該 QR 的數量、入庫時間、入庫人員、商品名稱、商品條碼</div>
                          </div>
                          <div className="warehouse-result-item">
                            <div className="warehouse-result-title">訂單模式</div>
                            <div className="warehouse-result-desc">顯示未出貨 / 待出貨 / 已退款 / 已換貨，提供出貨與回補判讀</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}


            {active === 'accounting' && (
              <>
                <SectionIntro
                  title="會計中心骨架"
                  desc="這一步改成更接近實際後台的三分頁：收款 / 退款作業、銷售統計、排行榜 / 熱銷。版位命名直接對齊你後面要接的 GAS 會計邏輯。"
                  stats={[`待收款 ${paymentQueue.filter((item) => item.paymentStatus === '待收款').length} 筆`, '已收款 / 已退款 防呆位', '報表 / 排行榜骨架']}
                />

                <section className="summary-grid">
                  {accountingSummary.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />
                  ))}
                </section>

                <div className="accounting-tab-row">
                  <button type="button" className={`accounting-tab ${accountingTab === 'ops' ? 'active' : ''}`} onClick={() => setAccountingTab('ops')}>
                    <CreditCard className="small-icon" />收款 / 退款作業
                  </button>
                  <button type="button" className={`accounting-tab ${accountingTab === 'stats' ? 'active' : ''}`} onClick={() => setAccountingTab('stats')}>
                    <BarChart3 className="small-icon" />銷售統計
                  </button>
                  <button type="button" className={`accounting-tab ${accountingTab === 'ranking' ? 'active' : ''}`} onClick={() => setAccountingTab('ranking')}>
                    <Trophy className="small-icon" />排行榜 / 熱銷
                  </button>
                </div>

                {accountingTab === 'ops' && (
                  <>
                    <section className="two-column-grid accounting-top-grid">
                      <div className="card order-panel">
                        <div className="panel-head">
                          <div>
                            <div className="panel-title">收款 / 退款作業</div>
                            <div className="panel-desc">先把會計最常用的查詢、狀態篩選、收款證明入口整理好，直接對齊你後面 GAS 的付款處理節奏。</div>
                          </div>
                          <span className="badge badge-role">作業入口</span>
                        </div>

                        <div className="accounting-filter-grid">
                          <label className="field-card field-span-2">
                            <span className="field-label"><Search className="small-icon" />搜尋訂單 / 客戶 / 發票</span>
                            <input value={accountingKeyword} onChange={(e) => setAccountingKeyword(e.target.value)} placeholder="輸入訂單編號、客戶、收款方式、發票號碼" />
                          </label>
                          <label className="field-card">
                            <span className="field-label"><CreditCard className="small-icon" />款項狀態</span>
                            <select value={accountingPaymentFilter} onChange={(e) => setAccountingPaymentFilter(e.target.value)}>
                              <option value="全部">全部</option>
                              <option value="待收款">待收款</option>
                              <option value="已收款">已收款</option>
                              <option value="退款處理中">退款處理中</option>
                            </select>
                          </label>
                          <label className="field-card">
                            <span className="field-label"><Truck className="small-icon" />商品狀態</span>
                            <select value={accountingShippingFilter} onChange={(e) => setAccountingShippingFilter(e.target.value)}>
                              <option value="全部">全部</option>
                              <option value="待出貨">待出貨</option>
                              <option value="理貨中">理貨中</option>
                              <option value="換貨待出庫">換貨待出庫</option>
                            </select>
                          </label>
                        </div>

                        <div className="accounting-proof-grid">
                          <div className="accounting-proof-card">
                            <div className="accounting-proof-title">收據上傳</div>
                            <div className="accounting-proof-desc">保留收據、轉帳證明與對帳附件位置</div>
                          </div>
                          <div className="accounting-proof-card">
                            <div className="accounting-proof-title">匯款截圖</div>
                            <div className="accounting-proof-desc">之後直接接照片上傳或檔案上傳</div>
                          </div>
                          <div className="accounting-proof-card">
                            <div className="accounting-proof-title">AI 辨識位</div>
                            <div className="accounting-proof-desc">預留辨識結果與人工覆核顯示區</div>
                          </div>
                        </div>
                      </div>

                      <div className="card order-panel">
                        <div className="panel-head compact-head">
                          <div>
                            <div className="panel-title">本次選取單</div>
                            <div className="panel-desc">先固定你要的結算欄位，不碰原本邏輯。</div>
                          </div>
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
                    </section>

                    <section className="card order-panel">
                      <div className="panel-head">
                        <div>
                          <div className="panel-title">訂單紀錄 / 收款狀態</div>
                          <div className="panel-desc">這裡開始承接會計操作邏輯，已可用關鍵字與狀態做前端篩選。</div>
                        </div>
                        <span className="badge badge-soft">共 {filteredAccountingQueue.length} 筆 / 金額 ${accountingOpsTotal}</span>
                      </div>

                      <div className="shipping-queue accounting-queue">
                        {filteredAccountingQueue.map((item) => (
                          <div key={item.orderNo} className="shipping-row accounting-row">
                            <div>
                              <div className="shipping-order">{item.orderNo}</div>
                              <div className="shipping-meta">{item.customer} / {item.date} / {item.paymentMethod} / 發票 {item.invoiceNo}</div>
                              <div className="shipping-meta">運費 ${item.shippingFee} / 稅率 {item.taxRate}% / 證明：{item.proof}</div>
                            </div>
                            <div className="shipping-actions accounting-statuses">
                              <span className={`badge ${item.paymentStatus === '已收款' ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                              <span className={`badge ${item.shippingStatus.includes('待') ? 'badge-danger' : item.shippingStatus.includes('理貨') ? 'badge-soft' : 'badge-neutral'}`}>{item.shippingStatus}</span>
                              <strong className="accounting-amount">${item.amount}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {accountingTab === 'stats' && (
                  <section className="accounting-stats-grid">
                    <div className="card order-panel">
                      <div className="panel-head">
                        <div>
                          <div className="panel-title">銷售統計</div>
                          <div className="panel-desc">把會議會看到的摘要放在同一區，後面直接承接 sales_report。</div>
                        </div>
                        <span className="badge badge-role">報表摘要</span>
                      </div>

                      <div className="accounting-stat-cards">
                        {accountingBoards[1].bullets.map((item) => (
                          <div key={item} className="accounting-mini-card">
                            <div className="accounting-mini-title">{item}</div>
                            <div className="accounting-mini-value">{item === '區間營收' ? '$128,600' : item === '稅金總額' ? '$6,430' : '$3,120'}</div>
                          </div>
                        ))}
                        <div className="accounting-mini-card accent">
                          <div className="accounting-mini-title">毛利</div>
                          <div className="accounting-mini-value">$18,420</div>
                        </div>
                      </div>

                      <div className="accounting-breakdown-list">
                        <div className="accounting-breakdown-item"><span>已收款占比</span><strong>74%</strong></div>
                        <div className="accounting-breakdown-item"><span>待收款占比</span><strong>22%</strong></div>
                        <div className="accounting-breakdown-item"><span>退款占比</span><strong>4%</strong></div>
                      </div>
                    </div>

                    <div className="accounting-stats-side">
                      <div className="card order-panel">
                        <div className="panel-head compact-head">
                          <div>
                            <div className="panel-title">營收趨勢</div>
                            <div className="panel-desc">先把圖表區的閱讀節奏定好，後面直接接真資料。</div>
                          </div>
                        </div>
                        <div className="trend-chart">
                          {accountingTrendBars.map((item) => (
                            <div key={item.label} className="trend-bar-col">
                              <div className="trend-bar-wrap">
                                <div className="trend-bar" style={{ height: `${item.value}%` }} />
                              </div>
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card order-panel">
                        <div className="panel-head compact-head">
                          <div>
                            <div className="panel-title">報表提醒</div>
                            <div className="panel-desc">延續你現在的 GAS 規則。</div>
                          </div>
                        </div>
                        <div className="stack-list compact">
                          <div>退款與退貨都要同步反扣毛利</div>
                          <div>運費要獨立統計，不與商品銷售額混算</div>
                          <div>已收款才納入正式營收統計</div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {accountingTab === 'ranking' && (
                  <section className="three-column-grid accounting-ranking-grid">
                    <div className="card order-panel">
                      <div className="panel-head compact-head">
                        <div>
                          <div className="panel-title">銷售排行</div>
                          <div className="panel-desc">後面可直接接你的人員業績與退款扣回邏輯。</div>
                        </div>
                      </div>
                      <div className="ranking-list">
                        {salesRanking.map((item, idx) => (
                          <div key={item.name} className="ranking-item">
                            <div className="ranking-badge">#{idx + 1}</div>
                            <div className="ranking-main">
                              <div className="ranking-name">{item.name}</div>
                              <div className="ranking-meta">{item.meta}</div>
                            </div>
                            <div className="ranking-value">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card order-panel">
                      <div className="panel-head compact-head">
                        <div>
                          <div className="panel-title">熱銷商品</div>
                          <div className="panel-desc">之後直接接商品統計與銷售件數。</div>
                        </div>
                      </div>
                      <div className="ranking-list">
                        {hotProductsBoard.map((item, idx) => (
                          <div key={item.name} className="ranking-item">
                            <div className="ranking-badge">#{idx + 1}</div>
                            <div className="ranking-main">
                              <div className="ranking-name">{item.name}</div>
                              <div className="ranking-meta">{item.meta}</div>
                            </div>
                            <div className="ranking-value">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card order-panel">
                      <div className="panel-head compact-head">
                        <div>
                          <div className="panel-title">排行規則提醒</div>
                          <div className="panel-desc">保留後續接真資料時的判讀規則。</div>
                        </div>
                      </div>
                      <div className="stack-list compact">
                        <div>排行榜要扣除退款 / 退貨影響</div>
                        <div>熱銷商品可延伸到會計與倉儲共用</div>
                        <div>報表區之後直接承接 sales_report</div>
                        <div>會計中心維持獨立子頁結構</div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}

            {active === 'profile' && (
              <>
                <SectionIntro
                  title="個人資料 / 我的歷史訂單"
                  desc="第四區先把個人頁常用功能全部啟動：掃碼、刷新、查詢、選單切換與訂單明細查看都先有反應。"
                  stats={[`歷史訂單 ${profileOrders.length} 筆`, '個人資料 / 業績雙區塊', '掃碼 / 刷新 / 查詢 已啟動']}
                />

                <section className="summary-grid">
                  {personalSummary.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} sub={item.sub} />
                  ))}
                </section>

                <section className="profile-action-grid">
                  {profileQuickActions.map((item) => {
                    const Icon = item.icon;
                    const onClick = item.title === '員編掃碼'
                      ? () => handleProfileAction('scan')
                      : item.title === '歷史刷新'
                        ? () => handleProfileAction('refresh')
                        : () => handleProfileAction('search');
                    return (
                      <button key={item.title} type="button" className="card profile-action-card profile-action-button" onClick={onClick}>
                        <div className="profile-action-icon"><Icon className="small-icon" /></div>
                        <div className="profile-action-title">{item.title}</div>
                        <div className="profile-action-desc">{item.desc}</div>
                      </button>
                    );
                  })}
                </section>

                <section className="two-column-grid profile-top-grid">
                  <div className="card order-panel">
                    <div className="panel-head">
                      <div>
                        <div className="panel-title">個人資料</div>
                        <div className="panel-desc">上半部固定個人資訊卡位，下半部可直接切到員編掃碼與歷史訂單查詢。</div>
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
                      <button type="button" className="profile-qr-box profile-qr-button" onClick={() => handleProfileAction('scan')}>
                        <QrCode className="profile-qr-icon" />
                        <span>點我掃碼</span>
                      </button>
                    </div>
                  </div>

                  <div className="card order-panel">
                    <div className="panel-head compact-head">
                      <div>
                        <div className="panel-title">我的累積業績</div>
                        <div className="panel-desc">第四區先讓數據卡位穩定可讀，後面再接真資料。</div>
                      </div>
                    </div>
                    <div className="profile-performance-grid">
                      <div className="metric-box large"><span>累積業績</span><strong>$128,600</strong></div>
                      <div className="metric-box large"><span>完成訂單數</span><strong>{profileOrders.length}</strong></div>
                      <div className="metric-box large"><span>目前排名</span><strong>#3</strong></div>
                      <div className="metric-box large"><span>目前選取單</span><strong>{selectedProfileOrder.orderNo}</strong></div>
                    </div>
                    <div className="profile-note-list">
                      <div className="profile-note-item">本月主力商品：女神酵素液 / 美妍X關鍵賦活飲</div>
                      <div className="profile-note-item">目前查看：{selectedProfileOrder.mainStatus} / {selectedProfileOrder.shippingStatus}</div>
                    </div>
                  </div>
                </section>

                <section className="card order-panel profile-history-panel">
                  <div className="panel-head">
                    <div>
                      <div className="panel-title">我的歷史訂單</div>
                      <div className="panel-desc">搜尋、掃碼、刷新整理、查看詳情都先做成可點可測的 UI 版本。</div>
                    </div>
                    <div className="history-toolbar">
                      <button type="button" className="ghost-button compact-btn" onClick={() => handleProfileAction('scan')}><QrCode className="small-icon" />掃碼</button>
                      <button type="button" className="ghost-button compact-btn" onClick={() => handleProfileAction('refresh')}><RefreshCw className="small-icon" />刷新整理</button>
                    </div>
                  </div>

                  <div className="history-filter-row">
                    <div className="search-wrap inline-search">
                      <Search className="search-icon" />
                      <input value={profileKeyword} onChange={(e) => setProfileKeyword(e.target.value)} placeholder="搜尋訂單編號 / 狀態 / 日期" />
                    </div>
                    <button type="button" className="primary-button compact-primary" onClick={() => handleProfileAction('search')}>輸入</button>
                  </div>

                  <div className="profile-history-grid">
                    <div className="history-list">
                      {filteredProfileOrders.map((item) => (
                        <button key={item.orderNo} type="button" className={`history-row history-row-button ${selectedProfileOrder.orderNo === item.orderNo ? 'selected' : ''}`} onClick={() => setSelectedProfileOrder(item)}>
                          <div className="history-main">
                            <div className="history-order">{item.orderNo}</div>
                            <div className="history-meta"><CalendarRange className="small-icon" />{item.date}</div>
                            <div className="history-statuses">
                              <span className={`badge ${item.paymentStatus.includes('已收款') ? 'badge-success' : item.paymentStatus.includes('退款') ? 'badge-neutral' : 'badge-danger'}`}>{item.paymentStatus}</span>
                              <span className={`badge ${item.shippingStatus.includes('已出貨') || item.shippingStatus.includes('理貨') ? 'badge-success' : item.shippingStatus.includes('換貨') ? 'badge-neutral' : 'badge-danger'}`}>{item.shippingStatus}</span>
                              <span className="badge badge-soft">{item.mainStatus}</span>
                            </div>
                          </div>
                          <div className="history-side">
                            <div className="history-amount">${item.amount}</div>
                            <span className="ghost-button compact-btn history-detail-btn">選取</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="card profile-detail-card">
                      <div className="panel-head compact-head">
                        <div>
                          <div className="panel-title">訂單詳情</div>
                          <div className="panel-desc">點選左側訂單後，這裡會同步切換。</div>
                        </div>
                        <button type="button" className="ghost-button compact-btn" onClick={() => handleProfileAction('detail', selectedProfileOrder)}>查看詳情</button>
                      </div>

                      <div className="profile-detail-grid">
                        <div className="fake-field"><span>訂單編號</span><strong>{selectedProfileOrder.orderNo}</strong></div>
                        <div className="fake-field"><span>訂單金額</span><strong>${selectedProfileOrder.amount}</strong></div>
                        <div className="fake-field"><span>收款狀態</span><strong>{selectedProfileOrder.paymentStatus}</strong></div>
                        <div className="fake-field"><span>出貨狀態</span><strong>{selectedProfileOrder.shippingStatus}</strong></div>
                        <div className="fake-field wide"><span>主狀態</span><strong>{selectedProfileOrder.mainStatus}</strong></div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        <div className="mobile-nav">
          {[
            { key: 'dashboard' as NavKey, label: '總覽', icon: BarChart3 },
            { key: 'orders' as NavKey, label: '訂購', icon: ShoppingCart },
            { key: 'inventory' as NavKey, label: '倉儲', icon: Warehouse },
            { key: 'accounting' as NavKey, label: '會計', icon: CreditCard },
            { key: 'profile' as NavKey, label: '我的', icon: ClipboardList },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                className={`mobile-nav-btn ${active === item.key ? 'active' : ''}`}
                onClick={() => setActive(item.key)}
              >
                <Icon className="small-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

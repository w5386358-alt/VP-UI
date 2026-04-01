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
  Plus,
  PencilLine,
  Eye,
} from 'lucide-react';
import DashboardModule from './modules/DashboardModule';
import ProductsModule from './modules/ProductsModule';
import CustomersModule from './modules/CustomersModule';
import StaffModule from './modules/StaffModule';
import OrdersModule from './modules/OrdersModule';
import InventoryModule from './modules/InventoryModule';
import AccountingModule from './modules/AccountingModule';
import ProfileModule from './modules/ProfileModule';

type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type NavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'products' | 'customers' | 'staff' | 'profile';

type Product = { id: string; code: string; name: string; category: string; price: number; enabled: boolean; stock: number };
type Customer = { id: string; name: string; phone: string; level: string };
type Staff = { id: string; name: string; loginId: string; role: string; rank: string; enabled: boolean };
type SessionUser = { name: string; loginId: string; role: Role; rank: string };
type ShippingMethod = '宅配' | '店到店' | '自取';
type CartItem = Product & { qty: number };
type WarehouseTab = 'shipping' | 'stock' | 'query';
type WarehouseQueryMode = 'barcode' | 'qr' | 'order';
type AccountingTab = 'ops' | 'stats' | 'ranking';

type WorkflowCard = {
  title: string;
  desc: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
};

type ProductEditorMode = 'create' | 'edit' | 'view';

type ProductDraft = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  enabled: boolean;
};

type OrderRecord = {
  orderNo: string;
  customer: string;
  phone: string;
  shippingMethod: ShippingMethod;
  address: string;
  amount: number;
  itemCount: number;
  paymentStatus: string;
  shippingStatus: string;
  mainStatus: string;
  date: string;
  remark: string;
  items: Array<{ code: string; name: string; qty: number; price: number }>;
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
  { orderNo: 'VP20260331-001', customer: '王小美', paymentStatus: '已收款', shippingStatus: '待出貨', itemCount: 3, urgency: 'high', shippingMethod: '宅配', address: '新竹市東區食品路 88 號', trackingNo: '未建立', scanStatus: '待掃碼驗證', qrSummary: 'E401*2 / P301*1' },
  { orderNo: 'VP20260331-002', customer: '林雅雯', paymentStatus: '已收款', shippingStatus: '理貨中', itemCount: 2, urgency: 'medium', shippingMethod: '店到店', address: '竹北成功門市', trackingNo: 'TCAT-203188', scanStatus: '已完成商品掃描', qrSummary: 'E402*1 / E408*1' },
  { orderNo: 'EX20260331-001', customer: '陳佳玲', paymentStatus: '免收款', shippingStatus: '換貨待出庫', itemCount: 1, urgency: 'medium', shippingMethod: '宅配', address: '新竹市北區湳雅街 10 號', trackingNo: '待建立', scanStatus: '換貨單待驗證', qrSummary: 'P305*1' },
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
  { code: 'E401', name: '女神酵素液', stock: 36, safe: 12, qr: 'QR(A)*18 / QR(B)*18', status: '正常', updated: '今日 10:45 更新' },
  { code: 'P301', name: '瞬白激光精華4G', stock: 9, safe: 10, qr: 'QR(P1)*6 / QR(P2)*3', status: '低庫存', updated: '今日 09:12 出貨後下降' },
  { code: 'E408', name: '魔力抹茶機能飲', stock: 22, safe: 8, qr: 'QR(M)*22', status: '正常', updated: '今日 11:18 換貨預留' },
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

const initialOrderRecords: OrderRecord[] = [
  {
    orderNo: 'VP20260331-001',
    customer: '王小美',
    phone: '0912345678',
    shippingMethod: '宅配',
    address: '新竹市東區食品路 88 號',
    amount: 4259,
    itemCount: 3,
    paymentStatus: '待收款',
    shippingStatus: '待出貨',
    mainStatus: '處理中',
    date: '2026/03/31 10:12',
    remark: '首批訂單',
    items: [
      { code: 'E401', name: '女神酵素液', qty: 2, price: 899 },
      { code: 'P301', name: '瞬白激光精華4G', qty: 1, price: 1680 },
    ],
  },
  {
    orderNo: 'VP20260331-002',
    customer: '林雅雯',
    phone: '0988777666',
    shippingMethod: '店到店',
    address: '竹北市成功八路 12 號',
    amount: 2825,
    itemCount: 2,
    paymentStatus: '已收款',
    shippingStatus: '理貨中',
    mainStatus: '出貨中',
    date: '2026/03/31 13:26',
    remark: '已上傳收款證明',
    items: [
      { code: 'E402', name: '美妍X關鍵賦活飲', qty: 1, price: 1380 },
      { code: 'E408', name: '魔力抹茶機能飲', qty: 1, price: 1380 },
    ],
  },
  {
    orderNo: 'EX20260331-001',
    customer: '陳佳玲',
    phone: '0933555777',
    shippingMethod: '宅配',
    address: '新竹市北區湳雅街 10 號',
    amount: 65,
    itemCount: 1,
    paymentStatus: '退款處理中',
    shippingStatus: '換貨待出庫',
    mainStatus: '換貨處理',
    date: '2026/03/31 16:08',
    remark: '換貨單，商品金額 0',
    items: [
      { code: 'P305', name: '超逆齡修復菁萃', qty: 1, price: 0 },
    ],
  },
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

function makeEmptyProductDraft(nextCode = ''): ProductDraft {
  return { id: '', code: nextCode, name: '', category: '保健', price: '', stock: '', enabled: true };
}

function toProductDraft(item: Product): ProductDraft {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    price: String(item.price),
    stock: String(item.stock),
    enabled: item.enabled,
  };
}

function mergeByOrderNo<T extends { orderNo: string }>(primary: T[], secondary: T[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((item) => {
    if (seen.has(item.orderNo)) return false;
    seen.add(item.orderNo);
    return true;
  });
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
  const [selectedWarehouseOrderNo, setSelectedWarehouseOrderNo] = useState(shippingQueue[0]?.orderNo ?? '');
  const [warehouseNotice, setWarehouseNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 倉儲頁已進入可操作版，可切換訂單與查詢模式',
    tone: 'success',
  });
  const [warehouseQueryMode, setWarehouseQueryMode] = useState<WarehouseQueryMode>('barcode');
  const [warehouseQueryInput, setWarehouseQueryInput] = useState('E401');
  const [warehouseQueryResult, setWarehouseQueryResult] = useState<{ title: string; desc: string; meta: string[] }[]>([
    { title: '女神酵素液', desc: '商品條碼 E401 / 目前庫存 36 / 最近入庫 2026/03/31 10:45', meta: ['QR(A)*18', 'QR(B)*18', '狀態：正常'] },
  ]);
  const [selectedStockCode, setSelectedStockCode] = useState(stockSnapshot[0]?.code ?? '');
  const [accountingTab, setAccountingTab] = useState<AccountingTab>('ops');
  const [accountingKeyword, setAccountingKeyword] = useState('');
  const [accountingPaymentFilter, setAccountingPaymentFilter] = useState('全部');
  const [accountingShippingFilter, setAccountingShippingFilter] = useState('全部');
  const [accountingDateStart, setAccountingDateStart] = useState('2026-03-01');
  const [accountingDateEnd, setAccountingDateEnd] = useState('2026-04-01');
  const [selectedAccountingOrderNo, setSelectedAccountingOrderNo] = useState(paymentQueue[0]?.orderNo ?? '');
  const [accountingNotice, setAccountingNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 會計頁已重補，可直接切換訂單與操作提示',
    tone: 'success',
  });
  const [orderCategory, setOrderCategory] = useState('全部商品');
  const [productEditorMode, setProductEditorMode] = useState<ProductEditorMode>('view');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [productDraft, setProductDraft] = useState<ProductDraft>(() => makeEmptyProductDraft(mockProducts[0]?.code ?? ''));
  const [productNotice, setProductNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [orderRecords, setOrderRecords] = useState<OrderRecord[]>(initialOrderRecords);
  const [selectedOrderNo, setSelectedOrderNo] = useState(initialOrderRecords[0]?.orderNo ?? '');
  const [orderNotice, setOrderNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ Orders 模組已啟動，可建立訂單與切換訂單紀錄',
    tone: 'success',
  });

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

  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedProductId) || filteredProducts[0] || products[0] || null, [products, filteredProducts, selectedProductId]);

  useEffect(() => {
    if (!selectedProduct) return;
    setSelectedProductId((prev) => prev || selectedProduct.id);
    if (productEditorMode === 'view' || !productDraft.id) {
      setProductDraft((prev) => {
        if (productEditorMode === 'edit' && prev.id && prev.id !== selectedProduct.id) return prev;
        return toProductDraft(selectedProduct);
      });
    }
  }, [selectedProduct]);

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

  useEffect(() => {
    if (!dynamicShippingQueue.length) return;
    if (!dynamicShippingQueue.some((item) => item.orderNo === selectedWarehouseOrderNo)) {
      setSelectedWarehouseOrderNo(dynamicShippingQueue[0].orderNo);
    }
  }, [dynamicShippingQueue, selectedWarehouseOrderNo]);

const dynamicShippingQueue = useMemo(() => {
    const orderDrivenQueue = orderRecords
      .filter((item) => ['待出貨', '理貨中', '已出貨'].includes(item.shippingStatus))
      .map((item) => ({
        orderNo: item.orderNo,
        customer: item.customer,
        paymentStatus: item.paymentStatus,
        shippingStatus: item.shippingStatus,
        itemCount: item.itemCount,
        urgency: item.shippingStatus === '待出貨' ? 'high' : 'medium',
        shippingMethod: item.shippingMethod,
        address: item.address,
        trackingNo: item.shippingStatus === '已出貨' ? `AUTO-${item.orderNo.slice(-3)}` : '未建立',
        scanStatus: item.shippingStatus === '已出貨' ? '已完成出貨驗證' : `待驗證 ${item.itemCount} 件商品`,
        qrSummary: item.items.map((sub) => `${sub.code}*${sub.qty}`).join(' / '),
      }));
    return mergeByOrderNo(orderDrivenQueue, shippingQueue);
  }, [orderRecords]);

  const selectedWarehouseOrder = useMemo(() => dynamicShippingQueue.find((item) => item.orderNo === selectedWarehouseOrderNo) || dynamicShippingQueue[0], [selectedWarehouseOrderNo, dynamicShippingQueue]);

  const selectedStockItem = useMemo(() => stockSnapshot.find((item) => item.code === selectedStockCode) || stockSnapshot[0], [selectedStockCode]);

  const runWarehouseQuery = (input = warehouseQueryInput, mode = warehouseQueryMode) => {
    const value = input.trim();
    if (!value) {
      setWarehouseNotice({ text: '❌ 請先輸入查詢條件', tone: 'danger' });
      return;
    }

    const normalized = value.toUpperCase();

    if (mode === 'barcode') {
      const matched = stockSnapshot.find((item) => item.code.toUpperCase().includes(normalized) || item.name.includes(value));
      if (!matched) {
        setWarehouseQueryResult([{ title: '查無商品條碼', desc: `找不到 ${value} 的商品資料`, meta: ['請改掃 QR 或訂單編號'] }]);
        setWarehouseNotice({ text: '❌ 商品條碼查無資料', tone: 'danger' });
        return;
      }
      setSelectedStockCode(matched.code);
      setWarehouseQueryResult([{
        title: matched.name,
        desc: `商品條碼 ${matched.code} / 目前庫存 ${matched.stock} / 安全庫存 ${matched.safe}`,
        meta: [matched.qr, matched.updated, `狀態：${matched.status}`],
      }]);
      setWarehouseNotice({ text: `✅ 已查到 ${matched.code}`, tone: 'success' });
      return;
    }

    if (mode === 'qr') {
      const qrMap: Record<string, { title: string; desc: string; meta: string[] }> = {
        'QR(A)': { title: 'QR(A)', desc: '女神酵素液 / 目前庫存 18 / 最近入庫 2026/03/31 10:45', meta: ['入庫人員：VP001', '商品條碼：E401', '狀態：可出貨'] },
        'QR(P1)': { title: 'QR(P1)', desc: '瞬白激光精華4G / 目前庫存 6 / 最近入庫 2026/03/31 09:12', meta: ['入庫人員：VP002', '商品條碼：P301', '狀態：低庫存注意'] },
        'QR(M)': { title: 'QR(M)', desc: '魔力抹茶機能飲 / 目前庫存 22 / 最近入庫 2026/03/31 11:18', meta: ['入庫人員：VP003', '商品條碼：E408', '狀態：正常'] },
      };
      const matched = qrMap[normalized] || qrMap[value];
      if (!matched) {
        setWarehouseQueryResult([{ title: '查無 QR 身分識別', desc: `找不到 ${value} 的 QR 記錄`, meta: ['請確認是否已入庫'] }]);
        setWarehouseNotice({ text: '❌ QR 身分識別查無資料', tone: 'danger' });
        return;
      }
      setWarehouseQueryResult([matched]);
      setWarehouseNotice({ text: `✅ 已查到 ${matched.title}`, tone: 'success' });
      return;
    }

    const matchedOrder = dynamicShippingQueue.find((item) => item.orderNo.toUpperCase().includes(normalized));
    if (!matchedOrder) {
      setWarehouseQueryResult([{ title: '查無訂單', desc: `找不到 ${value} 的出貨資料`, meta: ['請確認訂單編號格式'] }]);
      setWarehouseNotice({ text: '❌ 訂單查無資料', tone: 'danger' });
      return;
    }
    setSelectedWarehouseOrderNo(matchedOrder.orderNo);
    setWarehouseQueryResult([{
      title: matchedOrder.orderNo,
      desc: `${matchedOrder.customer} / ${matchedOrder.shippingStatus} / ${matchedOrder.shippingMethod}`,
      meta: [`${matchedOrder.paymentStatus}`, `出貨內容：${matchedOrder.qrSummary}`, `地址：${matchedOrder.address}`],
    }]);
    setWarehouseNotice({ text: `✅ 已切到 ${matchedOrder.orderNo}`, tone: 'success' });
  };

  const handleWarehouseShip = () => {
    if (!selectedWarehouseOrder) return;
    if (selectedWarehouseOrder.paymentStatus !== '已收款' && selectedWarehouseOrder.paymentStatus !== '免收款') {
      setWarehouseNotice({ text: '❌ 未收款不可出貨', tone: 'danger' });
      return;
    }
    if (orderRecords.some((item) => item.orderNo === selectedWarehouseOrder.orderNo)) {
      setOrderRecords((prev) => prev.map((item) => item.orderNo === selectedWarehouseOrder.orderNo ? { ...item, shippingStatus: '已出貨', mainStatus: '已出貨' } : item));
    }
    setWarehouseNotice({ text: `✅ 已出貨：${selectedWarehouseOrder.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ Orders 已同步出貨：${selectedWarehouseOrder.orderNo}`, tone: 'success' });
  };

  const handleWarehousePrint = () => {
    if (!selectedWarehouseOrder) return;
    setWarehouseNotice({ text: `✅ 已開啟出貨單：${selectedWarehouseOrder.orderNo}`, tone: 'neutral' });
  };

  const handleWarehouseScanFill = () => {
    const next = warehouseQueryMode === 'barcode' ? 'P301' : warehouseQueryMode === 'qr' ? 'QR(P1)' : 'VP20260331-002';
    setWarehouseQueryInput(next);
    setWarehouseNotice({ text: `✅ 已帶入 ${next}`, tone: 'neutral' });
  };

  const selectedOrderRecord = useMemo(() => orderRecords.find((item) => item.orderNo === selectedOrderNo) || orderRecords[0] || null, [orderRecords, selectedOrderNo]);

  const dynamicPaymentQueue = useMemo(() => {
    const orderDrivenQueue = orderRecords.map((item) => ({
      orderNo: item.orderNo,
      customer: item.customer,
      paymentStatus: item.paymentStatus,
      shippingStatus: item.shippingStatus,
      amount: item.amount,
      shippingFee: getShippingFee(item.shippingMethod),
      taxRate: 0,
      proof: item.paymentStatus === '已收款' ? 'Orders 模組收款完成' : '待上傳',
      date: item.date.split(' ')[0],
      paymentMethod: item.paymentStatus === '已收款' ? '系統確認收款' : '待確認',
      invoiceNo: '待補',
    }));
    return mergeByOrderNo(orderDrivenQueue, paymentQueue);
  }, [orderRecords]);

  const filteredAccountingQueue = useMemo(() => {
    const q = accountingKeyword.trim().toLowerCase();
    return dynamicPaymentQueue.filter((item) => {
      const matchKeyword = !q || [item.orderNo, item.customer, item.paymentStatus, item.shippingStatus, item.paymentMethod, item.invoiceNo].join(' ').toLowerCase().includes(q);
      const matchPayment = accountingPaymentFilter === '全部' || item.paymentStatus === accountingPaymentFilter;
      const matchShipping = accountingShippingFilter === '全部' || item.shippingStatus === accountingShippingFilter;
      const itemDateKey = item.date.replace(/\//g, '-');
      const matchDateStart = !accountingDateStart || itemDateKey >= accountingDateStart;
      const matchDateEnd = !accountingDateEnd || itemDateKey <= accountingDateEnd;
      return matchKeyword && matchPayment && matchShipping && matchDateStart && matchDateEnd;
    });
  }, [dynamicPaymentQueue, accountingKeyword, accountingPaymentFilter, accountingShippingFilter, accountingDateStart, accountingDateEnd]);

  useEffect(() => {
    if (!filteredAccountingQueue.length) return;
    if (!filteredAccountingQueue.some((item) => item.orderNo === selectedAccountingOrderNo)) {
      setSelectedAccountingOrderNo(filteredAccountingQueue[0].orderNo);
    }
  }, [filteredAccountingQueue, selectedAccountingOrderNo]);

  const selectedAccountingRecord = useMemo(
    () => filteredAccountingQueue.find((item) => item.orderNo === selectedAccountingOrderNo) || filteredAccountingQueue[0] || dynamicPaymentQueue[0],
    [filteredAccountingQueue, selectedAccountingOrderNo, dynamicPaymentQueue],
  );

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

  function getNextProductCode() {
    const next = products.length + 1;
    return `VPP${String(next).padStart(3, '0')}`;
  }

  function openCreateProduct() {
    setProductEditorMode('create');
    setSelectedProductId('');
    setProductDraft(makeEmptyProductDraft(getNextProductCode()));
    setProductNotice({ text: '✅ 新增模式', tone: 'neutral' });
  }

  function openEditProduct(item: Product) {
    setProductEditorMode('edit');
    setSelectedProductId(item.id);
    setProductDraft(toProductDraft(item));
    setProductNotice({ text: '✅ 已載入商品', tone: 'neutral' });
  }

  function openViewProduct(item: Product) {
    setProductEditorMode('view');
    setSelectedProductId(item.id);
    setProductDraft(toProductDraft(item));
    setProductNotice({ text: '✅ 已顯示詳情', tone: 'neutral' });
  }

  function saveProductDraft() {
    if (!productDraft.code.trim() || !productDraft.name.trim() || !productDraft.category.trim()) {
      setProductNotice({ text: '❌ 欄位未完成', tone: 'danger' });
      return;
    }

    const price = Number(productDraft.price || 0);
    const stock = Number(productDraft.stock || 0);

    if (price < 0 || stock < 0) {
      setProductNotice({ text: '❌ 數值錯誤', tone: 'danger' });
      return;
    }

    if (productEditorMode === 'create') {
      const nextProduct: Product = {
        id: `product-${Date.now()}`,
        code: productDraft.code.trim(),
        name: productDraft.name.trim(),
        category: productDraft.category.trim(),
        price,
        stock,
        enabled: productDraft.enabled,
      };
      setProducts((prev) => [nextProduct, ...prev]);
      setSelectedProductId(nextProduct.id);
      setProductDraft(toProductDraft(nextProduct));
      setProductEditorMode('edit');
      setProductNotice({ text: '✅ 已新增', tone: 'success' });
      return;
    }

    if (!productDraft.id) {
      setProductNotice({ text: '❌ 未選商品', tone: 'danger' });
      return;
    }

    setProducts((prev) => prev.map((item) => item.id === productDraft.id ? {
      ...item,
      code: productDraft.code.trim(),
      name: productDraft.name.trim(),
      category: productDraft.category.trim(),
      price,
      stock,
      enabled: productDraft.enabled,
    } : item));
    setProductEditorMode('edit');
    setProductNotice({ text: '✅ 已更新', tone: 'success' });
  }

  function toggleProductEnabled(item: Product) {
    const nextEnabled = !item.enabled;
    setProducts((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, enabled: nextEnabled } : entry));
    setSelectedProductId(item.id);
    setProductDraft((prev) => prev.id === item.id ? { ...prev, enabled: nextEnabled } : prev);
    setProductNotice({ text: nextEnabled ? '✅ 已啟用' : '❌ 已停用', tone: nextEnabled ? 'success' : 'danger' });
  }

  function makeNextOrderNo() {
    const next = orderRecords.length + 1;
    return `VP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(next).padStart(3, '0')}`;
  }

  function createOrderRecord() {
    if (!cart.length) {
      setOrderNotice({ text: '❌ 購物車沒有商品', tone: 'danger' });
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setOrderNotice({ text: '❌ 客戶資料未完成', tone: 'danger' });
      return;
    }

    const orderNo = makeNextOrderNo();
    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const nextRecord: OrderRecord = {
      orderNo,
      customer: customerName.trim(),
      phone: customerPhone.trim(),
      shippingMethod,
      address: customerAddress.trim() || (shippingMethod === '自取' ? '自取免填地址' : '-'),
      amount: grandTotal,
      itemCount,
      paymentStatus: '待收款',
      shippingStatus: '待出貨',
      mainStatus: '處理中',
      date,
      remark: remark.trim() || '—',
      items: cart.map((item) => ({ code: item.code, name: item.name, qty: item.qty, price: item.price })),
    };
    setOrderRecords((prev) => [nextRecord, ...prev]);
    setSelectedOrderNo(orderNo);
    setOrderNotice({ text: `✅ 已建立訂單：${orderNo}`, tone: 'success' });
    setCart([]);
    setRemark('');
    setDiscountMode('無');
    setDiscountValue(0);
  }

  function selectOrderRecord(orderNo: string) {
    setSelectedOrderNo(orderNo);
    setOrderNotice({ text: `✅ 已切換 ${orderNo}`, tone: 'neutral' });
  }

  function markOrderPaid(orderNo: string) {
    const target = orderRecords.find((item) => item.orderNo === orderNo);
    if (!target) return;
    if (target.paymentStatus === '已收款') {
      setOrderNotice({ text: '❌ 此訂單已收款', tone: 'danger' });
      return;
    }
    if (target.paymentStatus.includes('退款')) {
      setOrderNotice({ text: '❌ 此訂單處於退款流程', tone: 'danger' });
      return;
    }
    setOrderRecords((prev) => prev.map((item) => item.orderNo === orderNo ? { ...item, paymentStatus: '已收款', mainStatus: item.shippingStatus === '待出貨' ? '待出貨' : item.mainStatus } : item));
    setOrderNotice({ text: `✅ 已收款：${orderNo}`, tone: 'success' });
  }

  function markOrderShippingReady(orderNo: string) {
    const target = orderRecords.find((item) => item.orderNo === orderNo);
    if (!target) return;
    if (target.paymentStatus !== '已收款') {
      setOrderNotice({ text: '❌ 需先確認收款', tone: 'danger' });
      return;
    }
    setOrderRecords((prev) => prev.map((item) => item.orderNo === orderNo ? { ...item, shippingStatus: '待出貨', mainStatus: '待出貨' } : item));
    setOrderNotice({ text: `✅ 已更新待出貨：${orderNo}`, tone: 'success' });
  }

  function selectAccountingOrder(orderNo: string) {
    setSelectedAccountingOrderNo(orderNo);
    setAccountingNotice({ text: `✅ 已切換 ${orderNo}`, tone: 'neutral' });
  }

  function triggerAccountingAction(action: 'pay' | 'refund') {
    if (!selectedAccountingRecord) return;
    if (action === 'pay') {
      if (selectedAccountingRecord.paymentStatus === '已收款') {
        setAccountingNotice({ text: '❌ 此訂單已收款', tone: 'danger' });
        return;
      }
      if (selectedAccountingRecord.paymentStatus.includes('退款')) {
        setAccountingNotice({ text: '❌ 此訂單處於退款流程，請先確認退款結果', tone: 'danger' });
        return;
      }
      if (orderRecords.some((item) => item.orderNo === selectedAccountingRecord.orderNo)) {
        setOrderRecords((prev) => prev.map((item) => item.orderNo === selectedAccountingRecord.orderNo ? { ...item, paymentStatus: '已收款', mainStatus: item.shippingStatus === '待出貨' ? '待出貨' : item.mainStatus } : item));
      }
      setAccountingNotice({ text: `✅ 已收款：${selectedAccountingRecord.orderNo}`, tone: 'success' });
      setOrderNotice({ text: `✅ Orders 已同步收款：${selectedAccountingRecord.orderNo}`, tone: 'success' });
      return;
    }

    if (selectedAccountingRecord.paymentStatus.includes('退款')) {
      setAccountingNotice({ text: '❌ 此訂單已進入退款流程', tone: 'danger' });
      return;
    }
    if (orderRecords.some((item) => item.orderNo === selectedAccountingRecord.orderNo)) {
      setOrderRecords((prev) => prev.map((item) => item.orderNo === selectedAccountingRecord.orderNo ? { ...item, paymentStatus: '退款處理中', mainStatus: '退款處理中' } : item));
    }
    setAccountingNotice({ text: `✅ 已送出退款確認：${selectedAccountingRecord.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ Orders 已同步退款狀態：${selectedAccountingRecord.orderNo}`, tone: 'neutral' });
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
              <DashboardModule workflowCards={workflowCards} WorkflowModule={WorkflowModule} itemCount={itemCount} shippingMethod={shippingMethod} grandTotal={grandTotal} />
            )}
            {active === 'products' && (
              <ProductsModule products={products} enabledProducts={enabledProducts} productNotice={productNotice} selectedProductId={selectedProductId} filteredProducts={filteredProducts} openCreateProduct={openCreateProduct} openViewProduct={openViewProduct} openEditProduct={openEditProduct} toggleProductEnabled={toggleProductEnabled} productEditorMode={productEditorMode} productDraft={productDraft} setProductDraft={setProductDraft} saveProductDraft={saveProductDraft} selectedProduct={selectedProduct} SectionIntro={SectionIntro} StatusBadge={StatusBadge} />
            )}
            {active === 'customers' && (
              <CustomersModule customers={customers} vipCustomers={vipCustomers} filteredCustomers={filteredCustomers} SectionIntro={SectionIntro} />
            )}
            {active === 'staff' && (
              <StaffModule staff={staff} activeStaff={activeStaff} filteredStaff={filteredStaff} getRankClass={getRankClass} SectionIntro={SectionIntro} StatusBadge={StatusBadge} />
            )}
            {active === 'orders' && (
              <OrdersModule itemCount={itemCount} shippingMethod={shippingMethod} grandTotal={grandTotal} user={user} orderCategoryChips={orderCategoryChips} orderCategory={orderCategory} setOrderCategory={setOrderCategory} filteredOrderProducts={filteredOrderProducts} addToCart={addToCart} quickCustomerCards={quickCustomerCards} applyQuickCustomer={applyQuickCustomer} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} setShippingMethod={setShippingMethod} getShippingFee={getShippingFee} discountMode={discountMode} setDiscountMode={setDiscountMode} discountValue={discountValue} setDiscountValue={setDiscountValue} remark={remark} setRemark={setRemark} cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} subtotal={subtotal} shippingFee={shippingFee} discountAmount={discountAmount} SectionIntro={SectionIntro} orderRecords={orderRecords} selectedOrderRecord={selectedOrderRecord} selectedOrderNo={selectedOrderNo} selectOrderRecord={selectOrderRecord} createOrderRecord={createOrderRecord} markOrderPaid={markOrderPaid} markOrderShippingReady={markOrderShippingReady} orderNotice={orderNotice} />
            )}
            {active === 'inventory' && (
              <InventoryModule lowStockCount={lowStockCount} shippingQueue={dynamicShippingQueue} warehouseSummary={warehouseSummary} warehouseTab={warehouseTab} setWarehouseTab={setWarehouseTab} selectedWarehouseOrder={selectedWarehouseOrder} selectedWarehouseOrderNo={selectedWarehouseOrderNo} setSelectedWarehouseOrderNo={setSelectedWarehouseOrderNo} warehouseNotice={warehouseNotice} shippingChecklist={shippingChecklist} handleWarehouseShip={handleWarehouseShip} handleWarehousePrint={handleWarehousePrint} inventoryFlow={inventoryFlow} stockSnapshot={stockSnapshot} selectedStockCode={selectedStockCode} setSelectedStockCode={setSelectedStockCode} selectedStockItem={selectedStockItem} queryExamples={queryExamples} warehouseQueryMode={warehouseQueryMode} setWarehouseQueryMode={setWarehouseQueryMode} warehouseQueryInput={warehouseQueryInput} setWarehouseQueryInput={setWarehouseQueryInput} runWarehouseQuery={runWarehouseQuery} handleWarehouseScanFill={handleWarehouseScanFill} warehouseQueryResult={warehouseQueryResult} warehouseRecentLogs={warehouseRecentLogs} SectionIntro={SectionIntro} SummaryCard={SummaryCard} />
            )}
            {active === 'accounting' && (
              <AccountingModule paymentQueue={dynamicPaymentQueue} accountingSummary={accountingSummary} accountingTab={accountingTab} setAccountingTab={setAccountingTab} filteredAccountingQueue={filteredAccountingQueue} accountingOpsTotal={accountingOpsTotal} accountingKeyword={accountingKeyword} setAccountingKeyword={setAccountingKeyword} accountingPaymentFilter={accountingPaymentFilter} setAccountingPaymentFilter={setAccountingPaymentFilter} accountingShippingFilter={accountingShippingFilter} setAccountingShippingFilter={setAccountingShippingFilter} accountingDateStart={accountingDateStart} setAccountingDateStart={setAccountingDateStart} accountingDateEnd={accountingDateEnd} setAccountingDateEnd={setAccountingDateEnd} accountingNotice={accountingNotice} selectedAccountingRecord={selectedAccountingRecord} triggerAccountingAction={triggerAccountingAction} selectAccountingOrder={selectAccountingOrder} accountingBoards={accountingBoards} accountingTrendBars={accountingTrendBars} salesRanking={salesRanking} hotProductsBoard={hotProductsBoard} SectionIntro={SectionIntro} SummaryCard={SummaryCard} />
            )}
            {active === 'profile' && (
              <ProfileModule personalOrders={personalOrders} personalSummary={personalSummary} profileQuickActions={profileQuickActions} user={user} getRankClass={getRankClass} keyword={keyword} setKeyword={setKeyword} SectionIntro={SectionIntro} SummaryCard={SummaryCard} />
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
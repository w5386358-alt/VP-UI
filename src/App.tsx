import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, deleteDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Bell,
  RefreshCw,
  LogOut,
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


type BeforeInstallPromptEvent = Event & {
  readonly platforms?: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type Rank = 'core' | 'elite' | 'senior' | 'normal';
type NavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'products' | 'customers' | 'staff' | 'profile';
type MobileNavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'more';

type Product = { id: string; code: string; barcode?: string; name: string; category: string; price: number; enabled: boolean; stock: number; image?: string; vipPrice?: number; agentPrice?: number; generalAgentPrice?: number; sourceDocId?: string };
type Customer = { id: string; name: string; phone: string; level: string; ownerLoginId: string; ownerName: string };
type Staff = { id: string; name: string; loginId: string; role: string; rank: string; enabled: boolean; password?: string; permissions?: string[] };
type SessionUser = { name: string; loginId: string; role: Role; rank: string; rankKey: Rank };

type PermissionProfile = {
  canViewAllCustomers: boolean;
  canViewOwnCustomers: boolean;
  canViewAssignedOrderCustomers: boolean;
  canViewCustomerSensitiveFields: boolean;
  canEditPrice: boolean;
  canOverrideInventory: boolean;
  canRefund: boolean;
};
type ShippingMethod = '宅配' | '店到店' | '自取';
type CartItem = Product & { qty: number };
type WarehouseTab = 'shipping' | 'stock' | 'query';
type WarehouseQueryMode = 'barcode' | 'qr' | 'order';
type AccountingTab = 'ops' | 'bonus' | 'treasury' | 'stats' | 'ranking' | 'evaluation';
type EvaluationQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
type EvaluationMetric = 'sales' | 'collaboration' | 'professional' | 'efficiency';
type EvaluationDraft = { sales: number; collaboration: number; professional: number; efficiency: number; };
type EvaluationSubmission = { id: string; quarter: EvaluationQuarter; evaluatorLoginId: string; evaluatorName: string; evaluateeLoginId: string; evaluateeName: string; sales: number; collaboration: number; professional: number; efficiency: number; total: number; submittedAt: string; isAnonymous: boolean; };
type EvaluationResultRow = { loginId: string; name: string; quarter: EvaluationQuarter; sales: number; collaboration: number; professional: number; efficiency: number; total: number; kValue: number; medal: string; submissionCount: number; };

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
  barcode: string;
  name: string;
  category: string;
  price: string;
  vipPrice: string;
  agentPrice: string;
  generalAgentPrice: string;
  stock: string;
  image: string;
  enabled: boolean;
};

type StaffEditorMode = 'create' | 'edit' | 'view';

type StaffDraft = {
  id: string;
  name: string;
  loginId: string;
  role: string;
  rank: string;
  enabled: boolean;
  password: string;
};

type AccountingDraft = {
  orderNo: string;
  customer: string;
  untaxedAmount: string;
  taxRate: string;
  shippingFee: string;
  actualReceived: string;
  paymentMethod: string;
  invoiceNo: string;
  proof: string;
};

type TreasuryDraft = {
  orderNo: string;
  customer: string;
  refundAmount: string;
  payoutMethod: string;
  proof: string;
  note: string;
};

type TreasuryExpenseDraft = {
  category: string;
  amount: string;
  referenceNo: string;
  note: string;
  proof: string;
};

type TreasuryExpenseRecord = {
  id: string;
  category: string;
  amount: number;
  referenceNo: string;
  note: string;
  proof: string;
  createdAt: string;
  operator: string;
};

type BonusDraft = {
  date: string;
  time: string;
  amount: string;
  note: string;
};

type BonusRecord = {
  id: string;
  date: string;
  time: string;
  amount: number;
  note: string;
  operator: string;
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
  taxRate?: number;
  shippingFeeOverride?: number;
  actualReceived?: number;
  paymentMethod?: string;
  invoiceNo?: string;
  proof?: string;
  items: Array<{ code: string; name: string; qty: number; price: number }>;
};


type InventoryLogType = '入庫' | '出庫';

type InventoryLog = {
  id: string;
  createdAt: string;
  type: InventoryLogType;
  code: string;
  name: string;
  qty: number;
  qr: string;
  operator: string;
  note: string;
  orderNo?: string;
};

type StockSnapshotItem = {
  code: string;
  name: string;
  stock: number;
  safe: number;
  qr: string;
  status: string;
  updated: string;
};

const SAFE_STOCK_MAP: Record<string, number> = {
  E401: 12,
  E402: 8,
  E408: 8,
  P301: 10,
  P304: 6,
  P305: 8,
};

const INITIAL_QR_SEED: Record<string, Array<{ qr: string; qty: number }>> = {
  E401: [{ qr: 'QR(A)', qty: 18 }, { qr: 'QR(B)', qty: 18 }],
  E402: [{ qr: 'QR(E402)', qty: 18 }],
  E408: [{ qr: 'QR(M)', qty: 22 }],
  P301: [{ qr: 'QR(P1)', qty: 6 }, { qr: 'QR(P2)', qty: 3 }],
  P305: [{ qr: 'QR(P305)', qty: 14 }],
};

function parseDateValue(value: string) {
  return new Date(value.replace(/-/g, '/')).getTime();
}

function formatClock(value: string) {
  return new Date(value.replace(/-/g, '/')).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDateTime(value: string) {
  return new Date(value.replace(/-/g, '/')).toLocaleString('zh-TW', { hour12: false });
}

function buildInitialInventoryLogs(source: Product[]): InventoryLog[] {
  const logs: InventoryLog[] = [];
  source.forEach((product, productIndex) => {
    const buckets = INITIAL_QR_SEED[product.code] ?? [{ qr: `QR(${product.code})`, qty: Math.max(product.stock, 0) }];
    buckets.forEach((bucket, bucketIndex) => {
      if (bucket.qty <= 0) return;
      logs.push({
        id: `seed-${product.code}-${bucketIndex + 1}`,
        createdAt: `2026-03-31 ${String(8 + productIndex).padStart(2, '0')}:${String(10 + bucketIndex * 8).padStart(2, '0')}:00`,
        type: '入庫',
        code: product.code,
        name: product.name,
        qty: bucket.qty,
        qr: bucket.qr,
        operator: 'SYSTEM',
        note: `${product.code} 建立期初庫存 ${bucket.qty} 件（${bucket.qr}）`,
      });
    });
  });
  return logs;
}

function getQrBalanceMap(logs: InventoryLog[], code: string) {
  const map = new Map<string, number>();
  logs.filter((item) => item.code === code).forEach((item) => {
    const current = map.get(item.qr) ?? 0;
    map.set(item.qr, current + (item.type === '入庫' ? item.qty : -item.qty));
  });
  return map;
}

function findAvailableQrBuckets(logs: InventoryLog[], code: string) {
  return Array.from(getQrBalanceMap(logs, code).entries())
    .map(([qr, qty]) => ({ qr, qty }))
    .filter((item) => item.qty > 0)
    .sort((a, b) => b.qty - a.qty);
}

function deriveStockSnapshot(source: Product[], logs: InventoryLog[]): StockSnapshotItem[] {
  const latestByCode = new Map<string, InventoryLog>();
  logs.forEach((item) => {
    const current = latestByCode.get(item.code);
    if (!current || parseDateValue(item.createdAt) >= parseDateValue(current.createdAt)) {
      latestByCode.set(item.code, item);
    }
  });

  return source
    .map((product) => {
      const qrBalances = findAvailableQrBuckets(logs, product.code);
      const stock = qrBalances.reduce((sum, item) => sum + item.qty, 0);
      const latest = latestByCode.get(product.code);
      const safe = SAFE_STOCK_MAP[product.code] ?? 10;
      return {
        code: product.code,
        name: product.name,
        stock,
        safe,
        qr: qrBalances.length ? qrBalances.map((item) => `${item.qr}*${item.qty}`).join(' / ') : '無可用庫存',
        status: stock <= safe ? '低庫存' : '正常',
        updated: latest ? `${formatDateTime(latest.createdAt)} / ${latest.type}` : '尚無異動',
      };
    })
    .filter((item) => item.stock > 0 || source.find((product) => product.code === item.code)?.enabled);
}

function buildRecentWarehouseLogs(logs: InventoryLog[]) {
  return [...logs]
    .sort((a, b) => parseDateValue(b.createdAt) - parseDateValue(a.createdAt))
    .slice(0, 12)
    .map((item) => ({
      time: formatClock(item.createdAt),
      type: item.type,
      note: item.note,
    }));
}

const navItems: { key: NavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: '儀表板', icon: BarChart3 },
  { key: 'orders', label: '訂購', icon: ShoppingCart },
  { key: 'inventory', label: '倉儲', icon: Warehouse },
  { key: 'accounting', label: '會計', icon: CreditCard },
  { key: 'products', label: '商品', icon: Package },
  { key: 'customers', label: '客戶', icon: Users },
  { key: 'staff', label: '人員', icon: UserCog },
  { key: 'profile', label: '評鑑', icon: ClipboardList },
];

const NAV_ENGLISH_LABEL: Record<NavKey, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  inventory: 'Warehouse',
  accounting: 'Accounting',
  products: 'Products',
  customers: 'Customers',
  staff: 'Staff',
  profile: 'Evaluation',
};


const ROLE_NAV_ACCESS: Record<Role, NavKey[]> = {
  admin: ['dashboard', 'orders', 'inventory', 'accounting', 'products', 'customers', 'staff', 'profile'],
  sales: ['dashboard', 'orders', 'profile'],
  accounting: ['dashboard', 'orders', 'accounting', 'customers', 'profile'],
  warehouse: ['dashboard', 'orders', 'inventory', 'customers', 'profile'],
};

const ROLE_LABEL: Record<Role, string> = {
  admin: '系統',
  sales: '其他身分',
  accounting: '會計',
  warehouse: '倉儲',
};

const ROLE_RANK: Record<Role, string> = {
  admin: '核心成員',
  sales: '普通銷售',
  accounting: '高級銷售',
  warehouse: '高級銷售',
};

const RANK_LABEL: Record<Rank, string> = {
  core: '核心成員',
  elite: '菁英成員',
  senior: '高級銷售',
  normal: '普通銷售',
};

const RANK_DISPLAY: Record<Rank, string> = {
  core: '核心',
  elite: '菁英',
  senior: '高級',
  normal: '普通',
};


function getPriceTierLabel(rankKey: Rank) {
  if (rankKey === 'core') return '總代理價';
  if (rankKey === 'elite' || rankKey === 'senior') return '代理價';
  return 'VIP價';
}

function getPriceTierField(rankKey: Rank) {
  if (rankKey === 'core') return 'generalAgentPrice';
  if (rankKey === 'elite' || rankKey === 'senior') return 'agentPrice';
  return 'vipPrice';
}

function getTierPrice(product: Product, rankKey: Rank) {
  const field = getPriceTierField(rankKey);
  const value = Number((product as any)[field]);
  if (Number.isFinite(value) && value > 0) return value;
  return Number(product.price || 0);
}

function canAccessNav(role: Role, key: NavKey) {
  return ROLE_NAV_ACCESS[role].includes(key);
}

function canAccessEvaluation(user: SessionUser) {
  return user.rankKey === 'core' && canAccessNav(user.role, 'profile');
}

function getProfileTriggerLabel(name: string) {
  return name?.trim()?.charAt(1) || name?.trim()?.charAt(0) || '我';
}

function getPermissionProfile(role: Role, rankKey: Rank): PermissionProfile {
  const base: PermissionProfile = {
    canViewAllCustomers: false,
    canViewOwnCustomers: false,
    canViewAssignedOrderCustomers: false,
    canViewCustomerSensitiveFields: false,
    canEditPrice: false,
    canOverrideInventory: false,
    canRefund: false,
  };

  if (role === 'admin') {
    return {
      canViewAllCustomers: true,
      canViewOwnCustomers: true,
      canViewAssignedOrderCustomers: true,
      canViewCustomerSensitiveFields: true,
      canEditPrice: true,
      canOverrideInventory: true,
      canRefund: true,
    };
  }

  if (role === 'warehouse') {
    return {
      ...base,
      canViewAssignedOrderCustomers: true,
    };
  }

  if (role === 'accounting') {
    return {
      ...base,
      canViewAssignedOrderCustomers: true,
      canRefund: rankKey === 'core' || rankKey === 'elite',
    };
  }

  if (rankKey === 'core') {
    return {
      ...base,
      canViewAllCustomers: true,
      canViewOwnCustomers: true,
      canViewCustomerSensitiveFields: true,
      canEditPrice: true,
      canOverrideInventory: true,
      canRefund: true,
    };
  }

  return {
    ...base,
    canViewOwnCustomers: true,
    canViewCustomerSensitiveFields: true,
    canEditPrice: rankKey === 'elite',
  };
}

function getRankToneClass(rankKey: Rank) {
  switch (rankKey) {
    case 'core':
      return 'badge badge-rank-core';
    case 'elite':
      return 'badge badge-rank-elite';
    case 'senior':
      return 'badge badge-rank-senior';
    default:
      return 'badge badge-rank-normal';
  }
}



const EVALUATION_METRIC_META: Array<{ key: EvaluationMetric; label: string; max: number; desc: string }> = [
  { key: 'sales', label: '業績', max: 40, desc: '專案達成 / 結果導向' },
  { key: 'collaboration', label: '協作', max: 25, desc: '協作整合 / 團隊效能' },
  { key: 'professional', label: '專業', max: 20, desc: '資產化貢獻 / 長期價值' },
  { key: 'efficiency', label: '效率', max: 15, desc: '執行落地 / 時效品質' },
];

const EVALUATION_QUARTERS: EvaluationQuarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

function makeEvaluationDraft(): EvaluationDraft {
  return { sales: 32, collaboration: 20, professional: 16, efficiency: 12 };
}

function calculateEvaluationTotal(scores: EvaluationDraft | EvaluationSubmission) {
  return Number(scores.sales || 0) + Number(scores.collaboration || 0) + Number(scores.professional || 0) + Number(scores.efficiency || 0);
}

function getEvaluationMedal(total: number) {
  if (total >= 90) return '領航級';
  if (total >= 70) return '專業級';
  return '精進級';
}

function getEvaluationK(total: number) {
  if (total >= 90) return 1.2;
  if (total >= 80) return 1.1;
  if (total >= 70) return 1.0;
  if (total >= 60) return 0.95;
  return 0.9;
}

function normalizeRankKeyFromLabel(rank: string): Rank {
  if (String(rank || '').includes('核心')) return 'core';
  if (String(rank || '').includes('菁英')) return 'elite';
  if (String(rank || '').includes('高級')) return 'senior';
  return 'normal';
}

function buildSeedEvaluationSubmissions(coreMembers: Array<{ loginId: string; name: string }>): EvaluationSubmission[] {
  const basePairs = [];
  for (let i = 0; i < coreMembers.length; i += 1) {
    for (let j = 0; j < coreMembers.length; j += 1) {
      if (i === j) continue;
      const evaluator = coreMembers[i];
      const evaluatee = coreMembers[j];
      basePairs.push({ evaluator, evaluatee, quarter: i % 2 === 0 ? 'Q1' : 'Q2' });
    }
  }
  return basePairs.slice(0, Math.min(basePairs.length, 8)).map((pair, index) => {
    const sales = 30 + ((index * 3) % 9);
    const collaboration = 18 + ((index * 2) % 6);
    const professional = 13 + (index % 5);
    const efficiency = 10 + (index % 4);
    return {
      id: `seed-eval-${index + 1}`,
      quarter: pair.quarter as EvaluationQuarter,
      evaluatorLoginId: pair.evaluator.loginId,
      evaluatorName: pair.evaluator.name,
      evaluateeLoginId: pair.evaluatee.loginId,
      evaluateeName: pair.evaluatee.name,
      sales, collaboration, professional, efficiency,
      total: sales + collaboration + professional + efficiency,
      submittedAt: `2026-04-0${(index % 8) + 1} 10:${String((index + 1) * 4).padStart(2, '0')}:00`,
      isAnonymous: true,
    };
  });
}

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
    desc: '銷售排行、熱門商品與退款影響集中查看。',
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
  { title: '員編掃碼', desc: '快速開啟掃碼。', icon: QrCode },
  { title: '刷新資料', desc: '快速更新歷史資料。', icon: RefreshCw },
  { title: '業績查詢', desc: '集中查看排名與業績。', icon: Trophy },
];

const personalOrders = [
  { orderNo: 'VP20260329-021', date: '2026/03/29 14:20', amount: 3680, paymentStatus: '已收款', shippingStatus: '已出貨', mainStatus: '已完成' },
  { orderNo: 'VP20260330-008', date: '2026/03/30 11:05', amount: 4259, paymentStatus: '待收款', shippingStatus: '待出貨', mainStatus: '處理中' },
  { orderNo: 'EX20260330-001', date: '2026/03/30 18:42', amount: 65, paymentStatus: '退款處理中', shippingStatus: '換貨待出庫', mainStatus: '換貨處理' },
  { orderNo: 'VP20260331-002', date: '2026/03/31 09:08', amount: 2825, paymentStatus: '已收款', shippingStatus: '理貨中', mainStatus: '出貨中' },
];



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
    desc: '商品、客戶與訂單。',
    accent: 'rose',
    icon: Sparkles,
    bullets: ['商品列表 / 分類 / 搜尋', '客戶資料 / 配送欄位', '訂單主檔 / 訂單明細'],
  },
  {
    title: '會計',
    desc: '收款、退款與報表。',
    accent: 'gold',
    icon: CreditCard,
    bullets: ['未稅價 / 稅額 / 實收', '收款狀態 / 出貨狀態', '銷售統計 / 排名'],
  },
  {
    title: '倉儲中心',
    desc: '出貨、庫存與查詢。',
    accent: 'pearl',
    icon: Boxes,
    bullets: ['出貨 / 庫存 / 查詢', '商品條碼 / QR 身分識別', '入庫 / 出貨 / 退貨 / 換貨'],
  },
  {
    title: '評鑑',
    desc: '評鑑與後續投票機制。',
    accent: 'lavender',
    icon: ClipboardList,
    bullets: ['歷史訂單', '累積業績 / 排名', '身分 / 階級 / 價格層級'],
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

function getFirebaseAppInstance() {
  if (!hasFirebaseConfig()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

function getDb() {
  const app = getFirebaseAppInstance();
  if (!app) return null;
  return getFirestore(app);
}

function getStorageService() {
  const app = getFirebaseAppInstance();
  if (!app || !firebaseConfig.storageBucket) return null;
  return getStorage(app);
}

function normalizeProduct(id: string, data: any): Product {
  const canonicalCode = String(data.code || data.productCode || data.productId || id || '-').trim();
  return {
    id: canonicalCode,
    sourceDocId: id,
    code: canonicalCode,
    barcode: data.barcode || data.productBarcode || canonicalCode,
    name: data.name || data.productName || '未命名商品',
    category: data.category || data.productCategory || '未分類',
    price: Number(data.originalPrice ?? data.price ?? data.vipPrice ?? data.salePrice ?? 0),
    vipPrice: Number(data.vipPrice ?? data.price ?? data.salePrice ?? data.originalPrice ?? 0),
    agentPrice: Number(data.agentPrice ?? data.dealerPrice ?? data.vipPrice ?? data.price ?? data.originalPrice ?? 0),
    generalAgentPrice: Number(data.generalAgentPrice ?? data.masterPrice ?? data.agentPrice ?? data.dealerPrice ?? data.vipPrice ?? data.price ?? data.originalPrice ?? 0),
    image: data.image || data.imageUrl || data.photo || '',
    enabled: data.enabled ?? data.isActive ?? true,
    stock: Number(data.stock ?? data.currentStock ?? 0),
  };
}

function normalizeCustomer(id: string, data: any): Customer {
  return {
    id,
    name: data.name || data.customerName || '未命名客戶',
    phone: data.phone || data.customerPhone || '-',
    level: data.level || data.tier || data.customerLevel || '一般',
    ownerLoginId: data.ownerLoginId || data.salesLoginId || data.createdByLoginId || 'vp001',
    ownerName: data.ownerName || data.salesName || data.createdByName || '未指派',
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
    password: data.password || data.loginId || data.staffId || id,
    permissions: Array.isArray(data.permissions) ? data.permissions : undefined,
  };
}

function normalizeInventoryDoc(id: string, data: any) {
  const canonicalCode = String(data.code || data.productCode || data.productId || data.id || id || '-').trim();
  return {
    id: canonicalCode,
    sourceDocId: id,
    productId: canonicalCode,
    code: canonicalCode,
    barcode: data.barcode || canonicalCode,
    name: data.name || data.productName || '未命名商品',
    category: data.category || data.productCategory || '未分類',
    stock: Number(data.currentStock ?? data.stock ?? data.qty ?? 0),
    enabled: data.enabled ?? data.isActive ?? true,
    updatedAt: String(data.updatedAt || data.lastSyncedAt || ''),
  };
}

function normalizeInventoryLog(id: string, data: any): InventoryLog {
  return {
    id,
    createdAt: String(data.createdAt || data.created_at || data.updatedAt || '2026-04-01 00:00:00'),
    type: data.type === '出庫' ? '出庫' : '入庫',
    code: data.code || data.productCode || data.barcode || '-',
    name: data.name || data.productName || '未命名商品',
    qty: Number(data.qty || data.quantity || 0),
    qr: String(data.qr || data.qrCode || data.identityCode || `QR(${data.code || data.productCode || 'ITEM'})`).toUpperCase(),
    operator: String(data.operator || data.operatorLoginId || data.createdBy || 'SYSTEM'),
    note: String(data.note || ''),
    orderNo: data.orderNo || undefined,
  };
}


function normalizeOrderRecord(id: string, data: any): OrderRecord {
  const orderNo = String(data.orderNo || data.id || id || '').trim();
  const customer = String(data.customer || data.customerName || '').trim();
  const phone = String(data.phone || data.customerPhone || '').trim();
  const shippingMethodRaw = String(data.shippingMethod || '宅配').trim();
  const shippingMethod: ShippingMethod = shippingMethodRaw === '店到店' || shippingMethodRaw === '自取' ? shippingMethodRaw : '宅配';
  const address = String(data.address || data.shippingDetail || '').trim();
  const paymentStatus = String(data.paymentStatus || '待收款').trim();
  const shippingStatus = String(data.shippingStatus || '待出貨').trim();
  const mainStatus = String(data.mainStatus || data.orderStatus || '處理中').trim();
  const date = String(data.date || data.createdAt || data.updatedAt || getTaipeiTimestamp()).replace(/-/g, '/');
  const remark = String(data.remark || data.note || '').trim();
  const taxRate = Number(data.taxRate ?? 0);
  const shippingFeeOverride = Number(data.shippingFeeOverride ?? data.shippingFee ?? getShippingFeeByMethod(shippingMethod));
  const actualReceived = Number(data.actualReceived ?? data.total ?? data.amount ?? 0);
  const paymentMethod = String(data.paymentMethod || '待確認').trim();
  const invoiceNo = String(data.invoiceNo || '待補').trim();
  const proof = String(data.proof || '待上傳').trim();
  let items: Array<{ code: string; name: string; qty: number; price: number }> = [];
  const rawItems = data.items;
  try {
    const parsed = typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems;
    if (Array.isArray(parsed)) {
      items = parsed.map((item: any) => ({
        code: String(item.code || item.productCode || '').trim(),
        name: String(item.name || item.productName || '').trim(),
        qty: Number(item.qty || item.quantity || 0),
        price: Number(item.price || item.originalPrice || 0),
      })).filter((item) => item.code && item.qty > 0);
    }
  } catch {}
  const amount = Number(data.amount ?? data.total ?? data.actualReceived ?? actualReceived ?? 0);
  const itemCount = Number(data.itemCount ?? data.productCount ?? items.reduce((sum, item) => sum + item.qty, 0) ?? 0);
  return {
    orderNo,
    customer,
    phone,
    shippingMethod,
    address,
    amount,
    itemCount,
    paymentStatus,
    shippingStatus,
    mainStatus,
    date,
    remark,
    taxRate,
    shippingFeeOverride,
    actualReceived,
    paymentMethod,
    invoiceNo,
    proof,
    items,
  };
}

function dedupeByLatest<T>(items: T[], getKey: (item: T) => string, getUpdatedAt?: (item: T) => string | number | undefined) {
  const map = new Map<string, T>();
  items.forEach((item) => {
    const key = String(getKey(item) || '').trim();
    if (!key) return;
    const current = map.get(key);
    if (!current) {
      map.set(key, item);
      return;
    }
    if (!getUpdatedAt) return;
    const nextTime = new Date(String(getUpdatedAt(item) || '')).getTime() || 0;
    const currentTime = new Date(String(getUpdatedAt(current) || '')).getTime() || 0;
    if (nextTime >= currentTime) map.set(key, item);
  });
  return Array.from(map.values());
}

function getIsoNow() {
  return new Date().toISOString();
}

function getTaipeiTimestamp() {
  const now = new Date();
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Taipei',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now).replace(' ', ' ');
}

function buildProductPayload(product: Product) {
  const nowIso = getIsoNow();
  return {
    id: product.code,
    code: product.code,
    barcode: product.barcode || product.code,
    name: product.name,
    category: product.category,
    price: product.price,
    originalPrice: product.price,
    vipPrice: product.vipPrice ?? product.price,
    agentPrice: product.agentPrice ?? product.price,
    generalAgentPrice: product.generalAgentPrice ?? product.price,
    stock: product.stock,
    image: product.image || '',
    imageUrl: product.image || '',
    photo: product.image || '',
    enabled: product.enabled,
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildInventoryPayload(product: Product, stock: number) {
  const nowIso = getIsoNow();
  return {
    id: product.code,
    productId: product.code,
    code: product.code,
    barcode: product.barcode || product.code,
    name: product.name,
    category: product.category,
    currentStock: stock,
    stock,
    enabled: product.enabled,
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}


function safeFirestoreDocId(input: string, fallback = 'doc') {
  const cleaned = String(input || '')
    .trim()
    .replace(/[\/\?#\[\]]/g, '_')
    .replace(/\s+/g, '_');
  return cleaned || fallback;
}

function getTaipeiDateKey() {
  return getTaipeiTimestamp().replace(/[-:\s]/g, '_');
}

function buildCustomerPayloadFromOrder(order: OrderRecord) {
  const nowIso = getIsoNow();
  const customerId = safeFirestoreDocId(order.phone || order.customer || order.orderNo, 'customer');
  return {
    id: customerId,
    name: order.customer,
    phone: order.phone,
    level: '一般客戶',
    ownerLoginId: '',
    ownerName: '',
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildOrderPayload(order: OrderRecord) {
  const nowIso = getIsoNow();
  const createdAt = order.date.replace(/\//g, '-');
  return {
    id: order.orderNo,
    orderNo: order.orderNo,
    customerName: order.customer,
    customerPhone: order.phone,
    shippingMethod: order.shippingMethod,
    shippingDetail: order.address,
    address: order.address,
    productCount: order.itemCount,
    subtotal: getUntaxedAmountFromRecord(order),
    shippingFee: Number(order.shippingFeeOverride ?? getShippingFeeByMethod(order.shippingMethod) ?? 0),
    discountMode: '無',
    discountValue: 0,
    discountAmount: 0,
    total: order.amount,
    actualReceived: Number(order.actualReceived ?? order.amount ?? 0),
    untaxedPrice: Number(getUntaxedAmountFromRecord(order) || 0),
    taxRate: Number(order.taxRate ?? 0),
    taxableAmount: Number(getTaxAmount(getUntaxedAmountFromRecord(order), Number(order.taxRate ?? 0)) || 0),
    paymentStatus: order.paymentStatus,
    shippingStatus: order.shippingStatus,
    orderStatus: order.mainStatus,
    paymentMethod: order.paymentMethod || '待確認',
    invoiceNo: order.invoiceNo || '待補',
    proof: order.proof || '待上傳',
    note: order.remark || '',
    items: JSON.stringify(order.items),
    source: 'VERCEL_UI',
    createdAt,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildOrderItemPayload(order: OrderRecord, item: { code: string; name: string; qty: number; price: number }, index: number) {
  const nowIso = getIsoNow();
  const originalPrice = Number(item.price || 0);
  return {
    id: safeFirestoreDocId(`${order.orderNo}_${item.code}_${index + 1}`, 'order_item'),
    orderNo: order.orderNo,
    productCode: item.code,
    productName: item.name,
    qty: Number(item.qty || 0),
    originalPrice,
    price: originalPrice,
    subtotal: originalPrice * Number(item.qty || 0),
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildSalesReportPayload(order: OrderRecord) {
  const nowIso = getIsoNow();
  const untaxedPrice = Number(getUntaxedAmountFromRecord(order) || 0);
  const taxRate = Number(order.taxRate ?? 0);
  const taxableAmount = Number(getTaxAmount(untaxedPrice, taxRate) || 0);
  const shippingFee = Number(order.shippingFeeOverride ?? getShippingFeeByMethod(order.shippingMethod) ?? 0);
  return {
    id: order.orderNo,
    orderNo: order.orderNo,
    customerName: order.customer,
    amount: Number(order.amount || 0),
    actualReceived: Number(order.actualReceived ?? order.amount ?? 0),
    untaxedPrice,
    taxRate,
    taxableAmount,
    shippingFee,
    paymentStatus: order.paymentStatus,
    shippingStatus: order.shippingStatus,
    orderStatus: order.mainStatus,
    itemCount: Number(order.itemCount || 0),
    items: JSON.stringify(order.items),
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildPaymentPayload(order: OrderRecord, mode: 'pay' | 'refund') {
  const nowIso = getIsoNow();
  const paymentDate = getTaipeiTimestamp();
  const amount = Number(order.actualReceived ?? order.amount ?? 0);
  return {
    id: safeFirestoreDocId(mode === 'refund' ? `${order.orderNo}_refund` : `${order.orderNo}_payment`, 'payment'),
    orderNo: order.orderNo,
    customerName: order.customer,
    paymentDate,
    paymentMethod: order.paymentMethod || '待確認',
    amount,
    actualReceived: amount,
    invoiceNo: order.invoiceNo || '待補',
    proof: order.proof || '待上傳',
    paymentStatus: mode === 'refund' ? '退款處理中' : '已收款',
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildRefundPayload(order: OrderRecord) {
  const nowIso = getIsoNow();
  const refundDate = getTaipeiTimestamp();
  const amount = Number(order.actualReceived ?? order.amount ?? 0);
  return {
    id: safeFirestoreDocId(order.orderNo, 'refund'),
    orderNo: order.orderNo,
    customerName: order.customer,
    customerPhone: order.phone || '',
    refundDate,
    refundAmount: amount,
    actualRefundAmount: amount,
    paymentMethod: order.paymentMethod || '待確認',
    invoiceNo: order.invoiceNo || '退款單',
    proof: order.proof || '待上傳',
    status: '退款處理中',
    note: order.remark || '',
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildShippingPayload(order: OrderRecord, actor: SessionUser, allocations: InventoryLog[] = []) {
  const nowIso = getIsoNow();
  const shippedAt = getTaipeiTimestamp();
  return {
    id: order.orderNo,
    orderNo: order.orderNo,
    customerName: order.customer,
    customerPhone: order.phone,
    shippingMethod: order.shippingMethod,
    shippingDetail: order.address,
    address: order.address,
    shippingStatus: order.shippingStatus,
    paymentStatus: order.paymentStatus,
    shippedAt,
    operatorLoginId: actor.loginId,
    operatorName: actor.name,
    qty: allocations.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    items: JSON.stringify(order.items),
    scans: JSON.stringify(allocations.map((item) => ({
      productCode: item.code,
      productName: item.name,
      qty: item.qty,
      qrcode: item.qr,
    }))),
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function buildInventoryLogFirebasePayload(
  log: InventoryLog,
  product: Product,
  actor: SessionUser,
  typeOverride?: string,
) {
  const nowIso = getIsoNow();
  const changedAt = log.createdAt || getTaipeiTimestamp();
  const finalType = typeOverride || (log.type === '出庫' ? '出貨' : '入庫');
  const docId = safeFirestoreDocId(
    log.id || `${getTaipeiDateKey()}_${log.orderNo || 'noOrder'}_${log.code}_${log.qr || 'noQr'}`,
    'inventory_log',
  );
  return {
    id: docId,
    changedAt,
    orderNo: log.orderNo || '',
    productCode: log.code || product.code,
    productName: log.name || product.name,
    barcode: product.barcode || product.code,
    qrCode: log.qr || '',
    qty: Number(log.qty || 0),
    operatorLoginId: actor.loginId,
    operatorName: actor.name,
    note: log.note || '',
    type: finalType,
    source: 'VERCEL_UI',
    sourceSystem: 'VERCEL_UI',
    syncVersion: 1,
    updatedAt: nowIso,
    lastSyncedAt: nowIso,
  };
}

function getRankClass(rank: string) {
  if (rank.includes('核心')) return 'badge badge-rank-core';
  if (rank.includes('菁英')) return 'badge badge-rank-elite';
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
      return '搜尋條碼 / QR / 商品 / 出貨狀態';
    case 'accounting':
      return '搜尋訂單編號 / 客戶 / 收款狀態 / 退款狀態 / 收款證明';
    case 'profile':
      return '搜尋我的歷史訂單 / 訂單編號 / 狀態 / 日期';
    default:
      return '搜尋資料';
  }
}

function getShippingFee(method: ShippingMethod) {
  if (method === '宅配') return 100;
  if (method === '店到店') return 65;
  return 0;
}


function sortOrderRecords(records: OrderRecord[]) {
  return [...records].sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date) || b.orderNo.localeCompare(a.orderNo));
}

function makeEmptyProductDraft(nextCode = ''): ProductDraft {
  return { id: '', code: nextCode, barcode: '', name: '', category: '保健', price: '', vipPrice: '', agentPrice: '', generalAgentPrice: '', stock: '', image: '', enabled: true };
}

function getTodayDateInputValue() {
  const now = new Date();
  const taipei = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return taipei.toISOString().slice(0, 10);
}

function getShippingFeeByMethod(method: ShippingMethod) {
  return method === '宅配' ? 100 : method === '店到店' ? 65 : 0;
}

function getUntaxedAmountFromRecord(record: OrderRecord) {
  return record.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getTaxAmount(untaxedAmount: number, taxRate: number) {
  return Math.round(untaxedAmount * (taxRate / 100));
}

function getActualReceived(untaxedAmount: number, taxRate: number, shippingFee: number) {
  return untaxedAmount + getTaxAmount(untaxedAmount, taxRate) + shippingFee;
}


function makeAccountingDraft(record?: OrderRecord | null): AccountingDraft {
  if (!record) {
    return {
      orderNo: '',
      customer: '',
      untaxedAmount: '0',
      taxRate: '0',
      shippingFee: '0',
      actualReceived: '0',
      paymentMethod: '待確認',
      invoiceNo: '待補',
      proof: '待上傳',
    };
  }

  const untaxedAmount = getUntaxedAmountFromRecord(record);
  const shippingFee = typeof record.shippingFeeOverride === 'number'
    ? record.shippingFeeOverride
    : getShippingFeeByMethod(record.shippingMethod);
  const taxRate = typeof record.taxRate === 'number' ? record.taxRate : 0;
  const actualReceived = typeof record.actualReceived === 'number'
    ? record.actualReceived
    : getActualReceived(untaxedAmount, taxRate, shippingFee);

  return {
    orderNo: record.orderNo,
    customer: record.customer,
    untaxedAmount: String(untaxedAmount),
    taxRate: String(taxRate),
    shippingFee: String(shippingFee),
    actualReceived: String(actualReceived),
    paymentMethod: record.paymentMethod || '待確認',
    invoiceNo: record.invoiceNo || '待補',
    proof: record.proof || '待上傳',
  };
}

function makeTreasuryDraft(record?: OrderRecord | null): TreasuryDraft {
  return {
    orderNo: record?.orderNo || '',
    customer: record?.customer || '',
    refundAmount: String(typeof record?.actualReceived === 'number' ? record.actualReceived : record?.amount || 0),
    payoutMethod: record?.paymentMethod || '原路退回',
    proof: record?.proof || '待上傳',
    note: record?.paymentStatus === '退款處理中' ? '退款進行中，待出納撥款完成。' : '',
  };
}

function makeTreasuryExpenseDraft(): TreasuryExpenseDraft {
  return {
    category: '進貨支出',
    amount: '',
    referenceNo: '',
    note: '',
    proof: '待上傳',
  };
}

function makeBonusDraft(): BonusDraft {
  const now = new Date();
  const date = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' });
  const time = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false });
  return {
    date,
    time,
    amount: '',
    note: '',
  };
}

function toProductDraft(item: Product): ProductDraft {
  return {
    id: item.id,
    code: item.code,
    barcode: item.barcode || '',
    name: item.name,
    category: item.category,
    price: String(item.price),
    vipPrice: String(item.vipPrice ?? item.price ?? 0),
    agentPrice: String(item.agentPrice ?? item.price ?? 0),
    generalAgentPrice: String(item.generalAgentPrice ?? item.price ?? 0),
    stock: String(item.stock),
    image: item.image || '',
    enabled: item.enabled,
  };
}


function getPermissionsByRole(role: string, rank: string) {
  const base: Record<string, string[]> = {
    '系統組': ['全模組管理', '價格調整', '退款審核', '庫存覆核'],
    '銷售組': ['訂購操作', '個人客戶查看'],
    '行政組': ['收退款作業', '會計資料查看'],
    '倉儲組': ['出入庫作業', '庫存查詢'],
    '市場組': ['客戶資料查看', '活動資料查看'],
  };
  const permissions = [...(base[role] || ['基本查看'])];
  if (rank.includes('核心')) permissions.push('最終決定權');
  if (rank.includes('菁英')) permissions.push('參與討論');
  if (rank.includes('高級')) permissions.push('代理價格權限');
  return Array.from(new Set(permissions));
}

function makeEmptyStaffDraft() {
  return {
    id: '',
    name: '',
    loginId: '',
    role: '銷售組',
    rank: '普通銷售',
    enabled: true,
    password: '',
  };
}

function toStaffDraft(item: Staff): StaffDraft {
  return {
    id: item.id,
    name: item.name,
    loginId: item.loginId,
    role: item.role,
    rank: item.rank,
    enabled: item.enabled,
    password: item.password || item.loginId,
  };
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

function SectionIntro({ title, desc }: { title: string; desc: string; stats?: string[] }) {
  return (
    <section className="section-intro-shell section-intro-shell-minimal">
      <div className="section-intro-main">
        <h2 className="section-intro-title">{title}</h2>
        {desc ? <p className="section-intro-desc">{desc}</p> : null}
      </div>
    </section>
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
  const [logoImage, setLogoImage] = useState('');
  const [dashboardAvatarImage, setDashboardAvatarImage] = useState('');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const productImageInputRef = useRef<HTMLInputElement | null>(null);
  const accountingProofInputRef = useRef<HTMLInputElement | null>(null);
  const treasuryProofInputRef = useRef<HTMLInputElement | null>(null);
  const treasuryExpenseProofInputRef = useRef<HTMLInputElement | null>(null);
  const [dataMode, setDataMode] = useState<'firebase' | 'offline'>('offline');
  const [userRoleView, setUserRoleView] = useState<Role>('admin');
  const [userRankView, setUserRankView] = useState<Rank>('core');
  const user = useMemo<SessionUser>(() => ({
    name: '吳秉宸',
    loginId: 'vp001',
    role: userRoleView,
    rank: RANK_LABEL[userRankView] || ROLE_RANK[userRoleView],
    rankKey: userRankView,
  }), [userRoleView, userRankView]);
  const permissionProfile = useMemo(() => getPermissionProfile(user.role, user.rankKey), [user.role, user.rankKey]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('宅配');
  const [customerName, setCustomerName] = useState('王小美');
  const [customerPhone, setCustomerPhone] = useState('0912345678');
  const [customerAddress, setCustomerAddress] = useState('新竹市東區食品路 88 號');
  const [remark, setRemark] = useState('晚上可收件，若自取請先提醒。');
  const [discountMode, setDiscountMode] = useState<'無' | '固定金額'>('無');
  const [discountValue, setDiscountValue] = useState(0);
  const [warehouseTab, setWarehouseTab] = useState<WarehouseTab>('shipping');
  const [selectedWarehouseOrderNo, setSelectedWarehouseOrderNo] = useState('');
  const [warehouseNotice, setWarehouseNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 倉儲資料已更新',
    tone: 'success',
  });
  const [warehouseKeyword, setWarehouseKeyword] = useState('');
  const [warehousePaymentFilter, setWarehousePaymentFilter] = useState('全部');
  const [warehouseShippingFilter, setWarehouseShippingFilter] = useState('全部');
  const [warehouseDateStart, setWarehouseDateStart] = useState('2026-03-01');
  const [warehouseDateEnd, setWarehouseDateEnd] = useState(getTodayDateInputValue());
  const [warehouseQueryMode, setWarehouseQueryMode] = useState<WarehouseQueryMode>('barcode');
  const [warehouseQueryInput, setWarehouseQueryInput] = useState('E401');
  const [warehouseQueryResult, setWarehouseQueryResult] = useState<{ title: string; desc: string; meta: string[] }[]>([
    { title: '女神酵素液', desc: '商品條碼 E401 / 目前庫存 36 / 最近入庫 2026/03/31 10:45', meta: ['QR(A)*18', 'QR(B)*18', '狀態：正常'] },
  ]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [warehouseInboundQty, setWarehouseInboundQty] = useState(1);
  const [warehouseInboundQr, setWarehouseInboundQr] = useState('');
  const [warehouseScanBarcode, setWarehouseScanBarcode] = useState('');
  const [warehouseScanQr, setWarehouseScanQr] = useState('');
  const [selectedStockCode, setSelectedStockCode] = useState('');
  const [accountingTab, setAccountingTab] = useState<AccountingTab>('ops');
  const [accountingKeyword, setAccountingKeyword] = useState('');
  const [accountingPaymentFilter, setAccountingPaymentFilter] = useState('全部');
  const [accountingShippingFilter, setAccountingShippingFilter] = useState('全部');
  const [accountingDateStart, setAccountingDateStart] = useState('2026-03-01');
  const [accountingDateEnd, setAccountingDateEnd] = useState(getTodayDateInputValue());
  const [selectedAccountingOrderNo, setSelectedAccountingOrderNo] = useState('');
  const [accountingDraft, setAccountingDraft] = useState<AccountingDraft>(() => makeAccountingDraft(null));
  const [accountingNotice, setAccountingNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 會計頁已重補，可直接切換訂單與操作提示',
    tone: 'success',
  });
  const [selectedTreasuryOrderNo, setSelectedTreasuryOrderNo] = useState('');
  const [treasuryDraft, setTreasuryDraft] = useState<TreasuryDraft>(() => makeTreasuryDraft(null));
  const [treasuryExpenseDraft, setTreasuryExpenseDraft] = useState<TreasuryExpenseDraft>(() => makeTreasuryExpenseDraft());
  const [treasuryExpenseLogs, setTreasuryExpenseLogs] = useState<TreasuryExpenseRecord[]>([]);
  const [bonusDraft, setBonusDraft] = useState<BonusDraft>(() => makeBonusDraft());
  const [bonusLogs, setBonusLogs] = useState<BonusRecord[]>([]);
  const [treasuryNotice, setTreasuryNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 出納子頁已啟動，可接手退款撥款與支出登記',
    tone: 'success',
  });
  const [evaluationQuarter, setEvaluationQuarter] = useState<EvaluationQuarter>('Q1');
  const [selectedEvaluateeLoginId, setSelectedEvaluateeLoginId] = useState('');
  const [evaluationDraft, setEvaluationDraft] = useState<EvaluationDraft>(() => makeEvaluationDraft());
  const [evaluationNotice, setEvaluationNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 評鑑系統第一版已啟動，評分採匿名送出。',
    tone: 'success',
  });
  const [evaluationSubmissions, setEvaluationSubmissions] = useState<EvaluationSubmission[]>([]);
  const [orderCategory, setOrderCategory] = useState('全部商品');
  const orderCategoryChips = useMemo(() => ['全部商品', ...Array.from(new Set(products.map((item) => (item.category || '').trim()).filter(Boolean)))], [products]);

  const [productEditorMode, setProductEditorMode] = useState<ProductEditorMode>('view');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [productDraft, setProductDraft] = useState<ProductDraft>(() => makeEmptyProductDraft(''));
  const [productNotice, setProductNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [staffEditorMode, setStaffEditorMode] = useState<StaffEditorMode>('view');
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id ?? '');
  const [staffDraft, setStaffDraft] = useState<StaffDraft>(() => toStaffDraft({ id: '', name: '', loginId: '', role: '銷售組', rank: '普通銷售', enabled: true, password: '', permissions: [] }));
  const [staffNotice, setStaffNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [orderRecords, setOrderRecords] = useState<OrderRecord[]>([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState('');
  const [orderNotice, setOrderNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 訂單已建立',
    tone: 'success',
  });

  async function loadFirebaseData() {
    setBooting(true);
    try {
      const db = getDb();
      if (!db) {
        setFirebaseReady(false);
        setDataMode('offline');
        setProducts([]);
        setCustomers([]);
        setStaff([]);
        setInventoryLogs([]);
        setOrderRecords([]);
        setBootMessage('Firebase 未設定，請先接上真實資料庫');
        return;
      }

      const [productsSnap, customersSnap, staffSnap, inventorySnap, inventoryLogsSnap, ordersSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'customers')),
        getDocs(collection(db, 'staff')),
        getDocs(collection(db, 'inventory')),
        getDocs(collection(db, 'inventory_logs')),
        getDocs(collection(db, 'orders')),
      ]);

      const nextProducts = dedupeByLatest(
        productsSnap.docs.map((item) => normalizeProduct(item.id, item.data())),
        (item) => item.code,
        (item: any) => item.updatedAt || item.lastSyncedAt,
      );
      const nextCustomers = dedupeByLatest(
        customersSnap.docs.map((item) => normalizeCustomer(item.id, item.data())),
        (item) => item.phone || item.id,
      );
      const nextStaff = dedupeByLatest(
        staffSnap.docs.map((item) => normalizeStaff(item.id, item.data())),
        (item) => item.loginId || item.id,
      );
      const nextInventory = dedupeByLatest(
        inventorySnap.docs.map((item) => normalizeInventoryDoc(item.id, item.data())),
        (item) => item.code,
        (item: any) => item.updatedAt || item.lastSyncedAt,
      );
      const nextInventoryLogs = dedupeByLatest(
        inventoryLogsSnap.docs.map((item) => normalizeInventoryLog(item.id, item.data())),
        (item) => item.id,
        (item: any) => item.createdAt,
      );
      const nextOrders = dedupeByLatest(
        ordersSnap.docs.map((item) => normalizeOrderRecord(item.id, item.data())),
        (item) => item.orderNo,
        (item: any) => item.date,
      );

      const stockMap = new Map(nextInventory.map((item) => [item.productId || item.id || item.code, item.stock]));
      const codeMap = new Map(nextInventory.map((item) => [item.code, item.stock]));
      const mergedProducts = nextProducts.map((item) => {
        const matchedStock = stockMap.get(item.id) ?? codeMap.get(item.code);
        return typeof matchedStock === 'number' ? { ...item, stock: matchedStock } : item;
      });

      setProducts(mergedProducts);
      setCustomers(nextCustomers);
      setStaff(nextStaff);
      setInventoryLogs(nextInventoryLogs);
      setOrderRecords(sortOrderRecords(nextOrders));
      setFirebaseReady(true);
      setDataMode('firebase');
      setBootMessage('Firebase 真資料已接入，雙向同步監聽已啟用');
    } catch (error) {
      console.error(error);
      setProducts([]);
      setCustomers([]);
      setStaff([]);
      setInventoryLogs([]);
      setOrderRecords([]);
      setFirebaseReady(false);
      setDataMode('offline');
      setBootMessage('Firebase 讀取失敗，請檢查設定或權限');
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => {
    void loadFirebaseData();
  }, []);

  useEffect(() => {
    const db = getDb();
    if (!db) return;

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts((prev) => {
        const nextProducts = dedupeByLatest(
          snap.docs.map((item) => normalizeProduct(item.id, item.data())),
          (item) => item.code,
          (item: any) => item.updatedAt || item.lastSyncedAt,
        );
        const inventoryMap = new Map(prev.map((item) => [item.code, item.stock]));
        return nextProducts.map((item) => ({ ...item, stock: inventoryMap.get(item.code) ?? item.stock }));
      });
      setFirebaseReady(true);
      setDataMode('firebase');
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      setCustomers(dedupeByLatest(
        snap.docs.map((item) => normalizeCustomer(item.id, item.data())),
        (item) => item.phone || item.id,
      ));
    });

    const unsubStaff = onSnapshot(collection(db, 'staff'), (snap) => {
      setStaff(dedupeByLatest(
        snap.docs.map((item) => normalizeStaff(item.id, item.data())),
        (item) => item.loginId || item.id,
      ));
    });

    const unsubInventory = onSnapshot(collection(db, 'inventory'), (snap) => {
      const nextInventory = dedupeByLatest(
        snap.docs.map((item) => normalizeInventoryDoc(item.id, item.data())),
        (item) => item.code,
        (item: any) => item.updatedAt || item.lastSyncedAt,
      );
      setProducts((prev) => prev.map((item) => {
        const matched = nextInventory.find((row) => row.code === item.code);
        return matched ? { ...item, stock: matched.stock } : item;
      }));
    });

    const unsubInventoryLogs = onSnapshot(collection(db, 'inventory_logs'), (snap) => {
      setInventoryLogs(dedupeByLatest(
        snap.docs.map((item) => normalizeInventoryLog(item.id, item.data())),
        (item) => item.id,
        (item: any) => item.createdAt,
      ));
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrderRecords(sortOrderRecords(dedupeByLatest(
        snap.docs.map((item) => normalizeOrderRecord(item.id, item.data())),
        (item) => item.orderNo,
        (item: any) => item.date,
      )));
    });

    return () => {
      unsubProducts();
      unsubCustomers();
      unsubStaff();
      unsubInventory();
      unsubInventoryLogs();
      unsubOrders();
    };
  }, []);


  useEffect(() => {
    if (!selectedStockCode && products[0]?.code) setSelectedStockCode(products[0].code);
    if (!selectedProductId && products[0]?.id) setSelectedProductId(products[0].id);
    if (!selectedOrderNo && orderRecords[0]?.orderNo) setSelectedOrderNo(orderRecords[0].orderNo);
    if (!selectedWarehouseOrderNo && orderRecords[0]?.orderNo) setSelectedWarehouseOrderNo(orderRecords[0].orderNo);
    if (!selectedAccountingOrderNo && orderRecords[0]?.orderNo) setSelectedAccountingOrderNo(orderRecords[0].orderNo);
    if (!selectedStaffId && staff[0]?.id) setSelectedStaffId(staff[0].id);
  }, [products, orderRecords, staff, selectedStockCode, selectedProductId, selectedOrderNo, selectedWarehouseOrderNo, selectedAccountingOrderNo, selectedStaffId]);

  const coreMembers = useMemo(() => {
    const base = staff
      .filter((item) => normalizeRankKeyFromLabel(item.rank) === 'core' || String(item.rank).includes('核心'))
      .map((item) => ({ id: item.id, loginId: item.loginId, name: item.name, rank: item.rank }));
    if (user.rankKey === 'core' && !base.some((item) => item.loginId === user.loginId)) {
      base.unshift({ id: user.loginId, loginId: user.loginId, name: user.name, rank: user.rank });
    }
    return base;
  }, [staff, user.loginId, user.name, user.rank, user.rankKey]);

  useEffect(() => {
    if (!selectedEvaluateeLoginId) {
      const firstTarget = coreMembers.find((item) => item.loginId !== user.loginId);
      if (firstTarget) setSelectedEvaluateeLoginId(firstTarget.loginId);
    }
  }, [coreMembers, selectedEvaluateeLoginId, user.loginId]);

  useEffect(() => {
    if (!evaluationSubmissions.length && coreMembers.length >= 2) {
      setEvaluationSubmissions(buildSeedEvaluationSubmissions(coreMembers));
    }
  }, [coreMembers, evaluationSubmissions.length]);

  const evaluationTargets = useMemo(() => coreMembers.filter((item) => item.loginId !== user.loginId), [coreMembers, user.loginId]);
  const selectedEvaluatee = useMemo(() => evaluationTargets.find((item) => item.loginId === selectedEvaluateeLoginId) || evaluationTargets[0] || null, [evaluationTargets, selectedEvaluateeLoginId]);
  const hasSubmittedSelectedEvaluation = useMemo(() => {
    if (!selectedEvaluatee) return false;
    return evaluationSubmissions.some((item) => item.quarter === evaluationQuarter && item.evaluatorLoginId === user.loginId && item.evaluateeLoginId === selectedEvaluatee.loginId);
  }, [evaluationQuarter, evaluationSubmissions, selectedEvaluatee, user.loginId]);

  const evaluationResults = useMemo(() => {
    const rows: EvaluationResultRow[] = [];
    EVALUATION_QUARTERS.forEach((quarter) => {
      coreMembers.forEach((member) => {
        const received = evaluationSubmissions.filter((item) => item.quarter === quarter && item.evaluateeLoginId === member.loginId);
        const sales = received.length ? Math.round(received.reduce((sum, item) => sum + item.sales, 0) / received.length) : 0;
        const collaboration = received.length ? Math.round(received.reduce((sum, item) => sum + item.collaboration, 0) / received.length) : 0;
        const professional = received.length ? Math.round(received.reduce((sum, item) => sum + item.professional, 0) / received.length) : 0;
        const efficiency = received.length ? Math.round(received.reduce((sum, item) => sum + item.efficiency, 0) / received.length) : 0;
        const total = sales + collaboration + professional + efficiency;
        rows.push({
          loginId: member.loginId,
          name: member.name,
          quarter,
          sales, collaboration, professional, efficiency, total,
          kValue: getEvaluationK(total),
          medal: getEvaluationMedal(total),
          submissionCount: received.length,
        });
      });
    });
    return rows;
  }, [coreMembers, evaluationSubmissions]);

  const evaluationQuarterResults = useMemo(() => evaluationResults.filter((item) => item.quarter === evaluationQuarter).sort((a, b) => b.total - a.total), [evaluationResults, evaluationQuarter]);
  const myEvaluationQuarterResult = useMemo(() => evaluationQuarterResults.find((item) => item.loginId === user.loginId) || null, [evaluationQuarterResults, user.loginId]);
  const dashboardRadarMetrics = useMemo(() => ([
    { label: '業績', value: myEvaluationQuarterResult?.sales || 0 },
    { label: '協作', value: myEvaluationQuarterResult?.collaboration || 0 },
    { label: '專業', value: myEvaluationQuarterResult?.professional || 0 },
    { label: '效率', value: myEvaluationQuarterResult?.efficiency || 0 },
  ]), [myEvaluationQuarterResult]);

  const evaluationSubmissionsForProfile = useMemo(() => evaluationSubmissions.map((item) => ({
    ...item,
    targetLoginId: item.evaluateeLoginId,
    targetName: item.evaluateeName,
  })), [evaluationSubmissions]);

  const evaluationSummaryForAccounting = useMemo(() => evaluationQuarterResults.map((item) => ({
    quarter: evaluationQuarter,
    loginId: item.loginId,
    name: item.name,
    averageScores: {
      sales: item.sales,
      collaboration: item.collaboration,
      professional: item.professional,
      efficiency: item.efficiency,
    },
    totalScore: item.total,
    kValue: item.kValue,
    badge: item.medal,
    submissionCount: item.submissionCount,
  })), [evaluationQuarter, evaluationQuarterResults]);

  const submitEvaluation = (targetLoginId: string, draft: { sales: number; collaboration: number; professional: number; efficiency: number; }) => {
    if (user.rankKey !== 'core') {
      setEvaluationNotice({ text: '❌ 目前只有核心人員可進行評鑑', tone: 'danger' });
      return false;
    }
    const target = evaluationTargets.find((item) => item.loginId === targetLoginId) || null;
    if (!target) {
      setEvaluationNotice({ text: '❌ 目前沒有可評鑑的核心成員', tone: 'danger' });
      return false;
    }
    const safeDraft = {
      sales: Math.max(0, Math.min(40, Math.round(Number(draft.sales || 0)))),
      collaboration: Math.max(0, Math.min(25, Math.round(Number(draft.collaboration || 0)))),
      professional: Math.max(0, Math.min(20, Math.round(Number(draft.professional || 0)))),
      efficiency: Math.max(0, Math.min(15, Math.round(Number(draft.efficiency || 0)))),
    };
    if (!window.confirm(`確認送出 ${evaluationQuarter} 對 ${target.name} 的匿名評鑑？目前為測試模式，可重複送出。`)) return false;
    const nextItem: EvaluationSubmission = {
      id: `eval-${Date.now()}`,
      quarter: evaluationQuarter,
      evaluatorLoginId: user.loginId,
      evaluatorName: user.name,
      evaluateeLoginId: target.loginId,
      evaluateeName: target.name,
      sales: safeDraft.sales,
      collaboration: safeDraft.collaboration,
      professional: safeDraft.professional,
      efficiency: safeDraft.efficiency,
      total: safeDraft.sales + safeDraft.collaboration + safeDraft.professional + safeDraft.efficiency,
      submittedAt: getTaipeiTimestamp(),
      isAnonymous: true,
    };
    setEvaluationSubmissions((prev) => [nextItem, ...prev]);
    setEvaluationNotice({ text: `✅ ${evaluationQuarter} 匿名評鑑已送出，目前為測試模式，可再次送出`, tone: 'success' });
    return true;
  };

  const saveEvaluationSubmission = () => {
    if (user.rankKey !== 'core') {
      setEvaluationNotice({ text: '❌ 目前只有核心人員可進行評鑑', tone: 'danger' });
      return;
    }
    if (!selectedEvaluatee) {
      setEvaluationNotice({ text: '❌ 目前沒有可評鑑的核心成員', tone: 'danger' });
      return;
    }
    if (hasSubmittedSelectedEvaluation) {
    }
    const metricIssues = EVALUATION_METRIC_META.some((meta) => Number((evaluationDraft as any)[meta.key]) < 0 || Number((evaluationDraft as any)[meta.key]) > meta.max);
    if (metricIssues) {
      setEvaluationNotice({ text: '❌ 分數超出可評範圍，請重新確認', tone: 'danger' });
      return;
    }
    const confirmed = window.confirm(`你即將以匿名方式送出 ${evaluationQuarter} 對 ${selectedEvaluatee.name} 的評鑑。測試期間可重複送出，是否確認？`);
    if (!confirmed) return;
    const nextItem: EvaluationSubmission = {
      id: `eval-${Date.now()}`,
      quarter: evaluationQuarter,
      evaluatorLoginId: user.loginId,
      evaluatorName: user.name,
      evaluateeLoginId: selectedEvaluatee.loginId,
      evaluateeName: selectedEvaluatee.name,
      sales: Number(evaluationDraft.sales || 0),
      collaboration: Number(evaluationDraft.collaboration || 0),
      professional: Number(evaluationDraft.professional || 0),
      efficiency: Number(evaluationDraft.efficiency || 0),
      total: calculateEvaluationTotal(evaluationDraft),
      submittedAt: getTaipeiTimestamp(),
      isAnonymous: true,
    };
    setEvaluationSubmissions((prev) => [nextItem, ...prev]);
    setEvaluationNotice({ text: `✅ ${selectedEvaluatee.name} 的 ${evaluationQuarter} 評鑑已匿名送出，測試期間可重複送出`, tone: 'success' });
  };

  const updateEvaluationDraftField = (field: EvaluationMetric, value: number) => {
    const meta = EVALUATION_METRIC_META.find((item) => item.key === field);
    const safeValue = Math.max(0, Math.min(Number(meta?.max || 0), Number(value || 0)));
    setEvaluationDraft((prev) => ({ ...prev, [field]: safeValue }));
  };

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

  const visibleCustomerRecords = useMemo(() => {
    const assignedNames = new Set(orderRecords.map((item) => item.customer));

    return customers.filter((customer) => {
      if (permissionProfile.canViewAllCustomers) return true;
      if (permissionProfile.canViewAssignedOrderCustomers) return assignedNames.has(customer.name);
      if (permissionProfile.canViewOwnCustomers) return customer.ownerLoginId === user.loginId;
      return false;
    });
  }, [customers, orderRecords, permissionProfile, user.loginId]);

  const filteredCustomers = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return visibleCustomerRecords;
    return visibleCustomerRecords.filter((c) => [c.name, c.phone, c.level, c.ownerName].join(' ').toLowerCase().includes(q));
  }, [keyword, visibleCustomerRecords]);

  const filteredStaff = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) => [s.name, s.loginId, s.role, s.rank].join(' ').toLowerCase().includes(q));
  }, [keyword, staff]);

  const productCategories = useMemo(() => Array.from(new Set(products.map((item) => (item.category || '').trim()).filter(Boolean))), [products]);
  const staffRoles = ['系統組', '銷售組', '行政組', '倉儲組', '市場組'];
  const staffRanks = ['核心人員', '菁英成員', '高級銷售', '普通銷售'];
  const selectedStaff = useMemo(() => staff.find((item) => item.id === selectedStaffId) || staff[0] || null, [staff, selectedStaffId]);
  const staffPermissionPreview = useMemo(() => getPermissionsByRole(staffDraft.role, staffDraft.rank), [staffDraft.role, staffDraft.rank]);

  const filteredOrderProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const source = products
      .filter((item) => item.enabled)
      .filter((item) => orderCategory === '全部商品' || item.category === orderCategory)
      .map((item) => ({ ...item, originalPrice: item.price, price: getTierPrice(item, user.rankKey) }));
    if (!q) return source;
    return source.filter((item) => [item.code, item.name, item.category].join(' ').toLowerCase().includes(q));
  }, [keyword, products, orderCategory, user.rankKey]);

  const shippingQueue = useMemo(() => {
    return orderRecords
      .filter((item) => !item.paymentStatus.includes('已退款'))
      .map((item) => ({
        orderNo: item.orderNo,
        customer: item.customer,
        paymentStatus: item.paymentStatus,
        shippingStatus: item.shippingStatus,
        mainStatus: item.mainStatus,
        itemCount: item.itemCount,
        urgency: item.paymentStatus === '待收款' ? 'high' : item.shippingStatus.includes('換貨') ? 'medium' : 'low',
        shippingMethod: item.shippingMethod,
        address: item.address,
        date: item.date,
        trackingNo: item.shippingStatus === '已出貨' ? `TRK-${item.orderNo.slice(-3)}` : '未建立',
        scanStatus: item.shippingStatus === '理貨中' ? '已完成商品掃描' : '待掃碼驗證',
        qrSummary: item.items.map((entry) => `${entry.code}*${entry.qty}`).join(' / '),
      }));
  }, [orderRecords]);

  const paymentQueue = useMemo(() => {
    return orderRecords
      .map((item) => ({
        orderNo: item.orderNo,
        customer: item.customer,
        paymentStatus: item.paymentStatus,
        shippingStatus: item.shippingStatus,
        amount: typeof item.actualReceived === 'number' ? item.actualReceived : item.amount,
        shippingFee: typeof item.shippingFeeOverride === 'number' ? item.shippingFeeOverride : item.shippingMethod === '宅配' ? 100 : item.shippingMethod === '店到店' ? 65 : 0,
        taxRate: typeof item.taxRate === 'number' ? item.taxRate : 0,
        proof: item.proof || (item.paymentStatus === '已收款' ? '已上傳' : item.paymentStatus.includes('退款') ? '退款流程中' : '待上傳'),
        date: item.date.split(' ')[0],
        paymentMethod: item.paymentMethod || (item.paymentStatus === '已收款' ? '銀行轉帳' : '待確認'),
        invoiceNo: item.invoiceNo || (item.paymentStatus.includes('退款') ? '退款單' : '待補'),
      }))
      .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date) || b.orderNo.localeCompare(a.orderNo));
  }, [orderRecords]);

  const stockSnapshot = useMemo(() => deriveStockSnapshot(products, inventoryLogs), [products, inventoryLogs]);

  const warehouseRecentLogs = useMemo(() => buildRecentWarehouseLogs(inventoryLogs), [inventoryLogs]);

  const warehouseSummary = useMemo(() => {
    const pending = shippingQueue.length;
    const lowStock = stockSnapshot.filter((item) => item.stock <= item.safe).length;
    const todayKey = '2026-04-01';
    const todayOps = inventoryLogs.filter((item) => item.createdAt.startsWith(todayKey)).reduce((sum, item) => sum + item.qty, 0);
    const issueCount = orderRecords.filter((item) => item.paymentStatus === '待收款' && item.shippingStatus === '待出貨').length;
    return [
      { title: '待出貨', value: String(pending), sub: `待處理 ${pending} 筆` },
      { title: '低庫存', value: String(lowStock), sub: '安全值以下需先補貨' },
      { title: '今日入出庫', value: String(todayOps), sub: '依 inventory_logs 累計數量' },
      { title: '待查異常', value: String(issueCount), sub: '待收款但待出貨需覆核' },
    ];
  }, [shippingQueue, stockSnapshot, inventoryLogs, orderRecords]);

  const accountingSummary = useMemo(() => {
    const paid = paymentQueue.filter((item) => item.paymentStatus === '已收款').reduce((sum, item) => sum + item.amount, 0);
    const pending = paymentQueue.filter((item) => item.paymentStatus === '待收款').reduce((sum, item) => sum + item.amount, 0);
    const refund = paymentQueue.filter((item) => item.paymentStatus.includes('退款')).reduce((sum, item) => sum + item.amount, 0);
    const gross = Math.max(paid - refund, 0);
    return [
      { title: '今日實收', value: `$${paid.toLocaleString()}`, sub: '依實收總額統計' },
      { title: '待收款', value: `$${pending.toLocaleString()}`, sub: `待確認收款 ${paymentQueue.filter((item) => item.paymentStatus === '待收款').length} 筆` },
      { title: '退款處理', value: `$${refund.toLocaleString()}`, sub: '退款流程中訂單金額' },
      { title: '本月毛利', value: `$${gross.toLocaleString()}`, sub: '依目前訂單與退款狀態估算' },
    ];
  }, [paymentQueue]);

  const filteredWarehouseQueue = useMemo(() => {
    const q = warehouseKeyword.trim().toLowerCase();
    return shippingQueue
      .filter((item) => {
        const matchKeyword = !q || [item.orderNo, item.customer, item.paymentStatus, item.shippingStatus, item.mainStatus].join(' ').toLowerCase().includes(q);
        const matchPayment = warehousePaymentFilter === '全部' || item.paymentStatus === warehousePaymentFilter;
        const matchShipping = warehouseShippingFilter === '全部' || item.shippingStatus === warehouseShippingFilter;
        const itemDateKey = item.date.split(' ')[0].replace(/\//g, '-');
        const matchDateStart = !warehouseDateStart || itemDateKey >= warehouseDateStart;
        const matchDateEnd = !warehouseDateEnd || itemDateKey <= warehouseDateEnd;
        return matchKeyword && matchPayment && matchShipping && matchDateStart && matchDateEnd;
      })
      .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date) || b.orderNo.localeCompare(a.orderNo));
  }, [shippingQueue, warehouseKeyword, warehousePaymentFilter, warehouseShippingFilter, warehouseDateStart, warehouseDateEnd]);

  const selectedWarehouseOrder = useMemo(() => filteredWarehouseQueue.find((item) => item.orderNo === selectedWarehouseOrderNo) || filteredWarehouseQueue[0] || null, [selectedWarehouseOrderNo, filteredWarehouseQueue]);

  useEffect(() => {
    setWarehouseScanBarcode('');
    setWarehouseScanQr('');
  }, [selectedWarehouseOrderNo]);

  const warehouseExpectedScan = useMemo(() => {
    if (!selectedWarehouseOrder) {
      return {
        barcodeOptions: [] as string[],
        qrOptions: [] as string[],
        qrByBarcode: {} as Record<string, string[]>,
      };
    }

    const order = orderRecords.find((item) => item.orderNo === selectedWarehouseOrder.orderNo);
    if (!order) {
      return {
        barcodeOptions: [] as string[],
        qrOptions: [] as string[],
        qrByBarcode: {} as Record<string, string[]>,
      };
    }

    const qrByBarcode = order.items.reduce((acc, entry) => {
      acc[entry.code] = findAvailableQrBuckets(inventoryLogs, entry.code).map((bucket) => bucket.qr.toUpperCase());
      return acc;
    }, {} as Record<string, string[]>);

    const barcodeOptions = order.items.map((entry) => entry.code.toUpperCase());
    const qrOptions = Array.from(new Set(Object.values(qrByBarcode).flat()));

    return { barcodeOptions, qrOptions, qrByBarcode };
  }, [selectedWarehouseOrder, orderRecords, inventoryLogs]);

  const warehouseScanValidation = useMemo(() => {
    if (!selectedWarehouseOrder) {
      return {
        barcodeOk: false,
        qrOk: false,
        allOk: false,
        barcodeMessage: '請先選擇待出貨訂單',
        qrMessage: '請先選擇待出貨訂單',
      };
    }

    const barcode = warehouseScanBarcode.trim().toUpperCase();
    const qr = warehouseScanQr.trim().toUpperCase();
    const barcodeOptions = warehouseExpectedScan.barcodeOptions;

    let barcodeOk = false;
    let qrOk = false;
    let barcodeMessage = barcodeOptions.length
      ? `請掃描商品條碼（本單：${barcodeOptions.join(' / ')}）`
      : '此訂單尚無可驗證商品條碼';
    let qrMessage = '請掃描 QR 身分識別';

    if (barcode) {
      if (barcodeOptions.includes(barcode)) {
        barcodeOk = true;
        barcodeMessage = `✅ 商品條碼驗證通過：${barcode}`;
        const allowedQr = warehouseExpectedScan.qrByBarcode[barcode] ?? [];
        qrMessage = allowedQr.length
          ? `請掃描 QR 身分識別（可用：${allowedQr.join(' / ')}）`
          : `此商品目前查無可出貨 QR：${barcode}`;
      } else {
        barcodeMessage = `❌ 商品條碼不在本單內：${barcode}`;
      }
    }

    if (qr) {
      const allowedQr = barcodeOk
        ? (warehouseExpectedScan.qrByBarcode[barcode] ?? [])
        : warehouseExpectedScan.qrOptions;
      if (allowedQr.includes(qr)) {
        qrOk = true;
        qrMessage = `✅ QR 身分識別驗證通過：${qr}`;
      } else {
        qrMessage = `❌ QR 身分識別不符：${qr}`;
      }
    }

    return {
      barcodeOk,
      qrOk,
      allOk: barcodeOk && qrOk,
      barcodeMessage,
      qrMessage,
    };
  }, [selectedWarehouseOrder, warehouseScanBarcode, warehouseScanQr, warehouseExpectedScan]);

  const warehouseShipValidation = useMemo(() => {
    if (!selectedWarehouseOrder) {
      return {
        canShip: false,
        paymentOk: false,
        issues: ['請先選擇待出貨訂單'],
      };
    }

    const order = orderRecords.find((item) => item.orderNo === selectedWarehouseOrder.orderNo);
    if (!order) {
      return {
        canShip: false,
        paymentOk: false,
        issues: ['找不到對應訂單資料'],
      };
    }

    const isExchangeOrder = selectedWarehouseOrder.orderNo.startsWith('EX') || selectedWarehouseOrder.shippingStatus.includes('換貨');
    const paymentOk = selectedWarehouseOrder.paymentStatus === '已收款' || selectedWarehouseOrder.paymentStatus === '免收款' || isExchangeOrder;
    const issues: string[] = [];

    if (selectedWarehouseOrder.shippingStatus === '已出貨' || selectedWarehouseOrder.mainStatus === '已完成') {
      issues.push('此訂單已完成出貨');
    }

    if (!paymentOk) {
      issues.push(isExchangeOrder ? '換貨單待確認，不可直接出貨' : '未收款，不可出貨');
    }

    order.items.forEach((entry) => {
      const buckets = findAvailableQrBuckets(inventoryLogs, entry.code);
      const totalAvailable = buckets.reduce((sum, item) => sum + item.qty, 0);
      if (totalAvailable < entry.qty) {
        issues.push(`${entry.code} 庫存不足：剩 ${totalAvailable}，需 ${entry.qty}`);
      }
    });

    if (!warehouseScanBarcode.trim()) {
      issues.push('待掃商品條碼驗證');
    } else if (!warehouseScanValidation.barcodeOk) {
      issues.push(warehouseScanValidation.barcodeMessage.replace('❌ ', ''));
    }

    if (!warehouseScanQr.trim()) {
      issues.push('待掃 QR 身分識別驗證');
    } else if (!warehouseScanValidation.qrOk) {
      issues.push(warehouseScanValidation.qrMessage.replace('❌ ', ''));
    }

    return {
      canShip: issues.length === 0,
      paymentOk,
      issues,
    };
  }, [selectedWarehouseOrder, orderRecords, inventoryLogs, warehouseScanBarcode, warehouseScanQr, warehouseScanValidation]);


  const warehouseSopPoints = useMemo(() => {
    const order = selectedWarehouseOrder;
    return [
      {
        title: '檢查收款狀態',
        desc: order ? `目前款項狀態：${order.paymentStatus}` : '請先選擇訂單後檢查款項狀態。',
        status: !order ? 'idle' : warehouseShipValidation.paymentOk ? 'done' : 'warning',
      },
      {
        title: '檢查商品與數量',
        desc: order ? `待處理商品：${order.qrSummary}` : '請先選擇訂單後檢查商品明細。',
        status: !order ? 'idle' : warehouseShipValidation.issues.some((issue) => issue.includes('庫存不足')) ? 'warning' : 'done',
      },
      {
        title: '檢查配送方式與地址',
        desc: order ? `${order.shippingMethod} / ${order.address}` : '請先確認配送方式與地址。',
        status: order ? 'done' : 'idle',
      },
      {
        title: '確認出貨單與包裹標示',
        desc: order ? `列印單號：${order.orderNo}，目前可先預覽列印內容。` : '請先選單後列印出貨單。',
        status: order ? 'done' : 'idle',
      },
    ];
  }, [selectedWarehouseOrder, warehouseShipValidation]);

  const warehouseReminderItems = useMemo(() => {
    const order = selectedWarehouseOrder;
    if (!order) {
      return [
        { text: '請先從左側選擇待處理訂單，再進行倉儲作業。', tone: 'neutral' },
        { text: '目前依狀態顯示提醒。', tone: 'neutral' },
      ];
    }

    const items = [
      { text: order.paymentStatus === '已收款' || order.paymentStatus === '免收款' ? '此訂單款項狀態正常，可進入下一步檢查。' : '此訂單尚未完成收款，請先人工覆核。', tone: order.paymentStatus === '已收款' || order.paymentStatus === '免收款' ? 'success' : 'danger' },
      { text: order.shippingStatus === '待出貨' ? '目前為待出貨狀態。' : `目前商品狀態：${order.shippingStatus}。`, tone: order.shippingStatus === '待出貨' ? 'neutral' : 'warning' },
      { text: warehouseShipValidation.issues.length ? `本單共有 ${warehouseShipValidation.issues.length} 個檢查項目，請先處理。` : '目前可進行確認。', tone: warehouseShipValidation.issues.length ? 'warning' : 'success' },
    ];

    if (order.shippingStatus.includes('換貨')) {
      items.push({ text: '此單已進入換貨流程，需先確認換貨品項與新出貨單。', tone: 'warning' });
    }
    if (order.paymentStatus.includes('退款')) {
      items.push({ text: '此單含退款狀態，請先確認會計與倉儲資料一致。', tone: 'danger' });
    }
    return items;
  }, [selectedWarehouseOrder, warehouseShipValidation]);

  const selectedStockItem = useMemo(() => stockSnapshot.find((item) => item.code === selectedStockCode) || stockSnapshot[0], [selectedStockCode, stockSnapshot]);

  function confirmAction(message: string) {
    if (typeof window === 'undefined') return true;
    return window.confirm(message);
  }

  useEffect(() => {
    if (!stockSnapshot.length) return;
    if (!stockSnapshot.some((item) => item.code === selectedStockCode)) {
      setSelectedStockCode(stockSnapshot[0].code);
    }
  }, [stockSnapshot, selectedStockCode]);

  const runWarehouseQuery = (input = warehouseQueryInput) => {
    const value = input.trim();
    if (!value) {
      setWarehouseNotice({ text: '❌ 請先輸入查詢條件', tone: 'danger' });
      return;
    }

    const normalized = value.toUpperCase();

    const matchedOrder = orderRecords.find((item) => item.orderNo.toUpperCase().includes(normalized));
    if (matchedOrder) {
      setSelectedWarehouseOrderNo(matchedOrder.orderNo);
      setWarehouseQueryResult([{
        title: matchedOrder.orderNo,
        desc: `${matchedOrder.customer} / ${matchedOrder.shippingStatus} / ${matchedOrder.shippingMethod}`,
        meta: [`${matchedOrder.paymentStatus}`, `出貨內容：${matchedOrder.items.map((entry) => `${entry.code}*${entry.qty}`).join(' / ')}`, `地址：${matchedOrder.address}`],
      }]);
      setWarehouseNotice({ text: `✅ 已切到 ${matchedOrder.orderNo}`, tone: 'success' });
      return;
    }

    const matchedLogs = inventoryLogs.filter((item) => item.qr.toUpperCase().includes(normalized));
    if (matchedLogs.length) {
      const latest = [...matchedLogs].sort((a, b) => parseDateValue(b.createdAt) - parseDateValue(a.createdAt))[0];
      const balance = matchedLogs.reduce((sum, item) => sum + (item.type === '入庫' ? item.qty : -item.qty), 0);
      setWarehouseQueryResult([{
        title: latest.qr,
        desc: `${latest.name} / 目前庫存 ${balance} / 最近異動 ${formatDateTime(latest.createdAt)}`,
        meta: [`入庫人員：${latest.operator}`, `商品條碼：${latest.code}`, `狀態：${balance > 0 ? '可出貨' : '已出清'}`],
      }]);
      setWarehouseNotice({ text: `✅ 已查到 ${latest.qr}`, tone: 'success' });
      return;
    }

    const matched = stockSnapshot.find((item) =>
      item.code.toUpperCase().includes(normalized) ||
      (item.name || '').toUpperCase().includes(normalized) ||
      String((products.find((p) => p.code === item.code)?.barcode) || '').toUpperCase().includes(normalized)
    );
    if (matched) {
      setSelectedStockCode(matched.code);
      setWarehouseQueryResult([{
        title: matched.name,
        desc: `商品條碼 ${matched.code} / 目前庫存 ${matched.stock} / 安全庫存 ${matched.safe}`,
        meta: [matched.qr, matched.updated, `狀態：${matched.status}`],
      }]);
      setWarehouseNotice({ text: `✅ 已查到 ${matched.code}`, tone: 'success' });
      return;
    }

    setWarehouseQueryResult([{ title: '查無資料', desc: `找不到 ${value} 的庫存 / QR / 訂單資料`, meta: ['請確認商品條碼、QR 身分識別或訂單編號'] }]);
    setWarehouseNotice({ text: '❌ 查無資料', tone: 'danger' });
  };

  const handleWarehouseShip = async () => {
    if (!selectedWarehouseOrder) return;
    const isExchangeOrder = selectedWarehouseOrder.orderNo.startsWith('EX') || selectedWarehouseOrder.shippingStatus.includes('換貨');
    if (selectedWarehouseOrder.paymentStatus !== '已收款' && selectedWarehouseOrder.paymentStatus !== '免收款' && !isExchangeOrder) {
      setWarehouseNotice({ text: '❌ 未收款不可出貨', tone: 'danger' });
      return;
    }
    if (!warehouseScanValidation.allOk) {
      setWarehouseNotice({ text: '❌ 請先完成商品條碼與 QR 身分識別驗證', tone: 'danger' });
      return;
    }

    const order = orderRecords.find((item) => item.orderNo === selectedWarehouseOrder.orderNo);
    if (!order) {
      setWarehouseNotice({ text: '❌ 找不到對應訂單', tone: 'danger' });
      return;
    }

    const allocations: InventoryLog[] = [];
    const timestamp = getTaipeiTimestamp();

    for (const entry of order.items) {
      const buckets = findAvailableQrBuckets(inventoryLogs, entry.code);
      const totalAvailable = buckets.reduce((sum, item) => sum + item.qty, 0);
      if (totalAvailable < entry.qty) {
        setWarehouseNotice({ text: `❌ ${entry.code} 可出貨數量不足，目前只剩 ${totalAvailable}`, tone: 'danger' });
        return;
      }

      let remaining = entry.qty;
      for (const bucket of buckets) {
        if (remaining <= 0) break;
        const picked = Math.min(bucket.qty, remaining);
        allocations.push({
          id: safeFirestoreDocId(`out_${order.orderNo}_${entry.code}_${bucket.qr}_${picked}`, 'inventory_log'),
          createdAt: timestamp,
          type: '出庫',
          code: entry.code,
          name: entry.name,
          qty: picked,
          qr: bucket.qr,
          operator: user.loginId,
          orderNo: order.orderNo,
          note: `${order.orderNo} 完成出貨，${entry.code} ${entry.name} 出庫 ${picked} 件（${bucket.qr}）`,
        });
        remaining -= picked;
      }
    }

    const inventoryAfterMap = allocations.reduce((acc, item) => {
      const baseStock = stockSnapshot.find((entry) => entry.code === item.code)?.stock
        ?? products.find((entry) => entry.code === item.code)?.stock
        ?? 0;
      const current = typeof acc[item.code] === 'number' ? acc[item.code] : baseStock;
      acc[item.code] = Math.max(0, current - item.qty);
      return acc;
    }, {} as Record<string, number>);
    const shippedOrder = {
      ...order,
      shippingStatus: '已出貨',
      mainStatus: '已完成',
    };
    setInventoryLogs((prev) => [...prev, ...allocations]);
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === order.orderNo ? shippedOrder : item)));
    await syncOrderBundleToFirebase(shippedOrder, { shippingAllocations: allocations, inventoryAfterMap, inventoryLogType: '出貨' });
    setWarehouseNotice({ text: `✅ 已依 inventory_logs 完成出貨：${order.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 訂單已同步出貨：${order.orderNo}`, tone: 'success' });
    setWarehouseQueryResult([{ title: order.orderNo, desc: `${order.customer} / 已出貨 / ${order.shippingMethod}`, meta: ['已寫入 inventory_logs', `出貨筆數：${allocations.length}`, `商品：${order.items.map((item) => `${item.code}*${item.qty}`).join(' / ')}`] }]);
    setWarehouseScanBarcode('');
    setWarehouseScanQr('');
  };


  const handleWarehouseReturn = async () => {
    if (!selectedWarehouseOrder) {
      setWarehouseNotice({ text: '❌ 請先選擇訂單', tone: 'danger' });
      return;
    }
    const order = orderRecords.find((item) => item.orderNo === selectedWarehouseOrder.orderNo);
    if (!order) {
      setWarehouseNotice({ text: '❌ 找不到對應訂單', tone: 'danger' });
      return;
    }
    if (order.shippingStatus === '已退貨') {
      setWarehouseNotice({ text: '❌ 此訂單已退貨', tone: 'danger' });
      return;
    }
    const timestamp = getTaipeiTimestamp();
    const inboundLogs: InventoryLog[] = order.items.map((entry, index) => ({
      id: safeFirestoreDocId(`return_${order.orderNo}_${entry.code}_${index + 1}`, 'inventory_log'),
      createdAt: timestamp,
      type: '入庫',
      code: entry.code,
      name: entry.name,
      qty: entry.qty,
      qr: `RET-${entry.code}`,
      operator: user.loginId,
      orderNo: order.orderNo,
      note: `${order.orderNo} 退貨回補，${entry.code} ${entry.name} 回庫 ${entry.qty} 件`,
    }));
    const inventoryAfterMap = inboundLogs.reduce((acc, item) => {
      const baseStock = stockSnapshot.find((entry) => entry.code === item.code)?.stock
        ?? products.find((entry) => entry.code === item.code)?.stock
        ?? 0;
      const current = typeof acc[item.code] === 'number' ? acc[item.code] : baseStock;
      acc[item.code] = current + item.qty;
      return acc;
    }, {} as Record<string, number>);
    const returnedOrder = {
      ...order,
      shippingStatus: '已退貨',
      mainStatus: '退貨處理',
      paymentStatus: order.paymentStatus === '已收款' ? '退款處理中' : order.paymentStatus,
    };
    setInventoryLogs((prev) => [...prev, ...inboundLogs]);
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === order.orderNo ? returnedOrder : item)));
    await syncOrderBundleToFirebase(returnedOrder, { paymentMode: returnedOrder.paymentStatus.includes('退款') ? 'refund' : undefined, shippingAllocations: inboundLogs, inventoryAfterMap, inventoryLogType: '退貨回庫' });
    setWarehouseNotice({ text: `✅ 已完成退貨回補：${order.orderNo}`, tone: 'success' });
    setAccountingNotice({ text: `✅ 倉儲已送回退貨狀態：${order.orderNo}`, tone: 'success' });
  };

  const handleWarehouseExchange = async () => {
    if (!selectedWarehouseOrder) {
      setWarehouseNotice({ text: '❌ 請先選擇訂單', tone: 'danger' });
      return;
    }
    const order = orderRecords.find((item) => item.orderNo === selectedWarehouseOrder.orderNo);
    if (!order) {
      setWarehouseNotice({ text: '❌ 找不到對應訂單', tone: 'danger' });
      return;
    }
    if (order.shippingStatus === '換貨待出庫') {
      setWarehouseNotice({ text: '❌ 此訂單已在換貨流程', tone: 'danger' });
      return;
    }
    const exchangeOrder = {
      ...order,
      shippingStatus: '換貨待出庫',
      mainStatus: '換貨處理',
    };
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === order.orderNo ? exchangeOrder : item)));
    await syncOrderBundleToFirebase(exchangeOrder);
    setSelectedWarehouseOrderNo(order.orderNo);
    setWarehouseNotice({ text: `✅ 已切入換貨流程：${order.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 倉儲已標記換貨待出庫：${order.orderNo}`, tone: 'success' });
  };

  const handleWarehouseInbound = async () => {
    if (!selectedStockItem) {
      setWarehouseNotice({ text: '❌ 請先選擇商品再入庫', tone: 'danger' });
      return;
    }
    if (!warehouseInboundQr.trim()) {
      setWarehouseNotice({ text: '❌ 入庫必須填寫 QR 身分識別', tone: 'danger' });
      return;
    }
    if (warehouseInboundQty <= 0) {
      setWarehouseNotice({ text: '❌ 入庫數量必須大於 0', tone: 'danger' });
      return;
    }

    const productRef = products.find((item) => item.code === selectedStockItem.code);
    if (!productRef) {
      setWarehouseNotice({ text: '❌ 找不到對應商品，無法同步入庫', tone: 'danger' });
      return;
    }

    const timestamp = getTaipeiTimestamp();
    const cleanQr = warehouseInboundQr.trim().toUpperCase();
    const newLog: InventoryLog = {
      id: safeFirestoreDocId(`in_${selectedStockItem.code}_${cleanQr}_${timestamp}`, 'inventory_log'),
      createdAt: timestamp,
      type: '入庫',
      code: selectedStockItem.code,
      name: selectedStockItem.name,
      qty: warehouseInboundQty,
      qr: cleanQr,
      operator: user.loginId,
      note: `${selectedStockItem.code} ${selectedStockItem.name} 入庫 ${warehouseInboundQty} 件（${cleanQr}）`,
    };

    const nextStock = selectedStockItem.stock + warehouseInboundQty;
    setInventoryLogs((prev) => [...prev, newLog]);
    setProducts((prev) => prev.map((item) => item.id === productRef.id ? { ...item, stock: nextStock } : item));

    try {
      const synced = await appendInventoryInboundToFirebase(newLog, { ...productRef, stock: nextStock }, nextStock);
      setWarehouseNotice({ text: synced ? `✅ 已入庫並同步 Firebase：${selectedStockItem.code} +${warehouseInboundQty}` : `✅ 已寫入入庫紀錄：${selectedStockItem.code} +${warehouseInboundQty}`, tone: 'success' });
    } catch (error) {
      console.error(error);
      setWarehouseNotice({ text: '❌ 入庫已寫畫面，但 Firebase 同步失敗', tone: 'danger' });
    }
    setWarehouseQueryResult([{ title: cleanQr, desc: `${selectedStockItem.name} / 已入庫 ${warehouseInboundQty} 件`, meta: [`商品條碼：${selectedStockItem.code}`, `操作人員：${user.loginId}`, '已寫入 inventory_logs'] }]);
    setWarehouseInboundQty(1);
    setWarehouseInboundQr('');
  };

  const handleWarehousePrint = () => {
    if (!selectedWarehouseOrder) return;
    const order = orderRecords.find((item) => item.orderNo === selectedWarehouseOrder.orderNo);
    if (!order) return;

    const shippingFeeValue = order.shippingFeeOverride ?? getShippingFee(order.shippingMethod);
    const actualReceivedValue = order.actualReceived ?? order.amount;
    const taxRateValue = order.taxRate ?? 0;
    const untaxedBase = Math.max(actualReceivedValue - shippingFeeValue, 0);
    const taxAmountValue = taxRateValue > 0 ? Math.round(untaxedBase * (taxRateValue / 100)) : 0;
    const qrContent = order.orderNo;
    const itemSummary = order.items.map((item) => `${item.code} × ${item.qty}`).join(' / ');
    const lines = order.items.map((item) => `
      <tr>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>$${item.price.toLocaleString()}</td>
        <td>$${(item.price * item.qty).toLocaleString()}</td>
      </tr>`).join('');
    const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<title>${order.orderNo} 出貨單 PDF 預覽</title>
<style>
@page{size:A4;margin:14mm}
body{font-family:Arial,"Microsoft JhengHei",sans-serif;padding:18px;color:#24324b;background:#f5f7fb}
.sheet{max-width:920px;margin:0 auto;background:#fff;border:1px solid #e6d8df;border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(30,41,59,.08)}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:18px}
.title{font-size:30px;font-weight:800;margin:0 0 6px}
.sub{color:#6b7280;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}
.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}
.box{background:#faf7f8;border:1px solid #ecd9e1;border-radius:14px;padding:12px}
.box span{display:block;font-size:12px;color:#8a6b78;margin-bottom:6px}
.box strong{font-size:16px;word-break:break-word}
.qr-box{border:1px dashed #d78ba8;border-radius:18px;padding:16px;background:#fff8fb;text-align:center;min-width:180px}
.qr-code{font-size:20px;font-weight:800;letter-spacing:0.08em;margin-top:10px}
.qr-note{margin-top:8px;font-size:12px;color:#8a6b78}
table{width:100%;border-collapse:collapse;margin-top:16px}
th,td{border-bottom:1px solid #eee;padding:12px;text-align:left;font-size:14px;vertical-align:top}
th{background:#fdf2f6;color:#874b61}
.actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}
button{border:none;border-radius:999px;padding:10px 16px;font-weight:700;cursor:pointer}
.print{background:#ef5b96;color:#fff}
.close{background:#eef2f7;color:#334155}
.note{margin-top:18px;color:#64748b;font-size:13px;line-height:1.7}
@media print{body{background:#fff;padding:0}.sheet{box-shadow:none;border:none;padding:0}.actions{display:none}}
</style>
</head>
<body>
  <div class="sheet">
    <div class="head">
      <div>
        <div class="title">出貨單 / PDF 預覽</div>
        <div class="sub">${order.orderNo} ・ 依 GAS 邏輯顯示可列印內容</div>
        <div class="sub">建立時間：${order.date}</div>
      </div>
      <div class="qr-box">
        <div><strong>QR 內容</strong></div>
        <div class="qr-code">${qrContent}</div>
        <div class="qr-note">列印時可作為出貨單辨識內容</div>
      </div>
    </div>
    <div class="grid">
      <div class="box"><span>訂單編號</span><strong>${order.orderNo}</strong></div>
      <div class="box"><span>客戶姓名</span><strong>${order.customer}</strong></div>
      <div class="box"><span>款項狀態</span><strong>${order.paymentStatus}</strong></div>
      <div class="box"><span>商品狀態</span><strong>${order.shippingStatus}</strong></div>
      <div class="box"><span>配送方式</span><strong>${order.shippingMethod}</strong></div>
      <div class="box"><span>配送地址</span><strong>${order.address || '—'}</strong></div>
      <div class="box"><span>商品摘要</span><strong>${itemSummary}</strong></div>
      <div class="box"><span>備註</span><strong>${order.remark || '—'}</strong></div>
    </div>
    <table>
      <thead><tr><th>商品編號</th><th>商品名稱</th><th>數量</th><th>單價</th><th>小計</th></tr></thead>
      <tbody>${lines}</tbody>
    </table>
    <div class="grid-3">
      <div class="box"><span>未稅價</span><strong>$${untaxedBase.toLocaleString()}</strong></div>
      <div class="box"><span>稅率 / 稅額</span><strong>${taxRateValue}% / $${taxAmountValue.toLocaleString()}</strong></div>
      <div class="box"><span>運費</span><strong>$${shippingFeeValue.toLocaleString()}</strong></div>
      <div class="box"><span>實收總額</span><strong>$${actualReceivedValue.toLocaleString()}</strong></div>
      <div class="box"><span>商品條碼</span><strong>${order.items.map((item) => item.code).join(' / ')}</strong></div>
      <div class="box"><span>身分識別提示</span><strong>請依出貨區掃碼驗證後再列印</strong></div>
    </div>
    <div class="actions">
      <button class="close" onclick="window.close()">關閉</button>
      <button class="print" onclick="window.print()">列印 / 另存 PDF</button>
    </div>
    <div class="note">此頁可直接使用瀏覽器列印，或選擇另存為 PDF。若訂單含應稅條件，會同步顯示未稅、稅率、稅額與實收總額。</div>
  </div>
</body>
</html>`;
    const previewWindow = window.open('', '_blank', 'width=1024,height=920');
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(html);
      previewWindow.document.close();
      setWarehouseNotice({ text: `✅ 已開啟出貨單 PDF 預覽：${selectedWarehouseOrder.orderNo}`, tone: 'success' });
      return;
    }
    setWarehouseNotice({ text: '❌ 無法開啟列印視窗，請確認瀏覽器是否阻擋彈窗', tone: 'danger' });
  };

  const handleWarehouseScanFill = () => {
    const next = warehouseQueryMode === 'barcode'
      ? (selectedStockItem?.code || 'P301')
      : warehouseQueryMode === 'qr'
        ? (findAvailableQrBuckets(inventoryLogs, selectedStockItem?.code || 'E401')[0]?.qr || 'QR(P1)')
        : (selectedWarehouseOrder?.orderNo || 'VP20260331-002');
    setWarehouseQueryInput(next);
    setWarehouseNotice({ text: `✅ 已帶入 ${next}`, tone: 'neutral' });
  };

  useEffect(() => {
    const stockMap = new Map(stockSnapshot.map((item) => [item.code, item.stock]));
    setProducts((prev) => prev.map((item) => {
      const nextStock = stockMap.get(item.code);
      return typeof nextStock === 'number' && item.stock !== nextStock ? { ...item, stock: nextStock } : item;
    }));
  }, [stockSnapshot]);

  const selectedOrderRecord = useMemo(() => orderRecords.find((item) => item.orderNo === selectedOrderNo) || orderRecords[0] || null, [orderRecords, selectedOrderNo]);

  useEffect(() => {
    if (!filteredWarehouseQueue.length) return;
    if (!filteredWarehouseQueue.some((item) => item.orderNo === selectedWarehouseOrderNo)) {
      setSelectedWarehouseOrderNo(filteredWarehouseQueue[0].orderNo);
    }
  }, [filteredWarehouseQueue, selectedWarehouseOrderNo]);

  const filteredAccountingQueue = useMemo(() => {
    const q = accountingKeyword.trim().toLowerCase();
    return paymentQueue
      .filter((item) => {
        const matchKeyword = !q || [item.orderNo, item.customer, item.paymentStatus, item.shippingStatus, item.paymentMethod, item.invoiceNo].join(' ').toLowerCase().includes(q);
        const matchPayment = accountingPaymentFilter === '全部' || item.paymentStatus === accountingPaymentFilter;
        const matchShipping = accountingShippingFilter === '全部' || item.shippingStatus === accountingShippingFilter;
        const itemDateKey = item.date.replace(/\//g, '-');
        const matchDateStart = !accountingDateStart || itemDateKey >= accountingDateStart;
        const matchDateEnd = !accountingDateEnd || itemDateKey <= accountingDateEnd;
        return matchKeyword && matchPayment && matchShipping && matchDateStart && matchDateEnd;
      })
      .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date) || b.orderNo.localeCompare(a.orderNo));
  }, [paymentQueue, accountingKeyword, accountingPaymentFilter, accountingShippingFilter, accountingDateStart, accountingDateEnd]);

  useEffect(() => {
    if (!filteredAccountingQueue.length) return;
    if (!filteredAccountingQueue.some((item) => item.orderNo === selectedAccountingOrderNo)) {
      setSelectedAccountingOrderNo(filteredAccountingQueue[0].orderNo);
    }
  }, [filteredAccountingQueue, selectedAccountingOrderNo]);

  const selectedAccountingRecord = useMemo(
    () => filteredAccountingQueue.find((item) => item.orderNo === selectedAccountingOrderNo) || filteredAccountingQueue[0] || null,
    [filteredAccountingQueue, selectedAccountingOrderNo],
  );

  useEffect(() => {
    const sourceRecord = orderRecords.find((item) => item.orderNo === selectedAccountingRecord?.orderNo) || null;
    setAccountingDraft(makeAccountingDraft(sourceRecord));
  }, [selectedAccountingRecord?.orderNo, orderRecords]);

  useEffect(() => {
    if (!staff.length) return;
    if (!staff.some((item) => item.id === selectedStaffId)) {
      setSelectedStaffId(staff[0].id);
    }
  }, [staff, selectedStaffId]);

  useEffect(() => {
    if (!selectedStaff) return;
    if (staffEditorMode === 'view') {
      setStaffDraft(toStaffDraft(selectedStaff));
    }
  }, [selectedStaff, staffEditorMode]);

  const selectedAccountingSourceRecord = useMemo(
    () => orderRecords.find((item) => item.orderNo === selectedAccountingRecord?.orderNo) || null,
    [orderRecords, selectedAccountingRecord?.orderNo],
  );

  const accountingUntaxedAmount = Number(accountingDraft?.untaxedAmount || 0);
  const accountingTaxRateNumber = Number(accountingDraft?.taxRate || 0);
  const accountingShippingFeeNumber = Number(accountingDraft?.shippingFee || 0);
  const accountingTaxAmount = getTaxAmount(accountingUntaxedAmount, accountingTaxRateNumber);
  const accountingActualReceived = getActualReceived(accountingUntaxedAmount, accountingTaxRateNumber, accountingShippingFeeNumber);


  const treasuryQueue = useMemo(
    () => orderRecords
      .filter((item) => item.paymentStatus === '退款處理中' || item.paymentStatus === '已退款')
      .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date) || b.orderNo.localeCompare(a.orderNo)),
    [orderRecords],
  );

  useEffect(() => {
    if (!treasuryQueue.length) return;
    if (!treasuryQueue.some((item) => item.orderNo === selectedTreasuryOrderNo)) {
      setSelectedTreasuryOrderNo(treasuryQueue[0].orderNo);
    }
  }, [treasuryQueue, selectedTreasuryOrderNo]);

  const selectedTreasuryRecord = useMemo(
    () => treasuryQueue.find((item) => item.orderNo === selectedTreasuryOrderNo) || treasuryQueue[0] || null,
    [treasuryQueue, selectedTreasuryOrderNo],
  );

  useEffect(() => {
    setTreasuryDraft(makeTreasuryDraft(selectedTreasuryRecord));
  }, [selectedTreasuryRecord?.orderNo, orderRecords]);

  const treasuryReminderCount = useMemo(
    () => treasuryQueue.filter((item) => item.paymentStatus === '退款處理中' && (!item.proof || item.proof === '待上傳')).length,
    [treasuryQueue],
  );

  const treasuryPendingAmount = useMemo(
    () => treasuryQueue
      .filter((item) => item.paymentStatus === '退款處理中')
      .reduce((sum, item) => sum + (typeof item.actualReceived === 'number' ? item.actualReceived : item.amount), 0),
    [treasuryQueue],
  );

  const treasuryPaidAmount = useMemo(
    () => treasuryQueue
      .filter((item) => item.paymentStatus === '已退款')
      .reduce((sum, item) => sum + (typeof item.actualReceived === 'number' ? item.actualReceived : item.amount), 0),
    [treasuryQueue],
  );

  const treasuryExpenseTotal = useMemo(
    () => treasuryExpenseLogs.reduce((sum, item) => sum + item.amount, 0),
    [treasuryExpenseLogs],
  );

  const bonusTotal = useMemo(
    () => bonusLogs.reduce((sum, item) => sum + item.amount, 0),
    [bonusLogs],
  );

  const treasuryReminders = useMemo(
    () => treasuryQueue
      .filter((item) => item.paymentStatus === '退款處理中')
      .map((item) => ({
        orderNo: item.orderNo,
        customer: item.customer,
        missingProof: !item.proof || item.proof === '待上傳',
        amount: typeof item.actualReceived === 'number' ? item.actualReceived : item.amount,
      })),
    [treasuryQueue],
  );

  const treasurySummary = useMemo(() => ([
    { title: '退款進行中', value: `$${treasuryPendingAmount.toLocaleString()}`, sub: `待出納處理 ${treasuryQueue.filter((item) => item.paymentStatus === '退款處理中').length} 筆` },
    { title: '已完成退款', value: `$${treasuryPaidAmount.toLocaleString()}`, sub: '已完成實際撥款' },
    { title: '提醒中', value: String(treasuryReminderCount), sub: '缺退款證明將持續提醒' },
    { title: '支出總額', value: `$${treasuryExpenseTotal.toLocaleString()}`, sub: '目前為前端暫存紀錄' },
  ]), [treasuryPendingAmount, treasuryQueue, treasuryPaidAmount, treasuryReminderCount, treasuryExpenseTotal]);

  const treasuryExpenseCategories = ['進貨支出', '運費支出', '雜項支出', '請款撥付'];

  const accountingOpsTotal = filteredAccountingQueue.reduce((sum, item) => sum + item.amount, 0);

  const accountingBoardsView = useMemo(() => ([
    { title: '已收款總額', value: `$${orderRecords.filter((item) => item.paymentStatus === '已收款').reduce((sum, item) => sum + (item.actualReceived ?? item.amount), 0).toLocaleString()}`, sub: '訂單入帳總覽' },
    { title: '退款總額', value: `$${treasuryPaidAmount.toLocaleString()}`, sub: '出納完成撥款' },
    { title: '支出總額', value: `$${treasuryExpenseTotal.toLocaleString()}`, sub: '採購 / 運費 / 雜支' },
    { title: '獎金入帳', value: `$${bonusTotal.toLocaleString()}`, sub: `共 ${bonusLogs.length} 筆獎金入帳` },
  ]), [orderRecords, treasuryPaidAmount, treasuryExpenseTotal, bonusTotal, bonusLogs.length]);

  const accountingTrendBarsView = useMemo(() => {
    const maxValue = Math.max(...accountingTrendBars.map((item) => item.value), bonusTotal || 0, 1);
    const base = accountingTrendBars.map((item) => ({ ...item, width: Math.round((item.value / maxValue) * 100) }));
    if (!bonusTotal) return base;
    return [...base, { label: '獎金', value: bonusTotal, width: Math.round((bonusTotal / maxValue) * 100) }];
  }, [bonusTotal]);

  const profilePersonalOrders = useMemo(() => orderRecords.map((item) => ({
    orderNo: item.orderNo,
    date: item.date,
    amount: typeof item.actualReceived === 'number' ? item.actualReceived : item.amount,
    paymentStatus: item.paymentStatus,
    shippingStatus: item.shippingStatus,
    mainStatus: item.mainStatus,
  })), [orderRecords]);

  const shippingFee = getShippingFee(shippingMethod);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const discountAmount = discountMode === '固定金額' ? discountValue : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const lowStockCount = stockSnapshot.filter((p) => p.stock <= p.safe).length;
  const enabledProducts = products.filter((p) => p.enabled).length;
  const vipCustomers = visibleCustomerRecords.filter((c) => ['VIP', '代理'].some((tag) => c.level.includes(tag))).length;
  const activeStaff = staff.filter((s) => s.enabled).length;

  const visibleNavItems = useMemo(() => navItems.filter((item) => canAccessNav(user.role, item.key) && (item.key !== 'profile' || canAccessEvaluation(user))), [user]);
  const mobilePrimaryNavItems: { key: MobileNavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'dashboard', label: '儀表板', icon: BarChart3 },
    { key: 'orders', label: '訂購', icon: ShoppingCart },
    { key: 'inventory', label: '倉儲', icon: Warehouse },
    { key: 'accounting', label: '會計', icon: CreditCard },
    { key: 'more', label: '更多', icon: Boxes },
  ];
  const mobileMoreCommonItems = useMemo(() => [
    { key: 'profile' as NavKey, label: '評鑑', icon: ClipboardList },
  ].filter((item) => canAccessNav(user.role, item.key) && (item.key !== 'profile' || canAccessEvaluation(user))), [user]);
  const mobileManagementItems = useMemo(() => [
    { key: 'products' as NavKey, label: '商品管理', icon: Package },
    { key: 'customers' as NavKey, label: '客戶管理', icon: Users },
    { key: 'staff' as NavKey, label: '人員管理', icon: UserCog },
  ].filter((item) => canAccessNav(user.role, item.key)), [user.role]);
  const currentNavItem = navItems.find((item) => item.key === active) || navItems[0];
  const currentModuleLabel = currentNavItem.label;
  const currentModuleEnglish = NAV_ENGLISH_LABEL[currentNavItem.key];

  const customerViewMode = permissionProfile.canViewCustomerSensitiveFields ? 'full' : 'limited';
  const customerScopeLabel = permissionProfile.canViewAllCustomers
    ? '全部客戶完整資料'
    : permissionProfile.canViewAssignedOrderCustomers
      ? '僅訂單必要客戶資訊'
      : permissionProfile.canViewOwnCustomers
        ? '僅自己推銷客戶'
        : '無客戶權限';

  useEffect(() => {
    const blockedByRole = !canAccessNav(user.role, active);
    const blockedEvaluation = active === 'profile' && !canAccessEvaluation(user);
    if (blockedByRole || blockedEvaluation) {
      setActive(ROLE_NAV_ACCESS[user.role][0]);
    }
  }, [user, active]);

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

  async function uploadFileToFirebase(folder: 'products' | 'accounting' | 'treasury', file: File, targetKey: string) {
    const storage = getStorageService();
    if (!storage) throw new Error('storage_not_ready');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${safeFirestoreDocId(targetKey, folder)}/${Date.now()}_${safeName}`;
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  async function handleProductImageUpload(file?: File | null) {
    if (!file) return;
    const code = (productDraft.code || '').trim();
    if (!code) {
      setProductNotice({ text: '❌ 請先填商品編號', tone: 'danger' });
      return;
    }
    try {
      setProductNotice({ text: '圖片上傳中…', tone: 'neutral' });
      const imageUrl = await uploadFileToFirebase('products', file, code);
      setProductDraft((prev) => ({ ...prev, image: imageUrl }));
      setProductNotice({ text: '✅ 商品圖片已上傳', tone: 'success' });
    } catch {
      setProductNotice({ text: '❌ 商品圖片上傳失敗', tone: 'danger' });
    } finally {
      if (productImageInputRef.current) productImageInputRef.current.value = '';
    }
  }

  async function handleAccountingProofUpload(file?: File | null) {
    if (!file) return;
    if (!accountingDraft.orderNo) {
      setAccountingNotice({ text: '❌ 請先選擇訂單', tone: 'danger' });
      return;
    }
    try {
      setAccountingNotice({ text: '附件上傳中…', tone: 'neutral' });
      const proofUrl = await uploadFileToFirebase('accounting', file, accountingDraft.orderNo);
      setAccountingDraft((prev) => ({ ...prev, proof: proofUrl }));
      const saved = await saveAccountingDraft();
      if (saved) {
        setAccountingNotice({ text: '✅ 收款證明已上傳', tone: 'success' });
      }
    } catch {
      setAccountingNotice({ text: '❌ 收款證明上傳失敗', tone: 'danger' });
    } finally {
      if (accountingProofInputRef.current) accountingProofInputRef.current.value = '';
    }
  }


  function updateTreasuryDraftField(field: keyof TreasuryDraft, value: string) {
    setTreasuryDraft((prev) => ({ ...prev, [field]: value }));
  }

  function updateTreasuryExpenseField(field: keyof TreasuryExpenseDraft, value: string) {
    setTreasuryExpenseDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function handleTreasuryProofUpload(file?: File | null) {
    if (!file) return;
    if (!selectedTreasuryRecord && !treasuryExpenseDraft.category) {
      setTreasuryNotice({ text: '❌ 請先選擇退款單或支出項目', tone: 'danger' });
      return;
    }
    try {
      setTreasuryNotice({ text: '附件上傳中…', tone: 'neutral' });
      const targetKey = selectedTreasuryRecord?.orderNo || `expense-${Date.now()}`;
      const proofUrl = await uploadFileToFirebase('treasury', file, targetKey);
      if (selectedTreasuryRecord) {
        setTreasuryDraft((prev) => ({ ...prev, proof: proofUrl }));
      } else {
        setTreasuryExpenseDraft((prev) => ({ ...prev, proof: proofUrl }));
      }
      setTreasuryNotice({ text: '✅ 出納證明已上傳', tone: 'success' });
    } catch {
      setTreasuryNotice({ text: '❌ 出納證明上傳失敗', tone: 'danger' });
    } finally {
      if (treasuryProofInputRef.current) treasuryProofInputRef.current.value = '';
    }
  }


  async function handleTreasuryExpenseProofUpload(file?: File | null) {
    if (!file) return;
    try {
      setTreasuryNotice({ text: '附件上傳中…', tone: 'neutral' });
      const proofUrl = await uploadFileToFirebase('treasury', file, `expense-${Date.now()}`);
      setTreasuryExpenseDraft((prev) => ({ ...prev, proof: proofUrl }));
      setTreasuryNotice({ text: '✅ 支出證明已上傳', tone: 'success' });
    } catch {
      setTreasuryNotice({ text: '❌ 支出證明上傳失敗', tone: 'danger' });
    } finally {
      if (treasuryExpenseProofInputRef.current) treasuryExpenseProofInputRef.current.value = '';
    }
  }

  async function confirmTreasuryRefund() {
    if (!selectedTreasuryRecord) {
      setTreasuryNotice({ text: '❌ 尚未選擇退款訂單', tone: 'danger' });
      return;
    }
    if (selectedTreasuryRecord.paymentStatus === '已退款') {
      setTreasuryNotice({ text: '❌ 此訂單已完成退款', tone: 'danger' });
      return;
    }
    if (!treasuryDraft.proof || treasuryDraft.proof === '待上傳') {
      setTreasuryNotice({ text: '❌ 請先補上退款證明，否則不能完成撥款', tone: 'danger' });
      return;
    }
    if (!confirmAction(`確認由出納完成退款：${selectedTreasuryRecord.orderNo}？`)) {
      setTreasuryNotice({ text: '已取消出納退款', tone: 'neutral' });
      return;
    }

    const currentOrder = orderRecords.find((item) => item.orderNo === selectedTreasuryRecord.orderNo) || selectedTreasuryRecord;
    const refundAmount = Number(treasuryDraft.refundAmount || currentOrder.actualReceived || currentOrder.amount || 0);
    const nextOrder = {
      ...currentOrder,
      amount: refundAmount,
      actualReceived: refundAmount,
      paymentStatus: '已退款',
      shippingStatus: currentOrder.shippingStatus === '已出貨' ? '已出貨' : '已退款',
      mainStatus: '已完成',
      paymentMethod: treasuryDraft.payoutMethod || currentOrder.paymentMethod || '原路退回',
      proof: treasuryDraft.proof,
      remark: [currentOrder.remark, `出納完成退款：${user.loginId}`].filter(Boolean).join('｜'),
    };
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === selectedTreasuryRecord.orderNo ? nextOrder : item)));
    await syncOrderBundleToFirebase(nextOrder, { paymentMode: 'refund' });
    await syncRefundRecordToFirebase(nextOrder);
    setTreasuryNotice({ text: `✅ 出納已完成退款：${selectedTreasuryRecord.orderNo}`, tone: 'success' });
    setAccountingNotice({ text: `✅ 出納已完成退款：${selectedTreasuryRecord.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 訂單退款完成：${selectedTreasuryRecord.orderNo}`, tone: 'success' });
  }

  function saveTreasuryExpense() {
    const amount = Number(treasuryExpenseDraft.amount || 0);
    if (!treasuryExpenseDraft.category.trim()) {
      setTreasuryNotice({ text: '❌ 請選擇支出分類', tone: 'danger' });
      return;
    }
    if (!amount || Number.isNaN(amount) || amount < 0) {
      setTreasuryNotice({ text: '❌ 支出金額格式錯誤', tone: 'danger' });
      return;
    }
    const nextRecord: TreasuryExpenseRecord = {
      id: `expense-${Date.now()}`,
      category: treasuryExpenseDraft.category.trim(),
      amount,
      referenceNo: treasuryExpenseDraft.referenceNo.trim() || '未填寫',
      note: treasuryExpenseDraft.note.trim() || '—',
      proof: treasuryExpenseDraft.proof || '待上傳',
      createdAt: getTaipeiTimestamp(),
      operator: user.loginId,
    };
    setTreasuryExpenseLogs((prev) => [nextRecord, ...prev]);
    setTreasuryExpenseDraft(makeTreasuryExpenseDraft());
    setTreasuryNotice({ text: `✅ 已新增支出：${nextRecord.category}`, tone: 'success' });
  }

  function updateBonusDraftField(field: keyof BonusDraft, value: string) {
    setBonusDraft((prev) => ({ ...prev, [field]: value }));
  }

  function saveBonusEntry() {
    const amount = Number(bonusDraft.amount || 0);
    if (!bonusDraft.date || !bonusDraft.time) {
      setAccountingNotice({ text: '❌ 請先補齊入帳日期與時間', tone: 'danger' });
      return;
    }
    if (!amount || Number.isNaN(amount) || amount < 0) {
      setAccountingNotice({ text: '❌ 獎金金額格式錯誤', tone: 'danger' });
      return;
    }
    const nextRecord: BonusRecord = {
      id: `bonus-${Date.now()}`,
      date: bonusDraft.date,
      time: bonusDraft.time,
      amount,
      note: bonusDraft.note.trim() || '獎金入帳',
      operator: user.loginId,
    };
    setBonusLogs((prev) => [nextRecord, ...prev]);
    setBonusDraft(makeBonusDraft());
    setAccountingNotice({ text: `✅ 已加入獎金入帳：$${amount.toLocaleString()}`, tone: 'success' });
  }

  async function syncProductToFirebase(product: Product, stockValue?: number) {
    const db = getDb();
    if (!db) return false;
    const canonicalProduct = { ...product, id: product.code.trim(), code: product.code.trim(), barcode: (product.barcode || product.code).trim() };
    const stock = typeof stockValue === 'number' ? stockValue : canonicalProduct.stock;
    const batch = writeBatch(db);
    batch.set(doc(db, 'products', canonicalProduct.code), buildProductPayload({ ...canonicalProduct, stock }));
    batch.set(doc(db, 'inventory', canonicalProduct.code), buildInventoryPayload(canonicalProduct, stock));
    if (canonicalProduct.sourceDocId && canonicalProduct.sourceDocId !== canonicalProduct.code) {
      batch.delete(doc(db, 'products', canonicalProduct.sourceDocId));
      batch.delete(doc(db, 'inventory', canonicalProduct.sourceDocId));
    }
    await batch.commit();

    setFirebaseReady(true);
    setDataMode('firebase');
    return true;
  }

  async function appendInventoryInboundToFirebase(log: InventoryLog, product: Product, nextStock: number) {
    const db = getDb();
    if (!db) return false;
    const canonicalProduct = { ...product, id: product.code.trim(), code: product.code.trim(), barcode: (product.barcode || product.code).trim() };
    const batch = writeBatch(db);
    batch.set(doc(db, 'inventory', canonicalProduct.code), buildInventoryPayload(canonicalProduct, nextStock), { merge: true });
    if ((product as any).sourceDocId && (product as any).sourceDocId !== canonicalProduct.code) {
      batch.delete(doc(db, 'inventory', (product as any).sourceDocId));
    }
    batch.set(doc(db, 'inventory_logs', log.id), {
      id: log.id,
      createdAt: log.createdAt,
      type: log.type,
      code: log.code,
      barcode: product.barcode || product.code,
      name: log.name,
      qty: log.qty,
      qr: log.qr,
      operator: log.operator,
      note: log.note,
      orderNo: log.orderNo || '',
      source: 'VERCEL_UI',
      updatedAt: getIsoNow(),
      lastSyncedAt: getIsoNow(),
    });
    await batch.commit();

    setFirebaseReady(true);
    setDataMode('firebase');
    return true;
  }

  async function syncStaffToFirebase(nextStaff: Staff) {
    const db = getDb();
    if (!db) return false;
    const staffId = safeFirestoreDocId(nextStaff.loginId || nextStaff.id, 'staff');
    const nowIso = getIsoNow();
    const batch = writeBatch(db);
    batch.set(doc(db, 'staff', staffId), {
      id: staffId,
      name: nextStaff.name,
      loginId: nextStaff.loginId,
      role: nextStaff.role,
      rank: nextStaff.rank,
      enabled: nextStaff.enabled,
      password: nextStaff.password || nextStaff.loginId,
      permissions: Array.isArray(nextStaff.permissions) ? nextStaff.permissions : [],
      source: 'VERCEL_UI',
      updatedAt: nowIso,
      lastSyncedAt: nowIso,
    }, { merge: true });
    await batch.commit();

    setFirebaseReady(true);
    setDataMode('firebase');
    return true;
  }

  async function syncRefundRecordToFirebase(order: OrderRecord) {
    const db = getDb();
    if (!db) return false;
    const refundPayload = buildRefundPayload(order);
    await setDoc(doc(db, 'refunds', refundPayload.id), refundPayload, { merge: true });
    return true;
  }

  async function syncOrderBundleToFirebase(order: OrderRecord, options?: {
    paymentMode?: 'pay' | 'refund';
    shippingAllocations?: InventoryLog[];
    inventoryAfterMap?: Record<string, number>;
    inventoryLogType?: string;
  }) {
    const db = getDb();
    if (!db) return false;
    const batch = writeBatch(db);
    const customerId = safeFirestoreDocId(order.phone || order.customer || order.orderNo, 'customer');
    batch.set(doc(db, 'customers', customerId), buildCustomerPayloadFromOrder(order), { merge: true });
    batch.set(doc(db, 'orders', order.orderNo), buildOrderPayload(order), { merge: true });
    order.items.forEach((item, index) => {
      const orderItemPayload = buildOrderItemPayload(order, item, index);
      batch.set(doc(db, 'order_items', orderItemPayload.id), orderItemPayload, { merge: true });
    });
    batch.set(doc(db, 'sales_report', order.orderNo), buildSalesReportPayload(order), { merge: true });

    if (options?.paymentMode) {
      const paymentPayload = buildPaymentPayload(order, options.paymentMode);
      batch.set(doc(db, 'payments', paymentPayload.id), paymentPayload, { merge: true });
      if (options.paymentMode === 'refund') {
        const refundPayload = buildRefundPayload(order);
        batch.set(doc(db, 'refunds', refundPayload.id), refundPayload, { merge: true });
      }
    }

    if (options?.shippingAllocations?.length) {
      batch.set(doc(db, 'shipping', order.orderNo), buildShippingPayload(order, user, options.shippingAllocations), { merge: true });
      options.shippingAllocations.forEach((log) => {
        const productRef = products.find((item) => item.code === log.code) || {
          id: log.code,
          code: log.code,
          barcode: log.code,
          name: log.name,
          category: '未分類',
          price: 0,
          enabled: true,
          stock: 0,
        };
        const payload = buildInventoryLogFirebasePayload(log, productRef, user, options.inventoryLogType);
        batch.set(doc(db, 'inventory_logs', payload.id), payload, { merge: true });
      });
    }

    if (options?.inventoryAfterMap) {
      Object.entries(options.inventoryAfterMap).forEach(([code, nextStock]) => {
        const productRef = products.find((item) => item.code === code);
        if (!productRef) return;
        batch.set(doc(db, 'inventory', code), buildInventoryPayload(productRef, Number(nextStock || 0)), { merge: true });
      });
    }

    await batch.commit();

    setFirebaseReady(true);
    setDataMode('firebase');
    return true;
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

  async function saveProductDraft() {
    if (!productDraft.code.trim() || !productDraft.name.trim() || !productDraft.category.trim()) {
      setProductNotice({ text: '❌ 欄位未完成', tone: 'danger' });
      return;
    }

    const price = Number(productDraft.price || 0);
    const vipPrice = Number(productDraft.vipPrice || 0);
    const agentPrice = Number(productDraft.agentPrice || 0);
    const generalAgentPrice = Number(productDraft.generalAgentPrice || 0);
    const stock = Number(productDraft.stock || 0);

    if ([price, vipPrice, agentPrice, generalAgentPrice, stock].some((value) => value < 0)) {
      setProductNotice({ text: '❌ 數值錯誤', tone: 'danger' });
      return;
    }

    try {
      const trimmedCode = productDraft.code.trim();
      const trimmedBarcode = (productDraft.barcode || productDraft.code).trim();
      const duplicatedCode = products.some((item) => item.code.trim() === trimmedCode && item.id !== (productDraft.id || '').trim());
      if (duplicatedCode) {
        setProductNotice({ text: '❌ 商品編號重複', tone: 'danger' });
        return;
      }

      if (productEditorMode === 'create') {
        if (!confirmAction(`確認新增商品：${trimmedCode}？`)) {
          setProductNotice({ text: '已取消新增商品', tone: 'neutral' });
          return;
        }
        const nextProduct: Product = {
          id: trimmedCode,
          sourceDocId: trimmedCode,
          code: trimmedCode,
          barcode: trimmedBarcode,
          name: productDraft.name.trim(),
          category: productDraft.category.trim(),
          price,
          vipPrice,
          agentPrice,
          generalAgentPrice,
          stock,
          image: productDraft.image || '',
          enabled: productDraft.enabled,
        };
        setProducts((prev) => [nextProduct, ...prev]);
        setSelectedProductId(nextProduct.code);
        setProductDraft(toProductDraft(nextProduct));
        setProductEditorMode('edit');
        const synced = await syncProductToFirebase(nextProduct, stock);
        setProductNotice({ text: synced ? '✅ 已新增並同步 Firebase / inventory' : '✅ 已新增（目前未接 Firebase）', tone: 'success' });
        return;
      }

      if (!productDraft.id) {
        setProductNotice({ text: '❌ 未選商品', tone: 'danger' });
        return;
      }

      if (!confirmAction(`確認更新商品：${trimmedCode}？`)) {
        setProductNotice({ text: '已取消更新商品', tone: 'neutral' });
        return;
      }
      const originalProduct = products.find((item) => item.id === productDraft.id) || null;
      const updatedProduct: Product = {
        id: trimmedCode,
        sourceDocId: originalProduct?.sourceDocId || productDraft.id,
        code: trimmedCode,
        barcode: trimmedBarcode,
        name: productDraft.name.trim(),
        category: productDraft.category.trim(),
        price,
        vipPrice,
        agentPrice,
        generalAgentPrice,
        stock,
        image: productDraft.image || '',
        enabled: productDraft.enabled,
      };

      setProducts((prev) => prev.map((item) => item.id === productDraft.id ? { ...item, ...updatedProduct } : item));
      setSelectedProductId(updatedProduct.code);
      setProductEditorMode('edit');
      const synced = await syncProductToFirebase(updatedProduct, stock);
      setProductNotice({ text: synced ? '✅ 已更新並同步 Firebase / inventory' : '✅ 已更新（目前未接 Firebase）', tone: 'success' });
    } catch (error) {
      console.error(error);
      setProductNotice({ text: '❌ 商品儲存失敗', tone: 'danger' });
    }
  }

  async function toggleProductEnabled(item: Product) {
    const nextEnabled = !item.enabled;
    if (!confirmAction(`確認${nextEnabled ? '啟用' : '停用'}商品：${item.code}？`)) {
      setProductNotice({ text: `已取消${nextEnabled ? '啟用' : '停用'}商品`, tone: 'neutral' });
      return;
    }
    const updatedProduct = { ...item, enabled: nextEnabled };
    setProducts((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, enabled: nextEnabled } : entry));
    setSelectedProductId(item.id);
    setProductDraft((prev) => prev.id === item.id ? { ...prev, enabled: nextEnabled } : prev);
    try {
      const synced = await syncProductToFirebase(updatedProduct, item.stock);
      setProductNotice({ text: synced ? (nextEnabled ? '✅ 已啟用並同步 Firebase' : '❌ 已停用並同步 Firebase') : (nextEnabled ? '✅ 已啟用' : '❌ 已停用'), tone: nextEnabled ? 'success' : 'danger' });
    } catch (error) {
      console.error(error);
      setProductNotice({ text: '❌ 狀態更新失敗，Firebase 未同步成功', tone: 'danger' });
    }
  }


  function openCreateStaff() {
    setStaffEditorMode('create');
    setSelectedStaffId('');
    setStaffDraft(makeEmptyStaffDraft());
    setStaffNotice({ text: '✅ 新增模式', tone: 'neutral' });
  }

  function openEditStaff(item: Staff) {
    setStaffEditorMode('edit');
    setSelectedStaffId(item.id);
    setStaffDraft(toStaffDraft(item));
    setStaffNotice({ text: '✅ 已載入人員', tone: 'neutral' });
  }

  function openViewStaff(item: Staff) {
    setStaffEditorMode('view');
    setSelectedStaffId(item.id);
    setStaffDraft(toStaffDraft(item));
    setStaffNotice({ text: '✅ 已顯示人員', tone: 'neutral' });
  }

  function updateStaffDraftField(field: keyof StaffDraft, value: string | boolean) {
    setStaffDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'loginId') {
        next.password = String(value || '').trim();
      }
      return next;
    });
  }

  function resetStaffPassword() {
    if (!confirmAction('確認初始化密碼？')) {
      setStaffNotice({ text: '已取消初始化密碼', tone: 'neutral' });
      return;
    }
    setStaffDraft((prev) => ({ ...prev, password: prev.loginId.trim() || '' }));
    setStaffNotice({ text: '✅ 已初始化密碼', tone: 'success' });
  }

  async function saveStaffDraft() {
    if (!staffDraft.name.trim() || !staffDraft.loginId.trim()) {
      setStaffNotice({ text: '❌ 欄位未完成', tone: 'danger' });
      return;
    }
    const nextPayload = {
      name: staffDraft.name.trim(),
      loginId: staffDraft.loginId.trim(),
      role: staffDraft.role,
      rank: staffDraft.rank,
      enabled: staffDraft.enabled,
      password: staffDraft.password.trim() || staffDraft.loginId.trim(),
      permissions: getPermissionsByRole(staffDraft.role, staffDraft.rank),
    };
    if (staffEditorMode === 'create') {
      if (!confirmAction(`確認新增人員：${staffDraft.loginId.trim()}？`)) {
        setStaffNotice({ text: '已取消新增人員', tone: 'neutral' });
        return;
      }
      const nextStaff = { id: staffDraft.loginId.trim(), ...nextPayload };
      setStaff((prev) => [nextStaff, ...prev]);
      setSelectedStaffId(nextStaff.id);
      setStaffEditorMode('edit');
      setStaffDraft(toStaffDraft(nextStaff));
      await syncStaffToFirebase(nextStaff);
      setStaffNotice({ text: '✅ 已新增', tone: 'success' });
      return;
    }
    if (!staffDraft.id) {
      setStaffNotice({ text: '❌ 未選人員', tone: 'danger' });
      return;
    }
    if (!confirmAction(`確認更新人員：${staffDraft.loginId.trim() || staffDraft.id}？`)) {
      setStaffNotice({ text: '已取消更新人員', tone: 'neutral' });
      return;
    }
    const updatedStaff = { id: staffDraft.loginId.trim() || staffDraft.id, ...nextPayload };
    setStaff((prev) => prev.map((item) => item.id === staffDraft.id ? { ...item, ...updatedStaff } : item));
    setSelectedStaffId(updatedStaff.id);
    setStaffEditorMode('edit');
    setStaffDraft(toStaffDraft(updatedStaff));
    await syncStaffToFirebase(updatedStaff);
    setStaffNotice({ text: '✅ 已更新', tone: 'success' });
  }

  function makeNextOrderNo() {
    const next = orderRecords.length + 1;
    return `VP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(next).padStart(3, '0')}`;
  }

  async function createOrderRecord() {
    if (!cart.length) {
      setOrderNotice({ text: '❌ 購物車沒有商品', tone: 'danger' });
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setOrderNotice({ text: '❌ 客戶資料未完成', tone: 'danger' });
      return;
    }

    const orderNo = makeNextOrderNo();
    if (!confirmAction(`確認建立訂單：${orderNo}？`)) {
      setOrderNotice({ text: '已取消建立訂單', tone: 'neutral' });
      return;
    }
    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const defaultShippingFee = shippingMethod === '宅配' ? 100 : shippingMethod === '店到店' ? 65 : 0;
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
      taxRate: 0,
      shippingFeeOverride: defaultShippingFee,
      actualReceived: grandTotal,
      paymentMethod: '待確認',
      invoiceNo: '待補',
      proof: '待上傳',
      items: cart.map((item) => ({ code: item.code, name: item.name, qty: item.qty, price: item.price })),
    };
    setOrderRecords((prev) => sortOrderRecords([nextRecord, ...prev]));
    setSelectedOrderNo(orderNo);
    setSelectedAccountingOrderNo(orderNo);
    setAccountingDraft(makeAccountingDraft(nextRecord));
    setAccountingDateEnd(getTodayDateInputValue());
    await syncOrderBundleToFirebase(nextRecord);
    setAccountingNotice({ text: `✅ 訂單已串接會計：${orderNo}`, tone: 'success' });
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

  async function markOrderPaid(orderNo: string) {
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
    if (!confirmAction(`確認收款：${orderNo}？`)) {
      setOrderNotice({ text: '已取消收款', tone: 'neutral' });
      return;
    }
    const nextOrder = { ...target, paymentStatus: '已收款', mainStatus: target.shippingStatus === '待出貨' ? '待出貨' : target.mainStatus };
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === orderNo ? nextOrder : item)));
    await syncOrderBundleToFirebase(nextOrder, { paymentMode: 'pay' });
    setOrderNotice({ text: `✅ 已收款：${orderNo}`, tone: 'success' });
    setAccountingNotice({ text: `✅ Orders 已同步收款：${orderNo}`, tone: 'success' });
  }

  async function markOrderShippingReady(orderNo: string) {
    const target = orderRecords.find((item) => item.orderNo === orderNo);
    if (!target) return;
    if (target.paymentStatus !== '已收款') {
      setOrderNotice({ text: '❌ 需先確認收款', tone: 'danger' });
      return;
    }
    if (!confirmAction(`確認更新待出貨：${orderNo}？`)) {
      setOrderNotice({ text: '已取消更新', tone: 'neutral' });
      return;
    }
    const nextOrder = { ...target, shippingStatus: '待出貨', mainStatus: '待出貨' };
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === orderNo ? nextOrder : item)));
    await syncOrderBundleToFirebase(nextOrder);
    setOrderNotice({ text: `✅ 已更新待出貨：${orderNo}`, tone: 'success' });
    setWarehouseNotice({ text: `✅ Orders 已同步待出貨：${orderNo}`, tone: 'success' });
    setSelectedWarehouseOrderNo(orderNo);
  }

  function updateAccountingDraftField(field: keyof AccountingDraft, value: string) {
    setAccountingDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'taxRate' || field === 'shippingFee') {
        const untaxedAmount = Number(next.untaxedAmount || 0);
        const taxRate = Number(next.taxRate || 0);
        const shippingFee = Number(next.shippingFee || 0);
        next.actualReceived = String(getActualReceived(untaxedAmount, taxRate, shippingFee));
      }
      return next;
    });
  }

  async function saveAccountingDraft() {
    if (!accountingDraft.orderNo) {
      setAccountingNotice({ text: '❌ 尚未選擇訂單', tone: 'danger' });
      return false;
    }

    const untaxedAmount = Number(accountingDraft.untaxedAmount || 0);
    const taxRate = Number(accountingDraft.taxRate || 0);
    const shippingFee = Number(accountingDraft.shippingFee || 0);
    const actualReceived = getActualReceived(untaxedAmount, taxRate, shippingFee);

    if ([untaxedAmount, taxRate, shippingFee, actualReceived].some((value) => Number.isNaN(value) || value < 0)) {
      setAccountingNotice({ text: '❌ 金額或稅率格式錯誤', tone: 'danger' });
      return false;
    }

    const currentOrder = orderRecords.find((item) => item.orderNo === accountingDraft.orderNo);
    if (!currentOrder) {
      setAccountingNotice({ text: '❌ 找不到對應訂單', tone: 'danger' });
      return false;
    }
    const nextOrder = {
      ...currentOrder,
      customer: accountingDraft.customer.trim() || currentOrder.customer,
      amount: actualReceived,
      taxRate,
      shippingFeeOverride: shippingFee,
      actualReceived,
      paymentMethod: accountingDraft.paymentMethod.trim() || '待確認',
      invoiceNo: accountingDraft.invoiceNo.trim() || '待補',
      proof: accountingDraft.proof.trim() || '待上傳',
    };
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === accountingDraft.orderNo ? nextOrder : item)));
    setAccountingDraft((prev) => ({ ...prev, actualReceived: String(actualReceived) }));
    await syncOrderBundleToFirebase(nextOrder);
    setAccountingNotice({ text: `✅ 已更新本次訂單：${accountingDraft.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 會計欄位已回寫：${accountingDraft.orderNo}`, tone: 'success' });
    return true;
  }

  function selectAccountingOrder(orderNo: string) {
    setSelectedAccountingOrderNo(orderNo);
    setAccountingNotice({ text: `✅ 已切換 ${orderNo}`, tone: 'neutral' });
  }

  function selectTreasuryOrder(orderNo: string) {
    setSelectedTreasuryOrderNo(orderNo);
    setTreasuryNotice({ text: `✅ 出納已切換 ${orderNo}`, tone: 'neutral' });
  }

  async function triggerAccountingAction(action: 'pay' | 'refund') {
    if (!selectedAccountingRecord) return;
    if (!await saveAccountingDraft()) return;
    const baseOrder = (orderRecords.find((item) => item.orderNo === selectedAccountingRecord.orderNo) || selectedAccountingRecord);
    const latestDraftOrder = {
      ...baseOrder,
      customer: accountingDraft.customer.trim() || baseOrder.customer,
      amount: accountingActualReceived,
      taxRate: Number(accountingDraft.taxRate || 0),
      shippingFeeOverride: Number(accountingDraft.shippingFee || 0),
      actualReceived: accountingActualReceived,
      paymentMethod: accountingDraft.paymentMethod.trim() || '待確認',
      invoiceNo: accountingDraft.invoiceNo.trim() || '待補',
      proof: accountingDraft.proof.trim() || '待上傳',
    };
    if (action === 'pay') {
      if (selectedAccountingRecord.paymentStatus === '已收款') {
        setAccountingNotice({ text: '❌ 此訂單已收款', tone: 'danger' });
        return;
      }
      if (selectedAccountingRecord.paymentStatus.includes('退款')) {
        setAccountingNotice({ text: '❌ 此訂單處於退款流程，請先確認退款結果', tone: 'danger' });
        return;
      }
      if (!confirmAction(`確認收款：${selectedAccountingRecord.orderNo}？`)) {
        setAccountingNotice({ text: '已取消收款', tone: 'neutral' });
        return;
      }
      const nextOrder = {
        ...latestDraftOrder,
        paymentStatus: '已收款',
        mainStatus: latestDraftOrder.shippingStatus === '待出貨' ? '待出貨' : latestDraftOrder.mainStatus,
      };
      setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === selectedAccountingRecord.orderNo ? nextOrder : item)));
      await syncOrderBundleToFirebase(nextOrder, { paymentMode: 'pay' });
      setAccountingNotice({ text: `✅ 已收款：${selectedAccountingRecord.orderNo}，倉儲端將依狀態判定可出貨`, tone: 'success' });
      setWarehouseNotice({ text: `✅ 收款狀態已更新：${selectedAccountingRecord.orderNo}`, tone: 'success' });
      setOrderNotice({ text: `✅ 會計已同步收款：${selectedAccountingRecord.orderNo}`, tone: 'success' });
      return;
    }

    if (selectedAccountingRecord.paymentStatus.includes('退款')) {
      setAccountingNotice({ text: '❌ 此訂單已進入退款流程', tone: 'danger' });
      return;
    }
    if (!confirmAction(`確認退款：${selectedAccountingRecord.orderNo}？`)) {
      setAccountingNotice({ text: '已取消退款', tone: 'neutral' });
      return;
    }
    const refundOrder = {
      ...latestDraftOrder,
      paymentStatus: '退款處理中',
      shippingStatus: latestDraftOrder.shippingStatus === '已出貨' ? latestDraftOrder.shippingStatus : '已退款',
      mainStatus: '退款處理',
    };
    setOrderRecords((prev) => sortOrderRecords(prev.map((item) => item.orderNo === selectedAccountingRecord.orderNo ? refundOrder : item)));
    setSelectedTreasuryOrderNo(selectedAccountingRecord.orderNo);
    await syncOrderBundleToFirebase(refundOrder, { paymentMode: 'refund' });
    await syncRefundRecordToFirebase(refundOrder);
    setAccountingNotice({ text: `✅ 已送出退款確認：${selectedAccountingRecord.orderNo}，等待出納撥款`, tone: 'success' });
    setTreasuryNotice({ text: `✅ 已接收退款單：${selectedAccountingRecord.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 會計已同步退款：${selectedAccountingRecord.orderNo}`, tone: 'success' });
  }

  const activeLabel = visibleNavItems.find((item) => item.key === active)?.label || '受限模組';

  const notificationItems = useMemo(() => {
    const items: Array<{ id: string; title: string; detail: string; tone: 'danger' | 'warning' | 'neutral' }> = [];

    if (active === 'orders') {
      orderRecords
        .filter((item) => item.paymentStatus === '未收款')
        .slice(0, 6)
        .forEach((item) => {
          items.push({
            id: `payment-${item.orderNo}` ,
            title: `${item.orderNo} 待收款`,
            detail: `${item.customer}｜應收 $${item.amount.toLocaleString()}`,
            tone: 'neutral',
          });
        });
    }

    if (active === 'inventory') {
      orderRecords
        .filter((item) => item.paymentStatus === '已收款' && item.shippingStatus !== '已出貨')
        .slice(0, 6)
        .forEach((item) => {
          items.push({
            id: `shipping-${item.orderNo}` ,
            title: `${item.orderNo} 待出貨`,
            detail: `${item.customer}｜已收款待倉儲處理`,
            tone: 'warning',
          });
        });
      stockSnapshot
        .filter((item) => item.stock <= item.safe)
        .slice(0, 4)
        .forEach((item) => {
          items.push({
            id: `stock-${item.code}`,
            title: `${item.name} 低庫存`,
            detail: `${item.code}｜目前 ${item.stock} / 安全值 ${item.safe}`,
            tone: 'danger',
          });
        });
    }

    if (active === 'accounting') {
      if (accountingTab === 'ops') {
        orderRecords
          .filter((item) => item.paymentStatus === '未收款')
          .slice(0, 6)
          .forEach((item) => {
            items.push({
              id: `accounting-pay-${item.orderNo}`,
              title: `${item.orderNo} 待會計收款`,
              detail: `${item.customer}｜待確認入帳`,
              tone: 'neutral',
            });
          });
        if (bonusLogs.length) {
          items.push({
            id: 'bonus-summary',
            title: '獎金入帳已更新',
            detail: `目前累計 ${bonusLogs.length} 筆 / $${bonusTotal.toLocaleString()}`,
            tone: 'warning',
          });
        }
      }
      if (accountingTab === 'treasury') {
        treasuryQueue
          .filter((item) => item.paymentStatus === '退款處理中')
          .forEach((item) => {
            items.push({
              id: `refund-${item.orderNo}`,
              title: `${item.orderNo} 待出納退款`,
              detail: `${item.customer}｜退款金額 $${(typeof item.actualReceived === 'number' ? item.actualReceived : item.amount).toLocaleString()}`,
              tone: 'danger',
            });
          });
        treasuryQueue
          .filter((item) => item.paymentStatus === '退款處理中' && (!item.proof || item.proof === '待上傳'))
          .forEach((item) => {
            items.push({
              id: `proof-${item.orderNo}`,
              title: `${item.orderNo} 待補退款證明`,
              detail: `${item.customer}｜未上傳退款證明`,
              tone: 'warning',
            });
          });
      }
      if (accountingTab === 'stats' && bonusLogs.length) {
        items.push({
          id: 'stats-bonus',
          title: '營運報表已含獎金入帳',
          detail: `目前獎金合計 $${bonusTotal.toLocaleString()}`,
          tone: 'neutral',
        });
      }
    }

    if (active === 'products') {
      products.filter((item) => !item.enabled).slice(0, 6).forEach((item) => {
        items.push({
          id: `product-${item.id}`,
          title: `${item.name} 尚未啟用`,
          detail: `${item.code}｜可切換啟用狀態`,
          tone: 'warning',
        });
      });
    }

    if (active === 'customers') {
      visibleCustomerRecords.filter((item) => !item.phone || item.phone.trim() === '').slice(0, 6).forEach((item) => {
        items.push({
          id: `customer-${item.id}`,
          title: `${item.name} 待補資料`,
          detail: '缺少聯絡電話',
          tone: 'warning',
        });
      });
    }

    if (active === 'staff') {
      staff.filter((item) => !item.enabled).slice(0, 6).forEach((item) => {
        items.push({
          id: `staff-${item.id}`,
          title: `${item.name} 尚未啟用`,
          detail: `${item.loginId}｜可於人員模組開啟使用權`,
          tone: 'warning',
        });
      });
    }

    return items;
  }, [active, accountingTab, bonusLogs, bonusTotal, orderRecords, products, staff, stockSnapshot, treasuryQueue, visibleCustomerRecords]);

  const notificationCount = notificationItems.length;
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const profilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileMoreSheetRef = useRef<HTMLDivElement | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 900;
  });
  const logoImageInputRef = useRef<HTMLInputElement | null>(null);
  const dashboardAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [shellHint, setShellHint] = useState('');
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  const [showAppLaunch, setShowAppLaunch] = useState(() => {
    if (typeof window === 'undefined') return false;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    return standalone || window.innerWidth <= 900;
  });

  useEffect(() => {
    setLogoImage(localStorage.getItem('vp.logoImage') || '');
    setDashboardAvatarImage(localStorage.getItem('vp.dashboardAvatarImage') || '');
  }, []);

  useEffect(() => {
    try {
      if (logoImage && !logoImage.startsWith('blob:')) localStorage.setItem('vp.logoImage', logoImage);
      else if (!logoImage) localStorage.removeItem('vp.logoImage');
    } catch (error) {
      console.warn('logo image cache skipped', error);
    }
  }, [logoImage]);

  useEffect(() => {
    try {
      if (dashboardAvatarImage && !dashboardAvatarImage.startsWith('blob:')) localStorage.setItem('vp.dashboardAvatarImage', dashboardAvatarImage);
      else if (!dashboardAvatarImage) localStorage.removeItem('vp.dashboardAvatarImage');
    } catch (error) {
      console.warn('avatar image cache skipped', error);
    }
  }, [dashboardAvatarImage]);


  useEffect(() => {
    if (!showAppLaunch) return;
    const timer = window.setTimeout(() => setShowAppLaunch(false), 1400);
    const handlePointer = () => setShowAppLaunch(false);
    const handlePageShow = () => {
      setShowAppLaunch(true);
      window.setTimeout(() => setShowAppLaunch(false), 1400);
    };
    window.addEventListener('pointerdown', handlePointer, { passive: true });
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', handlePointer);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [showAppLaunch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(display-mode: standalone)');
    const updateStandalone = () => setIsStandaloneMode(media.matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));
    const handleOnline = () => {
      setIsOnline(true);
      triggerShellHint('✅ 網路已恢復，PWA 外殼可繼續連線。');
    };
    const handleOffline = () => {
      setIsOnline(false);
      triggerShellHint('⚠️ 目前離線中，仍可保留基本外殼畫面。');
    };
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsStandaloneMode(true);
      triggerShellHint('✅ 已加入主畫面，可用 App 方式開啟。');
    };

    updateStandalone();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    media.addEventListener?.('change', updateStandalone);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      media.removeEventListener?.('change', updateStandalone);
    };
  }, []);

  async function handleInstallApp() {
    if (!installPromptEvent) {
      triggerShellHint(isStandaloneMode ? '✅ 目前已是主畫面模式。' : '目前裝置尚未提供安裝提示，可先用瀏覽器加入主畫面。');
      return;
    }
    try {
      await installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        triggerShellHint('✅ 已送出安裝指令，完成後可從主畫面開啟。');
      } else {
        triggerShellHint('已取消加入主畫面。');
      }
      setInstallPromptEvent(null);
    } catch (error) {
      console.warn('install prompt failed', error);
      triggerShellHint('安裝提示啟動失敗，請改用瀏覽器加入主畫面。');
    }
  }

  function readImageFile(file: File | null, onDone: (value: string) => void) {
    if (!file) return;
    try {
      const previewUrl = URL.createObjectURL(file);
      onDone(previewUrl);
    } catch (error) {
      console.warn('preview url failed', error);
    }
    const reader = new FileReader();
    reader.onload = () => onDone(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  function handleLogoImageUpload(file: File | null) {
    readImageFile(file, setLogoImage);
  }

  function handleDashboardAvatarUpload(file: File | null) {
    readImageFile(file, setDashboardAvatarImage);
  }

  function openProfileCenter(mode: 'profile' | 'password' | 'login') {
    setProfileOpen(false);
    setMobileMoreOpen(false);
    if (!canAccessEvaluation(user)) {
      if (mode === 'password') setShellHint('變更密碼入口已預留，後續可接真實子頁。');
      else if (mode === 'login') setShellHint('登入入口已預留在個人中心卡，可後續接真實登入流程。');
      else setShellHint('目前評鑑專區僅核心人員可進入。');
      return;
    }
    setActive('profile');
    if (mode === 'password') setShellHint('已切到評鑑頁，可接續放入變更密碼子頁。');
    else if (mode === 'login') setShellHint('登入入口已預留在個人中心卡，可後續接真實登入流程。');
  }

  function triggerShellHint(message: string) {
    setShellHint(message);
    if (typeof window !== 'undefined') window.setTimeout(() => setShellHint(''), 2200);
  }

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(target)) {
        setNotificationOpen(false);
      }
      if (profilePanelRef.current && !profilePanelRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (mobileMoreSheetRef.current && !mobileMoreSheetRef.current.contains(target)) {
        const element = target as HTMLElement | null;
        if (!element?.closest('.mobile-nav')) {
          setMobileMoreOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    setMobileMoreOpen(false);
  }, [active]);

  return (
    <div className="vp-shell">
      {showAppLaunch && (
        <div className={`vp-launch-screen ${showAppLaunch ? 'show' : 'hide'}`}>
          <div className="vp-launch-card">
            <div className="vp-launch-mark-wrap">
              <div className="vp-launch-mark">VP</div>
              <span className="vp-launch-ring vp-launch-ring-a" />
              <span className="vp-launch-ring vp-launch-ring-b" />
            </div>
            <div className="vp-launch-kicker">Velvet Pulse</div>
            <div className="vp-launch-title">VP 系統</div>
            <div className="vp-launch-desc">訂購 × 倉儲 × 會計 × 同步中心</div>
          </div>
        </div>
      )}
      <div className="vp-ornament vp-ornament-a" />
      <div className="vp-ornament vp-ornament-b" />

      {!isMobileViewport && (
      <aside className="vp-sidebar">
        <div className="vp-brand-panel card">
          <button type="button" className="vp-brand-mark vp-brand-logo-slot" onClick={() => logoImageInputRef.current?.click()}>
            {logoImage ? <img src={logoImage} alt="品牌 Logo" className="vp-brand-logo-image" /> : <span>LOGO</span>}
          </button>
          <input ref={logoImageInputRef} type="file" accept="image/*" className="hidden-file-input" onChange={(e: ChangeEvent<HTMLInputElement>) => { handleLogoImageUpload(e.target.files?.[0] || null); e.target.value = ''; }} />
          <div>
            <div className="vp-brand-kicker">Velvet Pulse</div>
            <div className="vp-brand-title">VP訂購ERP</div>
            <div className="vp-brand-desc">點擊 Logo 區即可上傳品牌圖。</div>
          </div>
        </div>

        <div className="vp-nav-panel card">
          <div className="vp-panel-label">主選單</div>
          <div className="vp-nav-list">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActive(item.key)}
                  className={`vp-nav-button ${active === item.key ? 'active' : ''}`}
                >
                  <span className="vp-nav-icon-wrap"><Icon className="nav-icon" /></span>
                  <span className="vp-nav-copy">
                    <span className="vp-nav-title">{item.label}</span>
                    <span className="vp-nav-sub">功能入口</span>
                  </span>
                  <ChevronRight className="small-icon vp-nav-arrow" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="vp-sidebar-stack">
          <div className="vp-state-panel card">
            <div className="vp-panel-label">資料來源</div>
            <div className="vp-state-row">
              <div>
                <div className="vp-state-title">{dataMode === 'firebase' ? 'Firebase' : 'Offline Mock'}</div>
                <div className="vp-state-desc">{firebaseReady ? '連線中，可逐步回接資料。' : '目前以白紙版 UI 驗收為主。'}</div>
              </div>
              {firebaseReady ? <Wifi className="status-icon ok" /> : <WifiOff className="status-icon bad" />}
            </div>
          </div>

          <div className="vp-switch-panel card">
            <div className="vp-panel-label">預覽切換</div>
            <div className="vp-clean-toggle-group">
              <div className="clean-toggle-head">角色</div>
              <div className="clean-toggle-grid">
                {(['admin', 'sales', 'accounting', 'warehouse'] as Role[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={`clean-mode-chip ${user.role === role ? 'active' : ''}`}
                    onClick={() => setUserRoleView(role)}
                    aria-pressed={user.role === role}
                  >
                    <span className="clean-mode-dot" />
                    <span>{ROLE_LABEL[role]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="vp-clean-toggle-group">
              <div className="clean-toggle-head">階級</div>
              <div className="clean-toggle-grid clean-toggle-grid-rank">
                {(['core', 'elite', 'senior', 'normal'] as Rank[]).map((rank) => (
                  <button
                    key={rank}
                    type="button"
                    className={`clean-mode-chip rank-${rank} ${user.rankKey === rank ? 'active' : ''}`}
                    onClick={() => setUserRankView(rank)}
                    aria-pressed={user.rankKey === rank}
                  >
                    <span className="clean-mode-dot" />
                    <span>{RANK_DISPLAY[rank]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
      )}

      <main className="vp-main">
        <header className="vp-header card">
          <div className="vp-header-banner">
            <div className="vp-header-visual">
              <span className="vp-visual-orb vp-visual-orb-a" />
              <span className="vp-visual-orb vp-visual-orb-b" />
              <span className="vp-visual-curve vp-visual-curve-a" />
              <span className="vp-visual-curve vp-visual-curve-b" />
            </div>
            <div className="vp-header-branding">
              <div className="vp-header-module-title">{currentModuleLabel} <span className="vp-header-module-slash">/</span> <span className="vp-header-module-en-inline">{currentModuleEnglish}</span></div>
            </div>
          </div>
          <div className="vp-header-tools vp-header-tools-compact">
            <div className="vp-header-global-tools vp-header-global-tools-top">
              {!isStandaloneMode && (
                <div className="vp-header-pwa-strip">
                  <button
                    type="button"
                    className={`vp-pwa-chip ${isOnline ? 'online' : 'offline'}`}
                    onClick={() => triggerShellHint(isOnline ? '目前網路正常，可持續同步 Firebase / GAS 主線。' : '目前偵測為離線，只保留 PWA 基本外殼顯示。')}
                  >
                    {isOnline ? <Wifi className="small-icon" /> : <WifiOff className="small-icon" />}
                    <span>{isOnline ? '連線中' : '離線中'}</span>
                  </button>
                  <button
                    type="button"
                    className="vp-pwa-chip install"
                    onClick={handleInstallApp}
                  >
                    <Plus className="small-icon" />
                    <span>加入主畫面</span>
                  </button>
                </div>
              )}

              <div className="vp-header-action-group vp-header-action-group-bell" ref={notificationPanelRef}>
                <button
                  type="button"
                  className={`vp-icon-only-button vp-bell-button ${notificationOpen ? 'active' : ''}`}
                  onClick={() => {
                    setNotificationOpen((prev) => !prev);
                    setProfileOpen(false);
                    setMobileMoreOpen(false);
                  }}
                  aria-label="提醒"
                >
                  <span className="vp-bell-icon-wrap">
                    <Bell className="small-icon" />
                    {notificationCount > 0 && <span className="vp-bell-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>}
                  </span>
                </button>
                {notificationOpen && (
                  <div className="vp-notification-popover">
                    <div className="vp-notification-head">
                      <div>
                        <div className="vp-notification-title">待辦提醒</div>
                        <div className="vp-notification-sub">未完成事項會自動顯示在這裡</div>
                      </div>
                      <span className="vp-notification-count">{notificationCount}</span>
                    </div>
                    <div className="vp-notification-list">
                      {notificationItems.length ? notificationItems.map((item) => (
                        <div key={item.id} className={`vp-notification-item ${item.tone}`}>
                          <div className="vp-notification-dot" />
                          <div className="vp-notification-copy">
                            <div className="vp-notification-item-title">{item.title}</div>
                            <div className="vp-notification-item-detail">{item.detail}</div>
                          </div>
                        </div>
                      )) : (
                        <div className="vp-notification-empty">目前沒有待處理事項</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="vp-header-action-group vp-header-action-group-profile" ref={profilePanelRef}>
                <button
                  type="button"
                  className={`vp-profile-trigger-circle ${profileOpen ? 'active' : ''}`}
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setNotificationOpen(false);
                    setMobileMoreOpen(false);
                  }}
                  aria-label="個人中心"
                >
                  {dashboardAvatarImage ? <img src={dashboardAvatarImage} alt={user.name} className="vp-profile-trigger-image" /> : <span className="vp-profile-trigger-letter">{getProfileTriggerLabel(user.name)}</span>}
                </button>
                {profileOpen && (
                  <div className="vp-profile-popover">
                    <div className="vp-profile-popover-head">
                      <div className="vp-profile-popover-id-block">
                        <button type="button" className="vp-profile-popover-avatar" onClick={() => dashboardAvatarInputRef.current?.click()}>
                          {dashboardAvatarImage ? <img src={dashboardAvatarImage} alt={user.name} className="vp-profile-popover-avatar-image" /> : getProfileTriggerLabel(user.name)}
                        </button>
                        <div>
                          <div className="vp-profile-popover-name">{user.name}</div>
                          <div className="vp-profile-popover-sub">{ROLE_LABEL[user.role]} · {RANK_DISPLAY[user.rankKey]}</div>
                        </div>
                      </div>
                      <span className={getRankClass(user.rank)}>{RANK_DISPLAY[user.rankKey]}</span>
                    </div>
                    <div className="vp-profile-popover-body">
                      <div className="vp-profile-qr-card">
                        <div className="vp-profile-qr-box"><QrCode className="vp-profile-qr-icon" /></div>
                        <div className="vp-profile-qr-copy">
                          <div className="vp-profile-meta-title">身份 QR</div>
                          <div className="vp-profile-meta-value">{user.loginId}</div>
                        </div>
                      </div>
                      <div className="vp-profile-meta-grid">
                        <div className="vp-profile-meta-item"><span>帳號</span><strong>{user.loginId}</strong></div>
                        <div className="vp-profile-meta-item"><span>階級</span><strong>{RANK_DISPLAY[user.rankKey]}</strong></div>
                        <div className="vp-profile-meta-item"><span>價格身分</span><strong>{getPriceTierLabel(user.rankKey)}</strong></div>
                        <div className="vp-profile-meta-item"><span>榮譽稱號</span><strong>{myEvaluationQuarterResult?.medal || '精進級'}</strong></div>
                      </div>
                      <div className="vp-profile-popover-upload-note">點擊頭像可上傳圖片，未上傳時會自動顯示姓名第 2 個字。</div>
                      <div className="vp-profile-popover-actions">
                        <button type="button" className="vp-profile-popover-btn primary" onClick={() => openProfileCenter('profile')}>個人設定</button>
                        <button type="button" className="vp-profile-popover-btn" onClick={() => openProfileCenter('password')}>變更密碼</button>
                        <button type="button" className="vp-profile-popover-btn" onClick={() => openProfileCenter('login')}>登入</button>
                        <button type="button" className="vp-profile-popover-btn danger" onClick={() => { setProfileOpen(false);
                    setMobileMoreOpen(false); triggerShellHint('已登出（UI 示意），後續可接真實登出流程。'); }}>登出</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {shellHint && <div className="vp-shell-hint">{shellHint}</div>}

        <section className="vp-workspace card">
          {booting ? (
            <div className="card loading-card">
              <div className="spinner" />
              <div className="loading-title">{bootMessage}</div>
              <div className="loading-desc">正在載入系統畫面</div>
            </div>
          ) : (
            <>
              {!canAccessNav(user.role, active) && (
                <div className="card access-denied-card">
                  <div className="access-denied-title">此角色不可進入此頁</div>
                  <div className="access-denied-desc">目前角色是「{ROLE_LABEL[user.role]}」，此頁未開放。</div>
                </div>
              )}

              <div className="vp-module-body">
                {active === 'dashboard' && (
                  <DashboardModule user={user} getRankClass={getRankClass} priceTierLabel={getPriceTierLabel(user.rankKey)} personalOrders={profilePersonalOrders} ownCustomerRecords={visibleCustomerRecords.filter((item) => item.ownerLoginId === user.loginId)} allOrderRecords={orderRecords} workflowCards={workflowCards} WorkflowModule={WorkflowModule} itemCount={itemCount} shippingMethod={shippingMethod} grandTotal={grandTotal} dashboardAvatarImage={dashboardAvatarImage} dashboardAvatarInputRef={dashboardAvatarInputRef} handleDashboardAvatarUpload={handleDashboardAvatarUpload} evaluationQuarter={evaluationQuarter} myEvaluationQuarterResult={myEvaluationQuarterResult} />
                )}
                {active === 'products' && (
                  <ProductsModule products={products} enabledProducts={enabledProducts} productNotice={productNotice} selectedProductId={selectedProductId} filteredProducts={filteredProducts} openCreateProduct={openCreateProduct} openViewProduct={openViewProduct} openEditProduct={openEditProduct} toggleProductEnabled={toggleProductEnabled} productEditorMode={productEditorMode} productDraft={productDraft} setProductDraft={setProductDraft} saveProductDraft={saveProductDraft} selectedProduct={selectedProduct} productCategories={productCategories} handleProductImageUpload={handleProductImageUpload} productImageInputRef={productImageInputRef} SectionIntro={SectionIntro} StatusBadge={StatusBadge} />
                )}
                {active === 'customers' && (
                  <CustomersModule customers={visibleCustomerRecords} vipCustomers={vipCustomers} filteredCustomers={filteredCustomers} SectionIntro={SectionIntro} customerViewMode={customerViewMode} customerScopeLabel={customerScopeLabel} permissionProfile={permissionProfile} user={user} />
                )}
                {active === 'staff' && (
                  <StaffModule staff={staff} activeStaff={activeStaff} filteredStaff={filteredStaff} getRankClass={getRankClass} SectionIntro={SectionIntro} StatusBadge={StatusBadge} selectedStaffId={selectedStaffId} selectedStaff={selectedStaff} staffEditorMode={staffEditorMode} staffDraft={staffDraft} setStaffDraft={setStaffDraft} staffNotice={staffNotice} staffRoles={staffRoles} staffRanks={staffRanks} staffPermissionPreview={staffPermissionPreview} openCreateStaff={openCreateStaff} openEditStaff={openEditStaff} openViewStaff={openViewStaff} updateStaffDraftField={updateStaffDraftField} resetStaffPassword={resetStaffPassword} saveStaffDraft={saveStaffDraft} />
                )}
                {active === 'orders' && (
                  <OrdersModule itemCount={itemCount} shippingMethod={shippingMethod} grandTotal={grandTotal} user={user} priceTierLabel={getPriceTierLabel(user.rankKey)} orderHeroSlides={[{ title: '新品活動', desc: '顯示新品與活動重點。' }, { title: '配送公告', desc: '顯示付款與配送資訊。' }]} orderCategoryChips={orderCategoryChips} orderCategory={orderCategory} setOrderCategory={setOrderCategory} filteredOrderProducts={filteredOrderProducts} addToCart={addToCart} quickCustomerCards={quickCustomerCards} applyQuickCustomer={applyQuickCustomer} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} setShippingMethod={setShippingMethod} getShippingFee={getShippingFee} discountMode={discountMode} setDiscountMode={setDiscountMode} discountValue={discountValue} setDiscountValue={setDiscountValue} remark={remark} setRemark={setRemark} cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} subtotal={subtotal} shippingFee={shippingFee} discountAmount={discountAmount} SectionIntro={SectionIntro} orderRecords={orderRecords} selectedOrderRecord={selectedOrderRecord} selectedOrderNo={selectedOrderNo} selectOrderRecord={selectOrderRecord} createOrderRecord={createOrderRecord} markOrderPaid={markOrderPaid} markOrderShippingReady={markOrderShippingReady} orderNotice={orderNotice} />
                )}
                {active === 'inventory' && (
                  <InventoryModule lowStockCount={lowStockCount} shippingQueue={shippingQueue} filteredWarehouseQueue={filteredWarehouseQueue} warehouseSummary={warehouseSummary} warehouseTab={warehouseTab} setWarehouseTab={setWarehouseTab} selectedWarehouseOrder={selectedWarehouseOrder} selectedWarehouseOrderNo={selectedWarehouseOrderNo} setSelectedWarehouseOrderNo={setSelectedWarehouseOrderNo} warehouseNotice={warehouseNotice} warehouseKeyword={warehouseKeyword} setWarehouseKeyword={setWarehouseKeyword} warehousePaymentFilter={warehousePaymentFilter} setWarehousePaymentFilter={setWarehousePaymentFilter} warehouseShippingFilter={warehouseShippingFilter} setWarehouseShippingFilter={setWarehouseShippingFilter} warehouseDateStart={warehouseDateStart} setWarehouseDateStart={setWarehouseDateStart} warehouseDateEnd={warehouseDateEnd} setWarehouseDateEnd={setWarehouseDateEnd} shippingChecklist={shippingChecklist} warehouseSopPoints={warehouseSopPoints} warehouseReminderItems={warehouseReminderItems} handleWarehouseShip={handleWarehouseShip} handleWarehouseReturn={handleWarehouseReturn} handleWarehouseExchange={handleWarehouseExchange} handleWarehouseInbound={handleWarehouseInbound} warehouseInboundQty={warehouseInboundQty} setWarehouseInboundQty={setWarehouseInboundQty} warehouseInboundQr={warehouseInboundQr} setWarehouseInboundQr={setWarehouseInboundQr} warehouseScanBarcode={warehouseScanBarcode} setWarehouseScanBarcode={setWarehouseScanBarcode} warehouseScanQr={warehouseScanQr} setWarehouseScanQr={setWarehouseScanQr} warehouseExpectedScan={warehouseExpectedScan} warehouseScanValidation={warehouseScanValidation} handleWarehousePrint={handleWarehousePrint} inventoryFlow={inventoryFlow} stockSnapshot={stockSnapshot} selectedStockCode={selectedStockCode} setSelectedStockCode={setSelectedStockCode} selectedStockItem={selectedStockItem} queryExamples={queryExamples} warehouseQueryMode={warehouseQueryMode} setWarehouseQueryMode={setWarehouseQueryMode} warehouseQueryInput={warehouseQueryInput} setWarehouseQueryInput={setWarehouseQueryInput} runWarehouseQuery={runWarehouseQuery} handleWarehouseScanFill={handleWarehouseScanFill} warehouseQueryResult={warehouseQueryResult} warehouseRecentLogs={warehouseRecentLogs} SectionIntro={SectionIntro} SummaryCard={SummaryCard} warehouseShipValidation={warehouseShipValidation} />
                )}
                {active === 'accounting' && (
                  
<AccountingModule
                    paymentQueue={paymentQueue}
                    accountingSummary={accountingSummary}
                    accountingTab={accountingTab}
                    setAccountingTab={setAccountingTab}
                    filteredAccountingQueue={filteredAccountingQueue}
                    accountingOpsTotal={accountingOpsTotal}
                    accountingKeyword={accountingKeyword}
                    setAccountingKeyword={setAccountingKeyword}
                    accountingPaymentFilter={accountingPaymentFilter}
                    setAccountingPaymentFilter={setAccountingPaymentFilter}
                    accountingShippingFilter={accountingShippingFilter}
                    setAccountingShippingFilter={setAccountingShippingFilter}
                    accountingDateStart={accountingDateStart}
                    setAccountingDateStart={setAccountingDateStart}
                    accountingDateEnd={accountingDateEnd}
                    setAccountingDateEnd={setAccountingDateEnd}
                    accountingNotice={accountingNotice}
                    selectedAccountingRecord={selectedAccountingRecord}
                    selectedAccountingSourceRecord={selectedAccountingSourceRecord}
                    accountingDraft={accountingDraft}
                    accountingTaxAmount={accountingTaxAmount}
                    accountingActualReceived={accountingActualReceived}
                    updateAccountingDraftField={updateAccountingDraftField}
                    saveAccountingDraft={saveAccountingDraft}
                    triggerAccountingAction={triggerAccountingAction}
                    selectAccountingOrder={selectAccountingOrder}
                    handleAccountingProofUpload={handleAccountingProofUpload}
                    accountingProofInputRef={accountingProofInputRef}
                    treasuryQueue={treasuryQueue}
                    treasurySummary={treasurySummary}
                    treasuryReminders={treasuryReminders}
                    selectedTreasuryRecord={selectedTreasuryRecord}
                    treasuryDraft={treasuryDraft}
                    treasuryNotice={treasuryNotice}
                    selectTreasuryOrder={selectTreasuryOrder}
                    updateTreasuryDraftField={updateTreasuryDraftField}
                    confirmTreasuryRefund={confirmTreasuryRefund}
                    handleTreasuryProofUpload={handleTreasuryProofUpload}
                    treasuryProofInputRef={treasuryProofInputRef}
                    treasuryExpenseDraft={treasuryExpenseDraft}
                    updateTreasuryExpenseField={updateTreasuryExpenseField}
                    saveTreasuryExpense={saveTreasuryExpense}
                    treasuryExpenseLogs={treasuryExpenseLogs}
                    treasuryExpenseCategories={treasuryExpenseCategories}
                    handleTreasuryExpenseProofUpload={handleTreasuryExpenseProofUpload}
                    treasuryExpenseProofInputRef={treasuryExpenseProofInputRef}
                    bonusDraft={bonusDraft}
                    updateBonusDraftField={updateBonusDraftField}
                    saveBonusEntry={saveBonusEntry}
                    bonusLogs={bonusLogs}
                    bonusTotal={bonusTotal}
                    user={user}
                    accountingBoards={accountingBoardsView}
                    accountingTrendBars={accountingTrendBarsView}
                    salesRanking={salesRanking}
                    hotProductsBoard={hotProductsBoard}
                    SectionIntro={SectionIntro}
                    SummaryCard={SummaryCard}
                    evaluationQuarter={evaluationQuarter} setEvaluationQuarter={setEvaluationQuarter} evaluationSummary={evaluationSummaryForAccounting}
                  />
                )}
                {active === 'profile' && (
                  <ProfileModule personalOrders={profilePersonalOrders} user={user} getRankClass={getRankClass} keyword={keyword} setKeyword={setKeyword} priceTierLabel={getPriceTierLabel(user.rankKey)} ownCustomerRecords={visibleCustomerRecords.filter((item) => item.ownerLoginId === user.loginId)} allOrderRecords={orderRecords} evaluationQuarter={evaluationQuarter} setEvaluationQuarter={setEvaluationQuarter} evaluationTargets={evaluationTargets} evaluationSubmissions={evaluationSubmissionsForProfile} evaluationNotice={evaluationNotice} submitEvaluation={submitEvaluation} dashboardRadarMetrics={dashboardRadarMetrics} myEvaluationQuarterResult={myEvaluationQuarterResult} evaluationResults={evaluationResults} />
                )}
              </div>
            </>
          )}
        </section>

        <div className="mobile-nav">
          {mobilePrimaryNavItems.filter((item) => item.key === 'more' || (canAccessNav(user.role, item.key as NavKey) && (item.key !== 'profile' || canAccessEvaluation(user)))).map((item) => {
            const Icon = item.icon;
            const isActive = item.key === 'more' ? mobileMoreOpen : (!mobileMoreOpen && active === item.key);
            return (
              <button
                key={item.key}
                type="button"
                className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.key === 'more') {
                    setMobileMoreOpen((prev) => !prev);
                    setNotificationOpen(false);
                    setProfileOpen(false);
                  } else {
                    setActive(item.key as NavKey);
                    setMobileMoreOpen(false);
                  }
                }}
              >
                <Icon className="small-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {mobileMoreOpen && (
          <>
            <button type="button" className="mobile-more-overlay" aria-label="關閉更多選單" onClick={() => setMobileMoreOpen(false)} />
            <div ref={mobileMoreSheetRef} className="mobile-more-sheet card">
              <div className="mobile-more-head">
                <div>
                  <div className="mobile-more-title">更多</div>
                  <div className="mobile-more-sub">常用延伸功能與系統管理入口</div>
                </div>
                <button type="button" className="drawer-close-button" onClick={() => setMobileMoreOpen(false)}>關閉</button>
              </div>

              <div className="mobile-more-section">
                <div className="mobile-more-section-title">常用功能</div>
                <div className="mobile-more-grid">
                  {mobileMoreCommonItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={`mobile-more-btn ${active === item.key ? 'active' : ''}`}
                        onClick={() => {
                          setActive(item.key);
                          setMobileMoreOpen(false);
                        }}
                      >
                        <Icon className="small-icon" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {mobileManagementItems.length > 0 && (
                <div className="mobile-more-section">
                  <div className="mobile-more-section-title">系統管理</div>
                  <div className="mobile-more-grid">
                    {mobileManagementItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className={`mobile-more-btn admin ${active === item.key ? 'active' : ''}`}
                          onClick={() => {
                            setActive(item.key);
                            setMobileMoreOpen(false);
                          }}
                        >
                          <Icon className="small-icon" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
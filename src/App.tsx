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
type Rank = 'core' | 'elite' | 'senior' | 'normal';
type NavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'products' | 'customers' | 'staff' | 'profile';

type Product = { id: string; code: string; barcode?: string; name: string; category: string; price: number; enabled: boolean; stock: number; image?: string; vipPrice?: number; agentPrice?: number; generalAgentPrice?: number };
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
  barcode: string;
  name: string;
  category: string;
  price: string;
  stock: string;
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
  barcode?: string;
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

function getCurrentInventoryQty(logs: InventoryLog[], code: string) {
  return findAvailableQrBuckets(logs, code).reduce((sum, item) => sum + item.qty, 0);
}

function getDefaultInventoryQr(product: { code: string; barcode?: string }) {
  const seeded = INITIAL_QR_SEED[product.code]?.[0]?.qr;
  if (seeded) return seeded;
  const base = (product.barcode || product.code || 'NEW').trim();
  return `QR(${base})`;
}

function deriveInventoryAdjustmentLogs(params: {
  logs: InventoryLog[];
  previousProduct?: Product | null;
  nextProduct: Product;
  operator: string;
}) {
  const { logs, previousProduct, nextProduct, operator } = params;
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  const targetCode = nextProduct.code.trim();
  const previousCode = previousProduct?.code?.trim() || targetCode;
  const currentQty = getCurrentInventoryQty(logs, previousCode);
  const targetQty = Math.max(0, Number(nextProduct.stock || 0));
  const diff = targetQty - currentQty;

  const syncedLogs = logs.map((item) => {
    if (!previousProduct || item.code !== previousCode) return item;
    return {
      ...item,
      code: targetCode,
      name: nextProduct.name,
      note: item.note
        .split(previousProduct.code).join(nextProduct.code)
        .split(previousProduct.name).join(nextProduct.name),
    };
  });

  if (diff === 0) return syncedLogs;

  const qr = getDefaultInventoryQr(nextProduct);
  const adjustment: InventoryLog = {
    id: `inventory-sync-${targetCode}-${Date.now()}`,
    createdAt: timestamp,
    type: diff > 0 ? '入庫' : '出庫',
    code: targetCode,
    name: nextProduct.name,
    qty: Math.abs(diff),
    qr,
    operator,
    note: diff > 0
      ? `${targetCode} 商品建檔/編輯同步入庫 ${Math.abs(diff)} 件（${qr}）`
      : `${targetCode} 商品編輯同步扣減 ${Math.abs(diff)} 件（${qr}）`,
  };
  return [...syncedLogs, adjustment];
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
        barcode: product.barcode || product.code,
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

const mockProducts: Product[] = [
  { id: '1', code: 'E401', barcode: '4710000004011', name: '女神酵素液', category: '保健', price: 899, vipPrice: 899, agentPrice: 799, generalAgentPrice: 699, enabled: true, stock: 36 },
  { id: '2', code: 'E402', barcode: '4710000004028', name: '美妍X關鍵賦活飲', category: '保健', price: 1380, vipPrice: 1380, agentPrice: 1230, generalAgentPrice: 1120, enabled: true, stock: 18 },
  { id: '3', code: 'P301', barcode: '4710000003014', name: '瞬白激光精華4G', category: '保養', price: 1680, vipPrice: 1680, agentPrice: 1490, generalAgentPrice: 1350, enabled: true, stock: 9 },
  { id: '4', code: 'P304', barcode: '4710000003045', name: '奇肌修復全能霜', category: '保養', price: 1980, vipPrice: 1980, agentPrice: 1750, generalAgentPrice: 1590, enabled: false, stock: 0 },
  { id: '5', code: 'P305', barcode: '4710000003052', name: '超逆齡修復菁萃', category: '保養', price: 2280, vipPrice: 2280, agentPrice: 2050, generalAgentPrice: 1860, enabled: true, stock: 14 },
  { id: '6', code: 'E408', barcode: '4710000004080', name: '魔力抹茶機能飲', category: '保健', price: 1380, vipPrice: 1380, agentPrice: 1230, generalAgentPrice: 1120, enabled: true, stock: 22 },
];

const mockCustomers: Customer[] = [
  { id: 'c1', name: '王小美', phone: '0912345678', level: 'VIP', ownerLoginId: 'vp001', ownerName: '吳秉宸' },
  { id: 'c2', name: '林雅雯', phone: '0988777666', level: '一般', ownerLoginId: 'vp002', ownerName: '王小婷' },
  { id: 'c3', name: '陳佳玲', phone: '0933555777', level: '代理', ownerLoginId: 'vp001', ownerName: '吳秉宸' },
];

const mockStaff: Staff[] = [
  { id: 's1', name: '吳秉宸', loginId: 'vp001', role: '系統組', rank: '核心人員', enabled: true, password: 'vp001', permissions: ['全模組管理', '價格調整', '退款審核', '庫存覆核'] },
  { id: 's2', name: '王小婷', loginId: 'vp002', role: '銷售組', rank: '普通銷售', enabled: true, password: 'vp002', permissions: ['訂購操作', '個人客戶查看'] },
  { id: 's3', name: '陳小安', loginId: 'vp003', role: '行政組', rank: '高級銷售', enabled: true, password: 'vp003', permissions: ['收退款作業', '會計資料查看'] },
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

const initialInventoryLogs = buildInitialInventoryLogs(mockProducts);


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
    title: '會計中心',
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
    title: '個人資料',
    desc: '個人資料、訂單與業績。',
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

function getDb() {
  if (!hasFirebaseConfig()) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

function normalizeProduct(id: string, data: any): Product {
  return {
    id,
    code: data.code || data.productCode || data.productId || '-',
    barcode: data.barcode || data.productBarcode || data.sku || '',
    name: data.name || data.productName || '未命名商品',
    category: data.category || data.productCategory || '未分類',
    price: Number(data.price || data.vipPrice || data.salePrice || 0),
    vipPrice: Number(data.vipPrice || data.price || data.salePrice || 0),
    agentPrice: Number(data.agentPrice || data.dealerPrice || data.vipPrice || data.price || 0),
    generalAgentPrice: Number(data.generalAgentPrice || data.masterPrice || data.agentPrice || data.dealerPrice || data.vipPrice || data.price || 0),
    image: data.image || data.imageUrl || data.photo || '',
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

function makeEmptyProductDraft(nextCode = ''): ProductDraft {
  return { id: '', code: nextCode, barcode: '', name: '', category: '保健', price: '', stock: '', enabled: true };
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
    paymentMethod: record.paymentMethod || (record.paymentStatus === '已收款' ? '銀行轉帳' : '待確認'),
    invoiceNo: record.invoiceNo || (record.paymentStatus.includes('退款') ? '退款單' : '待補'),
    proof: record.proof || (record.paymentStatus === '已收款' ? '已上傳' : record.paymentStatus.includes('退款') ? '退款流程中' : '待上傳'),
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
    stock: String(item.stock),
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

function SectionIntro(_: { title: string; desc: string; stats?: string[] }) {
  return null;
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
  const [selectedWarehouseOrderNo, setSelectedWarehouseOrderNo] = useState(initialOrderRecords[0]?.orderNo ?? '');
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
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(initialInventoryLogs);
  const [warehouseInboundQty, setWarehouseInboundQty] = useState(1);
  const [warehouseInboundQr, setWarehouseInboundQr] = useState('');
  const [warehouseScanBarcode, setWarehouseScanBarcode] = useState('');
  const [warehouseScanQr, setWarehouseScanQr] = useState('');
  const [selectedStockCode, setSelectedStockCode] = useState(mockProducts[0]?.code ?? '');
  const [accountingTab, setAccountingTab] = useState<AccountingTab>('ops');
  const [accountingKeyword, setAccountingKeyword] = useState('');
  const [accountingPaymentFilter, setAccountingPaymentFilter] = useState('全部');
  const [accountingShippingFilter, setAccountingShippingFilter] = useState('全部');
  const [accountingDateStart, setAccountingDateStart] = useState('2026-03-01');
  const [accountingDateEnd, setAccountingDateEnd] = useState(getTodayDateInputValue());
  const [selectedAccountingOrderNo, setSelectedAccountingOrderNo] = useState(initialOrderRecords[0]?.orderNo ?? '');
  const [accountingDraft, setAccountingDraft] = useState<AccountingDraft>(() => makeAccountingDraft(initialOrderRecords[0] || null));
  const [accountingNotice, setAccountingNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 會計頁已重補，可直接切換訂單與操作提示',
    tone: 'success',
  });
  const [orderCategory, setOrderCategory] = useState('全部商品');
  const orderCategoryChips = useMemo(() => ['全部商品', ...Array.from(new Set(products.map((item) => (item.category || '').trim()).filter(Boolean)))], [products]);

  const [productEditorMode, setProductEditorMode] = useState<ProductEditorMode>('view');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [productDraft, setProductDraft] = useState<ProductDraft>(() => makeEmptyProductDraft(mockProducts[0]?.code ?? ''));
  const [productNotice, setProductNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [staffEditorMode, setStaffEditorMode] = useState<StaffEditorMode>('view');
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id ?? '');
  const [staffDraft, setStaffDraft] = useState<StaffDraft>(() => toStaffDraft(mockStaff[0]));
  const [staffNotice, setStaffNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>(null);
  const [orderRecords, setOrderRecords] = useState<OrderRecord[]>(initialOrderRecords);
  const [selectedOrderNo, setSelectedOrderNo] = useState(initialOrderRecords[0]?.orderNo ?? '');
  const [orderNotice, setOrderNotice] = useState<{ text: string; tone: 'success' | 'danger' | 'neutral' } | null>({
    text: '✅ 訂單已建立',
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
      .map((item) => ({ ...item, price: getTierPrice(item, user.rankKey) }));
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
      { title: '本月毛利', value: `$${gross.toLocaleString()}`, sub: '依目前 UI 假資料估算' },
    ];
  }, [paymentQueue]);

  const filteredWarehouseQueue = useMemo(() => {
    const q = warehouseKeyword.trim().toLowerCase();
    return shippingQueue.filter((item) => {
      const matchKeyword = !q || [item.orderNo, item.customer, item.paymentStatus, item.shippingStatus, item.mainStatus].join(' ').toLowerCase().includes(q);
      const matchPayment = warehousePaymentFilter === '全部' || item.paymentStatus === warehousePaymentFilter;
      const matchShipping = warehouseShippingFilter === '全部' || item.shippingStatus === warehouseShippingFilter;
      const itemDateKey = item.date.split(' ')[0].replace(/\//g, '-');
      const matchDateStart = !warehouseDateStart || itemDateKey >= warehouseDateStart;
      const matchDateEnd = !warehouseDateEnd || itemDateKey <= warehouseDateEnd;
      return matchKeyword && matchPayment && matchShipping && matchDateStart && matchDateEnd;
    });
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

  useEffect(() => {
    if (!stockSnapshot.length) return;
    if (!stockSnapshot.some((item) => item.code === selectedStockCode)) {
      setSelectedStockCode(stockSnapshot[0].code);
    }
  }, [stockSnapshot, selectedStockCode]);

  const runWarehouseQuery = (input = warehouseQueryInput, mode = warehouseQueryMode) => {
    const value = input.trim();
    if (!value) {
      setWarehouseNotice({ text: '❌ 請先輸入查詢條件', tone: 'danger' });
      return;
    }

    const normalized = value.toUpperCase();

    if (mode === 'barcode') {
      const matched = stockSnapshot.find((item) => (item.barcode || item.code).toUpperCase().includes(normalized) || item.code.toUpperCase().includes(normalized) || item.name.includes(value));
      if (!matched) {
        setWarehouseQueryResult([{ title: '查無商品條碼', desc: `找不到 ${value} 的商品資料`, meta: ['請改掃 QR 或訂單編號'] }]);
        setWarehouseNotice({ text: '❌ 商品條碼查無資料', tone: 'danger' });
        return;
      }
      setSelectedStockCode(matched.code);
      setWarehouseQueryResult([{
        title: matched.name,
        desc: `商品條碼 ${matched.barcode || matched.code} / 目前庫存 ${matched.stock} / 安全庫存 ${matched.safe}`,
        meta: [`商品編號：${matched.code}`, matched.qr, matched.updated, `狀態：${matched.status}`],
      }]);
      setWarehouseNotice({ text: `✅ 已查到 ${matched.code}`, tone: 'success' });
      return;
    }

    if (mode === 'qr') {
      const matchedLogs = inventoryLogs.filter((item) => item.qr.toUpperCase().includes(normalized));
      if (!matchedLogs.length) {
        setWarehouseQueryResult([{ title: '查無 QR 身分識別', desc: `找不到 ${value} 的 QR 記錄`, meta: ['請確認是否已入庫'] }]);
        setWarehouseNotice({ text: '❌ QR 身分識別查無資料', tone: 'danger' });
        return;
      }
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

    const matchedOrder = orderRecords.find((item) => item.orderNo.toUpperCase().includes(normalized));
    if (!matchedOrder) {
      setWarehouseQueryResult([{ title: '查無訂單', desc: `找不到 ${value} 的出貨資料`, meta: ['請確認訂單編號格式'] }]);
      setWarehouseNotice({ text: '❌ 訂單查無資料', tone: 'danger' });
      return;
    }
    setSelectedWarehouseOrderNo(matchedOrder.orderNo);
    setWarehouseQueryResult([{
      title: matchedOrder.orderNo,
      desc: `${matchedOrder.customer} / ${matchedOrder.shippingStatus} / ${matchedOrder.shippingMethod}`,
      meta: [`${matchedOrder.paymentStatus}`, `出貨內容：${matchedOrder.items.map((entry) => `${entry.code}*${entry.qty}`).join(' / ')}`, `地址：${matchedOrder.address}`],
    }]);
    setWarehouseNotice({ text: `✅ 已切到 ${matchedOrder.orderNo}`, tone: 'success' });
  };

  const handleWarehouseShip = () => {
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
    const timestamp = '2026-04-01 ' + new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

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
          id: `out-${order.orderNo}-${entry.code}-${bucket.qr}-${remaining}`,
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

    setInventoryLogs((prev) => [...prev, ...allocations]);
    setOrderRecords((prev) => prev.map((item) => item.orderNo === order.orderNo ? {
      ...item,
      shippingStatus: '已出貨',
      mainStatus: '已完成',
    } : item));
    setWarehouseNotice({ text: `✅ 已依 inventory_logs 完成出貨：${order.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 訂單已同步出貨：${order.orderNo}`, tone: 'success' });
    setWarehouseQueryResult([{ title: order.orderNo, desc: `${order.customer} / 已出貨 / ${order.shippingMethod}`, meta: ['已寫入 inventory_logs', `出貨筆數：${allocations.length}`, `商品：${order.items.map((item) => `${item.code}*${item.qty}`).join(' / ')}`] }]);
    setWarehouseScanBarcode('');
    setWarehouseScanQr('');
  };


  const handleWarehouseReturn = () => {
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
    const timestamp = '2026-04-01 ' + new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const inboundLogs: InventoryLog[] = order.items.map((entry, index) => ({
      id: `return-${order.orderNo}-${entry.code}-${index + 1}-${Date.now()}`,
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
    setInventoryLogs((prev) => [...prev, ...inboundLogs]);
    setOrderRecords((prev) => prev.map((item) => item.orderNo === order.orderNo ? {
      ...item,
      shippingStatus: '已退貨',
      mainStatus: '退貨處理',
      paymentStatus: item.paymentStatus === '已收款' ? '退款處理中' : item.paymentStatus,
    } : item));
    setWarehouseNotice({ text: `✅ 已完成退貨回補：${order.orderNo}`, tone: 'success' });
    setAccountingNotice({ text: `✅ 倉儲已送回退貨狀態：${order.orderNo}`, tone: 'success' });
  };

  const handleWarehouseExchange = () => {
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
    setOrderRecords((prev) => prev.map((item) => item.orderNo === order.orderNo ? {
      ...item,
      shippingStatus: '換貨待出庫',
      mainStatus: '換貨處理',
    } : item));
    setSelectedWarehouseOrderNo(order.orderNo);
    setWarehouseNotice({ text: `✅ 已切入換貨流程：${order.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 倉儲已標記換貨待出庫：${order.orderNo}`, tone: 'success' });
  };

  const handleWarehouseInbound = () => {
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

    const timestamp = '2026-04-01 ' + new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const cleanQr = warehouseInboundQr.trim().toUpperCase();
    const newLog: InventoryLog = {
      id: `in-${selectedStockItem.code}-${Date.now()}`,
      createdAt: timestamp,
      type: '入庫',
      code: selectedStockItem.code,
      name: selectedStockItem.name,
      qty: warehouseInboundQty,
      qr: cleanQr,
      operator: user.loginId,
      note: `${selectedStockItem.code} ${selectedStockItem.name} 入庫 ${warehouseInboundQty} 件（${cleanQr}）`,
    };

    setInventoryLogs((prev) => [...prev, newLog]);
    setWarehouseNotice({ text: `✅ 已寫入入庫紀錄：${selectedStockItem.code} +${warehouseInboundQty}`, tone: 'success' });
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
    return paymentQueue.filter((item) => {
      const matchKeyword = !q || [item.orderNo, item.customer, item.paymentStatus, item.shippingStatus, item.paymentMethod, item.invoiceNo].join(' ').toLowerCase().includes(q);
      const matchPayment = accountingPaymentFilter === '全部' || item.paymentStatus === accountingPaymentFilter;
      const matchShipping = accountingShippingFilter === '全部' || item.shippingStatus === accountingShippingFilter;
      const itemDateKey = item.date.replace(/\//g, '-');
      const matchDateStart = !accountingDateStart || itemDateKey >= accountingDateStart;
      const matchDateEnd = !accountingDateEnd || itemDateKey <= accountingDateEnd;
      return matchKeyword && matchPayment && matchShipping && matchDateStart && matchDateEnd;
    });
  }, [accountingKeyword, accountingPaymentFilter, accountingShippingFilter, accountingDateStart, accountingDateEnd]);

  useEffect(() => {
    if (!filteredAccountingQueue.length) return;
    if (!filteredAccountingQueue.some((item) => item.orderNo === selectedAccountingOrderNo)) {
      setSelectedAccountingOrderNo(filteredAccountingQueue[0].orderNo);
    }
  }, [filteredAccountingQueue, selectedAccountingOrderNo]);

  const selectedAccountingRecord = useMemo(
    () => filteredAccountingQueue.find((item) => item.orderNo === selectedAccountingOrderNo) || filteredAccountingQueue[0] || paymentQueue[0],
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

  const accountingOpsTotal = filteredAccountingQueue.reduce((sum, item) => sum + item.amount, 0);

  const shippingFee = getShippingFee(shippingMethod);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const discountAmount = discountMode === '固定金額' ? discountValue : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const lowStockCount = stockSnapshot.filter((p) => p.stock <= p.safe).length;
  const enabledProducts = products.filter((p) => p.enabled).length;
  const vipCustomers = visibleCustomerRecords.filter((c) => ['VIP', '代理'].some((tag) => c.level.includes(tag))).length;
  const activeStaff = staff.filter((s) => s.enabled).length;

  const visibleNavItems = useMemo(() => navItems.filter((item) => canAccessNav(user.role, item.key)), [user.role]);
  const customerViewMode = permissionProfile.canViewCustomerSensitiveFields ? 'full' : 'limited';
  const customerScopeLabel = permissionProfile.canViewAllCustomers
    ? '全部客戶完整資料'
    : permissionProfile.canViewAssignedOrderCustomers
      ? '僅訂單必要客戶資訊'
      : permissionProfile.canViewOwnCustomers
        ? '僅自己推銷客戶'
        : '無客戶權限';

  useEffect(() => {
    if (!canAccessNav(user.role, active)) {
      setActive(ROLE_NAV_ACCESS[user.role][0]);
    }
  }, [user.role, active]);

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
        barcode: productDraft.barcode.trim(),
        name: productDraft.name.trim(),
        category: productDraft.category.trim(),
        price,
        stock,
        enabled: productDraft.enabled,
      };
      setProducts((prev) => [nextProduct, ...prev]);
      setInventoryLogs((prev) => deriveInventoryAdjustmentLogs({
        logs: prev,
        previousProduct: null,
        nextProduct,
        operator: user.loginId,
      }));
      setSelectedProductId(nextProduct.id);
      setSelectedStockCode(nextProduct.code);
      setProductDraft(toProductDraft(nextProduct));
      setProductEditorMode('edit');
      setProductNotice({ text: '✅ 已新增，並完成庫存初始化', tone: 'success' });
      return;
    }

    if (!productDraft.id) {
      setProductNotice({ text: '❌ 未選商品', tone: 'danger' });
      return;
    }

    const previousProduct = products.find((item) => item.id === productDraft.id) || null;
    const nextProduct: Product = {
      id: productDraft.id,
      code: productDraft.code.trim(),
      barcode: productDraft.barcode.trim(),
      name: productDraft.name.trim(),
      category: productDraft.category.trim(),
      price,
      stock,
      enabled: productDraft.enabled,
      image: previousProduct?.image || '',
      vipPrice: previousProduct?.vipPrice,
      agentPrice: previousProduct?.agentPrice,
      generalAgentPrice: previousProduct?.generalAgentPrice,
    };

    setProducts((prev) => prev.map((item) => item.id === productDraft.id ? {
      ...item,
      code: nextProduct.code,
      barcode: nextProduct.barcode,
      name: nextProduct.name,
      category: nextProduct.category,
      price: nextProduct.price,
      stock: nextProduct.stock,
      enabled: nextProduct.enabled,
    } : item));
    setInventoryLogs((prev) => deriveInventoryAdjustmentLogs({
      logs: prev,
      previousProduct,
      nextProduct,
      operator: user.loginId,
    }));
    setSelectedStockCode(nextProduct.code);
    setProductDraft(toProductDraft(nextProduct));
    setProductEditorMode('edit');
    setProductNotice({ text: '✅ 已更新，並同步庫存資料', tone: 'success' });
  }

  function toggleProductEnabled(item: Product) {
    const nextEnabled = !item.enabled;
    setProducts((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, enabled: nextEnabled } : entry));
    setSelectedProductId(item.id);
    setProductDraft((prev) => prev.id === item.id ? { ...prev, enabled: nextEnabled } : prev);
    setProductNotice({ text: nextEnabled ? '✅ 已啟用' : '❌ 已停用', tone: nextEnabled ? 'success' : 'danger' });
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
    setStaffDraft((prev) => ({ ...prev, password: prev.loginId.trim() || '' }));
    setStaffNotice({ text: '✅ 已初始化密碼', tone: 'success' });
  }

  function saveStaffDraft() {
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
      const nextStaff = { id: `staff-${Date.now()}`, ...nextPayload };
      setStaff((prev) => [nextStaff, ...prev]);
      setSelectedStaffId(nextStaff.id);
      setStaffEditorMode('edit');
      setStaffDraft(toStaffDraft(nextStaff));
      setStaffNotice({ text: '✅ 已新增', tone: 'success' });
      return;
    }
    if (!staffDraft.id) {
      setStaffNotice({ text: '❌ 未選人員', tone: 'danger' });
      return;
    }
    setStaff((prev) => prev.map((item) => item.id === staffDraft.id ? { ...item, ...nextPayload } : item));
    setStaffEditorMode('edit');
    setStaffNotice({ text: '✅ 已更新', tone: 'success' });
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
    setOrderRecords((prev) => [nextRecord, ...prev]);
    setSelectedOrderNo(orderNo);
    setSelectedAccountingOrderNo(orderNo);
    setAccountingDraft(makeAccountingDraft(nextRecord));
    setAccountingDateEnd(getTodayDateInputValue());
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
    setAccountingNotice({ text: `✅ Orders 已同步收款：${orderNo}`, tone: 'success' });
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

  function saveAccountingDraft() {
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

    setOrderRecords((prev) => prev.map((item) => item.orderNo === accountingDraft.orderNo ? {
      ...item,
      customer: accountingDraft.customer.trim() || item.customer,
      amount: actualReceived,
      taxRate,
      shippingFeeOverride: shippingFee,
      actualReceived,
      paymentMethod: accountingDraft.paymentMethod.trim() || '待確認',
      invoiceNo: accountingDraft.invoiceNo.trim() || '待補',
      proof: accountingDraft.proof.trim() || '待上傳',
    } : item));
    setAccountingDraft((prev) => ({ ...prev, actualReceived: String(actualReceived) }));
    setAccountingNotice({ text: `✅ 已更新本次訂單：${accountingDraft.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 會計欄位已回寫：${accountingDraft.orderNo}`, tone: 'success' });
    return true;
  }

  function selectAccountingOrder(orderNo: string) {
    setSelectedAccountingOrderNo(orderNo);
    setAccountingNotice({ text: `✅ 已切換 ${orderNo}`, tone: 'neutral' });
  }

  function triggerAccountingAction(action: 'pay' | 'refund') {
    if (!selectedAccountingRecord) return;
    if (!saveAccountingDraft()) return;
    if (action === 'pay') {
      if (selectedAccountingRecord.paymentStatus === '已收款') {
        setAccountingNotice({ text: '❌ 此訂單已收款', tone: 'danger' });
        return;
      }
      if (selectedAccountingRecord.paymentStatus.includes('退款')) {
        setAccountingNotice({ text: '❌ 此訂單處於退款流程，請先確認退款結果', tone: 'danger' });
        return;
      }
      setOrderRecords((prev) => prev.map((item) => item.orderNo === selectedAccountingRecord.orderNo ? { ...item, paymentStatus: '已收款', mainStatus: item.shippingStatus === '待出貨' ? '待出貨' : item.mainStatus } : item));
      setAccountingNotice({ text: `✅ 已收款：${selectedAccountingRecord.orderNo}，倉儲端將依狀態判定可出貨`, tone: 'success' });
      setWarehouseNotice({ text: `✅ 收款狀態已更新：${selectedAccountingRecord.orderNo}`, tone: 'success' });
      setOrderNotice({ text: `✅ 會計已同步收款：${selectedAccountingRecord.orderNo}`, tone: 'success' });
      return;
    }

    if (selectedAccountingRecord.paymentStatus.includes('退款')) {
      setAccountingNotice({ text: '❌ 此訂單已進入退款流程', tone: 'danger' });
      return;
    }
    setOrderRecords((prev) => prev.map((item) => item.orderNo === selectedAccountingRecord.orderNo ? { ...item, paymentStatus: '退款處理中', shippingStatus: item.shippingStatus === '已出貨' ? item.shippingStatus : '已退款', mainStatus: '退款處理' } : item));
    setAccountingNotice({ text: `✅ 已送出退款確認：${selectedAccountingRecord.orderNo}`, tone: 'success' });
    setOrderNotice({ text: `✅ 會計已同步退款：${selectedAccountingRecord.orderNo}`, tone: 'success' });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand card">
          <div className="brand-kicker">VP SYSTEM</div>
          <div className="brand-title">VP UI</div>
          <div className="brand-subtitle">營運後台</div>
        </div>

        <div className="card user-card">
          <div className="muted-label">登入帳號</div>
          <div className="user-name">{user.name}</div>
          <div className="user-id">ID：{user.loginId}</div>
          <div className="badge-row">
            <span className="badge badge-role">角色 / {ROLE_LABEL[user.role]}</span>
            <span className={getRankClass(user.rank)}>階級 / {RANK_DISPLAY[user.rankKey]}</span>
          </div>
        </div>

        <div className="card source-card">
          <div>
            <div className="muted-label">資料來源</div>
            <div className="source-value">{dataMode === 'firebase' ? 'Firebase' : 'Mock'}</div>
          </div>
          {firebaseReady ? <Wifi className="status-icon ok" /> : <WifiOff className="status-icon bad" />}
        </div>

        <div className="card role-preview-card">
          <div className="muted-label">權限切換</div>
          <div className="role-preview-title">目前角色：{ROLE_LABEL[user.role]}</div>
          <div className="role-switch-group">
            <div className="role-switch-label">角色</div>
            <div className="role-switch-row">
              {(['admin', 'sales', 'accounting', 'warehouse'] as Role[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-switch-btn ${user.role === role ? 'active' : ''}`}
                  onClick={() => setUserRoleView(role)}
                >
                  {ROLE_LABEL[role]}
                </button>
              ))}
            </div>
          </div>
          <div className="role-switch-group">
            <div className="role-switch-label">階級</div>
            <div className="rank-switch-row">
              {(['core', 'elite', 'senior', 'normal'] as Rank[]).map((rank) => (
                <button
                  key={rank}
                  type="button"
                  className={`rank-switch-btn ${rank} ${user.rankKey === rank ? 'active' : ''}`}
                  onClick={() => setUserRankView(rank)}
                >
                  {RANK_DISPLAY[rank]}
                </button>
              ))}
            </div>
          </div>
          <div className="permission-chip-row">
            <span className={getRankToneClass(user.rankKey)}>階級 / {RANK_DISPLAY[user.rankKey]}</span>
            <span className="badge badge-neutral">價格層級 / {getPriceTierLabel(user.rankKey)}</span>
            <span className="badge badge-neutral">客戶範圍 / {customerScopeLabel}</span>
            <span className="badge badge-neutral">退款 / {permissionProfile.canRefund ? '可執行' : '受限'}</span>
          </div>
          <div className="role-preview-desc">切換角色與階級查看畫面。</div>
        </div>

        <div className="nav-group-title">主功能選單</div>
        <div className="nav-list">
          {visibleNavItems.map((item) => {
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

        {canAccessNav(user.role, 'accounting') && (
        <div className="card accounting-shortcut">
          <div className="shortcut-title">快捷入口</div>
          <button
            type="button"
            onClick={() => setActive('accounting')}
            className={`shortcut-button ${active === 'accounting' ? 'active' : ''}`}
          >
            <CreditCard className="small-icon" />會計中心
          </button>
        </div>
        )}

        <div className="sidebar-tip card">
          <div className="sidebar-tip-title">系統狀態</div>
          <div className="sidebar-tip-desc">畫面整理完成，逐步補主流程。</div>
        </div>

        <div className="sidebar-actions">
          <button type="button" className="ghost-button"><Bell className="small-icon" />通知</button>
          <button type="button" className="ghost-button"><LogOut className="small-icon" />登出</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="section-tag">{visibleNavItems.find((item) => item.key === active)?.label || '受限模組'}</div>
            <div className="topbar-title">操作區</div>
          </div>
          <div className="toolbar">
            <div className="search-wrap">
              <Search className="search-icon" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={getSearchPlaceholder(active)} />
            </div>
            <button type="button" className="primary-button" onClick={() => void loadFirebaseData()}>
              <RefreshCw className="small-icon" />重新整理
            </button>
          </div>
        </div>

        {booting ? (
          <div className="card loading-card">
            <div className="spinner" />
            <div className="loading-title">{bootMessage}</div>
            <div className="loading-desc">正在載入資料</div>
          </div>
        ) : (
          <>
            <div className={`card banner-card ${firebaseReady ? 'success' : 'warning'}`}>
              {firebaseReady ? <ShieldCheck className="small-icon" /> : <Database className="small-icon" />}
              <div>
                <div className="banner-title">{bootMessage}</div>
                <div className="banner-desc">
                  {firebaseReady
                    ? '已讀取商品、客戶與人員資料。'
                    : '目前使用本地資料。'}
                </div>
              </div>
            </div>


            {!canAccessNav(user.role, active) && (
              <div className="card access-denied-card">
                <div className="access-denied-title">此角色不可進入此頁</div>
                <div className="access-denied-desc">目前角色是「{ROLE_LABEL[user.role]}」，此頁未開放。</div>
              </div>
            )}

            {active === 'dashboard' && (
              <DashboardModule workflowCards={workflowCards} WorkflowModule={WorkflowModule} itemCount={itemCount} shippingMethod={shippingMethod} grandTotal={grandTotal} />
            )}
            {active === 'products' && (
              <ProductsModule products={products} enabledProducts={enabledProducts} productNotice={productNotice} selectedProductId={selectedProductId} filteredProducts={filteredProducts} openCreateProduct={openCreateProduct} openViewProduct={openViewProduct} openEditProduct={openEditProduct} toggleProductEnabled={toggleProductEnabled} productEditorMode={productEditorMode} productDraft={productDraft} setProductDraft={setProductDraft} saveProductDraft={saveProductDraft} selectedProduct={selectedProduct} productCategories={productCategories} SectionIntro={SectionIntro} StatusBadge={StatusBadge} />
            )}
            {active === 'customers' && (
              <CustomersModule customers={visibleCustomerRecords} vipCustomers={vipCustomers} filteredCustomers={filteredCustomers} SectionIntro={SectionIntro} customerViewMode={customerViewMode} customerScopeLabel={customerScopeLabel} permissionProfile={permissionProfile} user={user} />
            )}
            {active === 'staff' && (
              <StaffModule staff={staff} activeStaff={activeStaff} filteredStaff={filteredStaff} getRankClass={getRankClass} SectionIntro={SectionIntro} StatusBadge={StatusBadge} selectedStaffId={selectedStaffId} selectedStaff={selectedStaff} staffEditorMode={staffEditorMode} staffDraft={staffDraft} setStaffDraft={setStaffDraft} staffNotice={staffNotice} staffRoles={staffRoles} staffRanks={staffRanks} staffPermissionPreview={staffPermissionPreview} openCreateStaff={openCreateStaff} openEditStaff={openEditStaff} openViewStaff={openViewStaff} updateStaffDraftField={updateStaffDraftField} resetStaffPassword={resetStaffPassword} saveStaffDraft={saveStaffDraft} />
            )}
            {active === 'orders' && (
              <OrdersModule itemCount={itemCount} shippingMethod={shippingMethod} grandTotal={grandTotal} user={user} priceTierLabel={getPriceTierLabel(user.rankKey)} orderHeroSlides={[{ title: '新品活動', desc: '顯示新品與活動重點。' }, { title: '配送公告', desc: '顯示付款與配送資訊。' }]}  orderCategoryChips={orderCategoryChips} orderCategory={orderCategory} setOrderCategory={setOrderCategory} filteredOrderProducts={filteredOrderProducts} addToCart={addToCart} quickCustomerCards={quickCustomerCards} applyQuickCustomer={applyQuickCustomer} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} setShippingMethod={setShippingMethod} getShippingFee={getShippingFee} discountMode={discountMode} setDiscountMode={setDiscountMode} discountValue={discountValue} setDiscountValue={setDiscountValue} remark={remark} setRemark={setRemark} cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} subtotal={subtotal} shippingFee={shippingFee} discountAmount={discountAmount} SectionIntro={SectionIntro} orderRecords={orderRecords} selectedOrderRecord={selectedOrderRecord} selectedOrderNo={selectedOrderNo} selectOrderRecord={selectOrderRecord} createOrderRecord={createOrderRecord} markOrderPaid={markOrderPaid} markOrderShippingReady={markOrderShippingReady} orderNotice={orderNotice} />
            )}
            {active === 'inventory' && (
              <InventoryModule lowStockCount={lowStockCount} shippingQueue={shippingQueue} filteredWarehouseQueue={filteredWarehouseQueue} warehouseSummary={warehouseSummary} warehouseTab={warehouseTab} setWarehouseTab={setWarehouseTab} selectedWarehouseOrder={selectedWarehouseOrder} selectedWarehouseOrderNo={selectedWarehouseOrderNo} setSelectedWarehouseOrderNo={setSelectedWarehouseOrderNo} warehouseNotice={warehouseNotice} warehouseKeyword={warehouseKeyword} setWarehouseKeyword={setWarehouseKeyword} warehousePaymentFilter={warehousePaymentFilter} setWarehousePaymentFilter={setWarehousePaymentFilter} warehouseShippingFilter={warehouseShippingFilter} setWarehouseShippingFilter={setWarehouseShippingFilter} warehouseDateStart={warehouseDateStart} setWarehouseDateStart={setWarehouseDateStart} warehouseDateEnd={warehouseDateEnd} setWarehouseDateEnd={setWarehouseDateEnd} shippingChecklist={shippingChecklist} warehouseSopPoints={warehouseSopPoints} warehouseReminderItems={warehouseReminderItems} handleWarehouseShip={handleWarehouseShip} handleWarehouseReturn={handleWarehouseReturn} handleWarehouseExchange={handleWarehouseExchange} handleWarehouseInbound={handleWarehouseInbound} warehouseInboundQty={warehouseInboundQty} setWarehouseInboundQty={setWarehouseInboundQty} warehouseInboundQr={warehouseInboundQr} setWarehouseInboundQr={setWarehouseInboundQr} warehouseScanBarcode={warehouseScanBarcode} setWarehouseScanBarcode={setWarehouseScanBarcode} warehouseScanQr={warehouseScanQr} setWarehouseScanQr={setWarehouseScanQr} warehouseExpectedScan={warehouseExpectedScan} warehouseScanValidation={warehouseScanValidation} handleWarehousePrint={handleWarehousePrint} inventoryFlow={inventoryFlow} stockSnapshot={stockSnapshot} selectedStockCode={selectedStockCode} setSelectedStockCode={setSelectedStockCode} selectedStockItem={selectedStockItem} queryExamples={queryExamples} warehouseQueryMode={warehouseQueryMode} setWarehouseQueryMode={setWarehouseQueryMode} warehouseQueryInput={warehouseQueryInput} setWarehouseQueryInput={setWarehouseQueryInput} runWarehouseQuery={runWarehouseQuery} handleWarehouseScanFill={handleWarehouseScanFill} warehouseQueryResult={warehouseQueryResult} warehouseRecentLogs={warehouseRecentLogs} SectionIntro={SectionIntro} SummaryCard={SummaryCard} warehouseShipValidation={warehouseShipValidation} />
            )}
            {active === 'accounting' && (
              <AccountingModule paymentQueue={paymentQueue} accountingSummary={accountingSummary} accountingTab={accountingTab} setAccountingTab={setAccountingTab} filteredAccountingQueue={filteredAccountingQueue} accountingOpsTotal={accountingOpsTotal} accountingKeyword={accountingKeyword} setAccountingKeyword={setAccountingKeyword} accountingPaymentFilter={accountingPaymentFilter} setAccountingPaymentFilter={setAccountingPaymentFilter} accountingShippingFilter={accountingShippingFilter} setAccountingShippingFilter={setAccountingShippingFilter} accountingDateStart={accountingDateStart} setAccountingDateStart={setAccountingDateStart} accountingDateEnd={accountingDateEnd} setAccountingDateEnd={setAccountingDateEnd} accountingNotice={accountingNotice} selectedAccountingRecord={selectedAccountingRecord} selectedAccountingSourceRecord={selectedAccountingSourceRecord} accountingDraft={accountingDraft} accountingTaxAmount={accountingTaxAmount} accountingActualReceived={accountingActualReceived} updateAccountingDraftField={updateAccountingDraftField} saveAccountingDraft={saveAccountingDraft} triggerAccountingAction={triggerAccountingAction} selectAccountingOrder={selectAccountingOrder} accountingBoards={accountingBoards} accountingTrendBars={accountingTrendBars} salesRanking={salesRanking} hotProductsBoard={hotProductsBoard} SectionIntro={SectionIntro} SummaryCard={SummaryCard} />
            )}
            {active === 'profile' && (
              <ProfileModule
                personalOrders={personalOrders}
                personalSummary={personalSummary}
                profileQuickActions={profileQuickActions}
                user={user}
                getRankClass={getRankClass}
                keyword={keyword}
                setKeyword={setKeyword}
                priceTierLabel={getPriceTierLabel(user.rankKey)}
                SectionIntro={SectionIntro}
                SummaryCard={SummaryCard}
                ownCustomerRecords={visibleCustomerRecords.filter((item) => item.ownerLoginId === user.loginId)}
                allOrderRecords={orderRecords}
              />
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
          ].filter((item) => canAccessNav(user.role, item.key)).map((item) => {
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
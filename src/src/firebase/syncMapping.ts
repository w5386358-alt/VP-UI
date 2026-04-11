import { FIREBASE_COLLECTIONS, type FirebaseCollectionKey } from './collections';

export type SyncDirection = 'sheets_to_firebase' | 'firebase_to_sheets';

export type SyncCollectionConfig = {
  key: FirebaseCollectionKey;
  collection: string;
  enabled: boolean;
  sheetName: string;
  primaryIdField: string;
  requiredFields: string[];
  optionalFields: string[];
  notes: string[];
};

export const MAIN_SYNC_COLLECTIONS: SyncCollectionConfig[] = [
  {
    key: 'products',
    collection: FIREBASE_COLLECTIONS.products,
    enabled: true,
    sheetName: 'PRODUCTS',
    primaryIdField: '商品編號',
    requiredFields: ['商品編號', '商品名稱', '商品條碼'],
    optionalFields: ['分類', '原價', 'VIP價格', '代理價格', '總代理價格', '啟用狀態', '商品圖'],
    notes: ['products 文件 ID = 商品編號', 'inventory 文件 ID 需同步使用商品編號'],
  },
  {
    key: 'customers',
    collection: FIREBASE_COLLECTIONS.customers,
    enabled: true,
    sheetName: 'CUSTOMERS',
    primaryIdField: '手機號碼',
    requiredFields: ['手機號碼', '客戶名稱'],
    optionalFields: ['客戶等級', '所屬人員', '地址', '備註'],
    notes: ['customers 文件 ID 可先沿用手機號碼或標準化 customerId'],
  },
  {
    key: 'staff',
    collection: FIREBASE_COLLECTIONS.staff,
    enabled: true,
    sheetName: 'STAFF',
    primaryIdField: '登入帳號',
    requiredFields: ['登入帳號', '姓名', '角色', '階級'],
    optionalFields: ['啟用狀態', '權限'],
    notes: ['staff 集合可作為評鑑、出納、請款等新模組的共用人員來源'],
  },
  {
    key: 'orders',
    collection: FIREBASE_COLLECTIONS.orders,
    enabled: true,
    sheetName: 'ORDERS',
    primaryIdField: '訂單編號',
    requiredFields: ['訂單編號', '客戶名稱', '付款狀態', '出貨狀態'],
    optionalFields: ['主狀態', '收件資訊', '備註', '建立時間'],
    notes: ['orders 文件 ID = 訂單編號'],
  },
  {
    key: 'orderItems',
    collection: FIREBASE_COLLECTIONS.orderItems,
    enabled: true,
    sheetName: 'ORDER_ITEMS',
    primaryIdField: '明細ID',
    requiredFields: ['訂單編號', '商品編號', '數量', '單價'],
    optionalFields: ['商品名稱', '商品條碼'],
    notes: ['建議明細 ID 規則：訂單編號_商品編號_序號'],
  },
  {
    key: 'inventory',
    collection: FIREBASE_COLLECTIONS.inventory,
    enabled: true,
    sheetName: 'INVENTORY',
    primaryIdField: '商品編號',
    requiredFields: ['商品編號', '目前庫存'],
    optionalFields: ['安全庫存', '最近更新時間', '商品名稱', '商品條碼'],
    notes: ['inventory 是結果表，不可當唯一事實來源'],
  },
  {
    key: 'inventoryLogs',
    collection: FIREBASE_COLLECTIONS.inventoryLogs,
    enabled: true,
    sheetName: 'INVENTORY_LOGS',
    primaryIdField: 'eventId',
    requiredFields: ['eventId', '商品編號', '異動類型', '數量', '時間'],
    optionalFields: ['QR身分識別', '訂單編號', '操作人員', '備註'],
    notes: ['inventory_logs 是事實來源', '同 eventId 不可重複寫入'],
  },
  {
    key: 'payments',
    collection: FIREBASE_COLLECTIONS.payments,
    enabled: true,
    sheetName: 'PAYMENTS',
    primaryIdField: '付款ID',
    requiredFields: ['付款ID', '訂單編號', '金額'],
    optionalFields: ['付款方式', '收款證明', '收款時間'],
    notes: ['payments 與 orders、sales_report 需同批同步'],
  },
  {
    key: 'shipping',
    collection: FIREBASE_COLLECTIONS.shipping,
    enabled: true,
    sheetName: 'SHIPPING',
    primaryIdField: '出貨ID',
    requiredFields: ['出貨ID', '訂單編號', '出貨狀態'],
    optionalFields: ['物流單號', '出貨時間', '備註'],
    notes: ['shipping 完成時要連動 inventory / inventory_logs / sales_report'],
  },
  {
    key: 'refunds',
    collection: FIREBASE_COLLECTIONS.refunds,
    enabled: true,
    sheetName: 'REFUNDS',
    primaryIdField: '退款ID',
    requiredFields: ['退款ID', '訂單編號', '退款金額'],
    optionalFields: ['退款原因', '退款時間', '退款證明'],
    notes: ['refunds 與 orders、payments、sales_report 需同步更新'],
  },
  {
    key: 'salesReport',
    collection: FIREBASE_COLLECTIONS.salesReport,
    enabled: true,
    sheetName: 'SALES_REPORT',
    primaryIdField: '報表ID',
    requiredFields: ['報表ID', '訂單編號'],
    optionalFields: ['實收金額', '稅金總額', '運費總額', '毛利'],
    notes: ['sales_report 屬彙總層，來源仍應以主線流程資料為準'],
  },
  {
    key: 'syncMeta',
    collection: FIREBASE_COLLECTIONS.syncMeta,
    enabled: true,
    sheetName: 'SYNC_META',
    primaryIdField: 'key',
    requiredFields: ['key', 'lastSyncedAt'],
    optionalFields: ['source', 'syncVersion', 'status'],
    notes: ['同步中心可用來記錄最後一次同步時間與版本'],
  },
];

export const SYNC_DIRECTION_LABELS: Record<SyncDirection, string> = {
  sheets_to_firebase: '試算表 → Firebase',
  firebase_to_sheets: 'Firebase → 試算表',
};

export function getSyncCollectionConfig(key: FirebaseCollectionKey) {
  return MAIN_SYNC_COLLECTIONS.find((item) => item.key === key) || null;
}

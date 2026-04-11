import { FIREBASE_COLLECTIONS, MAINLINE_COLLECTION_ORDER, type FirebaseCollectionName } from './collections';

export type MainlineDocRule = {
  collection: FirebaseCollectionName;
  primaryIdRule: string;
  requiredFields: string[];
  syncPriority: number;
  notes: string;
};

export const MAINLINE_DOC_RULES: MainlineDocRule[] = [
  {
    collection: FIREBASE_COLLECTIONS.products,
    primaryIdRule: '商品編號 = document ID',
    requiredFields: ['id', 'productCode', 'name', 'updatedAt', 'source'],
    syncPriority: 1,
    notes: 'products 與 inventory 文件 ID 都必須統一使用商品編號。',
  },
  {
    collection: FIREBASE_COLLECTIONS.customers,
    primaryIdRule: '手機號碼或 customerId = document ID',
    requiredFields: ['id', 'name', 'phone', 'updatedAt', 'source'],
    syncPriority: 2,
    notes: '若手機號碼為主要鍵，需先做格式清洗。',
  },
  {
    collection: FIREBASE_COLLECTIONS.staff,
    primaryIdRule: 'loginId 或 staffId = document ID',
    requiredFields: ['id', 'name', 'role', 'updatedAt', 'source'],
    syncPriority: 3,
    notes: '後續評鑑與權限模組都會依賴 staff。',
  },
  {
    collection: FIREBASE_COLLECTIONS.orders,
    primaryIdRule: '訂單編號 = document ID',
    requiredFields: ['id', 'orderNo', 'customerName', 'paymentStatus', 'orderStatus', 'updatedAt', 'source'],
    syncPriority: 4,
    notes: '主單建立後再寫入 order_items / payments / shipping。',
  },
  {
    collection: FIREBASE_COLLECTIONS.orderItems,
    primaryIdRule: 'orderNo + itemCode + sequence = document ID',
    requiredFields: ['id', 'orderNo', 'code', 'name', 'qty', 'updatedAt', 'source'],
    syncPriority: 5,
    notes: '避免同訂單同商品重複寫入。',
  },
  {
    collection: FIREBASE_COLLECTIONS.inventory,
    primaryIdRule: '商品編號 = document ID',
    requiredFields: ['id', 'productCode', 'name', 'qty', 'updatedAt', 'source'],
    syncPriority: 6,
    notes: 'inventory 是結果表，數量應以 inventory_logs 作為事實來源重算。',
  },
  {
    collection: FIREBASE_COLLECTIONS.inventoryLogs,
    primaryIdRule: 'eventId 或 規則化流水號 = document ID',
    requiredFields: ['id', 'type', 'productCode', 'qty', 'updatedAt', 'source'],
    syncPriority: 7,
    notes: '需保留出貨、入庫、退貨、換貨退回、換貨出庫、報廢等細項。',
  },
  {
    collection: FIREBASE_COLLECTIONS.payments,
    primaryIdRule: 'orderNo + paymentType = document ID',
    requiredFields: ['id', 'orderNo', 'amount', 'paymentStatus', 'updatedAt', 'source'],
    syncPriority: 8,
    notes: '收款主線完成後，才允許出貨主線放行。',
  },
  {
    collection: FIREBASE_COLLECTIONS.shipping,
    primaryIdRule: 'orderNo 或 shippingId = document ID',
    requiredFields: ['id', 'orderNo', 'shippingStatus', 'updatedAt', 'source'],
    syncPriority: 9,
    notes: '出貨完成需同步回寫 orders / inventory / inventory_logs / sales_report。',
  },
  {
    collection: FIREBASE_COLLECTIONS.refunds,
    primaryIdRule: 'orderNo = document ID',
    requiredFields: ['id', 'orderNo', 'refundStatus', 'updatedAt', 'source'],
    syncPriority: 10,
    notes: '退款流程後續會再延伸到出納主線。',
  },
  {
    collection: FIREBASE_COLLECTIONS.salesReport,
    primaryIdRule: 'orderNo = document ID',
    requiredFields: ['id', 'orderNo', 'revenue', 'updatedAt', 'source'],
    syncPriority: 11,
    notes: '營運報表以訂單主線的結果欄位彙整。',
  },
  {
    collection: FIREBASE_COLLECTIONS.syncMeta,
    primaryIdRule: '固定鍵或集合名 = document ID',
    requiredFields: ['id', 'lastSyncedAt', 'source', 'syncVersion'],
    syncPriority: 12,
    notes: '同步中心使用，記錄最後同步版本與時間。',
  },
];

export function getMainlineRuleByCollection(collection: FirebaseCollectionName) {
  return MAINLINE_DOC_RULES.find((item) => item.collection === collection) || null;
}

export function getMainlineExecutionPlan(): string[] {
  return MAINLINE_COLLECTION_ORDER.map((collection) => {
    const rule = getMainlineRuleByCollection(collection);
    return rule
      ? `${rule.syncPriority}. ${collection}｜${rule.primaryIdRule}`
      : collection;
  });
}

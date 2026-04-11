import { MAIN_SYNC_COLLECTIONS, SYNC_DIRECTION_LABELS, type SyncDirection } from './syncMapping';
import { MAINLINE_COLLECTION_ORDER } from './collections';

export type SyncActionKey =
  | 'sync_products'
  | 'sync_customers'
  | 'sync_staff'
  | 'sync_orders'
  | 'sync_inventory'
  | 'sync_payments'
  | 'sync_shipping'
  | 'sync_refunds'
  | 'sync_sales_report'
  | 'sync_mainline_all';

export type SyncAction = {
  key: SyncActionKey;
  label: string;
  direction: SyncDirection;
  collections: string[];
  description: string;
  caution?: string;
};

export const GAS_SYNC_ACTIONS: SyncAction[] = [
  {
    key: 'sync_products',
    label: '同步商品主檔',
    direction: 'sheets_to_firebase',
    collections: ['products', 'inventory'],
    description: '商品新增或編輯時，同步 products 與 inventory 基本資料。',
  },
  {
    key: 'sync_customers',
    label: '同步客戶主檔',
    direction: 'sheets_to_firebase',
    collections: ['customers'],
    description: '將新試算表中的客戶資料同步到 customers。',
  },
  {
    key: 'sync_staff',
    label: '同步人員主檔',
    direction: 'sheets_to_firebase',
    collections: ['staff'],
    description: '把人員、角色、階級與權限同步到 staff。',
  },
  {
    key: 'sync_orders',
    label: '同步訂單主線',
    direction: 'sheets_to_firebase',
    collections: ['orders', 'order_items'],
    description: '同步訂單與訂單明細；建議先於商品、客戶同步完成後再執行。',
  },
  {
    key: 'sync_inventory',
    label: '同步庫存主線',
    direction: 'sheets_to_firebase',
    collections: ['inventory', 'inventory_logs'],
    description: '同步庫存結果與異動記錄；inventory_logs 為事實來源。',
  },
  {
    key: 'sync_payments',
    label: '同步收款資料',
    direction: 'sheets_to_firebase',
    collections: ['payments', 'orders', 'sales_report'],
    description: '同步收款、訂單付款狀態與報表欄位。',
  },
  {
    key: 'sync_shipping',
    label: '同步出貨資料',
    direction: 'sheets_to_firebase',
    collections: ['shipping', 'orders', 'inventory', 'inventory_logs', 'sales_report'],
    description: '同步出貨完成後的主線資料與庫存扣減。',
  },
  {
    key: 'sync_refunds',
    label: '同步退款資料',
    direction: 'sheets_to_firebase',
    collections: ['refunds', 'orders', 'payments', 'sales_report', 'inventory', 'inventory_logs'],
    description: '同步退貨退款、狀態與必要的庫存回補。',
  },
  {
    key: 'sync_sales_report',
    label: '同步營運報表',
    direction: 'sheets_to_firebase',
    collections: ['sales_report'],
    description: '同步銷售統計與營運彙總欄位。',
  },
  {
    key: 'sync_mainline_all',
    label: '全量同步主線',
    direction: 'sheets_to_firebase',
    collections: [...MAINLINE_COLLECTION_ORDER],
    description: '依主線順序執行全量同步；建議在人工測試完各分項同步後再開放。',
    caution: '全量同步建議保留給管理員或錯誤修復場景。',
  },
];

export function getSyncActionLabel(key: SyncActionKey) {
  return GAS_SYNC_ACTIONS.find((item) => item.key === key)?.label || key;
}

export function buildSyncCenterSummary() {
  return {
    collectionCount: MAIN_SYNC_COLLECTIONS.length,
    actionCount: GAS_SYNC_ACTIONS.length,
    directionLabel: SYNC_DIRECTION_LABELS.sheets_to_firebase,
    orderedCollections: [...MAINLINE_COLLECTION_ORDER],
  };
}

export function createSyncPlaceholderLog(action: SyncActionKey) {
  return {
    action,
    actionLabel: getSyncActionLabel(action),
    status: 'PENDING',
    startedAt: new Date().toISOString(),
    endedAt: null,
    message: '第三階段先建立同步中心骨架；實際 GAS / 新試算表連線待下一步補上。',
  };
}

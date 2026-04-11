export const FIREBASE_COLLECTIONS = {
  customers: 'customers',
  inventory: 'inventory',
  inventoryLogs: 'inventory_logs',
  orderItems: 'order_items',
  orders: 'orders',
  payments: 'payments',
  products: 'products',
  refunds: 'refunds',
  salesReport: 'sales_report',
  shipping: 'shipping',
  staff: 'staff',
  syncMeta: 'sync_meta',
} as const;

export type FirebaseCollectionKey = keyof typeof FIREBASE_COLLECTIONS;
export type FirebaseCollectionName = (typeof FIREBASE_COLLECTIONS)[FirebaseCollectionKey];

export const MAINLINE_COLLECTION_ORDER: FirebaseCollectionName[] = [
  FIREBASE_COLLECTIONS.products,
  FIREBASE_COLLECTIONS.customers,
  FIREBASE_COLLECTIONS.staff,
  FIREBASE_COLLECTIONS.orders,
  FIREBASE_COLLECTIONS.orderItems,
  FIREBASE_COLLECTIONS.inventory,
  FIREBASE_COLLECTIONS.inventoryLogs,
  FIREBASE_COLLECTIONS.payments,
  FIREBASE_COLLECTIONS.shipping,
  FIREBASE_COLLECTIONS.refunds,
  FIREBASE_COLLECTIONS.salesReport,
  FIREBASE_COLLECTIONS.syncMeta,
];

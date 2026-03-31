import React, { useEffect, useMemo, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
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
} from 'lucide-react';

type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type NavKey = 'dashboard' | 'products' | 'customers' | 'staff' | 'orders' | 'inventory';

type Product = { id: string; code: string; name: string; category: string; price: number; enabled: boolean; stock: number };
type Customer = { id: string; name: string; phone: string; level: string };
type Staff = { id: string; name: string; loginId: string; role: string; rank: string; enabled: boolean };
type Order = { id: string; orderNo: string; customerName: string; paymentStatus: string; orderStatus: string; totalAmount: number; createdAt: string };
type CartItem = { productId: string; code: string; name: string; price: number; qty: number; subtotal: number };
type SessionUser = { name: string; loginId: string; role: Role; rank: string };

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

const mockOrders: Order[] = [
  { id: 'o1', orderNo: 'VP20260331-001', customerName: '王小美', paymentStatus: '已收款', orderStatus: '已完成', totalAmount: 2680, createdAt: '2026/03/31 10:20' },
  { id: 'o2', orderNo: 'VP20260331-002', customerName: '林雅雯', paymentStatus: '未收款', orderStatus: '待出貨', totalAmount: 1380, createdAt: '2026/03/31 11:05' },
  { id: 'o3', orderNo: 'VP20260331-003', customerName: '陳佳玲', paymentStatus: '已收款', orderStatus: '待出貨', totalAmount: 899, createdAt: '2026/03/31 12:40' },
];

const priceTierOptions = ['VIP價格', '代理商價格', '總代理價格'] as const;

const navItems: { key: NavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: '總覽', icon: BarChart3 },
  { key: 'products', label: '商品', icon: Package },
  { key: 'customers', label: '客戶', icon: Users },
  { key: 'staff', label: '人員', icon: UserCog },
  { key: 'orders', label: '訂單', icon: ShoppingCart },
  { key: 'inventory', label: '倉儲', icon: Warehouse },
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

function normalizeOrder(id: string, data: any): Order {
  return {
    id,
    orderNo: data.orderNo || data.id || id,
    customerName: data.customerName || data.name || '未命名客戶',
    paymentStatus: data.paymentStatus || '未收款',
    orderStatus: data.orderStatus || '待處理',
    totalAmount: Number(data.totalAmount || data.finalAmount || data.amount || 0),
    createdAt: data.createdAt || data.created_at || data.orderTime || '-',
  };
}

function getRankClass(rank: string) {
  if (rank.includes('核心')) return 'badge badge-rank-core';
  if (rank.includes('高級')) return 'badge badge-rank-senior';
  return 'badge badge-rank-normal';
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

function PlaceholderCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card placeholder-card">
      <div className="placeholder-title">{title}</div>
      <div className="placeholder-desc">{desc}</div>
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
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [dataMode, setDataMode] = useState<'firebase' | 'mock'>('mock');
  const [user] = useState<SessionUser>({ name: '吳秉宸', loginId: 'vp001', role: 'admin', rank: '核心人員' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [priceTier, setPriceTier] = useState<(typeof priceTierOptions)[number]>('VIP價格');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

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
        setOrders(mockOrders);
        setBootMessage('Firebase 未設定，已切換 mock 資料');
        return;
      }

      const [productsSnap, customersSnap, staffSnap, ordersSnap] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('name'))),
        getDocs(query(collection(db, 'customers'), orderBy('name'))),
        getDocs(query(collection(db, 'staff'), orderBy('name'))),
        getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))),
      ]);

      const nextProducts = productsSnap.docs.map((doc) => normalizeProduct(doc.id, doc.data()));
      const nextCustomers = customersSnap.docs.map((doc) => normalizeCustomer(doc.id, doc.data()));
      const nextStaff = staffSnap.docs.map((doc) => normalizeStaff(doc.id, doc.data()));
      const nextOrders = ordersSnap.docs.map((doc) => normalizeOrder(doc.id, doc.data()));

      setProducts(nextProducts.length ? nextProducts : mockProducts);
      setCustomers(nextCustomers.length ? nextCustomers : mockCustomers);
      setStaff(nextStaff.length ? nextStaff : mockStaff);
      setOrders(nextOrders.length ? nextOrders : mockOrders);
      setFirebaseReady(true);
      setDataMode('firebase');
      setBootMessage('Firebase 真資料已接入');
    } catch (error) {
      console.error(error);
      setProducts(mockProducts);
      setCustomers(mockCustomers);
      setStaff(mockStaff);
      setOrders(mockOrders);
      setFirebaseReady(false);
      setDataMode('mock');
      setBootMessage('Firebase 讀取失敗，已切回 mock 資料');
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

  const filteredOrders = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => [o.orderNo, o.customerName, o.paymentStatus, o.orderStatus].join(' ').toLowerCase().includes(q));
  }, [keyword, orders]);

  const selectedCustomer = useMemo(() => customers.find((c) => c.id === selectedCustomerId) || null, [customers, selectedCustomerId]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems]);

  function resolvePrice(product: Product) {
    return product.price;
  }

  function addToCart(product: Product) {
    const price = resolvePrice(product);
    setCartItems((prev) => {
      const found = prev.find((item) => item.productId === product.id);
      if (found) {
        return prev.map((item) => item.productId === product.id ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price } : item);
      }
      return [...prev, { productId: product.id, code: product.code, name: product.name, price, qty: 1, subtotal: price }];
    });
    setOrderMessage('');
  }

  function updateCartQty(productId: string, nextQty: number) {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCartItems((prev) => prev.map((item) => item.productId === productId ? { ...item, qty: nextQty, subtotal: nextQty * item.price } : item));
  }

async function createOrder() {
  if (!selectedCustomer) {
    setOrderMessage('請先選擇客戶');
    return;
  }
  if (!cartItems.length) {
    setOrderMessage('請先加入商品到購物車');
    return;
  }

  const db = getDb();
  if (!db) {
    setOrderMessage('Firebase 尚未連線');
    return;
  }

  const now = new Date();
  const orderNo = `VP${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(orders.length + 1).padStart(3, '0')}`;
  const createdAt = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  setCreatingOrder(true);
  setOrderMessage('');

  try {
    const orderPayload = {
      orderNo,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      paymentStatus: '未收款',
      orderStatus: '待處理',
      totalAmount: cartTotal,
      priceTier,
      createdAt,
      createdAtServer: serverTimestamp(),
      createdBy: user.loginId,
    };

    const orderRef = await addDoc(collection(db, 'orders'), orderPayload);

    for (const item of cartItems) {
      await addDoc(collection(db, 'order_items'), {
        orderId: orderRef.id,
        orderNo,
        productId: item.productId,
        productCode: item.code,
        productName: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.subtotal,
        createdAt,
        createdAtServer: serverTimestamp(),
      });
    }

    const nextOrder: Order = {
      id: orderRef.id,
      orderNo,
      customerName: selectedCustomer.name,
      paymentStatus: '未收款',
      orderStatus: '待處理',
      totalAmount: cartTotal,
      createdAt,
    };

    setOrders((prev) => [nextOrder, ...prev]);
    setCartItems([]);
    setSelectedCustomerId('');
    setPriceTier('VIP價格');
    setActive('orders');
    setOrderMessage('訂單已成功寫入 Firebase');
  } catch (error) {
    console.error(error);
    setOrderMessage('寫入 Firebase 失敗');
  } finally {
    setCreatingOrder(false);
  }
}

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand card">
          <div className="brand-kicker">VP SYSTEM</div>
          <div className="brand-title">Vercel UI</div>
          <div className="brand-subtitle">Phase 2 下單 UI</div>
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

        <div className="sidebar-actions">
          <button type="button" className="ghost-button"><Bell className="small-icon" />通知</button>
          <button type="button" className="ghost-button"><LogOut className="small-icon" />登出</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-kicker">VP 訂購系統 / Vercel UI</div>
            <h1>Phase 2</h1>
          </div>
          <div className="toolbar">
            <div className="search-wrap">
              <Search className="search-icon" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜尋商品 / 客戶 / 人員 / 訂單" />
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
            <div className="loading-desc">正在建立前端骨架與 Firebase 資料介接層</div>
          </div>
        ) : (
          <>
            <div className={`card banner-card ${firebaseReady ? 'success' : 'warning'}`}>
              {firebaseReady ? <ShieldCheck className="small-icon" /> : <Database className="small-icon" />}
              <div>
                <div className="banner-title">{bootMessage}</div>
                <div className="banner-desc">
                  {firebaseReady
                    ? '目前畫面已直接讀取 Firebase products / customers / staff / orders'
                    : '先用 mock 保底，等你補 VITE_FIREBASE_* 後即可切真資料'}
                </div>
              </div>
            </div>

            <section className="summary-grid summary-grid-five">
              <SummaryCard title="商品數量" value={String(products.length)} sub="products" />
              <SummaryCard title="客戶數量" value={String(customers.length)} sub="customers" />
              <SummaryCard title="人員數量" value={String(staff.length)} sub="staff" />
              <SummaryCard title="低庫存商品" value={String(products.filter((p) => p.stock <= 10).length)} sub="inventory alert" />
              <SummaryCard title="訂單數量" value={String(orders.length)} sub="orders" />
            </section>

            {active === 'dashboard' && (
              <section className="two-column-grid">
                <div className="card content-card">
                  <h2>Phase 2 完成內容</h2>
                  <div className="stack-list">
                    <div>1. 已建立下單 UI 骨架</div>
                    <div>2. 已加入購物車</div>
                    <div>3. 已加入客戶選擇</div>
                    <div>4. 已加入價格層級選擇</div>
                    <div>5. 已可本地建立訂單列表</div>
                    <div>6. 下一步接 Firebase 寫入 orders / order_items</div>
                  </div>
                </div>
                <div className="card content-card">
                  <h2>現在要接的資料</h2>
                  <div className="stack-list compact">
                    <div>orders</div>
                    <div>order_items</div>
                    <div>payments</div>
                    <div>sales_report</div>
                    <div>customer selector</div>
                    <div>price tier mapping</div>
                  </div>
                </div>
              </section>
            )}

            {active === 'products' && (
              <section className="card content-card">
                <h2>商品主資料</h2>
                <div className="record-list scrollable">
                  {filteredProducts.map((item) => (
                    <div key={item.id} className="record-item">
                      <div>
                        <div className="record-title">{item.name}</div>
                        <div className="record-subtitle">{item.code} ・ {item.category}</div>
                      </div>
                      <div className="badge-row">
                        <StatusBadge enabled={item.enabled} />
                        <span className="badge badge-neutral">庫存 {item.stock}</span>
                        <span className="badge badge-price">${item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active === 'customers' && (
              <section className="card content-card">
                <h2>客戶主資料</h2>
                <div className="record-list">
                  {filteredCustomers.map((item) => (
                    <div key={item.id} className="record-item">
                      <div>
                        <div className="record-title">{item.name}</div>
                        <div className="record-subtitle">{item.phone}</div>
                      </div>
                      <span className="badge badge-role">{item.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active === 'staff' && (
              <section className="card content-card">
                <h2>人員主資料</h2>
                <div className="record-list">
                  {filteredStaff.map((item) => (
                    <div key={item.id} className="record-item">
                      <div>
                        <div className="record-title">{item.name}</div>
                        <div className="record-subtitle">{item.loginId} ・ {item.role}</div>
                      </div>
                      <div className="badge-row">
                        <StatusBadge enabled={item.enabled} />
                        <span className={getRankClass(item.rank)}>{item.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active === 'orders' && (
              <section className="orders-layout">
                <div className="card content-card order-builder-card">
                  <div className="section-header-row">
                    <h2>建立訂單</h2>
                    <span className="badge badge-role">{priceTier}</span>
                  </div>

                  <div className="order-builder-grid">
                    <div className="builder-panel">
                      <div className="field-label">選擇客戶</div>
                      <select className="field-select" value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                        <option value="">請選擇客戶</option>
                        {customers.map((item) => (
                          <option key={item.id} value={item.id}>{item.name} / {item.phone}</option>
                        ))}
                      </select>
                    </div>

                    <div className="builder-panel">
                      <div className="field-label">價格層級</div>
                      <select className="field-select" value={priceTier} onChange={(e) => setPriceTier(e.target.value as (typeof priceTierOptions)[number])}>
                        {priceTierOptions.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="product-picker-title">商品選擇</div>
                  <div className="product-picker-grid">
                    {products.map((item) => (
                      <button key={item.id} type="button" className="product-pick-card" onClick={() => addToCart(item)}>
                        <div className="product-pick-name">{item.name}</div>
                        <div className="product-pick-meta">{item.code} ・ {item.category}</div>
                        <div className="product-pick-footer">
                          <span className="badge badge-price">${resolvePrice(item)}</span>
                          <span className="badge badge-neutral">庫存 {item.stock}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card content-card cart-card">
                  <div className="section-header-row">
                    <h2>購物車</h2>
                    <span className="badge badge-neutral">{cartItems.length} 項</span>
                  </div>

                  <div className="record-list scrollable cart-list">
                    {cartItems.length ? cartItems.map((item) => (
                      <div key={item.productId} className="record-item cart-item-row">
                        <div>
                          <div className="record-title">{item.name}</div>
                          <div className="record-subtitle">{item.code} ・ 單價 ${item.price}</div>
                        </div>
                        <div className="cart-qty-wrap">
                          <button type="button" className="qty-btn" onClick={() => updateCartQty(item.productId, item.qty - 1)}>-</button>
                          <span className="qty-value">{item.qty}</span>
                          <button type="button" className="qty-btn" onClick={() => updateCartQty(item.productId, item.qty + 1)}>+</button>
                        </div>
                        <span className="badge badge-price">${item.subtotal}</span>
                      </div>
                    )) : <div className="empty-cart">尚未加入商品</div>}
                  </div>

                  <div className="cart-summary">
                    <div>
                      <div className="muted-label">客戶</div>
                      <div className="cart-summary-value">{selectedCustomer ? selectedCustomer.name : '未選擇'}</div>
                    </div>
                    <div>
                      <div className="muted-label">訂單總額</div>
                      <div className="cart-summary-total">${cartTotal}</div>
                    </div>
                  </div>

                  {orderMessage ? <div className="order-message">{orderMessage}</div> : null}

                  <button type="button" className="primary-button create-order-button" onClick={() => void createOrder()} disabled={creatingOrder}>
                    <ShoppingCart className="small-icon" />{creatingOrder ? '建立中...' : '建立訂單'}
                  </button>
                </div>

                <div className="card content-card order-list-card">
                  <div className="section-header-row">
                    <h2>訂單列表</h2>
                    <span className="badge badge-role">已接 orders</span>
                  </div>
                  <div className="record-list scrollable">
                    {filteredOrders.map((item) => (
                      <div key={item.id} className="record-item">
                        <div>
                          <div className="record-title">{item.orderNo}</div>
                          <div className="record-subtitle">{item.customerName} ・ {item.createdAt}</div>
                        </div>
                        <div className="badge-row">
                          <span className="badge badge-role">{item.paymentStatus}</span>
                          <span className="badge badge-price">{item.orderStatus}</span>
                          <span className="badge badge-neutral">${item.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {active === 'inventory' && <PlaceholderCard title="倉儲模組" desc="之後接 inventory / inventory_logs / shipping，做庫存與出貨視覺化。" />}
          </>
        )}
      </main>
    </div>
  );
}

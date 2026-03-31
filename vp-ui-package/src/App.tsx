import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Users, UserCog, ShoppingCart, Warehouse, BarChart3, LogOut, RefreshCw, Bell, ShieldCheck, Database, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

/**
 * Vercel UI Phase 1.5
 * 已開始接 Firebase 真資料：products / customers / staff
 * 若 Firebase 尚未設定，會自動 fallback 回 mock 資料，不炸版
 */

type Role = "admin" | "sales" | "accounting" | "warehouse";

type Product = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  enabled: boolean;
  stock: number;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  level: string;
};

type Staff = {
  id: string;
  name: string;
  loginId: string;
  role: string;
  rank: string;
  enabled: boolean;
};

type SessionUser = {
  name: string;
  loginId: string;
  role: Role;
  rank: string;
};

type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
};

const mockProducts: Product[] = [
  { id: "1", code: "E401", name: "女神酵素液", category: "保健", price: 899, enabled: true, stock: 36 },
  { id: "2", code: "E402", name: "美妍X關鍵賦活飲", category: "保健", price: 1380, enabled: true, stock: 18 },
  { id: "3", code: "P301", name: "瞬白激光精華4G", category: "保養", price: 1680, enabled: true, stock: 9 },
  { id: "4", code: "P304", name: "奇肌修復全能霜", category: "保養", price: 1980, enabled: false, stock: 0 },
];

const mockCustomers: Customer[] = [
  { id: "c1", name: "王小美", phone: "0912345678", level: "VIP" },
  { id: "c2", name: "林雅雯", phone: "0988777666", level: "一般" },
  { id: "c3", name: "陳佳玲", phone: "0933555777", level: "代理" },
];

const mockStaff: Staff[] = [
  { id: "s1", name: "吳秉宸", loginId: "vp001", role: "管理員", rank: "核心人員", enabled: true },
  { id: "s2", name: "王小婷", loginId: "vp002", role: "銷售", rank: "普通銷售", enabled: true },
  { id: "s3", name: "陳小安", loginId: "vp003", role: "會計", rank: "高級銷售", enabled: true },
];

const mockOrders: Order[] = [
  { id: "o1", orderNo: "VP20260331-001", customerName: "王小美", paymentStatus: "已收款", orderStatus: "已完成", totalAmount: 2680, createdAt: "2026/03/31 10:20" },
  { id: "o2", orderNo: "VP20260331-002", customerName: "林雅雯", paymentStatus: "未收款", orderStatus: "待出貨", totalAmount: 1380, createdAt: "2026/03/31 11:05" },
  { id: "o3", orderNo: "VP20260331-003", customerName: "陳佳玲", paymentStatus: "已收款", orderStatus: "待出貨", totalAmount: 899, createdAt: "2026/03/31 12:40" },
];

const navItems = [
  { key: "dashboard", label: "總覽", icon: BarChart3 },
  { key: "products", label: "商品", icon: Package },
  { key: "customers", label: "客戶", icon: Users },
  { key: "staff", label: "人員", icon: UserCog },
  { key: "orders", label: "訂單", icon: ShoppingCart },
  { key: "inventory", label: "倉儲", icon: Warehouse },
];

// ⭐ 安全讀取 env（避免 import.meta.env undefined 直接炸掉）
const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || "",
};

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

function getDb() {
  if (!hasFirebaseConfig()) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

function getRankClass(rank: string) {
  if (rank.includes("核心")) return "bg-rose-100 text-rose-700 border-rose-200";
  if (rank.includes("高級")) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function getStatusBadge(enabled: boolean) {
  return enabled ? (
    <Badge className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700">啟用中</Badge>
  ) : (
    <Badge className="rounded-full border-rose-200 bg-rose-50 text-rose-700">停用</Badge>
  );
}

function normalizeProduct(id: string, data: any): Product {
  return {
    id,
    code: data.code || data.productCode || data.productId || "-",
    name: data.name || data.productName || "未命名商品",
    category: data.category || data.productCategory || "未分類",
    price: Number(data.price || data.vipPrice || data.salePrice || 0),
    enabled: data.enabled ?? data.isActive ?? true,
    stock: Number(data.stock || data.currentStock || 0),
  };
}

function normalizeCustomer(id: string, data: any): Customer {
  return {
    id,
    name: data.name || data.customerName || "未命名客戶",
    phone: data.phone || data.customerPhone || "-",
    level: data.level || data.tier || data.customerLevel || "一般",
  };
}

function normalizeStaff(id: string, data: any): Staff {
  return {
    id,
    name: data.name || data.staffName || "未命名人員",
    loginId: data.loginId || data.staffId || data.id || "-",
    role: data.role || "未設定",
    rank: data.rank || "普通銷售",
    enabled: data.enabled ?? data.isActive ?? true,
  };
}

function normalizeOrder(id: string, data: any): Order {
  return {
    id,
    orderNo: data.orderNo || data.id || id,
    customerName: data.customerName || data.name || "未命名客戶",
    paymentStatus: data.paymentStatus || "未收款",
    orderStatus: data.orderStatus || "待處理",
    totalAmount: Number(data.totalAmount || data.finalAmount || data.amount || 0),
    createdAt: data.createdAt || data.created_at || data.orderTime || "-",
  };
}

export default function VercelUIPhase1() {
  const [active, setActive] = useState("dashboard");
  const [booting, setBooting] = useState(true);
  const [bootMessage, setBootMessage] = useState("初始化中...");
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [dataMode, setDataMode] = useState<"firebase" | "mock">("mock");
  const [user] = useState<SessionUser>({
    name: "吳秉宸",
    loginId: "vp001",
    role: "admin",
    rank: "核心人員",
  });

  async function loadFirebaseData() {
    setBooting(true);
    try {
      const db = getDb();
      if (!db) {
        setDataMode("mock");
        setFirebaseReady(false);
        setProducts(mockProducts);
        setCustomers(mockCustomers);
        setStaff(mockStaff);
        setOrders(mockOrders);
        setBootMessage("Firebase 未設定，已切換 mock 資料");
        return;
      }

      const [productsSnap, customersSnap, staffSnap, ordersSnap] = await Promise.all([
        getDocs(query(collection(db, "products"), orderBy("name"))),
        getDocs(query(collection(db, "customers"), orderBy("name"))),
        getDocs(query(collection(db, "staff"), orderBy("name"))),
        getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))),
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
      setDataMode("firebase");
      setBootMessage("Firebase 真資料已接入");
    } catch (error) {
      console.error(error);
      setProducts(mockProducts);
      setCustomers(mockCustomers);
      setStaff(mockStaff);
      setOrders(mockOrders);
      setFirebaseReady(false);
      setDataMode("mock");
      setBootMessage("Firebase 讀取失敗，已切回 mock 資料");
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => {
    loadFirebaseData();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = keyword.trim();
    if (!q) return products;
    return products.filter((p) => [p.code, p.name, p.category].join(" ").toLowerCase().includes(q.toLowerCase()));
  }, [keyword, products]);

  const filteredCustomers = useMemo(() => {
    const q = keyword.trim();
    if (!q) return customers;
    return customers.filter((c) => [c.name, c.phone, c.level].join(" ").toLowerCase().includes(q.toLowerCase()));
  }, [keyword, customers]);

  const filteredStaff = useMemo(() => {
    const q = keyword.trim();
    if (!q) return staff;
    return staff.filter((s) => [s.name, s.loginId, s.role, s.rank].join(" ").toLowerCase().includes(q.toLowerCase()));
  }, [keyword, staff]);

  const filteredOrders = useMemo(() => {
    const q = keyword.trim();
    if (!q) return orders;
    return orders.filter((o) => [o.orderNo, o.customerName, o.paymentStatus, o.orderStatus].join(" ").toLowerCase().includes(q.toLowerCase()));
  }, [keyword, orders]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-rose-100 bg-white/85 backdrop-blur">
          <div className="p-5">
            <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-100 to-pink-50 p-4 shadow-sm">
              <div className="text-xs tracking-[0.2em] text-rose-500">VP SYSTEM</div>
              <div className="mt-2 text-2xl font-bold text-rose-700">Vercel UI</div>
              <div className="mt-1 text-sm text-slate-500">Phase 1.5 Firebase</div>
            </div>

            <Card className="mt-4 rounded-3xl border-rose-100 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-slate-500">目前登入</div>
                <div className="mt-1 text-lg font-bold">{user.name}</div>
                <div className="mt-1 text-sm text-slate-500">ID：{user.loginId}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="rounded-full border-sky-200 bg-sky-50 text-sky-700">身分 / 管理員</Badge>
                  <Badge className={`rounded-full border ${getRankClass(user.rank)}`}>階級 / {user.rank}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 rounded-3xl border-rose-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">資料來源</div>
                    <div className="mt-1 font-semibold">{dataMode === "firebase" ? "Firebase" : "Mock"}</div>
                  </div>
                  {firebaseReady ? <Wifi className="h-5 w-5 text-emerald-600" /> : <WifiOff className="h-5 w-5 text-rose-500" />}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const selected = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${selected ? "bg-rose-600 text-white shadow" : "bg-white text-slate-700 hover:bg-rose-50"}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-2xl border-rose-200">
                <Bell className="mr-2 h-4 w-4" />通知
              </Button>
              <Button variant="outline" className="flex-1 rounded-2xl border-rose-200">
                <LogOut className="mr-2 h-4 w-4" />登出
              </Button>
            </div>
          </div>
        </aside>

        <main className="p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm text-slate-500">VP 訂購系統 / Vercel UI</div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Phase 1.5</h1>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-[240px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜尋商品 / 客戶 / 人員"
                    className="rounded-2xl border-rose-200 pl-9"
                  />
                </div>
                <Button className="rounded-2xl bg-rose-600 hover:bg-rose-700" onClick={loadFirebaseData}>
                  <RefreshCw className="mr-2 h-4 w-4" />刷新資料
                </Button>
              </div>
            </div>

            {booting ? (
              <Card className="rounded-3xl border-rose-100">
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
                  <div className="text-base font-medium">{bootMessage}</div>
                  <div className="text-sm text-slate-500">正在建立前端骨架與 Firebase 資料介接層</div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-5">
                <Card className={`rounded-3xl shadow-sm ${firebaseReady ? "border-emerald-100 bg-emerald-50/60" : "border-amber-100 bg-amber-50/60"}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    {firebaseReady ? <ShieldCheck className="h-5 w-5 text-emerald-600" /> : <Database className="h-5 w-5 text-amber-600" />}
                    <div>
                      <div className={`font-semibold ${firebaseReady ? "text-emerald-700" : "text-amber-700"}`}>{bootMessage}</div>
                      <div className={`text-sm ${firebaseReady ? "text-emerald-700/80" : "text-amber-700/80"}`}>
                        {firebaseReady ? "目前畫面已直接讀取 Firebase products / customers / staff" : "先用 mock 保底，等你補 VITE_FIREBASE_* 後即可切真資料"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <SummaryCard title="商品數量" value={String(products.length)} sub="products" />
                  <SummaryCard title="客戶數量" value={String(customers.length)} sub="customers" />
                  <SummaryCard title="人員數量" value={String(staff.length)} sub="staff" />
                  <SummaryCard title="低庫存商品" value={String(products.filter((p) => p.stock <= 10).length)} sub="inventory alert" />
                  <SummaryCard title="訂單數量" value={String(orders.length)} sub="orders" />
                </section>

                <Tabs value={active} onValueChange={setActive}>
                  <TabsList className="hidden" />

                  <TabsContent value="dashboard" className="mt-0">
                    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                      <Card className="rounded-3xl border-rose-100">
                        <CardHeader>
                          <CardTitle>Phase 1.5 完成內容</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-600">
                          <div>1. products / customers / staff 已改成可接 Firebase</div>
                          <div>2. 加入 fallback 機制，沒設好也不會炸版</div>
                          <div>3. 加入資料來源狀態顯示</div>
                          <div>4. 刷新按鈕已可重抓 Firebase</div>
                          <div>5. 下一步可接登入權限與訂購介面</div>
                          <div>6. orders 已接入基礎讀取與列表顯示</div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-3xl border-rose-100">
                        <CardHeader>
                          <CardTitle>你現在要補的環境變數</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                          <div>VITE_FIREBASE_API_KEY</div>
                          <div>VITE_FIREBASE_AUTH_DOMAIN</div>
                          <div>VITE_FIREBASE_PROJECT_ID</div>
                          <div>VITE_FIREBASE_STORAGE_BUCKET</div>
                          <div>VITE_FIREBASE_MESSAGING_SENDER_ID</div>
                          <div>VITE_FIREBASE_APP_ID</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="products" className="mt-0">
                    <DataCard title="商品主資料">
                      <ScrollArea className="h-[520px] pr-3">
                        <div className="space-y-3">
                          {filteredProducts.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <div className="text-lg font-bold">{item.name}</div>
                                  <div className="mt-1 text-sm text-slate-500">{item.code} ・ {item.category}</div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {getStatusBadge(item.enabled)}
                                  <Badge className="rounded-full border-slate-200 bg-slate-50 text-slate-700">庫存 {item.stock}</Badge>
                                  <Badge className="rounded-full border-amber-200 bg-amber-50 text-amber-700">${item.price}</Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DataCard>
                  </TabsContent>

                  <TabsContent value="customers" className="mt-0">
                    <DataCard title="客戶主資料">
                      <div className="space-y-3">
                        {filteredCustomers.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="text-lg font-bold">{item.name}</div>
                                <div className="mt-1 text-sm text-slate-500">{item.phone}</div>
                              </div>
                              <Badge className="rounded-full border-sky-200 bg-sky-50 text-sky-700">{item.level}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DataCard>
                  </TabsContent>

                  <TabsContent value="staff" className="mt-0">
                    <DataCard title="人員主資料">
                      <div className="space-y-3">
                        {filteredStaff.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="text-lg font-bold">{item.name}</div>
                                <div className="mt-1 text-sm text-slate-500">{item.loginId} ・ {item.role}</div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {getStatusBadge(item.enabled)}
                                <Badge className={`rounded-full border ${getRankClass(item.rank)}`}>{item.rank}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DataCard>
                  </TabsContent>

                  <TabsContent value="orders" className="mt-0">
                    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                      <DataCard title="訂單列表">
                        <ScrollArea className="h-[520px] pr-3">
                          <div className="space-y-3">
                            {filteredOrders.map((item) => (
                              <div key={item.id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <div className="text-lg font-bold">{item.orderNo}</div>
                                    <div className="mt-1 text-sm text-slate-500">{item.customerName} ・ {item.createdAt}</div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge className="rounded-full border-sky-200 bg-sky-50 text-sky-700">{item.paymentStatus}</Badge>
                                    <Badge className="rounded-full border-amber-200 bg-amber-50 text-amber-700">{item.orderStatus}</Badge>
                                    <Badge className="rounded-full border-slate-200 bg-slate-50 text-slate-700">${item.totalAmount}</Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </DataCard>

                      <DataCard title="訂單模組下一步">
                        <div className="space-y-3 text-sm text-slate-600">
                          <div>1. 接 order_items</div>
                          <div>2. 接 payments</div>
                          <div>3. 做下單表單</div>
                          <div>4. 做購物車抽屜</div>
                          <div>5. 接客戶選擇與價格層級</div>
                        </div>
                      </DataCard>
                    </div>
                  </TabsContent>

                  <TabsContent value="inventory" className="mt-0">
                    <PlaceholderCard title="倉儲模組" desc="之後接 inventory / inventory_logs / shipping，做庫存與出貨視覺化。" />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="rounded-3xl border-rose-100 shadow-sm">
      <CardContent className="p-5">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-rose-400">{sub}</div>
      </CardContent>
    </Card>
  );
}

function DataCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-3xl border-rose-100 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

function PlaceholderCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="rounded-3xl border-dashed border-rose-200 bg-white/80 shadow-sm">
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
        <div className="text-2xl font-bold text-slate-800">{title}</div>
        <div className="mt-2 max-w-xl text-sm text-slate-500">{desc}</div>
      </CardContent>
    </Card>
  );
}

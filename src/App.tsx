import React, { useEffect, useMemo, useRef, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, deleteDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
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

/**
 * VP訂購ERP - 主入口檔案 (App.tsx)
 * 整合 Velvet Pulse 設計系統與 Firebase 邏輯
 */

type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type Rank = 'core' | 'elite' | 'senior' | 'normal';
type NavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'products' | 'customers' | 'staff' | 'profile';

// ... 其餘型別與邏輯與 TEXT_11 保持一致

export default function App() {
  const [active, setActive] = useState<NavKey>('dashboard');
  // ... 狀態與 Firebase 邏輯
  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* SideNavBar 結構 */}
      </aside>
      <main className="main-content">
        {/* TopNavBar 與 模組切換 */}
        {active === 'dashboard' && <DashboardModule {...props} />}
        {active === 'orders' && <OrdersModule {...props} />}
        {/* ... 其他模組 */}
      </main>
    </div>
  );
}

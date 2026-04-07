import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Plus,
  QrCode,
  Trophy,
  Menu,
} from 'lucide-react';

/**
 * Vercel Deployable Version (Simplified & Integrated)
 * 語言：全繁體中文 (Traditional Chinese)
 * 風格：Velvet Pulse (玫瑰粉色系)
 */

// --- Types ---
type Role = 'admin' | 'sales' | 'accounting' | 'warehouse';
type Rank = 'core' | 'elite' | 'senior' | 'normal';
type NavKey = 'dashboard' | 'orders' | 'inventory' | 'accounting' | 'products' | 'customers' | 'staff' | 'profile';

// --- Mock Data & Constants ---
const ROLE_LABEL: Record<Role, string> = { admin: '系統管理', sales: '銷售人員', accounting: '會計財務', warehouse: '倉儲物流' };
const RANK_LABEL: Record<Rank, string> = { core: '核心成員', elite: '菁英成員', senior: '高級銷售', normal: '普通銷售' };

const navItems = [
  { key: 'dashboard', label: '總覽', icon: BarChart3 },
  { key: 'orders', label: '訂購介面', icon: ShoppingCart },
  { key: 'inventory', label: '倉儲中心', icon: Warehouse },
  { key: 'accounting', label: '會計中心', icon: CreditCard },
  { key: 'products', label: '商品管理', icon: Package },
  { key: 'customers', label: '客戶管理', icon: Users },
  { key: 'staff', label: '團隊管理', icon: UserCog },
  { key: 'profile', label: '個人資料', icon: ClipboardList },
];

// --- Components ---

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

function StatCard({ title, value, sub, accent = 'rose' }: { title: string, value: string, sub: string, accent?: string }) {
  return (
    <div className={`card summary-card border-l-4 border-${accent}-500`}>
      <div className="text-sm text-slate-500 font-medium">{title}</div>
      <div className="text-3xl font-black mt-2 text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

export default function VercelApp() {
  const [active, setActive] = useState<NavKey>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole] = useState<Role>('admin');

  return (
    <div className="app-shell min-h-screen bg-[#fffafc]">
      {/* Sidebar - Desktop */}
      <aside className="sidebar hidden md:flex flex-col sticky top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-rose-100 p-6 z-40">
        <div className="brand mb-8 p-4 bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-100">
          <div className="text-[10px] tracking-[0.2em] text-rose-400 font-bold uppercase">VP System</div>
          <div className="text-2xl font-black text-rose-600">The Curator</div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key as NavKey)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 font-bold' 
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-rose-50">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center text-white font-bold">吳</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">吳秉宸</div>
              <div className="text-[10px] text-slate-400 uppercase">Administrator</div>
            </div>
            <LogOut size={16} className="text-slate-400 cursor-pointer hover:text-rose-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-rose-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-slate-800">
              {navItems.find(n => n.key === active)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 w-64 border border-transparent focus-within:border-rose-200 focus-within:bg-white transition-all">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="搜尋..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <div className="relative">
              <Bell size={20} className="text-slate-400 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Dashboard View */}
          {active === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="今日實收" value="NT$ 128,450" sub="+12.5% 較昨日增長" />
                <StatCard title="待處理訂單" value="12" sub="需儘速安排出貨" accent="amber" />
                <StatCard title="低庫存提醒" value="3" sub="部分熱銷品低於安全水位" accent="rose" />
                <StatCard title="本月業績" value="NT$ 2,484,200" sub="達成率 84%" accent="emerald" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-slate-800">銷售趨勢</h2>
                    <select className="bg-slate-50 border-none text-xs rounded-lg px-3 py-1 outline-none">
                      <option>過去 7 天</option>
                      <option>本月</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-around gap-2 px-4">
                    {[65, 45, 80, 55, 95, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className={`w-full rounded-t-lg transition-all duration-500 ${i === 4 ? 'bg-rose-500 shadow-lg shadow-rose-200' : 'bg-rose-100'}`} style={{ height: `${h}%` }}></div>
                        <span className="text-[10px] text-slate-400 font-bold">0{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-black text-slate-800 mb-6">熱門商品排行</h2>
                  <div className="space-y-4">
                    {[
                      { name: '精品皮革手札', sales: '328', growth: '+15%' },
                      { name: '永續竹炭香氛', sales: '215', growth: '+8%' },
                      { name: '典雅玫瑰腕錶', sales: '142', growth: '+22%' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-rose-50 transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 font-black group-hover:bg-rose-500 group-hover:text-white transition-all">
                          0{i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-400">{item.sales} 件已售</div>
                        </div>
                        <div className="text-emerald-500 text-xs font-bold">{item.growth}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Placeholder for other views */}
          {active !== 'dashboard' && (
            <div className="card p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                <Sparkles size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">{navItems.find(n => n.key === active)?.label} 頁面</h2>
              <p className="text-slate-500 max-w-md">此區域已完成 React 邏輯對接，正在整合後端 API 資料...</p>
              <button className="primary-button" onClick={() => setActive('dashboard')}>回到總覽</button>
            </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-rose-100 flex justify-around items-center px-2 py-4 z-50 rounded-t-[2rem] shadow-2xl shadow-rose-200">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key as NavKey)}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-rose-500' : 'text-slate-400'}`}
            >
              <Icon size={isActive ? 22 : 18} className={isActive ? 'animate-bounce-short' : ''} />
              <span className="text-[10px] font-bold">{item.label.slice(0, 2)}</span>
            </button>
          );
        })}
      </nav>

      {/* CSS Overrides for deployment */}
      <style dangerouslySetInnerHTML={{ __html: `
        .card { 
          background: white; 
          border: 1px solid #fff1f5; 
          border-radius: 1.5rem; 
          box-shadow: 0 10px 30px -5px rgba(231, 62, 114, 0.05); 
          transition: all 0.3s ease;
        }
        .card:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(231, 62, 114, 0.1); }
        .primary-button {
          background: linear-gradient(135deg, #ef4444 0%, #eb5b8b 100%);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: 800;
          box-shadow: 0 10px 20px -5px rgba(231, 62, 114, 0.3);
          transition: all 0.3s ease;
        }
        .primary-button:hover { transform: scale(1.05); box-shadow: 0 15px 30px -5px rgba(231, 62, 114, 0.4); }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short { animation: bounce-short 1s ease infinite; }
      `}} />
    </div>
  );
}

<!DOCTYPE html>

<html class="light" lang="zh-Hant"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-primary-fixed-variant": "#8c0a44",
                    "error-container": "#ffdad6",
                    "on-secondary": "#ffffff",
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#b8cbc0",
                    "on-error-container": "#93000a",
                    "on-error": "#ffffff",
                    "surface-bright": "#fdf8f9",
                    "primary-fixed-dim": "#ffb1c4",
                    "primary-container": "#ca4172",
                    "inverse-on-surface": "#f4eff0",
                    "secondary-container": "#feadc8",
                    "on-background": "#1c1b1c",
                    "on-surface": "#1c1b1c",
                    "on-primary-container": "#fffbff",
                    "background": "#fdf8f9",
                    "primary": "#a92759",
                    "tertiary-fixed": "#d3e7dc",
                    "primary-fixed": "#ffd9e1",
                    "tertiary": "#4e6057",
                    "on-secondary-fixed": "#39071f",
                    "outline-variant": "#ddbfc5",
                    "on-primary-fixed": "#3f001a",
                    "secondary": "#8b4a62",
                    "on-secondary-container": "#7a3d54",
                    "surface-dim": "#ddd9da",
                    "error": "#ba1a1a",
                    "on-surface-variant": "#574146",
                    "surface-variant": "#e6e1e2",
                    "on-tertiary-container": "#f5fff7",
                    "inverse-surface": "#313031",
                    "inverse-primary": "#ffb1c4",
                    "surface-container-low": "#f7f2f3",
                    "on-tertiary-fixed-variant": "#394b42",
                    "surface-container-lowest": "#ffffff",
                    "outline": "#8a7076",
                    "surface-tint": "#ad2a5c",
                    "surface-container-highest": "#e6e1e2",
                    "on-secondary-fixed-variant": "#6f334a",
                    "on-tertiary-fixed": "#0e1f18",
                    "surface-container-high": "#ece7e8",
                    "tertiary-container": "#66796f",
                    "surface": "#fdf8f9",
                    "secondary-fixed-dim": "#ffb0ca",
                    "on-primary": "#ffffff",
                    "surface-container": "#f1edee",
                    "secondary-fixed": "#ffd9e3"
            },
            "borderRadius": {
                    "DEFAULT": "1rem",
                    "lg": "2rem",
                    "xl": "3rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Plus Jakarta Sans"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; }
        h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-surface text-on-surface">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-[32px] bg-white/92 backdrop-blur-xl flex flex-col py-8 gap-2 shadow-[20px_0_40px_rgba(219,166,185,0.1)] z-50">
<div class="px-8 mb-8">
<h1 class="text-2xl font-black text-[#a92759]">Velvet Pulse</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Enterprise Resource Planning</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<!-- Active Tab: 會計中心 -->
<a class="flex items-center bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg transition-all duration-300" href="#">
<span class="material-symbols-outlined mr-3">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">inventory</span>
<span class="font-medium">商品</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">groups</span>
<span class="font-medium">客戶</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">badge</span>
<span class="font-medium">人員</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:text-[#a92759] transition-all duration-300 rounded-full hover:bg-[#f7f2f3]" href="#">
<span class="material-symbols-outlined mr-3">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="px-6 mt-auto">
<button class="w-full py-4 bg-secondary-container text-on-secondary-container rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined">add</span>
                New Entry
            </button>
</div>
</aside>
<!-- TopNavBar -->
<header class="fixed top-0 right-0 w-full z-40 bg-[#fdf8f9] shadow-[0_18px_50px_rgba(219,166,185,0.14)]">
<div class="flex justify-between items-center h-16 px-8 ml-64">
<div class="flex items-center gap-4 flex-1">
<div class="relative w-96">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</span>
<input class="w-full pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="搜尋訂單、憑證或交易紀錄..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<button class="text-stone-500 hover:text-primary transition-colors">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-stone-500 hover:text-primary transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
<div class="text-right">
<p class="text-sm font-bold text-on-surface">Admin User</p>
<p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Accounting Manager</p>
</div>
<div class="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden ring-2 ring-white">
<img class="w-full h-full object-cover" data-alt="professional portrait of an accounting manager with a friendly expression in a modern office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQx9VufNG5huc_6FGWdBTZ-LgawYsFCC6svmiQrrxgPV75QTVlqht_Yl-XleZy3FdFg2k4e4FJG2nNKIj0JEKKhd9UFkPf_lmzt3I1hAapEQVYY-_kqp8_SBv-ZGhxmW9F9judMsLaUajR7ovxSozlU8-2Z_N11E-eOQ2tYKHWnGT1r_3s-4bjXy9jmCgmutQ3_cUO3Bs0qVTLU5MCL6gpiSj4XK8ft1BF0aLIjMDUYo7c9XHbmqFAISOavzGX7NrQ-G3wbSsBRp0d"/>
</div>
</div>
</div>
</div>
</header>
<!-- Main Content -->
<main class="ml-64 pt-24 px-10 pb-12">
<!-- Header Section -->
<div class="flex justify-between items-end mb-8">
<div>
<h2 class="text-4xl font-extrabold text-on-surface tracking-tight mb-2">會計中心</h2>
<p class="text-stone-500 font-medium">管理您的財務收支、稅務計算與銷售統計</p>
</div>
<div class="flex bg-surface-container-low p-1.5 rounded-full shadow-inner">
<button class="px-6 py-2 bg-white text-primary font-bold rounded-full shadow-sm text-sm">作業面板</button>
<button class="px-6 py-2 text-stone-500 font-bold rounded-full text-sm hover:text-primary transition-colors">統計報表</button>
</div>
</div>
<div class="grid grid-cols-12 gap-8">
<!-- Left Column: Order Filtering & Form -->
<div class="col-span-12 lg:col-span-8 space-y-8">
<!-- Filter Section -->
<section class="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
<div class="flex items-center justify-between mb-6">
<h3 class="text-xl font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-primary">filter_list</span>
                            訂單篩選與核對
                        </h3>
</div>
<div class="grid grid-cols-3 gap-6">
<div class="space-y-2">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">訂單編號</label>
<input class="w-full bg-surface-container-high border-none rounded-sm px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="#ORD-2024..." type="text"/>
</div>
<div class="space-y-2">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">日期範圍</label>
<select class="w-full bg-surface-container-high border-none rounded-sm px-4 py-3 focus:ring-2 focus:ring-primary/20">
<option>過去 30 天</option>
<option>本季</option>
<option>自定義範圍</option>
</select>
</div>
<div class="space-y-2">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">交易類別</label>
<div class="flex gap-2">
<button class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-sm">收款</button>
<button class="flex-1 py-3 bg-surface-container-high text-stone-500 text-xs font-bold rounded-sm hover:bg-surface-variant">退款</button>
</div>
</div>
</div>
</section>
<!-- Processing Form -->
<section class="bg-white p-8 rounded-lg shadow-sm">
<h3 class="text-xl font-bold mb-8">帳務處理詳情</h3>
<div class="grid grid-cols-2 gap-10">
<div class="space-y-6">
<div class="grid grid-cols-2 gap-4">
<div class="space-y-2">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">基礎金額 (未稅)</label>
<input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-4 font-mono font-bold text-lg" type="number" value="12500"/>
</div>
<div class="space-y-2">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">稅率 (%)</label>
<input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-4 font-mono font-bold text-lg" type="number" value="5"/>
</div>
</div>
<div class="space-y-2">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">運費支出</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
<input class="w-full bg-surface-container-low border-none rounded-sm pl-8 pr-4 py-4 font-mono font-bold text-lg" type="number" value="150"/>
</div>
</div>
<div class="pt-6 border-t border-outline-variant/10">
<div class="flex justify-between items-center mb-2">
<span class="text-stone-500 font-medium">營業稅額計算</span>
<span class="font-mono font-bold text-primary">$ 625</span>
</div>
<div class="flex justify-between items-center">
<span class="text-xl font-extrabold text-on-surface">應收總計 (含稅)</span>
<span class="text-2xl font-black text-primary tracking-tight">$ 13,275</span>
</div>
</div>
</div>
<div class="space-y-6">
<label class="text-xs font-bold text-stone-400 uppercase tracking-wider">收款證明 / 憑證附件</label>
<div class="border-2 border-dashed border-outline-variant/30 rounded-lg h-48 flex flex-col items-center justify-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors group cursor-pointer">
<span class="material-symbols-outlined text-4xl text-stone-300 group-hover:text-primary transition-colors mb-2">cloud_upload</span>
<p class="text-sm font-bold text-stone-500">點擊或拖曳檔案至此上傳</p>
<p class="text-[10px] text-stone-400 mt-1">支援 PDF, JPG, PNG (Max 10MB)</p>
</div>
<div class="flex items-center gap-3 p-3 bg-tertiary-fixed/30 rounded-sm">
<span class="material-symbols-outlined text-tertiary">verified_user</span>
<div>
<p class="text-xs font-bold text-tertiary">系統已自動校核</p>
<p class="text-[10px] text-tertiary/80">此金額與訂單系統原始記錄一致</p>
</div>
</div>
</div>
</div>
<div class="mt-10 flex gap-4">
<button class="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all">確認入帳並發送通知</button>
<button class="px-8 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-full hover:bg-surface-variant transition-colors">暫存草稿</button>
</div>
</section>
</div>
<!-- Right Column: Quick Stats Bento -->
<div class="col-span-12 lg:col-span-4 space-y-8">
<!-- Quick Sales Overview Card -->
<section class="bg-gradient-to-br from-[#a92759] to-[#ca4172] p-8 rounded-lg shadow-xl text-white relative overflow-hidden">
<div class="relative z-10">
<p class="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">今日銷售額總計</p>
<h4 class="text-4xl font-extrabold tracking-tight mb-6">$ 142,850</h4>
<div class="flex items-center gap-2 mb-8">
<span class="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">+12.5%</span>
<span class="text-[10px] font-bold opacity-70">相較於昨日</span>
</div>
<div class="space-y-4">
<div class="flex justify-between items-end">
<span class="text-xs font-bold opacity-80">本月達成率</span>
<span class="text-sm font-bold">82%</span>
</div>
<div class="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
<div class="w-[82%] h-full bg-white rounded-full"></div>
</div>
</div>
</div>
<span class="material-symbols-outlined absolute -right-8 -bottom-8 text-[160px] opacity-10 rotate-12">trending_up</span>
</section>
<!-- Mini Chart Section -->
<section class="bg-surface-container-low p-8 rounded-lg">
<div class="flex items-center justify-between mb-6">
<h3 class="text-sm font-bold text-on-surface">收款來源分佈</h3>
<span class="material-symbols-outlined text-stone-400 text-sm">more_horiz</span>
</div>
<div class="space-y-4">
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-sm text-primary">credit_card</span>
</div>
<div class="flex-1">
<div class="flex justify-between text-xs font-bold mb-1">
<span>線上刷卡</span>
<span>65%</span>
</div>
<div class="w-full h-1 bg-primary/20 rounded-full">
<div class="w-[65%] h-full bg-primary rounded-full"></div>
</div>
</div>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-sm text-secondary">account_balance</span>
</div>
<div class="flex-1">
<div class="flex justify-between text-xs font-bold mb-1">
<span>銀行轉帳</span>
<span>25%</span>
</div>
<div class="w-full h-1 bg-secondary/20 rounded-full">
<div class="w-[25%] h-full bg-secondary rounded-full"></div>
</div>
</div>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-sm text-tertiary">payments</span>
</div>
<div class="flex-1">
<div class="flex justify-between text-xs font-bold mb-1">
<span>現金支付</span>
<span>10%</span>
</div>
<div class="w-full h-1 bg-tertiary/20 rounded-full">
<div class="w-[10%] h-full bg-tertiary rounded-full"></div>
</div>
</div>
</div>
</div>
</section>
<!-- Activity Feed -->
<section class="bg-white p-8 rounded-lg shadow-sm">
<h3 class="text-sm font-bold mb-6">最近核銷活動</h3>
<div class="space-y-6">
<div class="flex gap-4">
<div class="w-2 h-2 rounded-full bg-tertiary mt-1.5 shrink-0"></div>
<div>
<p class="text-sm font-bold">#ORD-2024-0512 已核銷</p>
<p class="text-[10px] text-stone-400 font-medium">15 分鐘前 · 由 陳小明 處理</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0"></div>
<div>
<p class="text-sm font-bold text-error">退款請求 #RF-1022</p>
<p class="text-[10px] text-stone-400 font-medium">1 小時前 · 等待主管審核</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
<div>
<p class="text-sm font-bold">大宗採購入帳通知</p>
<p class="text-[10px] text-stone-400 font-medium">3 小時前 · 來自 雅虎科技</p>
</div>
</div>
</div>
<button class="w-full mt-8 py-3 text-xs font-bold text-primary hover:bg-primary/5 rounded-sm transition-colors border border-primary/20">查看完整財務日誌</button>
</section>
</div>
</div>
</main>
<!-- FAB for New Entry (Only on specific screens) -->
<button class="fixed right-10 bottom-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50">
<span class="material-symbols-outlined text-3xl">add_business</span>
</button>
</body></html>
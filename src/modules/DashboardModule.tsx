<html lang="zh-Hant"><head>
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
            }
        }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #fdf8f9; }
        .font-headline { font-family: 'Plus Jakarta Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    </style>
</head>
<body class="text-on-background">
<!-- SideNavBar (Semantic Shell) -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-xl bg-white/92 backdrop-blur-xl flex flex-col py-8 gap-2 shadow-[20px_0_40px_rgba(219,166,185,0.1)] z-50">
<div class="px-8 mb-8">
<h1 class="text-2xl font-black text-primary font-headline">Velvet Pulse</h1>
<p class="text-[10px] text-stone-400 font-label tracking-widest uppercase mt-1">Enterprise Resource Planning</p>
</div>
<nav class="flex-1 flex flex-col gap-1">
<!-- Active State Logic: Mapping "總覽" -->
<a class="bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="inventory">inventory</span>
<span class="font-medium">商品</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="groups">groups</span>
<span class="font-medium">客戶</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="badge">badge</span>
<span class="font-medium">人員</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:text-primary hover:bg-surface-container-low rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="px-4 mt-auto">
<button class="w-full bg-primary text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-transform">
<span class="material-symbols-outlined text-sm">add</span>
<span>New Entry</span>
</button>
</div>
</aside>
<!-- TopNavBar (Semantic Shell) -->
<header class="fixed top-0 right-0 w-full z-40 bg-[#fdf8f9] flex justify-between items-center h-16 px-8 ml-64 shadow-[0_18px_50px_rgba(219,166,185,0.14)]" style="width: calc(100% - 16rem);">
<div class="flex items-center gap-4">
<div class="relative">
<span class="absolute inset-y-0 left-3 flex items-center text-stone-400">
<span class="material-symbols-outlined text-xl">search</span>
</span>
<input class="bg-surface-container-high border-none rounded-full pl-10 pr-6 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all w-64" placeholder="搜尋數據或報表..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<div class="flex items-center gap-2">
<button class="p-2 text-stone-500 hover:bg-[#f7f2f3] rounded-full transition-colors relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
</button>
<button class="p-2 text-stone-500 hover:bg-[#f7f2f3] rounded-full transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
<div class="h-8 w-[1px] bg-outline-variant/20"></div>
<div class="flex items-center gap-3">
<div class="text-right">
<p class="text-sm font-bold text-on-surface">系統管理員</p>
<p class="text-[10px] text-stone-500 uppercase tracking-tighter">Administrator</p>
</div>
<img alt="Administrator Profile" class="w-10 h-10 rounded-full border-2 border-primary-fixed shadow-sm" data-alt="Close up portrait of a professional administrator in business attire, clean studio lighting, soft rose-tinted background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ciroIlDYYj9d0ehrgJJ3C5Q17jJjMgfUjjUjZt5Uz-7-nBem2rHqEnN5Kw7N3qLeBIEnKfwcmDvOclkRT7gaV4MMnqYqZXwUY4NsczUHJjTyGq_S8tq3_25tDnOtOMgDmKGaovhVCxRyFOK5AYUuUw-Pu_5jdBQtilLA_vcgvPj7YD938r_f-TMbFcfiXTSWQ8qoBClvdO5dHSHzVQWrEQP-pGRyIq_qikkyHxFdQSn2IxAAH7YQjMbiuLpW2hK293HZnkS7PxZN"/>
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="ml-64 pt-24 pb-12 px-10 min-h-screen transition-all">
<!-- Dashboard Header -->
<header class="mb-10 flex justify-between items-end">
<div>
<h2 class="text-4xl font-extrabold font-headline text-on-surface tracking-tight">營運總覽</h2>
<p class="text-stone-500 mt-2 font-medium">歡迎回來，這是您今天的企業資源即時數據。</p>
</div>
<div class="flex gap-3">
<button class="px-6 py-2.5 rounded-full bg-white text-on-surface border border-outline-variant/20 shadow-sm font-semibold text-sm hover:bg-surface-container-low transition-colors">
                    導出報表
                </button>
<button class="px-6 py-2.5 rounded-full bg-primary text-white shadow-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                    今日詳細紀錄
                </button>
</div>
</header>
<!-- Bento Grid: Key Metrics -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
<!-- Metric 1 -->
<div class="bg-white p-8 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)] relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4">
<div class="w-12 h-12 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">payments</span>
</div>
</div>
<p class="text-stone-500 text-xs font-bold tracking-widest uppercase mb-1">今日實收</p>
<h3 class="text-3xl font-extrabold font-headline text-on-surface">$128,450</h3>
<div class="mt-4 flex items-center gap-2 text-xs font-bold text-tertiary">
<span class="material-symbols-outlined text-sm">trending_up</span>
<span>+12.5% 比昨日</span>
</div>
</div>
<!-- Metric 2 -->
<div class="bg-white p-8 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)] relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4">
<div class="w-12 h-12 rounded-2xl bg-secondary-fixed/30 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">pending_actions</span>
</div>
</div>
<p class="text-stone-500 text-xs font-bold tracking-widest uppercase mb-1">待處理訂單</p>
<h3 class="text-3xl font-extrabold font-headline text-on-surface">42</h3>
<div class="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
<span class="material-symbols-outlined text-sm">priority_high</span>
<span>5 筆緊急訂單</span>
</div>
</div>
<!-- Metric 3 -->
<div class="bg-white p-8 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)] relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4">
<div class="w-12 h-12 rounded-2xl bg-error-container/50 flex items-center justify-center text-error">
<span class="material-symbols-outlined">inventory_2</span>
</div>
</div>
<p class="text-stone-500 text-xs font-bold tracking-widest uppercase mb-1">低庫存提醒</p>
<h3 class="text-3xl font-extrabold font-headline text-on-surface">08</h3>
<div class="mt-4 flex items-center gap-2 text-xs font-bold text-error">
<span class="material-symbols-outlined text-sm">warning</span>
<span>需立即補貨</span>
</div>
</div>
<!-- Metric 4 -->
<div class="bg-white p-8 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)] relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4">
<div class="w-12 h-12 rounded-2xl bg-tertiary-fixed/50 flex items-center justify-center text-on-tertiary-fixed-variant">
<span class="material-symbols-outlined">analytics</span>
</div>
</div>
<p class="text-stone-500 text-xs font-bold tracking-widest uppercase mb-1">本月業績</p>
<h3 class="text-3xl font-extrabold font-headline text-on-surface">$2.4M</h3>
<div class="mt-4 flex items-center gap-2 text-xs font-bold text-tertiary">
<span class="material-symbols-outlined text-sm">check_circle</span>
<span>已達成目標 85%</span>
</div>
</div>
</div>
<!-- Charts and Rankings Section -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
<!-- Main Chart Area -->
<div class="lg:col-span-2 bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)]">
<div class="flex justify-between items-center mb-10">
<div>
<h4 class="text-xl font-bold text-on-surface font-headline">銷售趨勢圖表</h4>
<p class="text-sm text-stone-400 mt-1">過去七天的訂單與營收成長分析</p>
</div>
<select class="bg-surface-container-low border-none rounded-full px-4 py-2 text-xs font-bold text-stone-600 focus:ring-primary/20">
<option>最近 7 天</option>
<option>最近 30 天</option>
</select>
</div>
<!-- Visual Mockup of Column Chart -->
<div class="h-64 flex items-end gap-4 px-2">
<div class="flex-1 bg-surface-container-low rounded-t-xl relative group transition-all hover:bg-primary-fixed duration-300 h-[40%]">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">$45,200</div>
</div>
<div class="flex-1 bg-surface-container-low rounded-t-xl relative group transition-all hover:bg-primary-fixed duration-300 h-[65%]">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">$68,400</div>
</div>
<div class="flex-1 bg-surface-container-low rounded-t-xl relative group transition-all hover:bg-primary-fixed duration-300 h-[55%]"></div>
<div class="flex-1 bg-primary/20 rounded-t-xl relative group transition-all hover:bg-primary duration-300 h-[85%]">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">$92,100</div>
</div>
<div class="flex-1 bg-surface-container-low rounded-t-xl relative group transition-all hover:bg-primary-fixed duration-300 h-[45%]"></div>
<div class="flex-1 bg-surface-container-low rounded-t-xl relative group transition-all hover:bg-primary-fixed duration-300 h-[70%]"></div>
<div class="flex-1 bg-primary/80 rounded-t-xl relative group transition-all hover:bg-primary duration-300 h-[95%]">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">$108,000</div>
</div>
</div>
<div class="flex justify-between mt-6 px-2 text-[10px] font-bold text-stone-400 tracking-tighter uppercase">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span>Sat</span>
<span>Sun</span>
</div>
</div>
<!-- Rankings Area -->
<div class="bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)]">
<div class="mb-8">
<h4 class="text-xl font-bold text-on-surface font-headline">熱門商品排行</h4>
<p class="text-sm text-stone-400 mt-1">本週銷售量最高的前五名</p>
</div>
<div class="space-y-6">
<!-- Product 1 -->
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shadow-sm flex-shrink-0">
<img alt="Product Image 1" class="w-full h-full object-cover" data-alt="Red sleek professional running shoe on a minimalist white background, soft editorial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiBEbyNvvw3xkbUXcGc_nD33SZnL1FcWKburvxx0_POA9svFozs0Ijt8udSHJYa-TC6c84lQb_qDIhVz8bCARS8IvH2uRHb_8kM-i6WKzXyACk9wsq8pMCnfYLDpx5ErUjNUvHzq3UK-dB1tN8xO-ibihkeHFMURAcxx67T4yCZms5T0QwN_VSkoUrNb-Q3BC8yQ94s_B5wZd8tkuqvjeMIRctE2ffKV9qCt_5-xp4TYRhpOqoL78Oqmtro9i_4t8-zJxHINd1Lg9N"/>
</div>
<div class="flex-1">
<p class="text-sm font-bold text-on-surface">極致動能跑鞋</p>
<p class="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Fashion / Footwear</p>
</div>
<div class="text-right">
<p class="text-sm font-extrabold text-primary">1,240</p>
<p class="text-[10px] text-stone-400 uppercase">Sales</p>
</div>
</div>
<!-- Product 2 -->
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shadow-sm flex-shrink-0">
<img alt="Product Image 2" class="w-full h-full object-cover" data-alt="Classic minimalist silver wrist watch with white face on a clean textured surface, high-end product photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj0StlIqI6NmtOlNIU1czvmFi-DkCVYxLpj5w0UqtT1S8hZWD8rLApOXskKqANrTL5kMclbq0TDHCYtQxBdL4JclWFa2RbGoaItEHRu0xsxoNhKrxwj-IFeZvF1OrSKt1-VgesYQ6hBLUuCLIMRK5oyPev3Tp2VXuNRV2u7gW4QCMdrTcuSXgV5ObBUJLTmUBDxw4WrZHIkacMVrLDRbLmvp8SWQjF5ZD2m7A9lB3IELKuLhgErtQrW4XZZB3FdFqzmfYSx8i3udSU"/>
</div>
<div class="flex-1">
<p class="text-sm font-bold text-on-surface">漫步時光腕錶</p>
<p class="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Accessories / Luxury</p>
</div>
<div class="text-right">
<p class="text-sm font-extrabold text-primary">982</p>
<p class="text-[10px] text-stone-400 uppercase">Sales</p>
</div>
</div>
<!-- Product 3 -->
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shadow-sm flex-shrink-0">
<img alt="Product Image 3" class="w-full h-full object-cover" data-alt="Modern professional wireless headphones in sleek matte finish, dramatic studio lighting with soft rose hues" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-en6X7P_M1pnnvylFRxtfO6dMkgf6Uk1G6ZWPlBP_8QhlNjJ4jqKjzUVRISeL-Lg0tib0ziSk2F6OvddNg6Hq6Onln72UN2bVs3yTmB3NHFOuJngxkd8Y-9fTKN9quaQc7m2_eTsFOSWS1w6ZhCfQhb2IVwawe9zdzJwnyJRNVsrh-YEOPoFPbV89KXEdAsQoVvqX720_QdIi_8LS7NsdHrM58cIzPBACGVacjHID8HQJ33jgT_NFpW6wSuUcqrjiWs4SEucHHfjJ"/>
</div>
<div class="flex-1">
<p class="text-sm font-bold text-on-surface">原音沉浸耳機</p>
<p class="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Electronics / Audio</p>
</div>
<div class="text-right">
<p class="text-sm font-extrabold text-primary">856</p>
<p class="text-[10px] text-stone-400 uppercase">Sales</p>
</div>
</div>
</div>
<button class="w-full mt-10 py-3 rounded-full border border-primary/20 text-primary font-bold text-xs hover:bg-primary-fixed/20 transition-all uppercase tracking-widest">
                    查看完整庫存排行
                </button>
</div>
</div>
<!-- Secondary Info Row -->
<div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
<!-- Recent Activity Table -->
<div class="bg-white p-8 rounded-lg shadow-[0_10px_30px_rgba(219,166,185,0.08)]">
<div class="flex justify-between items-center mb-6">
<h4 class="text-lg font-bold text-on-surface font-headline">近期交易</h4>
<a class="text-xs font-bold text-primary hover:underline" href="#">查看全部</a>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead>
<tr class="border-b border-outline-variant/10 text-[10px] text-stone-400 uppercase tracking-widest">
<th class="pb-4 font-bold">訂單編號</th>
<th class="pb-4 font-bold">客戶</th>
<th class="pb-4 font-bold">狀態</th>
<th class="pb-4 font-bold text-right">金額</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/10">
<tr class="group hover:bg-surface-container-low transition-colors">
<td class="py-4 text-xs font-bold text-on-surface">#ORD-9021</td>
<td class="py-4 text-xs text-stone-500">王小明</td>
<td class="py-4">
<span class="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded text-[10px] font-bold">已出貨</span>
</td>
<td class="py-4 text-xs font-bold text-right text-on-surface">$3,200</td>
</tr>
<tr class="group hover:bg-surface-container-low transition-colors">
<td class="py-4 text-xs font-bold text-on-surface">#ORD-9022</td>
<td class="py-4 text-xs text-stone-500">李美玲</td>
<td class="py-4">
<span class="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded text-[10px] font-bold">處理中</span>
</td>
<td class="py-4 text-xs font-bold text-right text-on-surface">$12,850</td>
</tr>
<tr class="group hover:bg-surface-container-low transition-colors">
<td class="py-4 text-xs font-bold text-on-surface">#ORD-9023</td>
<td class="py-4 text-xs text-stone-500">張大千</td>
<td class="py-4">
<span class="px-2 py-1 bg-surface-container-high text-stone-500 rounded text-[10px] font-bold">待付款</span>
</td>
<td class="py-4 text-xs font-bold text-right text-on-surface">$750</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Promotion / Announcement Area -->
<div class="bg-gradient-to-br from-primary to-primary-container p-1 rounded-lg shadow-lg">
<div class="bg-white/10 backdrop-blur-md rounded-[calc(0.5rem-1px)] h-full p-10 flex flex-col text-white">
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-3xl">auto_awesome</span>
<h4 class="text-2xl font-bold font-headline">AI 智慧預測</h4>
</div>
<p class="text-white/80 leading-relaxed mb-8 font-medium">
                        根據目前的庫存流動速度與銷售趨勢，我們預測下週「極致動能跑鞋」的需求將增長 20%。建議提前調整採購計畫。
                    </p>
<div class="mt-auto">
<button class="w-full bg-white text-primary rounded-full py-3 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
                            查看預測報告
                        </button>
</div>
</div>
</div>
</div>
</main>
</body></html>